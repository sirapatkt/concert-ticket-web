"use client";
import React, { createContext, useContext, useState } from "react";
import { translations } from "@/utils/translations";

// กำหนด Type
type Language = "th" | "en";
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.th; // ตัวช่วยให้ VS Code รู้จักคำแปล
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("th"); // ค่าเริ่มต้นภาษาไทย

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook สำหรับเรียกใช้ในหน้าอื่น
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}