import React from "react";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import { LinkItem } from "@/types";

interface FooterWidgetProps {
  title: string;
  links: LinkItem[];
}

const FooterWidget: React.FC<FooterWidgetProps> = ({ title, links }) => {
  return (
    <div className="w-full flex flex-col items-center lg:items-start">
      <h3 className="text-white font-goldman text-2xl mb-6">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="flex items-center text-gray-400 hover:text-theme transition-colors text-sm group font-rajdhani"
            >
              <LuChevronRight className="w-4 h-4 mr-2 text-theme group-hover:translate-x-1 transition-transform" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterWidget;
