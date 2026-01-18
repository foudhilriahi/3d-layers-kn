"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Language, translations, TranslationKeys } from './translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: TranslationKeys;
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('fr');
    
    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && (savedLang === 'fr' || savedLang === 'en' || savedLang === 'ar')) {
            setLanguageState(savedLang);
        }
        document.documentElement.classList.add('dark');
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }, []);

    const t = useMemo(() => translations[language], [language]);

    const value = useMemo(() => ({ 
        language, 
        setLanguage, 
        t, 
        darkMode: true, 
        toggleDarkMode: () => {} 
    }), [language, setLanguage, t]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
