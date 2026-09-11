import React from "react";
import AboutWidget from "./AboutWidget";
import FooterWidget from "./FooterWidget";
import Newsletter from "./Newsletter";
import Copyright from "./Copyright";
import { footerData } from "./content";

const Footer = () => {
  return (
    <footer className="relative z-20 bg-gray-950 overflow-hidden border-t-4 xl:border-t-3 border-theme">
      {/* Top Decorative Shape */}
      <div className="text-center">
        <div
          className="inline-block bg-gray-90 px-12 sm:px-60 py-6 mb-[-20px]"
          style={{
            clipPath: "polygon(0 0, 100% 0, calc(100% - 50px) 100%, 50px 100%)",
          }}
        />
      </div>

      {/* Widget Area */}
      <div className="pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* About Widget */}
            <div className="w-full">
              <AboutWidget
                logo={footerData.logo}
                about={footerData.about}
                socialLinks={footerData.socialLinks}
              />
            </div>

            {/* Link Widgets */}
            {footerData.widgets.map((widget) => (
              <div key={widget.title} className="w-full">
                <FooterWidget title={widget.title} links={widget.links} />
              </div>
            ))}

            {/* Newsletter Widget
            <div className="w-full">
              <Newsletter
                title={footerData.newsletter.title}
                description={footerData.newsletter.description}
                placeholder={footerData.newsletter.placeholder}
              />
            </div> */}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <Copyright />
    </footer>
  );
};

export default Footer;
