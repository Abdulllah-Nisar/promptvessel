import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('EN');
  
  const translations = {
    EN: { hero: "Decode the matrix behind generative art.", studio: "Studio Matrix" },
    AR: { hero: "فك شفرة المصفوفة وراء الفن التوليدي.", studio: "مصفوفة الاستوديو" }
  };

  const value = { 
    lang, 
    setLang, 
    t: translations[lang] || translations['EN'] 
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Ye export check karein, ye exact hona chahiye
export function useLanguage() {
  return useContext(LanguageContext);
}