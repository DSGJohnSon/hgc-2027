"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import TurnstileWidget from "./TurnstileWidget";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [sentToEmail, setSentToEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  // Les jetons Turnstile sont à usage unique : incrémenter cette clé remonte le widget.
  const [widgetKey, setWidgetKey] = useState(0);
  const mountedAtRef = useRef(Date.now());

  useEffect(() => {
    mountedAtRef.current = Date.now();
  }, []);

  const handleFailure = (message: string) => {
    setStatus("error");
    setErrorMsg(message);
    setTurnstileToken(null);
    setWidgetKey((k) => k + 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") ?? ""),
          email,
          message: String(formData.get("message") ?? ""),
          contact_hp: String(formData.get("contact_hp") ?? ""),
          elapsedMs: Date.now() - mountedAtRef.current,
          turnstileToken,
        }),
      });
      const data: { ok?: boolean; error?: string } | null = await res
        .json()
        .catch(() => null);

      if (res.ok && data?.ok) {
        setSentToEmail(email);
        setStatus("success");
      } else {
        handleFailure(
          data?.error ||
            "Une erreur est survenue. Merci de réessayer ou de nous écrire directement à contact@holidaygeekcup.fr."
        );
      }
    } catch {
      handleFailure(
        "Impossible de contacter le serveur. Vérifiez votre connexion et réessayez."
      );
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setErrorMsg("");
    setTurnstileToken(null);
    setWidgetKey((k) => k + 1);
    mountedAtRef.current = Date.now();
  };

  const isSending = status === "sending";
  const waitingForTurnstile = Boolean(TURNSTILE_SITE_KEY) && !turnstileToken;

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-goldman text-4xl md:text-5xl uppercase text-white mb-4">
              NOUS CONTACTER
            </h2>
            <p className="text-lg text-gray-300 font-rajdhani">
              Remplissez le formulaire ci-dessous et nous vous répondrons dans
              les plus brefs délais
            </p>
          </div>

          {status === "success" ? (
            <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-theme p-8 md:p-12 rounded-lg text-center space-y-6">
              <CheckCircle2 className="w-16 h-16 text-theme2 mx-auto" />
              <h3 className="font-goldman text-3xl uppercase text-white">
                Message envoyé !
              </h3>
              <p className="text-lg text-gray-300 font-rajdhani">
                Nous avons bien reçu votre message et nous vous répondrons dans
                les plus brefs délais.
                <br />
                Un email de confirmation vient de vous être envoyé à{" "}
                <span className="text-theme2 font-semibold">{sentToEmail}</span>
                {" "}(pensez à vérifier vos courriers indésirables).
              </p>
              <Button
                variant="secondary"
                size="md"
                type="button"
                onClick={resetForm}
                className="uppercase"
              >
                Envoyer un autre message
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-gray-900/50 backdrop-blur-sm border-2 border-gray-800 p-8 md:p-12 rounded-lg"
            >
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-white font-rajdhani font-semibold text-lg mb-2 uppercase"
                >
                  Nom *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  minLength={2}
                  maxLength={100}
                  disabled={isSending}
                  className="w-full px-4 py-3 bg-gray-950 border-2 border-gray-700 focus:border-theme text-white font-rajdhani text-lg rounded-lg transition-colors outline-none disabled:opacity-60"
                  placeholder="Votre nom"
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-white font-rajdhani font-semibold text-lg mb-2 uppercase"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  maxLength={200}
                  disabled={isSending}
                  className="w-full px-4 py-3 bg-gray-950 border-2 border-gray-700 focus:border-theme text-white font-rajdhani text-lg rounded-lg transition-colors outline-none disabled:opacity-60"
                  placeholder="votre.email@exemple.fr"
                />
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-white font-rajdhani font-semibold text-lg mb-2 uppercase"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={6}
                  disabled={isSending}
                  className="w-full px-4 py-3 bg-gray-950 border-2 border-gray-700 focus:border-theme text-white font-rajdhani text-lg rounded-lg transition-colors outline-none resize-none disabled:opacity-60"
                  placeholder="Votre message..."
                />
              </div>

              {/* Honeypot anti-bots : invisible pour les humains, rempli par les bots */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact_hp">Ne pas remplir ce champ</label>
                <input
                  type="text"
                  id="contact_hp"
                  name="contact_hp"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Vérification anti-robot Cloudflare Turnstile (si configurée) */}
              {TURNSTILE_SITE_KEY && (
                <TurnstileWidget
                  key={widgetKey}
                  siteKey={TURNSTILE_SITE_KEY}
                  onToken={setTurnstileToken}
                />
              )}

              {status === "error" && errorMsg && (
                <div
                  role="alert"
                  className="border-2 border-red-500/60 bg-red-950/40 text-red-200 font-rajdhani text-lg px-4 py-3 rounded-lg"
                >
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex flex-col items-center gap-3 pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  disabled={isSending || waitingForTurnstile}
                  className="uppercase disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSending ? "Envoi en cours…" : "Envoyer"}
                </Button>
                {waitingForTurnstile && (
                  <p className="text-sm text-gray-400 font-rajdhani">
                    Vérification anti-robot en cours…
                  </p>
                )}
              </div>
            </form>
          )}

          {/* Alternative Contact */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 font-rajdhani mb-4">
              Vous préférez nous écrire directement ?
            </p>
            <Button
              variant="secondary"
              size="md"
              asLink
              href="mailto:contact@holidaygeekcup.fr"
              className="uppercase"
            >
              <Mail className="w-5 h-5 mr-2" />
              Nous écrire par email
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
