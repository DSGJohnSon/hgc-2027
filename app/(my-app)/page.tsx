import { Metadata } from "next";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { LucideCalendar } from "lucide-react";
import Hero from "@/components/sections/HomeHero";
import CountingNumber from "@/components/ui/counting-number";
import { FaDiscord } from "react-icons/fa6";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import type { IconType } from "react-icons";
import { LuClock } from "react-icons/lu";
import Link from "next/link";
import Partners from "@/components/sections/Partners";
import { GameCard } from "@/components/features/games/GameCard";
import EventCarousel from "@/components/sections/EventCarousel";
import {
  getCategories,
  getEvents,
  getEventSeries,
  getGames,
  getHomePage,
} from "@/lib/content";
import {
  mergeSeriesAndEvents,
  prepareEvents,
  prepareEventSeries,
} from "@/lib/eventUtils";
import { cn } from "@/lib/utils";
import type { SocialNetwork } from "@/types/pages/home";

const SOCIAL_ICONS: Record<SocialNetwork, IconType> = {
  discord: FaDiscord,
  instagram: FaInstagram,
  facebook: FaFacebook,
  tiktok: FaTiktok,
  youtube: FaYoutube,
};

// Page d’accueil « joueurs » : cible principale, servie à la racine du site.
// Contenu modifiable depuis le backoffice (Pages → Page Accueil).
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomePage();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/" },
  };
}

