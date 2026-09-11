import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageData, SocialLink } from "@/types";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGooglePlay,
} from "react-icons/fa";

interface AboutWidgetProps {
  logo: ImageData;
  about: string;
  socialLinks: SocialLink[];
}

const AboutWidget: React.FC<AboutWidgetProps> = ({
  logo,
  about,
  socialLinks,
}) => {
  const getSocialIcon = (icon: string) => {
    const iconClass = "w-5 h-5";
    switch (icon.toLowerCase()) {
      case "facebook":
        return <FaFacebook className={iconClass} />;
      case "twitter":
        return <FaTwitter className={iconClass} />;
      case "instagram":
        return <FaInstagram className={iconClass} />;
      case "linkedin":
        return <FaLinkedin className={iconClass} />;
      case "google-play":
        return <FaGooglePlay className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center lg:items-start">
      {/* Logo */}
      <div className="mb-6">
        <Link href="/" className="inline-block">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={500}
            height={500}
            className="w-auto h-32 md:h-24"
          />
        </Link>
      </div>

      {/* About Text */}
      <p className="text-gray-400 text-sm mb-6 leading-relaxed font-rajdhani w-full text-center lg:text-left">
        {about}
      </p>

      {/* Social Links */}
      <div className="w-full flex flex-col items-center lg:items-start">
        <h3 className="text-white font-goldman text-xl mb-4">
          Suivez <span className="text-theme">Nous :</span>
        </h3>
        <div className="flex gap-3">
          {socialLinks.map((link) => (
            <Link
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-gray-900 hover:bg-theme text-white rounded transition-colors"
              aria-label={link.platform}
            >
              {getSocialIcon(link.icon)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutWidget;
