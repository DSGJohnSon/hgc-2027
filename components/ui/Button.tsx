"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "carouselTrophies";
export type ButtonSize = "sm" | "md" | "lg" | "carouselTrophies";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
  className?: string;
  href?: string;
  asLink?: boolean;
  isExternal?: boolean;
  textUpperCase?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  children,
  className = "",
  href,
  asLink = false,
  isExternal = false,
  textUpperCase = false,
  ...props
}) => {
  // Base styles
  const baseStyles = `
    relative z-[2] overflow-hidden inline-flex items-center justify-center
    border-none text-center font-rajdhani font-bold leading-none
    transition-all duration-200
    ${textUpperCase ? "uppercase" : ""}
  `;

  // Size variants
  const sizeStyles = {
    sm: "px-6 py-4 min-w-[152px] text-base",
    md: "px-8 py-5 min-w-[200px] text-base",
    lg: "px-10 py-6 min-w-[220px] text-lg",
    carouselTrophies: "aspect-square size-8 p-0 m-0",
  };

  // Variant styles with clip-path
  const variantStyles = {
    primary: cn(
      `bg-gradient-to-r from-theme to-theme2 text-gray-950`,
      `[clip-path:polygon(15px_0%,calc(100%-15px)_0%,100%_50%,calc(100%-15px)_100%,15px_100%,0%_50%)]`,
      `hover:bg-white hover:[clip-path:polygon(0_0%,100%_0%,100%_50%,100%_100%,0_100%,0%_50%)]`,
      `before:absolute before:top-[5px] before:left-[5px] before:w-4 before:h-[calc(100%-10px)] before:bg-gray-950 before:z-[-1] before:transition-all before:duration-200 before:[clip-path:polygon(85%_0,100%_0,15%_50%,100%_100%,85%_100%,0%_50%)]`,
      `hover:before:[clip-path:polygon(2px_60%,2px_calc(100%-2px),100%_calc(100%-0px),100%_100%,0_100%,0_100%)]`,
      `after:absolute after:top-[5px] after:right-[5px] after:w-4 after:h-[calc(100%-10px)] after:bg-gray-950 after:z-[-1] after:transition-all after:duration-200 after:rotate-180 after:[clip-path:polygon(85%_0,100%_0,15%_50%,100%_100%,85%_100%,0%_50%)]`,
      `hover:after:[clip-path:polygon(2px_60%,2px_calc(100%-2px),100%_calc(100%-0px),100%_100%,0_100%,0_100%)]`
    ),
    secondary: `
      bg-white text-gray-950
      [clip-path:polygon(15px_0%,calc(100%-15px)_0%,100%_50%,calc(100%-15px)_100%,15px_100%,0%_50%)]
      hover:bg-gray-300 hover:[clip-path:polygon(0_0%,100%_0%,100%_50%,100%_100%,0_100%,0%_50%)]
      before:absolute before:top-[5px] before:left-[5px] before:w-4 before:h-[calc(100%-10px)]
      before:bg-gray-950 before:z-[-1] before:transition-all before:duration-200
      before:[clip-path:polygon(85%_0,100%_0,15%_50%,100%_100%,85%_100%,0%_50%)]
      hover:before:[clip-path:polygon(2px_60%,2px_calc(100%-2px),100%_calc(100%-0px),100%_100%,0_100%,0_100%)]
      after:absolute after:top-[5px] after:right-[5px] after:w-4 after:h-[calc(100%-10px)]
      after:bg-gray-950 after:z-[-1] after:transition-all after:duration-200 after:rotate-180
      after:[clip-path:polygon(85%_0,100%_0,15%_50%,100%_100%,85%_100%,0%_50%)]
      hover:after:[clip-path:polygon(2px_60%,2px_calc(100%-2px),100%_calc(100%-0px),100%_100%,0_100%,0_100%)]
    `,
    carouselTrophies: "text-white hover:cursor-pointer hover:opacity-100 opacity-40",
  };

  // Border inner content styles
  const borderInnerStyles = variant.startsWith("border")
    ? `
    inline-block bg-title text-white border-0 w-full m-[2px] transition-all duration-400
    [clip-path:polygon(15px_0%,calc(100%-15px)_0%,100%_50%,calc(100%-15px)_100%,15px_100%,0%_50%)]
    ${sizeStyles[size]}
  `
    : "";

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${
    !variant.startsWith("border") ? sizeStyles[size] : ""
  } ${className}`;

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className="mr-2 transition-all duration-400">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="ml-2 transition-all duration-400">{icon}</span>
      )}
    </>
  );

  if (asLink && href) {
    return (
      <Link href={href} target={isExternal ? "_blank" : ""} className={combinedStyles}>
        {variant.startsWith("border") ? (
          <span className={borderInnerStyles}>{content}</span>
        ) : (
          content
        )}
      </Link>
    );
  }

  return (
    <button className={combinedStyles} {...props}>
      {variant.startsWith("border") ? (
        <span className={borderInnerStyles}>{content}</span>
      ) : (
        content
      )}
    </button>
  );
};

export default Button;
