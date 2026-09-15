"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import AudiencePicker from "@/components/features/audience/AudiencePicker";

interface AudiencePickerContextType {
  /** Rouvre la popup de sélection de cible, depuis n'importe quel composant. */
  openPicker: () => void;
}

const AudiencePickerContext = createContext<AudiencePickerContextType | undefined>(
  undefined,
);

export const useAudiencePicker = () => {
  const context = useContext(AudiencePickerContext);
  if (!context) {
    throw new Error("useAudiencePicker must be used within AudiencePickerProvider");
  }
  return context;
};

/**
 * Monte la popup de sélection joueurs/collectivités une seule fois, au niveau
 * du layout : elle s'affiche automatiquement à la première visite d'une des
 * deux pages d'accueil (logique interne à `AudiencePicker`), et peut aussi
 * être rouverte à la demande — par le bouton de version dans le header.
 */
export const AudiencePickerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [forcedOpen, setForcedOpen] = useState(false);

  const openPicker = useCallback(() => setForcedOpen(true), []);
  const closeForcedPicker = useCallback(() => setForcedOpen(false), []);

  return (
    <AudiencePickerContext.Provider value={{ openPicker }}>
      {children}
      <AudiencePicker forcedOpen={forcedOpen} onForcedClose={closeForcedPicker} />
    </AudiencePickerContext.Provider>
  );
};
