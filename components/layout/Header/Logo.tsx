import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageData } from "@/types";

interface LogoProps {
  logo: ImageData;
  className?: string;
  href?: string;
}

const Logo: React.FC<LogoProps> = ({ logo, className = "", href = "/" }) => {
  return (
    <div className={`relative w-15 xl:w-[100px] py-4 ${className}`}>
      <Link href={href} className="block w-full">
        <Image
          src={logo.src}
          alt={logo.alt}
          width={500}
          height={500}
          className="relative z-10 w-full"
          priority
        />
      </Link>
    </div>
  );
};

export default Logo;
