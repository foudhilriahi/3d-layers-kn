"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Product } from "@/lib/db";
import Link from "next/link";
import { useState, useRef } from "react";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";

export default function ProductDetail({ product }: { product: Product }) {
    const { t, language } = useLanguage();
    const { addToCart } = useCart();
    const router = useRouter();
    const [mainImage, setMainImage] = useState(product.image_url);
    
    // Swipe gesture state
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const images = [
        product.image_url,
        product.image_url2,
        product.image_url3,
    ].filter(Boolean) as string[];

    const currentIndex = images.indexOf(mainImage);

    const nextImage = () => {
        const nextIndex = (currentIndex + 1) % images.length;
        setMainImage(images[nextIndex]);
    };

    const prevImage = () => {
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setMainImage(images[prevIndex]);
    };

    // Swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        const threshold = 50; // minimum swipe distance
        
        if (Math.abs(diff) > threshold && images.length > 1) {
            if (diff > 0) {
                nextImage(); // Swipe left = next
            } else {
                prevImage(); // Swipe right = prev
            }
        }
    };

    const localName = language === 'en' ? product.name_en : language === 'ar' ? product.name_ar : product.name;
    const localDesc = language === 'en' ? product.description_en : language === 'ar' ? product.description_ar : product.description;

    const handleOrderNow = () => {
        addToCart(product, 1);
        router.push('/cart');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 md:py-24">
            <Link href="/" className={`inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-6 sm:mb-12 group transition-all ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50 transition-all active:scale-95">
                    <span className="transition-transform text-white">
                        {language === 'ar' ? '→' : '←'}
                    </span>
                </div>
                {t.product.back}
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 md:gap-16 lg:gap-24 items-start">
                <div className="space-y-3 sm:space-y-6 animate-in fade-in slide-in-from-left duration-700 max-w-lg mx-auto lg:mx-0 w-full">
                    <div className="rounded-2xl sm:rounded-[3rem] overflow-hidden glass p-2 sm:p-6 shadow-2xl shadow-slate-900/50 border-white/10 relative group/gallery">
                        <div 
                            className="aspect-square rounded-xl sm:rounded-[2rem] overflow-hidden bg-white flex items-center justify-center p-3 sm:p-8 relative touch-pan-x"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <img
                                src={mainImage}
                                alt={localName || product.name}
                                className="w-full h-full object-contain animate-in fade-in zoom-in duration-500 select-none pointer-events-none"
                                key={mainImage}
                                draggable={false}
                            />
                            {images.length > 1 && (
                                <>
                                    {/* Desktop arrows - hidden on mobile, visible on hover */}
                                    <button onClick={prevImage} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 text-white flex items-center justify-center md:opacity-0 md:group-hover/gallery:opacity-100 opacity-70 transition-opacity hover:bg-blue-600 active:scale-90 z-10">
                                        <span className="text-lg sm:text-xl font-black">←</span>
                                    </button>
                                    <button onClick={nextImage} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 text-white flex items-center justify-center md:opacity-0 md:group-hover/gallery:opacity-100 opacity-70 transition-opacity hover:bg-blue-600 active:scale-90 z-10">
                                        <span className="text-lg sm:text-xl font-black">→</span>
                                    </button>
                                </>
                            )}
                        </div>
                        
                        {/* Dot indicators for mobile */}
                        {images.length > 1 && (
                            <div className="flex justify-center gap-2 mt-3 md:hidden">
                                {images.map((_, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => setMainImage(images[i])}
                                        className={`w-2 h-2 rounded-full transition-all ${currentIndex === i ? 'bg-blue-500 w-6' : 'bg-white/30'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Thumbnails - hidden on mobile, visible on desktop */}
                    <div className="hidden sm:flex justify-center lg:justify-start gap-2 sm:gap-4 overflow-x-auto pb-2 hide-scrollbar">
                        {images.map((img, i) => (
                            <button key={i} onClick={() => setMainImage(img)} className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden glass p-1 shadow-lg transition-all hover:scale-105 active:scale-95 flex-shrink-0 ${mainImage === img ? 'ring-2 ring-blue-500' : 'opacity-40 hover:opacity-100'}`}>
                                <div className="w-full h-full rounded-lg sm:rounded-xl overflow-hidden bg-white p-1">
                                    <img src={img} alt={`${localName || product.name} ${i + 1}`} className="w-full h-full object-contain" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`flex flex-col pt-2 sm:pt-4 animate-in fade-in slide-in-from-right duration-700 ${language === 'ar' ? 'text-right items-end' : ''}`}>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-8 tracking-tighter leading-[0.9] italic">
                        {localName || product.name}
                    </h1>
                    <div className={`flex items-baseline gap-2 sm:gap-4 mb-6 sm:mb-10 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <span className="text-3xl sm:text-4xl md:text-5xl font-black gradient-text tracking-tighter">{product.price}</span>
                        <span className="text-base sm:text-xl font-black text-slate-400 uppercase tracking-widest italic">TND</span>
                    </div>
                    <div className="prose prose-slate max-w-none mb-6 sm:mb-12">
                        <p className={`text-base sm:text-lg md:text-xl text-slate-400 font-bold opacity-90 max-w-xl ${language === 'ar' ? 'text-right' : ''}`}>
                            {localDesc || product.description}
                        </p>
                    </div>

                    <div className="mt-auto space-y-4 sm:space-y-8 w-full">
                        {product.stock > 0 ? (
                            <div className="space-y-4 sm:space-y-6 p-4 sm:p-8 rounded-2xl sm:rounded-[3rem] glass border-white/10 shadow-xl">
                                <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                    <div className="text-xs sm:text-sm font-bold text-slate-400">
                                        <span className="text-green-500">✓ {t.product.stock}</span> • {product.stock} {t.product.available}
                                    </div>
                                </div>

                                <button
                                    onClick={handleOrderNow}
                                    className="w-full bg-white text-slate-900 py-4 sm:py-6 text-center font-black text-base sm:text-xl rounded-2xl sm:rounded-[2rem] shadow-2xl hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 group"
                                >
                                    {t.product.orderNow}
                                    <svg className={`w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0 group-hover:${language === 'ar' ? '-translate-x-1' : 'translate-x-1'} transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <button disabled className="w-full bg-slate-800 text-slate-500 py-6 rounded-[2rem] font-black text-xl cursor-not-allowed border border-white/5">{t.product.outOfStock}</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
