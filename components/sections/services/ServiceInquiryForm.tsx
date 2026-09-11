"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { LuSend, LuCheck } from "react-icons/lu";

interface Props {
  serviceTitle: string; // valeur pré-remplie du champ "Projet concerné"
  highlightColor: string;
}

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Formulaire de demande d'informations pour les pages services BtoB.
 * Le champ "Projet concerné" est pré-rempli (non modifiable) avec le service.
 *
 * TODO (lot 5) : brancher l'envoi réel sur la Server Action Resend
 * `sendServiceInquiry` (envoi de mail à l'association). Pour l'instant, la
 * soumission est simulée côté client.
 */
const ServiceInquiryForm: React.FC<Props> = ({ serviceTitle, highlightColor }) => {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Honeypot anti-spam : si rempli, on ignore silencieusement.
    const honeypot = (form.elements.namedItem("company_website") as HTMLInputElement)
      ?.value;
    if (honeypot) return;

    setStatus("submitting");
    try {
      // TODO lot 5 : await sendServiceInquiry(new FormData(form))
      await new Promise((r) => setTimeout(r, 600));
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-sm">
        <div
          className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: highlightColor }}
        >
          <LuCheck className="w-7 h-7 text-white" />
        </div>
        <h3 className="font-goldman text-white text-2xl uppercase mb-2">
          Demande envoyée
        </h3>
        <p className="text-gray-300 font-rajdhani">
          Merci ! Nous revenons vers vous dans les plus brefs délais.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-900/50 backdrop-blur-sm border border-white/10 p-8 md:p-10 rounded-2xl"
    >
      {/* Projet concerné (pré-rempli, lecture seule) */}
      <div>
        <label className="block text-white font-rajdhani font-semibold mb-2 uppercase text-sm">
          Projet concerné
        </label>
        <input
          type="text"
          name="projet"
          value={serviceTitle}
          readOnly
          className="w-full px-4 py-3 bg-gray-950/60 border-2 border-white/10 text-gray-300 font-rajdhani rounded-lg cursor-not-allowed"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-white font-rajdhani font-semibold mb-2 uppercase text-sm">
            Nom *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Votre nom"
            className="w-full px-4 py-3 bg-gray-950 border-2 border-gray-700 focus:border-theme text-white font-rajdhani rounded-lg outline-none transition-colors"
          />
        </div>
        <div>
          <label htmlFor="organization" className="block text-white font-rajdhani font-semibold mb-2 uppercase text-sm">
            Collectivité / Structure
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            placeholder="Nom de la collectivité"
            className="w-full px-4 py-3 bg-gray-950 border-2 border-gray-700 focus:border-theme text-white font-rajdhani rounded-lg outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-white font-rajdhani font-semibold mb-2 uppercase text-sm">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="votre.email@exemple.fr"
            className="w-full px-4 py-3 bg-gray-950 border-2 border-gray-700 focus:border-theme text-white font-rajdhani rounded-lg outline-none transition-colors"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-white font-rajdhani font-semibold mb-2 uppercase text-sm">
            Téléphone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="06 12 34 56 78"
            className="w-full px-4 py-3 bg-gray-950 border-2 border-gray-700 focus:border-theme text-white font-rajdhani rounded-lg outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-white font-rajdhani font-semibold mb-2 uppercase text-sm">
          Votre message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Décrivez votre projet, vos besoins, vos dates…"
          className="w-full px-4 py-3 bg-gray-950 border-2 border-gray-700 focus:border-theme text-white font-rajdhani rounded-lg outline-none transition-colors resize-none"
        />
      </div>

      {/* Honeypot anti-spam (masqué) */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      {status === "error" && (
        <p className="text-red-400 font-rajdhani text-sm">
          Une erreur est survenue. Merci de réessayer ou de nous écrire par email.
        </p>
      )}

      <div className="flex justify-end">
        <Button
          variant="primary"
          size="lg"
          type="submit"
          className="uppercase"
          disabled={status === "submitting"}
        >
          <LuSend className="w-5 h-5 mr-2" />
          {status === "submitting" ? "Envoi…" : "Envoyer ma demande"}
        </Button>
      </div>
    </form>
  );
};

export default ServiceInquiryForm;
