import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales | Holiday Geek Cup",
  description: "Consultez les mentions légales du site Holiday Geek Cup, incluant les informations sur l'association, les droits d'auteur et les conditions d'utilisation.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-950 pt-72 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
          <header className="mb-12 border-b border-theme/30 pb-8">
            <h1 className="font-goldman text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-tight mb-4 tracking-tight">
              Mentions <span className="text-theme">Légales</span>
            </h1>
            <div className="flex flex-wrap gap-4 text-gray-400 font-rajdhani uppercase tracking-wider text-sm">
              <span>Holiday Geek Cup</span>
              <span className="text-theme">•</span>
              <span>Association loi 1901</span>
              <span className="text-theme">•</span>
              <span>Dernière mise à jour : Janvier 2026</span>
            </div>
          </header>

          <div className="space-y-12 text-gray-300 font-rajdhani leading-relaxed">
            {/* Éditeur du site */}
            <section>
              <h2 className="font-rajdhani font-bold text-2xl text-white uppercase mb-6 flex items-center gap-3">
                <span className="text-theme">01.</span> Éditeur du Site
              </h2>
              <div className="space-y-4">
                <p>
                  Le présent site est édité par l'association{" "}
                  <span className="font-bold">Holiday Geek Cup</span>,
                  association régie par la loi du 1er juillet 1901, enregistrée
                  sous le numéro SIRET{" "}
                  <span className="font-bold">909 762 288 00027</span>.
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <span className="font-bold">Siège social :</span> 5002F Rue Louis Blériot, 62420 Billy-Montigny
                  </li>
                  <li>
                    <span className="font-bold">Email :</span>{" "}
                    <a
                      href="mailto:contact@holidaygeekcup.fr"
                      className="text-theme hover:underline"
                    >
                      contact@holidaygeekcup.fr
                    </a>
                  </li>
                  <li>
                    <span className="font-bold">
                      Directeur de la publication :
                    </span>{" "}
                    Sylvain Regnier
                  </li>
                </ul>
              </div>
            </section>

            {/* Hébergement */}
            <section>
              <h2 className="font-rajdhani font-bold text-2xl text-white uppercase mb-6 flex items-center gap-3">
                <span className="text-theme">02.</span> Hébergement
              </h2>
              <div className="space-y-4">
                <p>Le site est hébergé par :</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <span className="font-bold">Hébergeur :</span> Vercel Inc.
                  </li>
                  <li>
                    <span className="font-bold">Adresse :</span> 440 N Barranca
                    Ave #4133 Covina, CA 91723
                  </li>
                  <li>
                    <span className="font-bold">Site web :</span>{" "}
                    <a
                      href="https://vercel.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-theme hover:underline"
                    >
                      www.vercel.com
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h2 className="font-rajdhani font-bold text-2xl text-white uppercase mb-6 flex items-center gap-3">
                <span className="text-theme">03.</span> Propriété Intellectuelle
              </h2>
              <div className="space-y-4">
                <p>
                  L'ensemble des contenus présents sur ce site (textes, images,
                  logos, vidéos, icônes) est la propriété exclusive de
                  l'association{" "}
                  <span className="font-bold">Holiday Geek Cup</span> ou de ses
                  partenaires, sauf mention contraire.
                </p>
                <p>
                  Toute reproduction, distribution, modification, adaptation ou
                  publication de ces différents éléments est strictement
                  interdite sans l'accord exprès par écrit de l'association.
                </p>
              </div>
            </section>

            {/* Données personnelles */}
            <section>
              <h2 className="font-rajdhani font-bold text-2xl text-white uppercase mb-6 flex items-center gap-3">
                <span className="text-theme">04.</span> Données Personnelles
              </h2>
              <div className="space-y-4">
                <p>
                  Conformément au Règlement Général sur la Protection des
                  Données (RGPD), vous disposez d'un droit d'accès, de
                  rectification, de suppression et d'opposition aux données
                  personnelles vous concernant.
                </p>
                <p>
                  Pour exercer ces droits, vous pouvez nous contacter à
                  l'adresse suivante :{" "}
                  <a
                    href="mailto:contact@holidaygeekcup.fr"
                    className="text-theme hover:underline"
                  >
                    contact@holidaygeekcup.fr
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="font-rajdhani font-bold text-2xl text-white uppercase mb-6 flex items-center gap-3">
                <span className="text-theme">05.</span> Cookies
              </h2>
              <div className="space-y-4">
                <p>
                  Le site peut utiliser des cookies pour améliorer l'expérience
                  utilisateur et réaliser des statistiques de visite. Vous
                  pouvez configurer votre navigateur pour refuser ces cookies.
                </p>
              </div>
            </section>

            {/* Responsabilité */}
            <section>
              <h2 className="font-rajdhani font-bold text-2xl text-white uppercase mb-6 flex items-center gap-3">
                <span className="text-theme">06.</span> Responsabilité
              </h2>
              <div className="space-y-4">
                <p>
                  L'association met tout en œuvre pour diffuser des informations
                  exactes et mises à jour, mais ne saurait être tenue pour
                  responsable d'erreurs, d'omissions ou de résultats obtenus par
                  un mauvais usage de ces informations.
                </p>
              </div>
            </section>

            {/* Final Note */}
            <div className="pt-12 border-t border-white/10 text-center">
              <p className="font-rajdhani font-bold text-xl text-white uppercase mb-4">
                L'équipe Holiday Geek Cup
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
