"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useLanguage } from "@/lib/LanguageContext";
import { usePathname } from "next/navigation";

export default function MobileNav() {
    const { totalItems } = useCart();
    const { language, setLanguage } = useLanguage();
    const pathname = usePathname();

    const cycleLanguage = () => {
        const langs = ['fr', 'en', 'ar'] as const;
        const currentIndex = langs.indexOf(language);
        const nextIndex = (currentIndex + 1) % langs.length;
        setLanguage(langs[nextIndex]);
    };

    const langFlags: Record<string, string> = {
        fr: '🇫🇷',
        en: '🇺🇸',
        ar: '🇹🇳'
    };

    return (
        <>
            {/* Gradient fade at bottom */}
            <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pointer-events-none z-40 md:hidden" />
            
            {/* Navigation bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-bottom">
                <div className="mx-2 mb-2 px-2 py-2 rounded-2xl glass border-white/10 shadow-2xl">
                    <div className="flex items-center justify-around">
                        {/* Home */}
                        <Link 
                            href="/" 
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-90 ${pathname === '/' ? 'text-blue-400' : 'text-slate-400'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="text-[10px] font-bold">Home</span>
                        </Link>

                        {/* Instagram */}
                        <a 
                            href="https://www.instagram.com/3d_layers_kn/" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-1 p-2 rounded-xl text-slate-400 transition-all active:scale-90"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                            <span className="text-[10px] font-bold">Insta</span>
                        </a>

                        {/* Cart - Centered & Elevated */}
                        <Link 
                            href="/cart" 
                            className="relative -mt-6 flex flex-col items-center"
                        >
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${pathname === '/cart' ? 'bg-blue-600' : 'bg-white'}`}>
                                <span className={`text-2xl ${pathname === '/cart' ? 'grayscale-0' : ''}`}>🛒</span>
                            </div>
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                    {totalItems > 9 ? '9+' : totalItems}
                                </span>
                            )}
                            <span className={`text-[10px] font-bold mt-1 ${pathname === '/cart' ? 'text-blue-400' : 'text-slate-400'}`}>Cart</span>
                        </Link>

                        {/* Language */}
                        <button 
                            onClick={cycleLanguage}
                            className="flex flex-col items-center gap-1 p-2 rounded-xl text-slate-400 transition-all active:scale-90"
                        >
                            <span className="text-2xl">{langFlags[language]}</span>
                            <span className="text-[10px] font-bold">{language.toUpperCase()}</span>
                        </button>

                        {/* Admin (hidden link) */}
                        <Link 
                            href="/admin" 
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-90 ${pathname.startsWith('/admin') ? 'text-blue-400' : 'text-slate-400'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-[10px] font-bold">More</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
}
