"use client";

import React, { useState } from "react";
import { LuSend } from "react-icons/lu";

interface NewsletterProps {
  title: string;
  description: string;
  placeholder: string;
}

const Newsletter: React.FC<NewsletterProps> = ({
  title,
  description,
  placeholder,
}) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <div className="w-full flex flex-col items-center lg:items-start">
      <h3 className="text-white font-goldman text-2xl mb-4">
        {title}
      </h3>
      <p className="text-gray-400 text-sm mb-4 font-rajdhani text-center lg:text-left">
        {description}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 font-rajdhani">
        <div className="flex items-center gap-4 bg-gray-900 rounded-full h-12 px-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            required
            className="flex-1 bg-transparent border-0 text-white text-sm focus:outline-none placeholder:text-gray-500"
          />
          <button
            type="submit"
            className="flex-none text-theme hover:text-theme2 transition-colors"
            aria-label="Subscribe"
          >
            <LuSend className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Newsletter;
