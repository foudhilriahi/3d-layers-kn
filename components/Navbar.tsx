"use client";

import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import { useCart } from "@/lib/CartContext";

export default function Navbar() {
    const { totalItems } = useCart();

    return (
        <nav className="sticky top-0 left-0 right-0 z-40 px-4 py-2">
            <div className="w-full flex items-center justify-between px-6 py-2 rounded-[2rem] glass border-white/10 shadow-2xl">
                <Link href="/" className="text-xl md:text-2xl font-black text-white tracking-tighter hover:text-blue-400 transition-colors">
                    <span>3D LAYERS KN</span>
                </Link>

                <div className="flex items-center gap-3 sm:gap-6">
                    <Link href="/cart" className="relative group touch-manipulation">
                        <div className="w-11 h-11 sm:w-10 sm:h-10 rounded-full dark-glass flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-lg shadow-lg border-white/10">
                            <span className="group-hover:text-blue-400 transition-colors">🛒</span>
                        </div>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    <LanguageSelector />
                </div>
            </div>
        </nav>
    );
}
