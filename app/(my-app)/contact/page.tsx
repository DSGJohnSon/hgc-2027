import React from "react";
import { Metadata } from "next";
import { Mail } from "lucide-react";
import { FaInstagram, FaFacebook, FaXTwitter } from "react-icons/fa6";
import ContactForm from "@/components/sections/ContactForm";
import { contactHero, contactSeo } from "./content";

const FALLBACK = {
  title: "NOUS CONTACTER",
  intro:
    "Vous avez une question, une suggestion ou souhaitez collaborer avec nous ? N'hésitez pas à nous contacter via nos réseaux sociaux ou notre email.",
  seoTitle: "Contact | Holiday Geek Cup",
  seoDescription:
    "Contactez Holiday Geek Cup pour toute question concernant nos événements gaming et tournois esport. Retrouvez-nous sur les réseaux sociaux.",
};

export const metadata: Metadata = {
  title: contactSeo.title || FALLBACK.seoTitle,
  description: contactSeo.description || FALLBACK.seoDescription,
};

export default function Contact() {
  const hero = contactHero;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-72 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-goldman text-5xl md:text-7xl uppercase text-white mb-6">
              {hero.title || FALLBACK.title}
            </h1>
            <p className="text-xl text-gray-300 font-rajdhani max-w-3xl">
              {hero.intro || FALLBACK.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Social Networks Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-goldman text-3xl md:text-4xl uppercase text-theme2 mb-4 text-center">
              NOS RÉSEAUX SOCIAUX
            </h2>
            <p className="text-lg text-gray-300 font-rajdhani text-center mb-12">
              Suivez-nous pour rester informé de nos événements et actualités
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/holiday_geek_cup/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gray-900/50 backdrop-blur-sm border-2 border-gray-800 hover:border-theme transition-all duration-300 p-8 rounded-lg"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-linear-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaInstagram className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-rajdhani font-bold text-2xl uppercase text-white">
                    INSTAGRAM
                  </h3>
                  <p className="text-gray-400 font-rajdhani">
                    Suivez nos événements en direct
                  </p>
                  <span className="text-theme font-rajdhani font-semibold uppercase group-hover:underline">
                    VOIR →
                  </span>
                </div>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/HolidayGeekCup/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gray-900/50 backdrop-blur-sm border-2 border-gray-800 hover:border-theme transition-all duration-300 p-8 rounded-lg"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaFacebook className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-rajdhani font-bold text-2xl uppercase text-white">
                    FACEBOOK
                  </h3>
                  <p className="text-gray-400 font-rajdhani">
                    Rejoignez notre communauté
                  </p>
                  <span className="text-theme font-rajdhani font-semibold uppercase group-hover:underline">
                    VOIR →
                  </span>
                </div>
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/HolidayGeekCup"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gray-900/50 backdrop-blur-sm border-2 border-gray-800 hover:border-theme transition-all duration-300 p-8 rounded-lg"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaXTwitter className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-rajdhani font-bold text-2xl uppercase text-white">
                    X (TWITTER)
                  </h3>
                  <p className="text-gray-400 font-rajdhani">
                    Actualités en temps réel
                  </p>
                  <span className="text-theme font-rajdhani font-semibold uppercase group-hover:underline">
                    VOIR →
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Email Section */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-goldman text-3xl md:text-4xl uppercase text-theme2 mb-4">
              NOTRE EMAIL
            </h2>
            <a
              href="mailto:contact@holidaygeekcup.fr"
              className="group inline-flex items-center gap-3 text-xl md:text-5xl font-rajdhani font-bold text-white hover:text-theme transition-colors mb-6"
            >
              <Mail className="w-5 h-5 md:w-12 md:h-12" />
              CONTACT@HOLIDAYGEEKCUP.FR
            </a>
            <p className="text-lg text-gray-300 font-rajdhani mt-6">
              Pour toute demande professionnelle, partenariat ou question
              spécifique
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <ContactForm />
    </div>
  );
}
