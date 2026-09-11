/**
 * Templates des emails du formulaire de contact.
 * HTML volontairement simple (styles inline, tables) pour rester
 * compatible avec tous les clients mail (Gmail, Outlook, etc.).
 */

const SITE_URL = "https://holidaygeekcup.fr";
const THEME = "#6240cf";
const THEME2 = "#8b5cf6";
const DARK = "#030712";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

function formatDate(date: Date): string {
  return date.toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    dateStyle: "full",
    timeStyle: "short",
  });
}

function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:0;background-color:#f3f4f6;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background-color:${DARK};padding:28px 32px;text-align:center;">
                <span style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;letter-spacing:2px;color:#ffffff;">
                  HOLIDAY <span style="color:${THEME2};">GEEK</span> CUP
                </span>
              </td>
            </tr>
            <tr>
              <td style="height:4px;background:linear-gradient(90deg,${THEME},${THEME2});background-color:${THEME};font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:32px;font-family:Arial,Helvetica,sans-serif;color:#111827;font-size:15px;line-height:1.6;">
                ${content}
              </td>
            </tr>
            <tr>
              <td style="background-color:#f9fafb;padding:20px 32px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;">
                <a href="${SITE_URL}" style="color:${THEME};text-decoration:none;font-weight:bold;">holidaygeekcup.fr</a>
                &nbsp;•&nbsp;
                <a href="https://www.instagram.com/holiday_geek_cup/" style="color:#6b7280;text-decoration:underline;">Instagram</a>
                &nbsp;•&nbsp;
                <a href="https://www.facebook.com/HolidayGeekCup/" style="color:#6b7280;text-decoration:underline;">Facebook</a>
                &nbsp;•&nbsp;
                <a href="https://x.com/HolidayGeekCup" style="color:#6b7280;text-decoration:underline;">X</a>
                <br /><br />
                Holiday Geek Cup — Association loi 1901
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Email envoyé à l'association : contenu complet du message reçu.
 */
export function buildNotificationEmail(payload: ContactPayload, date: Date) {
  const { name, email, message } = payload;

  const html = emailLayout(`
    <h1 style="margin:0 0 20px;font-size:20px;color:${DARK};">Nouveau message reçu via le formulaire de contact</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr>
        <td style="padding:10px 12px;background-color:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;width:100px;">Nom</td>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;">${escapeHtml(name)}</td>
      </tr>
      <tr>
        <td style="padding:10px 12px;background-color:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;">Email</td>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;"><a href="mailto:${escapeHtml(email)}" style="color:${THEME};">${escapeHtml(email)}</a></td>
      </tr>
      <tr>
        <td style="padding:10px 12px;background-color:#f9fafb;border:1px solid #e5e7eb;font-weight:bold;">Date</td>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;">${escapeHtml(formatDate(date))}</td>
      </tr>
    </table>
    <div style="margin-top:24px;">
      <p style="margin:0 0 8px;font-weight:bold;color:${DARK};">Message :</p>
      <div style="padding:16px;background-color:#f9fafb;border-left:4px solid ${THEME};border-radius:0 8px 8px 0;">
        ${nl2br(message)}
      </div>
    </div>
    <p style="margin:24px 0 0;font-size:13px;color:#6b7280;">
      💡 Répondez directement à cet email pour écrire à ${escapeHtml(name)} (réponse pré-adressée à ${escapeHtml(email)}).
    </p>
  `);

  const text = [
    "Nouveau message reçu via le formulaire de contact du site",
    "",
    `Nom : ${name}`,
    `Email : ${email}`,
    `Date : ${formatDate(date)}`,
    "",
    "Message :",
    message,
    "",
    "Répondez directement à cet email pour écrire à l'expéditeur.",
  ].join("\n");

  return {
    subject: `[Contact HGC] Nouveau message de ${name}`,
    html,
    text,
  };
}

/**
 * Email de confirmation envoyé au visiteur.
 */
export function buildConfirmationEmail(payload: ContactPayload, date: Date) {
  const { name, message } = payload;

  const html = emailLayout(`
    <h1 style="margin:0 0 20px;font-size:20px;color:${DARK};">Nous avons bien reçu votre message&nbsp;! 🎮</h1>
    <p style="margin:0 0 16px;">Bonjour <strong>${escapeHtml(name)}</strong>,</p>
    <p style="margin:0 0 16px;">
      Merci de nous avoir contactés. Votre message a bien été transmis à l'équipe
      Holiday Geek Cup, et nous vous répondrons dans les plus brefs délais.
    </p>
    <div style="margin:24px 0;">
      <p style="margin:0 0 8px;font-weight:bold;color:${DARK};">Rappel de votre message (envoyé le ${escapeHtml(formatDate(date))}) :</p>
      <div style="padding:16px;background-color:#f9fafb;border-left:4px solid ${THEME};border-radius:0 8px 8px 0;color:#374151;">
        ${nl2br(message)}
      </div>
    </div>
    <p style="margin:0 0 16px;">
      En attendant, retrouvez toutes nos actualités et nos événements sur
      <a href="${SITE_URL}" style="color:${THEME};font-weight:bold;">holidaygeekcup.fr</a>
      et sur nos réseaux sociaux.
    </p>
    <p style="margin:24px 0 0;">À très vite,<br /><strong>L'équipe Holiday Geek Cup</strong></p>
  `);

  const text = [
    `Bonjour ${name},`,
    "",
    "Merci de nous avoir contactés. Votre message a bien été transmis à l'équipe Holiday Geek Cup, et nous vous répondrons dans les plus brefs délais.",
    "",
    `Rappel de votre message (envoyé le ${formatDate(date)}) :`,
    message,
    "",
    "En attendant, retrouvez toutes nos actualités sur https://holidaygeekcup.fr",
    "",
    "À très vite,",
    "L'équipe Holiday Geek Cup",
  ].join("\n");

  return {
    subject: "Votre message a bien été reçu — Holiday Geek Cup",
    html,
    text,
  };
}
