"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuTicket } from "react-icons/lu";
import { useWeezeventDialog } from "@/components/providers/WeezeventDialogProvider";
import { getRegistrationDeadline } from "@/lib/dateUtils";

interface FloatingRegisterProps {
  weezeventCode?: string;
  eventTitle: string;
  highlightColor: string;
  startDate: string;
  endDate?: string;
  shouldOpenRegister?: boolean;
  registrationOpen?: boolean;
  isCancelled?: boolean;
}

const FloatingRegister: React.FC<FloatingRegisterProps> = ({
  weezeventCode,
  startDate,
  endDate,
  eventTitle,
  highlightColor,
  shouldOpenRegister = false,
  registrationOpen = false,
  isCancelled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [autoOpenDialog, setAutoOpenDialog] = useState(shouldOpenRegister || false);
  const { openDialog } = useWeezeventDialog();

  // Auto-open dialog if register parameter is present
  useEffect(() => {
    if (autoOpenDialog && weezeventCode && registrationOpen) {
      openDialog(weezeventCode, eventTitle);
      setAutoOpenDialog(false);
    } else {
      setAutoOpenDialog(false); // Reset to prevent future auto-opens on re-render
    }
  }, [autoOpenDialog, weezeventCode, registrationOpen, eventTitle, openDialog]);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!weezeventCode) return null;

  return (
    <>
      <AnimatePresence>
        {isVisible && new Date() <= getRegistrationDeadline(startDate, endDate) && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-200 p-4 md:bottom-8 md:left-auto md:right-8 md:p-0"
          >
            {/* Desktop: Round Floating Button */}
            <button
              onClick={() => weezeventCode && openDialog(weezeventCode, eventTitle, registrationOpen)}
              disabled={!registrationOpen}
              className={registrationOpen ? "hidden md:flex items-center gap-3 px-8 py-4 rounded-full font-rajdhani font-bold text-gray-950 uppercase tracking-widest text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,0,0,0.3)] group overflow-hidden isolate cursor-pointer" : "hidden md:flex items-center gap-3 px-8 py-4 rounded-full font-rajdhani font-bold text-gray-400 uppercase tracking-widest text-lg transition-all shadow-[0_0_30px_rgba(0,0,0,0.3)] group overflow-hidden isolate cursor-not-allowed opacity-60"}
              style={{
                backgroundColor: registrationOpen ? highlightColor : '#4b5563',
                boxShadow: registrationOpen ? `0 10px 30px -10px ${highlightColor}cc` : '0 10px 30px -10px rgba(0,0,0,0.3)',
              }}
            >
              <LuTicket className="w-6 h-6" />
              {registrationOpen ? "S'inscrire" : (isCancelled ? "Événement annulé" : "Inscriptions fermées")}
              {/* Shine Effect Container */}
              <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-all duration-1000 skew-x-[-20deg] opacity-0 group-hover:opacity-100" />
              </div>
            </button>

            {/* Mobile: Full Width Fixed Bar */}
            <button
              onClick={() => weezeventCode && openDialog(weezeventCode, eventTitle, registrationOpen)}
              disabled={!registrationOpen}
              className="flex md:hidden w-full items-center justify-center gap-3 py-4 rounded-xl font-rajdhani font-bold uppercase tracking-widest text-base shadow-2xl transition-transform"
              style={{ 
                backgroundColor: registrationOpen ? highlightColor : '#4b5563',
                cursor: registrationOpen ? 'pointer' : 'not-allowed',
                opacity: registrationOpen ? 1 : 0.6,
                color: registrationOpen ? '#111827' : '#d1d5db',
              }}
            >
              <LuTicket className="w-5 h-5" />
              {registrationOpen ? "S'inscrire à l'événement" : (isCancelled ? "Événement annulé" : "Inscriptions fermées")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingRegister;
