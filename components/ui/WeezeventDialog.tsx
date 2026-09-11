"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuTicket, LuX } from "react-icons/lu";
import Ticketing from "@/components/sections/Ticketing";

interface WeezeventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  weezeventCode: string;
  title: string;
  registrationOpen?: boolean;
}

const WeezeventDialog: React.FC<WeezeventDialogProps> = ({
  isOpen,
  onClose,
  weezeventCode,
  title,
  registrationOpen = true,
}) => {
  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-9998 bg-gray-950/95 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[80vh] mt-24 overflow-hidden flex flex-col pointer-events-auto shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gray-900/50">
                <div>
                  <h3 className="font-rajdhani font-bold text-xl text-white uppercase tracking-tight">
                    {title}
                  </h3>
                  <p className="text-gray-400 font-goldman text-sm uppercase tracking-wider">
                    Billetterie Weezevent
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                >
                  <LuX size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-0 bg-gray-950/30 w-full">
                {registrationOpen ? (
                  <Ticketing
                    data={{ code: weezeventCode }}
                    className="py-10 w-full max-w-none"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                    <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-8 max-w-md">
                      <LuTicket className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                      <h4 className="font-goldman text-2xl text-white uppercase mb-3">
                        Inscriptions fermées
                      </h4>
                      <p className="text-gray-400 font-rajdhani text-base leading-relaxed">
                        Les inscriptions pour cet événement sont actuellement fermées. 
                        Revenez plus tard ou contactez-nous pour plus d'informations.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/10 bg-gray-900/50 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg font-rajdhani font-bold text-white uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WeezeventDialog;
