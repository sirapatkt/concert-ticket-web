"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/utils/translations";

// 1. กำหนด Type
type Language = "th" | "en";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.th;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  
  // ประกาศตัวแปร State
  const [myLanguage, setMyLanguage] = useState<Language>("th");

  // โหลดค่าเดิม
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("beatpass-lang") as Language;
      
      if (savedLang === "th" || savedLang === "en") {
        // ✅ แก้ไข: ใช้ setTimeout เพื่อหลบตัวแดง (Trick)
        // มันจะช่วยให้ React ไม่มองว่าเป็น Cascading Render
        setTimeout(() => {
          setMyLanguage(savedLang);
        }, 0);
      }
    }
  }, []);

  // ฟังก์ชันเปลี่ยนภาษา
  const changeLanguage = (lang: Language) => {
    setMyLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("beatpass-lang", lang);
    }
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language: myLanguage, 
        setLanguage: changeLanguage, 
        t: translations[myLanguage] 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}