export default async function Home() {
  const [eventsData, seriesData, games, categories, page] = await Promise.all([
    getEvents(),
    getEventSeries(),
    getGames(),
    getCategories(),
    getHomePage(),
  ]);
  const {
    hero,
    gamingSpaces,
    howItWorks,
    whyJoin,
    figures,
    community,
    cta,
    partners,
  } = page;

  // `prepareEvents` et `prepareEventSeries` calculent les statuts (à venir / en
  // cours / passé / annulé) et résolvent les jeux et catégories référencés par
  // identifiant. Une série y figure comme un seul rendez-vous couvrant toutes
  // ses étapes ; `mergeSeriesAndEvents` trie le tout (prochains rendez-vous en
  // tête) et garde les 10 premières cartes.
  const refs = { games, categories };
  const events = mergeSeriesAndEvents(
    prepareEventSeries(seriesData, refs),
    prepareEvents(eventsData, refs),
    10,
  );

  return (
    <>
      {/* Hero Header */}
      <Hero
        data={{
          mainHero: {
            subtitle: hero.subtitle,
            title: {
              line1: hero.titleLine1,
              line2: hero.titleLine2,
            },
            buttons: hero.buttons.map((button, index) => ({
              ...button,
              variant: index === 0 ? "primary" : "secondary",
              textUpperCase: true,
            })),
            totalParticipants: hero.totalParticipants,
            participantsSince: hero.participantsSince,
            backgroundImage: hero.backgroundImage,
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
          {gamingSpaces.eyebrow}
        </p>
        <h2 className="font-goldman text-white uppercase text-3xl sm:text-4xl lg:text-5xl text-center text-balance">
          {gamingSpaces.title}
        </h2>
        <div className="h-1 w-24 bg-theme mx-auto my-6 rounded-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12 max-w-sm md:max-w-none mx-auto mt-12">
          {gamingSpaces.cards.map((card, index) => (
            <div
              key={`${card.text}-${index}`}
              className="relative flex flex-col items-center gap-4"
            >
              {/* Espace indisponible : mêmes filtres que l'état au repos de
                  « Pourquoi rejoindre HGC ? », la mention restant hors filtre. */}
              <div
                className={cn(
                  "relative w-full aspect-square overflow-hidden rounded-4xl bg-linear-to-t from-yellow-600 to-yellow-600/0 flex items-end",
                  card.unavailable &&
                    "opacity-60 saturate-[0.2] grayscale-[0.5] brightness-[0.85] contrast-[0.9]",
                )}
              >
                {card.logo && (
                  <Image
                    src={card.logo.src}
                    alt={card.logo.alt}
                    width={800}
                    height={800}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] z-10"
                  />
                )}
                {card.backgroundImage && (
                  <Image
                    src={card.backgroundImage.src}
                    alt={card.backgroundImage.alt}
                    width={800}
                    height={800}
                    className="object-cover w-full h-full opacity-40"
                  />
                )}
                <p className="absolute inset-x-0 bottom-5 px-4 font-montserrat font-semibold text-sm lg:text-base text-white text-center text-balance z-20">
                  {card.text}
                </p>
              </div>
              {card.unavailable && (
                <span className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex w-max max-w-[85%] items-center justify-center gap-2 rounded-full bg-theme px-4 py-2 sm:px-5 font-rajdhani font-bold uppercase tracking-wide text-center text-sm lg:text-base leading-tight text-white shadow-lg shadow-black/50 ring-2 ring-white/30">
                  <LuClock className="size-4 lg:size-5 shrink-0" aria-hidden="true" />
                  Indisponible pour le moment
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Section "Jeux" */}
      <section className="py-[10svh] px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48 overflow-x-clip">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-2 lg:gap-12">
          <div>
            <h2 className="font-goldman text-white uppercase text-3xl sm:text-4xl lg:text-5xl text-balance">
              {page.games.title}
            </h2>
            <div className="h-1 w-24 bg-theme my-6 rounded-full"></div>
          </div>
          <p className="text-white text-balance font-rajdhani text-lg lg:max-w-md">
            {page.games.intro}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-16 lg:gap-8 mt-12 lg:mt-16">
          {page.games.items.map((game) => (
            <Link
              key={game.id}
              href={`/evenements?game=${game.id}`}
              className="w-full aspect-2/1"
            >
              <GameCard game={game} />
            </Link>
          ))}
        </div>
      </section>

      {/* Comment participer ? */}
      <section
        id="comment-participer"
        className="py-[10svh] px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48"
      >
        <h2 className="font-goldman text-white uppercase text-center text-3xl sm:text-4xl lg:text-5xl text-balance">
          {howItWorks.title}
        </h2>
        <div className="h-1 w-24 bg-theme mx-auto my-6 rounded-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mt-12 lg:mt-16">
          {howItWorks.steps.map((step, index) => (
            <div
              key={`${step.title}-${index}`}
              className="flex flex-col items-center"
            >
              <div className="flex items-center justify-center w-24 h-24 p-6 aspect-square bg-linear-to-t from-theme to-theme/0 rounded-full">
                {step.icon ? (
                  <Image
                    src={step.icon.src}
                    alt={step.icon.alt}
                    width={100}
                    height={100}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <LucideCalendar className="w-full h-full text-white" />
                )}
              </div>
              <h3 className="font-montserrat font-bold text-white text-xl sm:text-2xl lg:text-3xl text-center mt-4 uppercase">
                {step.title}
              </h3>
              <p className="font-rajdhani text-white text-center mt-2">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pourquoi rejoindre ? */}
      <section className="py-[10svh] px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48">
        <h2 className="font-goldman text-white uppercase text-center text-3xl sm:text-4xl lg:text-5xl text-balance">
          {whyJoin.title}
        </h2>
        <div className="h-1 w-24 bg-theme mx-auto my-6 rounded-full"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-x-8 lg:gap-16 mt-12 lg:mt-16">
          {whyJoin.cards.map((card, index) => (
            <div
              key={`${card.titleStart}-${index}`}
              className="flex flex-col items-center group"
            >
              {/* Sur PC : illustration au repos, remplacée au survol. Sur
                  mobile : seule l'illustration du survol, sans animation. */}
              <div
                className="relative flex items-center justify-center w-full max-w-64 sm:max-w-none p-[20%] aspect-square bg-linear-to-t from-theme to-theme/0 rounded-[25%]
            lg:opacity-60 lg:saturate-[0.2] lg:grayscale-[0.5] lg:brightness-[0.85] lg:contrast-[0.9]
            lg:transition-all lg:ease-in-out
            lg:group-hover:opacity-100 lg:group-hover:saturate-[1] lg:group-hover:grayscale-[0] lg:group-hover:brightness-[1] lg:group-hover:contrast-[1] group-hover:cursor-default
            "
              >
                {card.image && (
                  <Image
                    src={card.image.src}
                    alt={card.image.alt}
                    width={500}
                    height={500}
                    className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain w-[60%] h-[60%] opacity-100 lg:group-hover:opacity-0 lg:transition-all lg:ease-in-out"
                  />
                )}
                {card.hoverImage && (
                  <Image
                    src={card.hoverImage.src}
                    alt={card.hoverImage.alt}
                    width={500}
                    height={500}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 opacity-100 lg:scale-100 lg:opacity-0 lg:group-hover:scale-150 lg:group-hover:opacity-100 object-contain w-[60%] h-[60%] lg:transition-all lg:ease-in-out"
                  />
                )}
              </div>
              <h3 className="font-montserrat font-bold text-white text-xl sm:text-2xl lg:text-3xl text-center mt-4 uppercase flex flex-col">
                {card.titleStart}
                <span className="text-theme lg:text-white/50 lg:group-hover:text-theme lg:transition-all lg:ease-in-out text-lg sm:text-xl lg:text-2xl">
                  {card.titleAccent}
                </span>
              </h3>
              <p className="font-rajdhani text-white text-center text-balance mt-2">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section "Chiffres" */}
      <section className="py-[10svh] px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48">
        <h2 className="font-goldman text-white uppercase text-3xl sm:text-4xl lg:text-5xl text-center text-balance">
          {figures.title}
        </h2>
        <div className="h-1 w-24 bg-theme mx-auto my-6 rounded-full"></div>
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-8 lg:gap-12 mt-12 p-8 sm:p-12 lg:p-16 xl:p-24 bg-linear-to-br from-theme/0 to-theme/75 rounded-4xl overflow-hidden">
          {figures.logo && (
            <Image
              src={figures.logo.src}
              alt={figures.logo.alt}
              width={500}
              height={500}
              className="w-1/2 sm:w-2/3 mx-auto"
            />
          )}
          {figures.items.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex flex-col gap-2">
              <CountingNumber
                from={0}
                target={item.value}
                decimals={item.decimals}
                prefix={item.prefix}
                suffix={item.suffix}
                className="text-4xl sm:text-5xl xl:text-6xl text-white text-center uppercase font-goldman"
              />
              <span className="text-white uppercase font-rajdhani text-center font-semibold text-base sm:text-lg">
                {item.label}
              </span>
            </div>
          ))}
          {figures.backgroundImage && (
            <Image
              src={figures.backgroundImage.src}
              alt={figures.backgroundImage.alt}
              fill
              style={{ objectFit: "cover" }}
              className="absolute -inset-1 -z-1 opacity-40"
            />
          )}
        </div>
      </section>

      {/* Section "Communauté" */}
      <section className="py-[10svh] px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48">
        <div className="relative flex flex-col lg:flex-row bg-linear-to-tl from-theme/90 to-theme/0 rounded-4xl border-2 border-theme overflow-hidden">
          <div className="w-full lg:w-2/3 p-8 sm:p-12 lg:p-16">
            <h2 className="font-goldman text-white uppercase text-3xl sm:text-4xl lg:text-5xl text-balance">
              {community.title}
            </h2>
            <p className="font-goldman text-theme uppercase text-7xl sm:text-8xl lg:text-9xl">
              {community.accent}
            </p>
            <p className="font-rajdhani text-white font-semibold text-lg text-balance">
              {community.text}
            </p>
            <div className="flex flex-wrap gap-4 items-center mt-6">
              {community.socials.map((social, index) => {
                const Icon = SOCIAL_ICONS[social.network];
                return (
                  <Link
                    key={`${social.network}-${index}`}
                    href={social.url}
                    target="_blank"
                    aria-label={social.network}
                    className="text-white hover:text-theme transition-all ease-in-out"
                  >
                    <Icon className="size-8" />
                  </Link>
                );
              })}
            </div>
          </div>
          {community.photo && (
            <Image
              src={community.photo.src}
              alt={community.photo.alt}
              width={500}
              height={500}
              className="w-2/3 max-w-sm mx-auto -mt-2 sm:-mt-6 lg:self-end lg:w-full lg:h-full lg:object-contain lg:object-bottom"
            />
          )}
          {community.backgroundImage && (
            <Image
              src={community.backgroundImage.src}
              alt={community.backgroundImage.alt}
              fill
              style={{ objectFit: "cover" }}
              className="absolute right-0 top-0 bottom-0 w-2/3 -z-1 opacity-40"
            />
          )}
        </div>
      </section>

      {/* Section "Appel à l'action" */}
      <section className="py-[10svh] px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48 flex flex-col items-center">
        <h2 className="font-goldman text-theme uppercase text-3xl sm:text-4xl lg:text-5xl text-center text-balance">
          {cta.titleAccent}
        </h2>
        <h2 className="font-goldman text-white uppercase text-3xl sm:text-4xl lg:text-5xl text-center text-balance">
          {cta.title}
        </h2>
        {cta.button.label && (
          <Button
            variant={"primary"}
            asLink
            href={cta.button.href}
            textUpperCase
            className="w-full lg:w-auto mt-6"
          >
            {cta.button.label}
          </Button>
        )}
      </section>

      {/* Section "Partenaires" */}
      <Partners
        data={{
          subtitle: partners.subtitle,
          title: partners.title,
          logos: partners.logos,
        }}
      />
    </>
  );
}
