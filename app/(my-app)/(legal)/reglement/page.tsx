import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Règlement des Tournois | Holiday Geek Cup",
  description: "Consultez le règlement général des tournois organisés par Holiday Geek Cup. Règles, conditions de participation et fair-play pour tous nos événements gaming.",
};

export default function ReglementPage() {
  return (
    <div className="min-h-screen bg-gray-950 pt-72 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
          <header className="mb-12 border-b border-theme/30 pb-8">
            <h1 className="font-goldman text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-tight mb-4 tracking-tight">
              Règlement Général des Tournois{" "}
              <span className="text-theme">Holiday Geek Cup</span>
            </h1>
            <div className="flex flex-wrap gap-4 text-gray-400 font-rajdhani uppercase tracking-wider text-sm">
              <span>Association loi 1901</span>
              <span className="text-theme">•</span>
              <span>SIRET : 909 762 288 00027</span>
              <span className="text-theme">•</span>
              <span>Version : Novembre 2025</span>
            </div>
          </header>

          <div className="space-y-12 text-gray-300 font-rajdhani leading-relaxed">
            {/* Section 1 */}
            <section>
              <h2 className="font-rajdhani font-bold text-2xl text-white uppercase mb-6 flex items-center gap-3">
                <span className="text-theme">01.</span> Introduction
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    1.1. Présentation
                  </h3>
                  <p>
                    Les tournois organisés par Holiday Geek Cup (ci-après
                    “l’Organisateur”) sont des compétitions d’esport visant à
                    promouvoir la pratique du jeu vidéo, la mixité sociale, le
                    fair-play et un cadre bienveillant.
                  </p>
                  <p>
                    Le présent règlement s’applique à tous les tournois,
                    animations et compétitions organisés ou co-organisés par
                    Holiday Geek Cup. Toute inscription ou participation vaut
                    acceptation intégrale du présent règlement.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    1.2. Dates et lieu
                  </h3>
                  <p>
                    Les dates, horaires et lieux (en présentiel ou en ligne)
                    sont communiqués sur la billetterie, le site ou les supports
                    de communication officiels.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    1.3. Modalités d’inscription
                  </h3>
                  <p>Pour participer, le joueur doit :</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      réserver sa place via la billetterie Holiday Geek Cup ;
                    </li>
                    <li>fournir des informations exactes ;</li>
                    <li>présenter son billet lors du check-in ;</li>
                    <li>
                      respecter les horaires, consignes, et le présent
                      règlement.
                    </li>
                  </ul>
                  <p className="mt-2 italic">
                    Les inscriptions peuvent être gratuites ou payantes selon
                    l’événement.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="font-rajdhani font-bold text-2xl text-white uppercase mb-6 flex items-center gap-3">
                <span className="text-theme">02.</span> Check-in obligatoire
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    2.1. Obligation de check-in
                  </h3>
                  <p>
                    Le check-in est obligatoire pour valider la participation au
                    tournoi. Sans check-in, aucune participation n’est possible.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    2.2. Fonctionnement du check-in
                  </h3>
                  <ul className="list-decimal list-inside ml-4 space-y-1">
                    <li>
                      Récupérer sa place sur{" "}
                      <a
                        href="https://www.holidaygeekcup.fr"
                        className="text-theme hover:underline"
                      >
                        www.holidaygeekcup.fr
                      </a>
                    </li>
                    <li>Présenter son billet à l’ouverture de l’événement</li>
                    <li>Scanner son billet à l’entrée ou à la zone tournoi</li>
                    <li>Attendre la confirmation d’inscription validée</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">2.3. Délais</h3>
                  <p>
                    Le check-in se fait avant le début du tournoi. Les joueurs
                    doivent se présenter pendant l’heure dédiée. Une fois le
                    check-in fermé, aucune exception ne sera accordée.
                  </p>
                  <p className="mt-2 text-theme/80 font-semibold uppercase text-sm">
                    Les retards, files d’attente, problèmes techniques
                    personnels ne constituent pas un motif de réintégration.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="font-rajdhani font-bold text-2xl text-white uppercase mb-6 flex items-center gap-3">
                <span className="text-theme">03.</span> Conditions générales
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    3.1. Conditions d’admissibilité
                  </h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Âge minimum : âge PEGI du jeu.</li>
                    <li>
                      Autorisation parentale obligatoire pour les mineurs.
                    </li>
                    <li>
                      Pseudonyme approprié, non discriminatoire, non politique,
                      non commercial.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    3.2. Fair-play et comportement
                  </h3>
                  <p>Interdits formels :</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>triche, hacks, logiciels tiers non autorisés ;</li>
                    <li>
                      langage injurieux, comportement agressif, harcèlement ;
                    </li>
                    <li>non-respect des arbitres ;</li>
                    <li>
                      sabotage ou tentative de nuire au bon déroulement du
                      tournoi.
                    </li>
                  </ul>
                  <p className="mt-2 text-red-500 font-semibold">
                    Sanctions possibles : avertissement, exclusion du tournoi,
                    exclusion de l’événement ou interdiction de participation
                    future.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="font-rajdhani font-bold text-2xl text-white uppercase mb-6 flex items-center gap-3">
                <span className="text-theme">04.</span> Règles spécifiques
                d'événement
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    4.1. Matériel
                  </h3>
                  <p>
                    Interdictions : Vol ou déplacement du matériel,
                    détérioration volontaire ou négligente, débranchement ou
                    manipulation non autorisée du matériel HGC.
                  </p>
                  <p className="mt-2 font-semibold">
                    Conséquences : remboursement du matériel, exclusion
                    immédiate, dépôt de plainte si nécessaire.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    4.2. Hygiène et propreté
                  </h3>
                  <p>
                    Les participants doivent nettoyer manettes, claviers ou
                    souris après utilisation (lingettes disponibles), ne pas
                    laisser traîner de déchets et utiliser les poubelles.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    4.3. Vidéosurveillance
                  </h3>
                  <p>
                    Pour la sécurité de toutes et tous, l’événement peut être
                    équipé de caméras de vidéosurveillance. Les participants en
                    sont informés par leur présence sur site.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="font-rajdhani font-bold text-2xl text-white uppercase mb-6 flex items-center gap-3">
                <span className="text-theme">05.</span> Format et déroulement
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    5.1. Format du tournoi
                  </h3>
                  <p>
                    Le format (poules, élimination directe, BO1/BO3/BO5,
                    scoring…) est détaillé sur chaque événement.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    5.2. Retards
                  </h3>
                  <p>
                    Un retard de plus de 5 minutes après l’appel ou le début
                    d’un match peut entraîner un forfait automatique.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    5.3. Litiges
                  </h3>
                  <p>
                    Toute réclamation doit être faite immédiatement auprès des
                    arbitres. Les décisions arbitrales sont définitives et non
                    contestables.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="font-rajdhani font-bold text-2xl text-white uppercase mb-6 flex items-center gap-3">
                <span className="text-theme">06.</span> Matériel
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    6.1. Événements physiques
                  </h3>
                  <p>
                    Holiday Geek Cup fournit la majorité du matériel. Les
                    joueurs peuvent, selon l’événement, apporter leurs propres
                    périphériques (manette, casque), sous réserve de conformité.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    6.2. Événements en ligne
                  </h3>
                  <p>
                    Le joueur doit posséder : un matériel fonctionnel, une
                    connexion stable, un compte valide sur le jeu.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="font-rajdhani font-bold text-2xl text-white uppercase mb-6 flex items-center gap-3">
                <span className="text-theme">07.</span> Récompenses
              </h2>
              <p>
                Les lots sont précisés sur l’événement. Les gagnants seront
                contactés après la compétition pour recevoir leur lot.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="font-rajdhani font-bold text-2xl text-white uppercase mb-6 flex items-center gap-3">
                <span className="text-theme">08.</span> Droit à l'image
              </h2>
              <p>
                En participant à un tournoi Holiday Geek Cup, les joueurs
                autorisent la captation et l'utilisation de leur image, voix,
                nom et pseudonyme sur tous supports. Cette autorisation est
                gratuite et illimitée dans le temps.
              </p>
              <p className="mt-2">
                Demande de retrait :{" "}
                <a
                  href="mailto:contact@holidaygeekcup.fr"
                  className="text-theme hover:underline"
                >
                  contact@holidaygeekcup.fr
                </a>
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="font-rajdhani font-bold text-2xl text-white uppercase mb-6 flex items-center gap-3">
                <span className="text-theme">09.</span> Données personnelles
                (RGPD)
              </h2>
              <p>
                Holiday Geek Cup respecte le RGPD. Les données collectées
                servent uniquement au bon fonctionnement des tournois. Demande
                de rectification :{" "}
                <a
                  href="mailto:contact@holidaygeekcup.fr"
                  className="text-theme hover:underline"
                >
                  contact@holidaygeekcup.fr
                </a>
              </p>
            </section>

            {/* Final Note */}
            <div className="pt-12 border-t border-white/10 text-center">
              <p className="font-rajdhani font-bold text-xl text-white uppercase mb-4">
                L'équipe Holiday Geek Cup
              </p>
              <p className="italic text-gray-400">
                Bonne chance à tous les joueurs, et bon événement !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
