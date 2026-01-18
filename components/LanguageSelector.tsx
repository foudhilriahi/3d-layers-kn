"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { useState } from "react";

export default function LanguageSelector() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'ar', name: 'العربية', flag: '🇹🇳' },
    ];

    const currentLang = languages.find(l => l.code === language);

    return (
        <div className="flex items-center gap-3">
            {/* Language Dropdown */}
            <div className="relative inline-block text-left">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass hover:bg-slate-700/50 transition-all text-sm font-bold tracking-tight text-white border-white/10 shadow-lg min-h-[44px] touch-manipulation"
                >
                    <span>{currentLang?.flag}</span>
                    <span className="hidden sm:inline">{currentLang?.name}</span>
                    <svg className={`w-3 h-3 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10 pointer-events-none"
                            onClick={() => setIsOpen(false)}
                        ></div>
                        <div className="absolute right-0 mt-3 w-40 rounded-2xl glass shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 border-white/10">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code as any);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-5 py-4 text-xs font-black tracking-widest uppercase hover:bg-white/10 transition-colors touch-manipulation ${language === lang.code ? 'text-blue-400 bg-white/5' : 'text-slate-300'
                                        }`}
                                >
                                    <span>{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
