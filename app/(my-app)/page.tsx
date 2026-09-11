import { Metadata } from "next";
import Button from "@/components/ui/Button";
import Image from "next/image";
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideCalendar,
} from "lucide-react";
import Hero from "@/components/sections/HomeHero";
import CountingNumber from "@/components/ui/counting-number";
import { FaDiscord } from "react-icons/fa6";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import Partners from "@/components/sections/Partners";
import { GameCardById } from "@/components/features/games/GameCard";
import EventCarousel from "@/components/sections/EventCarousel";
import { getCategories, getEvents, getGames } from "@/lib/content";
import { prepareEvents } from "@/lib/eventUtils";
import AudiencePicker from "@/components/features/audience/AudiencePicker";

// Page d’accueil « joueurs » : cible principale, servie à la racine du site.
export const metadata: Metadata = {
  title:
    "Holiday Geek Cup | Tournois gaming et événements esport près de chez toi",
  description:
    "Participe aux tournois et événements gaming gratuits de Holiday Geek Cup : Fortnite, FC26, Rocket League, Valorant, Mario Kart. Des compétitions ouvertes à tous les niveaux, partout dans les Hauts-de-France.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [eventsData, games, categories] = await Promise.all([
    getEvents(),
    getGames(),
    getCategories(),
  ]);

  // `prepareEvents` calcule les statuts (à venir / en cours / passé / annulé),
  // résout les jeux et catégories référencés par identifiant, et trie les
  // prochains rendez-vous en tête. Mêmes règles que le carrousel des pages
  // événement, limité aux 10 premières cartes.
  const events = prepareEvents(
    eventsData,
    { games, categories },
    undefined,
    10,
  );

  return (
    <>
      {/* Première visite : choix entre la version joueurs et collectivités. */}
      <AudiencePicker />

      {/* Hero Header */}
      <Hero
        data={{
          mainHero: {
            subtitle: "#     100% GRATUITS     #",
            title: {
              line1: "L'événement gaming qui",
              line2: "débarque chez toi",
            },
            buttons: [
              {
                label: "Événements à venir",
                href: "/evenements",
                variant: "primary",
                textUpperCase: true,
              },
              {
                label: "Comment participer ?",
                href: "#comment-participer",
                variant: "secondary",
                textUpperCase: true,
              },
            ],
            totalParticipants: "80.000",
          },
        }}
      />

      {/* Section "Événements" */}
      {events.length > 0 && (
        <section className="py-[10svh] px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48">
          <EventCarousel
            data={{
              subtitle: "",
              title: "",
              events,
            }}
            loop={false}
            games={games}
            categories={categories}
          />
        </section>
      )}

      {/* Section "Espaces Gaming" */}
      <section className="py-[10svh] px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48">
        <p className="my-4 text-lg sm:text-xl uppercase text-theme text-center text-balance wrap-normal font-rajdhani">
          Envie de jouer dès maintenant ?
        </p>
        <h2 className="font-goldman text-white uppercase text-3xl sm:text-4xl lg:text-5xl text-center text-balance">
          nos espaces gaming
        </h2>
        <div className="h-1 w-24 bg-theme mx-auto my-6 rounded-full"></div>
        <div className="grid grid-cols-3 gap-12 mt-12">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full aspect-square overflow-hidden rounded-4xl bg-linear-to-t from-yellow-600 to-yellow-600/0 flex items-end">
              <Image
                src={"/new-assets/logo_pathe_games.webp"}
                alt="Holiday Geek Cup vous aide à créer du lien social au sein de votre collectivté"
                width={800}
                height={800}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-2/3 z-10"
              />
              <Image
                src={"/new-assets/bg-espace-pathe.webp"}
                alt="Holiday Geek Cup vous aide à créer du lien social au sein de votre collectivté"
                width={800}
                height={800}
                className="object-cover w-full h-full opacity-40"
              />
              <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-montserrat font-semibold text-sm sm:text-base text-white text-center text-balance z-20">
                Viens fêter ton anniversaire sur nos setups.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full aspect-square overflow-hidden rounded-4xl bg-linear-to-t from-yellow-600 to-yellow-600/0 flex items-end">
              <Image
                src={"/new-assets/logo_pathe_games.webp"}
                alt="Holiday Geek Cup vous aide à créer du lien social au sein de votre collectivté"
                width={800}
                height={800}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-2/3 z-10"
              />
              <Image
                src={"/new-assets/bg-espace-pathe.webp"}
                alt="Holiday Geek Cup vous aide à créer du lien social au sein de votre collectivté"
                width={800}
                height={800}
                className="object-cover w-full h-full opacity-40"
              />
              <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-montserrat font-semibold text-sm sm:text-base text-white text-center text-balance z-20">
                Viens fêter ton anniversaire sur nos setups.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full aspect-square overflow-hidden rounded-4xl bg-linear-to-t from-yellow-600 to-yellow-600/0 flex items-end">
              <Image
                src={"/new-assets/logo_pathe_games.webp"}
                alt="Holiday Geek Cup vous aide à créer du lien social au sein de votre collectivté"
                width={800}
                height={800}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-2/3 z-10"
              />
              <Image
                src={"/new-assets/bg-espace-pathe.webp"}
                alt="Holiday Geek Cup vous aide à créer du lien social au sein de votre collectivté"
                width={800}
                height={800}
                className="object-cover w-full h-full opacity-40"
              />
              <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-montserrat font-semibold text-sm sm:text-base text-white text-center text-balance z-20">
                Viens fêter ton anniversaire sur nos setups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section "Jeux" */}
      <section className="py-[10svh] px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48">
        <div className="flex justify-between">
          <div>
            <h2 className="font-goldman text-white uppercase text-3xl sm:text-4xl lg:text-5xl text-balance">
              À quoi tu joues ?
            </h2>
            <div className="h-1 w-24 bg-theme my-6 rounded-full"></div>
          </div>
          <p className="text-white text-balance  font-rajdhani text-lg">
            Clique sur ton jeu favori pour filtrer instantanément tous les
            tournois et animations disponibles.
          </p>
        </div>
        <div className="grid grid-cols-5 gap-8 mt-16">
          <div className="w-full aspect-2/1">
            <GameCardById id="fortnite" />
          </div>
          <div className="w-full aspect-2/1">
            <GameCardById id="fc26" />
          </div>
          <div className="w-full aspect-2/1">
            <GameCardById id="rocket_league" />
          </div>
          <div className="w-full aspect-2/1">
            <GameCardById id="mariokart_world" />
          </div>
          <div className="w-full aspect-2/1">
            <GameCardById id="valorant" />
          </div>
        </div>
      </section>

      {/* Comment participer ? */}
      <section
        id="comment-participer"
        className="py-[10svh] px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48"
      >
        <h2 className="font-goldman text-white uppercase text-center text-3xl sm:text-4xl lg:text-5xl text-balance">
          Comment ça marche ?
        </h2>
        <div className="h-1 w-24 bg-theme mx-auto my-6 rounded-full"></div>
        <div className="grid grid-cols-3 mt-16">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-24 h-24 p-6 aspect-square bg-linear-to-t from-theme to-theme/0 rounded-full">
              <LucideCalendar className="w-full h-full text-white" />
            </div>
            <h3 className="font-montserrat font-bold text-white text-xl sm:text-2xl lg:text-3xl text-center mt-4 uppercase">
              1. Choisis ton event
            </h3>
            <p className="font-rajdhani text-white text-center mt-2">
              Parcours les tournois à venir et choisis celui qui te plaît.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-24 h-24 p-6 aspect-square bg-linear-to-t from-theme to-theme/0 rounded-full">
              <LucideCalendar className="w-full h-full text-white" />
            </div>
            <h3 className="font-montserrat font-bold text-white text-xl sm:text-2xl lg:text-3xl text-center mt-4 uppercase">
              2. Inscris-toi
            </h3>
            <p className="font-rajdhani text-white text-center mt-2">
              Remplis le formulaire d'inscription en ligne.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-24 h-24 p-6 aspect-square bg-linear-to-t from-theme to-theme/0 rounded-full">
              <LucideCalendar className="w-full h-full text-white" />
            </div>
            <h3 className="font-montserrat font-bold text-white text-xl sm:text-2xl lg:text-3xl text-center mt-4 uppercase">
              3. Participe
            </h3>
            <p className="font-rajdhani text-white text-center mt-2">
              Rejoins-nous le jour J., montre ton skill et amuse-toi !
            </p>
          </div>
        </div>
      </section>

      {/* Pourquoi rejoindre ? */}
      <section className="py-[10svh] px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48">
        <h2 className="font-goldman text-white uppercase text-center text-3xl sm:text-4xl lg:text-5xl text-balance">
          Pourquoi rejoindre HGC ?
        </h2>
        <div className="h-1 w-24 bg-theme mx-auto my-6 rounded-full"></div>
        <div className="grid grid-cols-4 gap-16 mt-16">
          <div className="flex flex-col items-center group">
            <div
              className="flex items-center justify-center w-full p-[20%] aspect-square bg-linear-to-t from-theme to-theme/0 saturate-[0.2] sepai-[0.6] grayscale-[0.5]  brightness-[0.85] contrast-[0.9] rounded-[25%] opacity-60
            transition-all ease-in-out
            group-hover:opacity-100 group-hover:saturate-[1] group-hover:sepai-[0] group-hover:grayscale-[0]  group-hover:brightness-[1] group-hover:contrast-[1] group-hover:cursor-default
            "
            >
              <Image
                src={"/new-assets/mascotte/mascotte-vainqueur-triste.webp"}
                alt="decorative"
                width={500}
                height={500}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain w-[60%] h-[60%] opacity-100 group-hover:opacity-0 transition-all ease-in-out"
              />
              <Image
                src={"/new-assets/mascotte/mascotte-vainqueur.webp"}
                alt="decorative"
                width={500}
                height={500}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 group-hover:scale-150 opacity-0 group-hover:opacity-100 object-contain w-[60%] h-[60%] transition-all ease-in-out"
              />
            </div>
            <h3 className="font-montserrat font-bold text-white text-xl sm:text-2xl lg:text-3xl text-center mt-4 uppercase flex flex-col">
              Des tournois
              <span className="text-white/50 group-hover:text-theme transition-all ease-in-out text-lg sm:text-xl lg:text-2xl">
                pour tous
              </span>
            </h3>
            <p className="font-rajdhani text-white text-center text-balance mt-2">
              Des compétitions accessibles à tous les niveaux et sur tes jeux
              préféres.
            </p>
          </div>
          <div className="flex flex-col items-center group">
            <div
              className="flex items-center justify-center w-full p-[20%] aspect-square bg-linear-to-t from-theme to-theme/0 saturate-[0.2] sepai-[0.6] grayscale-[0.5]  brightness-[0.85] contrast-[0.9] rounded-[25%] opacity-60
            transition-all ease-in-out
            group-hover:opacity-100 group-hover:saturate-[1] group-hover:sepai-[0] group-hover:grayscale-[0]  group-hover:brightness-[1] group-hover:contrast-[1] group-hover:cursor-default
            "
            >
              <Image
                src={"/new-assets/mascotte/mascotte-communaute-triste.webp"}
                alt="decorative"
                width={500}
                height={500}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain w-[60%] h-[60%] opacity-100 group-hover:opacity-0 transition-all ease-in-out"
              />
              <Image
                src={"/new-assets/mascotte/mascotte-communaute.webp"}
                alt="decorative"
                width={500}
                height={500}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 group-hover:scale-150 opacity-0 group-hover:opacity-100 object-contain w-[60%] h-[60%] transition-all ease-in-out"
              />
            </div>
            <h3 className="font-montserrat font-bold text-white text-xl sm:text-2xl lg:text-3xl text-center mt-4 uppercase flex flex-col">
              Une communauté
              <span className="text-white/50 group-hover:text-theme transition-all ease-in-out text-lg sm:text-xl lg:text-2xl">
                passionnée
              </span>
            </h3>
            <p className="font-rajdhani text-white text-center text-balance mt-2">
              Rencontre d'autres joueurs qui partagent ta passion.
            </p>
          </div>
          <div className="flex flex-col items-center group">
            <div
              className="flex items-center justify-center w-full p-[20%] aspect-square bg-linear-to-t from-theme to-theme/0 saturate-[0.2] sepai-[0.6] grayscale-[0.5]  brightness-[0.85] contrast-[0.9] rounded-[25%] opacity-60
            transition-all ease-in-out
            group-hover:opacity-100 group-hover:saturate-[1] group-hover:sepai-[0] group-hover:grayscale-[0]  group-hover:brightness-[1] group-hover:contrast-[1] group-hover:cursor-default
            "
            >
              <Image
                src={"/new-assets/mascotte/mascotte-gift-triste.webp"}
                alt="decorative"
                width={500}
                height={500}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain w-[60%] h-[60%] opacity-100 group-hover:opacity-0 transition-all ease-in-out"
              />
              <Image
                src={"/new-assets/mascotte/mascotte-gift.webp"}
                alt="decorative"
                width={500}
                height={500}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 group-hover:scale-150 opacity-0 group-hover:opacity-100 object-contain w-[60%] h-[60%] transition-all ease-in-out"
              />
            </div>
            <h3 className="font-montserrat font-bold text-white text-xl sm:text-2xl lg:text-3xl text-center mt-4 uppercase flex flex-col">
              Des cashprizes
              <span className="text-white/50 group-hover:text-theme transition-all ease-in-out text-lg sm:text-xl lg:text-2xl">
                à gagner
              </span>
            </h3>
            <p className="font-rajdhani text-white text-center text-balance mt-2">
              Cashprizes, cadeaux et récompenses exclusives à certains
              événements.
            </p>
          </div>
          <div className="flex flex-col items-center group">
            <div
              className="flex items-center justify-center w-full p-[20%] aspect-square bg-linear-to-t from-theme to-theme/0 saturate-[0.2] sepai-[0.6] grayscale-[0.5]  brightness-[0.85] contrast-[0.9] rounded-[25%] opacity-60
            transition-all ease-in-out
            group-hover:opacity-100 group-hover:saturate-[1] group-hover:sepai-[0] group-hover:grayscale-[0]  group-hover:brightness-[1] group-hover:contrast-[1] group-hover:cursor-default
            "
            >
              <Image
                src={"/new-assets/mascotte/mascotte-location-triste.webp"}
                alt="decorative"
                width={500}
                height={500}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain w-[60%] h-[60%] opacity-100 group-hover:opacity-0 transition-all ease-in-out"
              />
              <Image
                src={"/new-assets/mascotte/mascotte-location.webp"}
                alt="decorative"
                width={500}
                height={500}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 group-hover:scale-150 opacity-0 group-hover:opacity-100 object-contain w-[60%] h-[60%] transition-all ease-in-out"
              />
            </div>
            <h3 className="font-montserrat font-bold text-white text-xl sm:text-2xl lg:text-3xl text-center mt-4 uppercase flex flex-col">
              Des Événements
              <span className="text-white/50 group-hover:text-theme transition-all ease-in-out text-lg sm:text-xl lg:text-2xl">
                proche de chez toi
              </span>
            </h3>
            <p className="font-rajdhani text-white text-center text-balance mt-2">
              HGC organise des events dans ta ville et ton quartier toute
              l'année.
            </p>
          </div>
        </div>
      </section>

      {/* Section "Chiffres" */}
      <section className="py-[10svh] px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48">
        <h2 className="font-goldman text-white uppercase text-3xl sm:text-4xl lg:text-5xl text-center text-balance">
          HGC en quelques chiffres
        </h2>
        <div className="h-1 w-24 bg-theme mx-auto my-6 rounded-full"></div>
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-8 lg:gap-12 mt-12 p-8 sm:p-12 lg:p-16 xl:p-24 bg-linear-to-br from-theme/0 to-theme/75 rounded-4xl overflow-hidden">
          <Image
            src={"/assets/logos/logo-hgc.svg"}
            alt="decorative"
            width={500}
            height={500}
            className="w-2/3"
          />
          <div className="flex flex-col gap-2">
            <CountingNumber
              from={0}
              target={10.3}
              decimals={1}
              prefix="+ de "
              suffix=" k"
              className="text-4xl sm:text-5xl xl:text-6xl text-white text-center uppercase font-goldman"
            />
            <span className="text-white uppercase font-rajdhani text-center font-semibold text-base sm:text-lg">
              joueurs / an
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <CountingNumber
              from={0}
              target={67}
              decimals={0}
              prefix="+ de "
              className="text-4xl sm:text-5xl xl:text-6xl text-white text-center uppercase font-goldman"
            />
            <span className="text-white uppercase font-rajdhani text-center font-semibold text-base sm:text-lg">
              événements / an
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <CountingNumber
              from={0}
              target={4}
              decimals={0}
              prefix="+ de "
              suffix=" k€"
              className="text-4xl sm:text-5xl xl:text-6xl text-white text-center uppercase font-goldman"
            />
            <span className="text-white uppercase font-rajdhani text-center font-semibold text-base sm:text-lg">
              cashprize offert par an
            </span>
          </div>
          <Image
            src={"/new-assets/bg-section-chiffres.webp"}
            alt="decorative"
            fill
            style={{ objectFit: "cover" }}
            className="absolute -inset-1 -z-1 opacity-40"
          />
        </div>
      </section>

      {/* Section "Chiffres" */}
      <section className="py-[10svh] px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48">
        <div className="relative flex bg-linear-to-tl from-theme/90 to-theme/0 rounded-4xl border-2 border-theme overflow-hidden">
          <div className="w-2/3 p-16">
            <h2 className="font-goldman text-white uppercase text-3xl sm:text-4xl lg:text-5xl">
              Rejoins la communauté
            </h2>
            <p className="font-goldman text-theme uppercase text-9xl">HGC</p>
            <p className="font-rajdhani text-white font-semibold text-lg text-balance">
              Ne rate aucune annonce d'événement, actualités ou ouverture de
              billeterie. Suis-nous sur nos réseaux sociaux et sois parmi les
              premiers informés !
            </p>
            <div className="flex gap-4 items-center mt-6">
              <Link
                href="#"
                target="_blank"
                className="text-white hover:text-theme transition-all ease-in-out"
              >
                <FaDiscord className="size-8" />
              </Link>
              <Link
                href="#"
                target="_blank"
                className="text-white hover:text-theme transition-all ease-in-out"
              >
                <FaInstagram className="size-8" />
              </Link>
              <Link
                href="#"
                target="_blank"
                className="text-white hover:text-theme transition-all ease-in-out"
              >
                <FaFacebook className="size-8" />
              </Link>
              <Link
                href="#"
                target="_blank"
                className="text-white hover:text-theme transition-all ease-in-out"
              >
                <FaTiktok className="size-8" />
              </Link>
              <Link
                href="#"
                target="_blank"
                className="text-white hover:text-theme transition-all ease-in-out"
              >
                <FaYoutube className="size-8" />
              </Link>
            </div>
          </div>
          <Image
            src={"/new-assets/photo-section-commu-joueurs.webp"}
            alt="decorative"
            width={500}
            height={500}
            className="absolute w-1/3 right-6 top-4"
          />
          <Image
            src={"/new-assets/bg-section-commu-joueurs.webp"}
            alt="decorative"
            fill
            style={{ objectFit: "cover" }}
            className="absolute right-0 top-0 bottom-0 w-2/3 -z-1 opacity-40"
          />
        </div>
      </section>

      {/* Section "Chiffres" */}
      <section className="py-[10svh] px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48 flex flex-col items-center">
        <h2 className="font-goldman text-theme uppercase text-3xl sm:text-4xl lg:text-5xl text-center text-balance">
          Prêt à jouer ?
        </h2>
        <h2 className="font-goldman text-white uppercase text-3xl sm:text-4xl lg:text-5xl text-center text-balance">
          Trouve ton prochain événement.
        </h2>
        <Button
          variant={"primary"}
          asLink
          href={"/evenements"}
          textUpperCase
          className="w-full lg:w-auto mt-6"
        >
          Découvrir les événements
        </Button>
      </section>

      {/* Section "Partenaires" */}
      <Partners
        data={{
          subtitle: "",
          title: "Nos partenaires",
          logos: [
            {
              alt: "",
              src: "/api/media/file/logo_ville-lens-1.png",
            },
            {
              alt: "",
              src: "/api/media/file/logo_ville-lillers-1.png",
            },
            {
              alt: "",
              src: "/api/media/file/logo_solillers-1.png",
            },
            {
              alt: "",
              src: "/api/media/file/logo_ville-ronchin-1.png",
            },
            {
              alt: "",
              src: "/api/media/file/logo_ville-marcq-en-baroeule-1.png",
            },
            {
              alt: "",
              src: "/api/media/file/logo_ville-wingles-1.png",
            },
            {
              alt: "",
              src: "/api/media/file/logo_ville-loos-en-gohelle-1.png",
            },
            {
              alt: "",
              src: "/api/media/file/logo_ville-isbergues-1.png",
            },
            {
              alt: "",
              src: "/api/media/file/logo_ville-lestrem-1.png",
            },
          ],
        }}
      />
    </>
  );
}
