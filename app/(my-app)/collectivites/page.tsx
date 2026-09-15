import React from "react";
import { Metadata } from "next";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import CountingNumber from "@/components/ui/counting-number";
import Partners from "@/components/sections/Partners";
import TestimonialsCarousel from "@/components/sections/TestimonialsCarousel";
import { getCollectivitesPage } from "@/lib/content";

// Page d’accueil « collectivités » : cible secondaire, sur son URL propre.
// Contenu modifiable depuis le backoffice (Pages → Page Collectivités).
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getCollectivitesPage();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/collectivites" },
  };
}

export default async function Collectivites() {
  const { hero, whyUs, figures, solutions, testimonials, partners } =
    await getCollectivitesPage();

  const hasTestimonials = testimonials.items.length > 0;

  return (
    <>
      {/* Hero Header */}

      <section className="pt-[20svh] pb-[10svh] lg:pt-[30svh] gap-6 px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48 relative">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-6 justify-between items-start lg:items-end">
          <div className="w-full lg:w-1/2">
            <h1 className="font-goldman text-white uppercase text-3xl sm:text-4xl md:text-5xl xl:text-6xl text-left text-balance">
              {hero.titleLine1}
              <br /> {hero.titleLine2}
              <br /> {hero.titleLine3Start}{" "}
              <span className="text-theme">{hero.titleLine3Accent}</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-300 text-left text-balance wrap-normal font-rajdhani">
              {hero.intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-start items-stretch sm:items-center mt-6">
              {hero.buttons.map((button, index) => (
                <Button
                  key={`${button.href}-${index}`}
                  variant={index === 0 ? "primary" : "secondary"}
                  size="lg"
                  asLink
                  href={button.href}
                  className="w-full sm:w-auto"
                >
                  {button.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="bg-theme p-6 sm:p-8 w-full lg:w-auto h-fit rounded-xl flex flex-col sm:flex-row items-center justify-center gap-4">
            {hero.highlights.map((highlight, index) => (
              <React.Fragment key={`${highlight.label}-${index}`}>
                {index > 0 && (
                  <div className="h-px w-full sm:h-16 sm:w-px bg-white" />
                )}
                {highlight.icon ? (
                  <div className="flex items-center gap-4">
                    <div className="aspect-square w-12 sm:w-16 shrink-0">
                      <Image
                        src={highlight.icon.src}
                        alt={highlight.icon.alt}
                        width={100}
                        height={100}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-white font-bold uppercase text-xl sm:text-2xl text-balance font-rajdhani whitespace-pre-line">
                      {highlight.label}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center -space-y-0.5">
                    <span className="text-white font-bold uppercase text-xl sm:text-2xl font-rajdhani">
                      {highlight.value}
                    </span>
                    <span className="text-white uppercase font-rajdhani whitespace-pre-line text-center">
                      {highlight.label}
                    </span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <InfiniteSlider duration={60} className="mt-12 lg:mt-24">
          {hero.sliderImages.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className="aspect-video w-[70svw] sm:w-[45svw] lg:w-[30svw] xl:w-[20svw] rounded-xl overflow-hidden shadow-accent"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={1920}
                height={1080}
              />
            </div>
          ))}
        </InfiniteSlider>
        <div className="absolute top-0 left-0 bottom-1/3 right-0 lg:left-1/3 lg:bottom-1/2 -z-1">
          {hero.backgroundImage && (
            <Image
              src={hero.backgroundImage.src}
              alt={hero.backgroundImage.alt}
              fill
              style={{ objectFit: "cover" }}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/50 to-gray-950"></div>
          <div className="absolute inset-0 bg-linear-to-r from-gray-950 to-gray-950/0"></div>
        </div>
      </section>

      {/* Section "Why Us" */}
      <section className="py-[10svh] px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48">
        <p className="my-4 text-lg sm:text-xl uppercase text-theme text-center text-balance wrap-normal font-rajdhani">
          {whyUs.eyebrow}
        </p>
        <h2 className="font-goldman text-white uppercase text-3xl sm:text-4xl lg:text-5xl text-center text-balance">
          {whyUs.title}
        </h2>
        <div className="h-1 w-24 bg-theme mx-auto my-6 rounded-full"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 mt-12">
          {whyUs.cards.map((card, index) => (
            <div
              key={`${card.titleStart}-${index}`}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-full aspect-square overflow-hidden rounded-xl bg-linear-to-t from-theme to-theme/0 flex items-end">
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  width={800}
                  height={800}
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-rajdhani uppercase text-center flex flex-col">
                {card.titleStart}{" "}
                <span className="text-theme">{card.titleAccent}</span>
              </h3>
              <p className="font-rajdhani text-sm sm:text-base text-white text-center text-balance">
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
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mt-12 p-8 sm:p-12 lg:p-16 xl:p-24 bg-linear-to-br from-theme/0 to-theme/75 rounded-4xl overflow-hidden">
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

      {/* Section "Solutions" */}
      <section className="py-[10svh] px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48">
        <h2 className="font-goldman text-white uppercase text-3xl sm:text-4xl lg:text-5xl text-center text-balance">
          {solutions.title}
        </h2>
        <div className="h-1 w-24 bg-theme mx-auto my-6 rounded-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mt-12">
          {solutions.cards.map((card, index) => (
            <div
              key={`${card.title}-${index}`}
              className="bg-linear-to-br rounded-4xl border-2 border-white/5 w-full h-full flex flex-col gap-4 overflow-hidden relative"
            >
              <div className="w-full aspect-video overflow-hidden relative">
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  width={1920}
                  height={1080}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-950 to-transparent"></div>
              </div>
              <div className="flex flex-col gap-2 p-6 sm:p-8">
                <h4 className="text-white uppercase font-goldman text-xl">
                  {card.title}
                </h4>
                <span className="text-white font-rajdhani">{card.text}</span>
              </div>
              {card.icon.src && (
                <div className="p-3 sm:p-4 bg-theme aspect-square absolute top-4 left-4 rounded-full flex items-center justify-center w-12 sm:w-16">
                  <Image
                    src={card.icon.src}
                    alt={card.icon.alt}
                    width={50}
                    height={50}
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Section "Témoignages" */}
      {hasTestimonials && (
        <section className="py-[10svh] px-4 sm:px-8 lg:px-16 xl:px-32 2xl:px-48">
          <div className="border-2 border-theme rounded-2xl bg-linear-to-tl from-theme/70 to-theme/0 flex flex-col lg:flex-row items-stretch lg:items-center p-6 sm:p-8 lg:p-12 gap-8 lg:gap-16">
            <div className="w-full lg:w-1/3">
              <p className="text-lg sm:text-xl uppercase text-theme text-balance wrap-normal font-rajdhani">
                {testimonials.eyebrow}
              </p>
              <h2 className="font-goldman text-white uppercase text-3xl sm:text-4xl lg:text-5xl text-balance">
                {testimonials.title}
              </h2>
              <p className="font-rajdhani text-white mt-2">
                {testimonials.intro}
              </p>
              <Button
                variant="primary"
                size="md"
                asLink
                href={testimonials.button.href}
                className="cursor-pointer mt-8 w-full sm:w-auto"
              >
                {testimonials.button.label}
              </Button>
            </div>
            <TestimonialsCarousel items={testimonials.items} />
          </div>
        </section>
      )}

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
