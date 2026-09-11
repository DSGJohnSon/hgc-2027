"use client";

import React from "react";
import Link from "next/link";
import {
  LuClock,
  LuMapPin,
  LuTrainFront,
  LuBus,
  LuCar,
  LuShieldCheck,
  LuExternalLink,
  LuTicket,
  LuGamepad2,
  LuNavigation,
} from "react-icons/lu";
import { useWeezeventDialog } from "@/components/providers/WeezeventDialogProvider";
import { getRegistrationDeadline } from "@/lib/dateUtils";
import EventMap from "./EventMap";
import { Event } from "@/types/pages/detail-event";
import { Game } from "@/types/games";
import Statistics from "@/components/sections/Statistics";
import Gallery from "@/components/sections/Gallery";
import { FaWalking } from "react-icons/fa";
import Partners from "@/components/sections/Partners";
import FreeplaySection from "./FreeplaySection";
import EventCTASection from "./EventCTASection";

interface EventInfoProps {
  description: Event["description"];
  startDate: Event["startDate"];
  endDate?: Event["endDate"];
  startTime: Event["startTime"];
  endTime?: Event["endTime"];
  location: Event["location"];
  highlightColor: Event["color"];
  transports?: Event["transports"];
  weezeventCode?: Event["weezeventCode"];
  eventTitle: Event["title"];
  registrationOpen?: boolean;
  partners?: Event["partners"];
  freeplayGames?: Event["freeplayGames"];
  randomizeFreeplayGames?: boolean;
  isCancelled?: boolean;
  /** Catalogue des jeux, transmis par la page serveur. */
  gamesCatalogue: Game[];
}

