"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import WeezeventDialog from "@/components/ui/WeezeventDialog";

interface WeezeventDialogContextType {
  openDialog: (weezeventCode: string, title: string, registrationOpen?: boolean) => void;
  closeDialog: () => void;
}

const WeezeventDialogContext = createContext<
  WeezeventDialogContextType | undefined
>(undefined);

export const useWeezeventDialog = () => {
  const context = useContext(WeezeventDialogContext);
  if (!context) {
    throw new Error(
      "useWeezeventDialog must be used within WeezeventDialogProvider"
    );
  }
  return context;
};

interface WeezeventDialogProviderProps {
  children: ReactNode;
}

export const WeezeventDialogProvider: React.FC<
  WeezeventDialogProviderProps
> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [weezeventCode, setWeezeventCode] = useState("");
  const [title, setTitle] = useState("");
  const [registrationOpen, setRegistrationOpen] = useState(true);

  const openDialog = (code: string, dialogTitle: string, isOpen = true) => {
    setWeezeventCode(code);
    setTitle(dialogTitle);
    setRegistrationOpen(isOpen);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <WeezeventDialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <WeezeventDialog
        isOpen={isOpen}
        onClose={closeDialog}
        weezeventCode={weezeventCode}
        title={title}
        registrationOpen={registrationOpen}
      />
    </WeezeventDialogContext.Provider>
  );
};
