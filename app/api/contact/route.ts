import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { buildConfirmationEmail, buildNotificationEmail } from "@/lib/contactEmails";

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "contact@holidaygeekcup.fr";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "Holiday Geek Cup <contact@holidaygeekcup.fr>";

/** Soumission trop rapide pour être humaine (anti-bots, couche 1). */
const MIN_ELAPSED_MS = 2000;

/** Rate limiting : max 3 tentatives par IP sur 10 minutes.
 * Stockage en mémoire : par instance serverless, donc "best effort",
 * mais suffisant comme couche complémentaire de Turnstile. */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const attemptsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (attemptsByIp.size > 1000) {
    for (const [key, times] of attemptsByIp) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) attemptsByIp.delete(key);
    }
  }
  const recent = (attemptsByIp.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    attemptsByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  attemptsByIp.set(ip, recent);
  return false;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactBody {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot : doit rester vide (rempli uniquement par les bots). */
  contact_hp?: unknown;
  /** Temps écoulé entre l'affichage du formulaire et la soumission. */
  elapsedMs?: unknown;
  /** Jeton Cloudflare Turnstile (si le widget est activé). */
  turnstileToken?: unknown;
}

function validate(body: ContactBody): { error: string } | { name: string; email: string; message: string } {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (name.length < 2 || name.length > 100) {
    return { error: "Merci d'indiquer votre nom (2 caractères minimum)." };
  }
  if (!EMAIL_REGEX.test(email) || email.length > 200) {
    return { error: "Merci d'indiquer une adresse email valide." };
  }
  if (message.length < 10) {
    return { error: "Votre message est un peu court (10 caractères minimum)." };
  }
  if (message.length > 5000) {
    return { error: "Votre message est trop long (5 000 caractères maximum)." };
  }
  return { name, email, message };
}

/** Vérifie le jeton Turnstile auprès de Cloudflare.
 * Si TURNSTILE_SECRET_KEY n'est pas configurée, la vérification est ignorée
 * (le formulaire fonctionne alors avec les protections invisibles seules). */
async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || !token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("[contact] Échec de l'appel de vérification Turnstile :", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  let body: ContactBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // Honeypot rempli = bot. On renvoie un faux succès pour ne pas le lui révéler.
  if (typeof body.contact_hp === "string" && body.contact_hp.length > 0) {
    console.warn(`[contact] Honeypot déclenché (ip: ${ip})`);
    return NextResponse.json({ ok: true });
  }

  if (typeof body.elapsedMs !== "number" || body.elapsedMs < MIN_ELAPSED_MS) {
    return NextResponse.json(
      { ok: false, error: "Le formulaire a été soumis trop rapidement. Merci de réessayer." },
      { status: 400 }
    );
  }

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Trop de messages envoyés. Merci de patienter quelques minutes avant de réessayer." },
      { status: 429 }
    );
  }

  const validated = validate(body);
  if ("error" in validated) {
    return NextResponse.json({ ok: false, error: validated.error }, { status: 400 });
  }

  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return NextResponse.json(
      { ok: false, error: "La vérification anti-robot a échoué. Merci de recharger la page et de réessayer." },
      { status: 403 }
    );
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY manquante : impossible d'envoyer les emails.");
    return NextResponse.json(
      { ok: false, error: "Le service d'envoi est momentanément indisponible. Merci de nous écrire directement à contact@holidaygeekcup.fr." },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const now = new Date();

  // 1. Notification à l'association (critique).
  const notification = buildNotificationEmail(validated, now);
  const { error: sendError } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: validated.email,
    subject: notification.subject,
    html: notification.html,
    text: notification.text,
  });

  if (sendError) {
    console.error("[contact] Échec d'envoi de la notification :", sendError);
    return NextResponse.json(
      { ok: false, error: "L'envoi a échoué. Merci de réessayer, ou de nous écrire directement à contact@holidaygeekcup.fr." },
      { status: 502 }
    );
  }

  // 2. Confirmation au visiteur (best effort : ne fait pas échouer la soumission).
  const confirmation = buildConfirmationEmail(validated, now);
  const { error: confirmError } = await resend.emails.send({
    from: FROM_EMAIL,
    to: validated.email,
    subject: confirmation.subject,
    html: confirmation.html,
    text: confirmation.text,
  });
  if (confirmError) {
    console.error("[contact] Échec d'envoi de la confirmation :", confirmError);
  }

  return NextResponse.json({ ok: true });
}