const EventInfo: React.FC<EventInfoProps> = ({
  description,
  startDate,
  endDate,
  startTime,
  endTime,
  location,
  highlightColor,
  transports,
  weezeventCode,
  eventTitle,
  registrationOpen = false,
  partners,
  freeplayGames,
  randomizeFreeplayGames = false,
  isCancelled = false,
  gamesCatalogue,
}) => {
  const { openDialog } = useWeezeventDialog();

  const mapsDirectionLink = location
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`
    : undefined;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const displayDate = (() => {
    const start = formatDate(startDate);

    const hasEndDate = endDate && endDate.trim() !== "" && endDate !== startDate;
    const hasStartTime = startTime && startTime.trim() !== "";

    if (hasEndDate) {
      const end = formatDate(endDate);
      if (hasStartTime) {
        return `Du ${start} au ${end} à ${startTime}`;
      }
      return `Du ${start} au ${end}`;
    }

    if (hasStartTime) {
      return `Le ${start} à ${startTime}`;
    }
    return `Le ${start}`;
  })();

  return (
    <section className="py-20 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 lg:items-start">
          <div className="order-1 lg:order-2 lg:self-start lg:sticky lg:top-32 lg:h-fit">
            <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
              <h3 className="font-goldman text-2xl text-white uppercase tracking-tight">
                Infos Pratiques
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <LuGamepad2
                      className="w-5 h-5"
                      style={{ color: highlightColor }}
                    />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                      Date
                    </p>
                    <p className="text-white font-rajdhani font-bold">{displayDate}</p>
                  </div>
                </div>

                {startTime && !endTime && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <LuClock
                        className="w-5 h-5"
                        style={{ color: highlightColor }}
                      />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Horaires
                      </p>
                      <p className="text-white font-rajdhani font-bold">{startTime}</p>
                    </div>
                  </div>
                )}

                {startTime && endTime && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <LuClock
                        className="w-5 h-5"
                        style={{ color: highlightColor }}
                      />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Horaires
                      </p>
                      <p className="text-white font-rajdhani font-bold">
                        de {startTime} à {endTime}
                      </p>
                    </div>
                  </div>
                )}

                {location && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <LuMapPin
                        className="w-5 h-5"
                        style={{ color: highlightColor }}
                      />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Lieu
                      </p>
                      <p className="text-white font-rajdhani font-bold">{location}</p>
                    </div>
                  </div>
                )}
              </div>

              {transports && (
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <h4 className="text-white font-goldman uppercase text-sm tracking-wider">
                    Comment s&apos;y rendre ?
                  </h4>

                  {transports.metro &&
                    transports.metro.map((metro) => (
                      <div
                        className="flex items-start gap-4"
                        key={`metro-${metro.station}-${metro.lines.join("-")}`}
                      >
                        <LuTrainFront className="w-5 h-5 text-gray-400 shrink-0" />
                        <p className="text-gray-400 text-sm font-rajdhani">
                          Métro <span className="text-white font-bold">{metro.lines.join(", ")}</span> :
                          Arrêt <span className="text-white font-bold"> {metro.station}</span>
                        </p>
                        <p className="text-gray-500 font-rajdhani flex items-center gap-1">
                          <FaWalking className="size-3.5 text-gray-400 shrink-0" />
                          {metro.walkTimeInMin} min.
                        </p>
                      </div>
                    ))}

                  {transports.tramway &&
                    transports.tramway.map((tramway) => (
                      <div
                        className="flex items-start gap-4"
                        key={`tram-${tramway.station}-${tramway.lines.join("-")}`}
                      >
                        <LuTrainFront className="w-5 h-5 text-gray-400 shrink-0" />
                        <p className="text-gray-400 text-sm font-rajdhani">
                          Tramway <span className="text-white font-bold">{tramway.lines.join(", ")}</span> :
                          Arrêt <span className="text-white font-bold"> {tramway.station}</span>
                        </p>
                        <p className="text-gray-500 font-rajdhani flex items-center gap-1">
                          <FaWalking className="size-3.5 text-gray-400 shrink-0" />
                          {tramway.walkTimeInMin} min.
                        </p>
                      </div>
                    ))}

                  {transports.bus &&
                    transports.bus.map((bus) => (
                      <div className="flex items-start gap-4" key={bus.station}>
                        <LuBus className="w-5 h-5 text-gray-400 shrink-0" />
                        <p className="text-gray-400 font-rajdhani">
                          Bus <span className="text-white font-bold">{bus.lines.join(", ")}</span> : Arrêt
                          <span className="text-white font-bold"> {bus.station}</span>
                        </p>
                        <p className="text-gray-500 font-rajdhani flex items-center gap-1">
                          <FaWalking className="size-3.5 text-gray-400 shrink-0" />
                          {bus.walkTimeInMin} min.
                        </p>
                      </div>
                    ))}

                  {transports.car && (
                    <div className="space-y-3">
                      <div className="flex items-start gap-4">
                        <LuCar className="w-5 h-5 text-gray-400 shrink-0" />
                        <p className="text-white font-rajdhani font-bold text-sm">
                          Parkings à proximité :
                        </p>
                      </div>
                      <div className="pl-9 space-y-2">
                        {transports.car.parkings.map((p, idx) => (
                          <div key={idx} className="text-xs">
                            <p className="text-gray-200 font-bold">
                              {p.name} ({p.distanceInMeters}m)
                            </p>
                            <p className="text-gray-500 font-rajdhani">{p.address}</p>
                            <p className="text-gray-500 font-rajdhani flex items-center gap-1">
                              <FaWalking className="size-3.5 text-gray-400 shrink-0" />
                              {p.walkTimeInMin} min.
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                {mapsDirectionLink && (
                  <a
                    href={mapsDirectionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-xl border border-white/10 bg-white/5 font-rajdhani font-bold text-white uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all group"
                  >
                    <LuNavigation className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    me rendre à l&apos;événement
                    <LuExternalLink className="w-4 h-4 opacity-50" />
                  </a>
                )}

                <Link
                  href="/reglement"
                  target="_blank"
                  className="w-full py-4 rounded-xl border border-white/10 bg-white/5 font-rajdhani font-bold text-white uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all group"
                >
                  <LuShieldCheck className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  Voir le règlement
                  <LuExternalLink className="w-4 h-4 opacity-50" />
                </Link>

                {weezeventCode &&
                  new Date() <= getRegistrationDeadline(startDate, endDate) && (
                  <button
                    onClick={() =>
                      registrationOpen &&
                      weezeventCode &&
                      openDialog(weezeventCode, eventTitle, registrationOpen)
                    }
                    disabled={!registrationOpen}
                    className="w-full py-4 rounded-xl font-rajdhani font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-lg"
                    style={{
                      backgroundColor: registrationOpen ? highlightColor : "#4b5563",
                      color: registrationOpen ? "#111827" : "#d1d5db",
                      cursor: registrationOpen ? "pointer" : "not-allowed",
                      opacity: registrationOpen ? 1 : 0.6,
                    }}
                  >
                    <LuTicket className="w-5 h-5" />
                    {registrationOpen
                      ? "S'inscrire maintenant"
                      : isCancelled
                        ? "Événement annulé"
                        : "Inscriptions fermées"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-1 lg:col-span-2 space-y-12">
            <div>
              <h2 className="font-goldman text-3xl text-white uppercase tracking-tight flex items-center gap-3 mb-8">
                <span
                  className="w-8 h-1"
                  style={{ backgroundColor: highlightColor }}
                />
                Détails
              </h2>

              <div>
                {description &&
                  description.map((block, index) => {
                    if (block.type === "text" && Array.isArray(block.content)) {
                      return block.content.map((contentItem, idx: number) => {
                        if (contentItem.type === "title") {
                          return (
                            <h3
                              key={`${index}-${idx}-title`}
                              className="font-rajdhani font-bold text-2xl text-white mt-8 mb-4"
                            >
                              {contentItem.title}
                            </h3>
                          );
                        }

                        if (contentItem.type === "paragraph") {
                          return contentItem.paragraphs?.map(
                            (para: string, pIdx: number) => (
                              <p
                                key={`${index}-${idx}-${pIdx}`}
                                className="text-gray-300 text-base leading-7 mb-4"
                              >
                                {para}
                              </p>
                            ),
                          );
                        }

                        if (contentItem.type === "list") {
                          return (
                            <ul
                              key={`${index}-${idx}-list`}
                              className="list-disc list-inside text-gray-300 text-base leading-7 mb-4"
                            >
                              {contentItem.items?.map((item: string, itemIdx: number) => (
                                <li key={`${index}-${idx}-${itemIdx}`}>{item}</li>
                              ))}
                            </ul>
                          );
                        }

                        if (contentItem.type === "citation") {
                          return (
                            <blockquote
                              key={`${index}-${idx}-citation`}
                              className="border-l-4 border-gray-500 pl-4 italic text-gray-400 my-6"
                            >
                              {contentItem.citationText}
                            </blockquote>
                          );
                        }

                        return null;
                      });
                    }

                    if (block.type === "statistics" && block.content) {
                      return (
                        <Statistics
                          key={index}
                          data={block.content}
                          isDetailedEventPage={true}
                        />
                      );
                    }

                    if (block.type === "gallery" && block.content) {
                      return (
                        <Gallery
                          key={index}
                          data={block.content}
                          isDetailedEventPage={true}
                        />
                      );
                    }

                    return null;
                  })}
              </div>
            </div>

            {freeplayGames && freeplayGames.length > 0 && (
              <FreeplaySection
                games={freeplayGames}
                catalogue={gamesCatalogue}
                randomizeGames={randomizeFreeplayGames}
                highlightColor={highlightColor}
                compact={true}
              />
            )}

            {partners && partners.length > 0 && (
              <Partners
                data={{
                  subtitle: "Ils soutiennent l'événement",
                  title: "Nos Partenaires",
                  logos: partners,
                }}
                compact={true}
                subtitleColor={highlightColor}
              />
            )}

            {weezeventCode && (
              <EventCTASection
                highlightColor={highlightColor}
                registrationOpen={registrationOpen}
                weezeventCode={weezeventCode}
                eventTitle={eventTitle}
                isCancelled={isCancelled}
                compact={true}
              />
            )}

            {location && <EventMap location={location} highlightColor={highlightColor} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventInfo;
