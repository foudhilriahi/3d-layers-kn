"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Product } from "@/lib/db";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";

export default function ProductDetail({ product }: { product: Product }) {
    const { t, language } = useLanguage();
    const { addToCart } = useCart();
    const router = useRouter();
    const [mainImage, setMainImage] = useState(product.image_url);

    const images = [
        product.image_url,
        product.image_url2,
        product.image_url3,
    ].filter(Boolean) as string[];

    const nextImage = () => {
        const currentIndex = images.indexOf(mainImage);
        const nextIndex = (currentIndex + 1) % images.length;
        setMainImage(images[nextIndex]);
    };

    const prevImage = () => {
        const currentIndex = images.indexOf(mainImage);
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setMainImage(images[prevIndex]);
    };

    const localName = language === 'en' ? product.name_en : language === 'ar' ? product.name_ar : product.name;
    const localDesc = language === 'en' ? product.description_en : language === 'ar' ? product.description_ar : product.description;

    const handleOrderNow = () => {
        addToCart(product, 1);
        router.push('/cart');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
            <Link href="/" className={`inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-12 group transition-all ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50 transition-all">
                    <span className={`group-hover:${language === 'ar' ? 'translate-x-1' : '-translate-x-1'} transition-transform text-white`}>
                        {language === 'ar' ? '→' : '←'}
                    </span>
                </div>
                {t.product.back}
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-24 items-start">
                <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-left duration-700 max-w-lg mx-auto lg:mx-0">
                    <div className="rounded-2xl sm:rounded-[3rem] overflow-hidden glass p-3 sm:p-6 shadow-2xl shadow-slate-900/50 border-white/10 relative group/gallery">
                        <div className="aspect-square rounded-xl sm:rounded-[2rem] overflow-hidden bg-white flex items-center justify-center p-4 sm:p-8 relative">
                            <img
                                src={mainImage}
                                alt={localName || product.name}
                                className="w-full h-full object-contain animate-in fade-in zoom-in duration-500 hover:scale-105 transition-transform"
                                key={mainImage}
                            />
                            {images.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 text-white flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity hover:bg-blue-600 scale-90 hover:scale-100 z-10">
                                        <span className="text-xl font-black">←</span>
                                    </button>
                                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 text-white flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity hover:bg-blue-600 scale-90 hover:scale-100 z-10">
                                        <span className="text-xl font-black">→</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center lg:justify-start gap-2 sm:gap-4 overflow-x-auto pb-2">
                        {images.map((img, i) => (
                            <button key={i} onClick={() => setMainImage(img)} className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden glass p-1 shadow-lg transition-all hover:scale-105 active:scale-95 flex-shrink-0 ${mainImage === img ? 'ring-2 ring-blue-500' : 'opacity-40 hover:opacity-100'}`}>
                                <div className="w-full h-full rounded-lg sm:rounded-xl overflow-hidden bg-white p-1">
                                    <img src={img} alt={`${localName || product.name} ${i + 1}`} className="w-full h-full object-contain" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`flex flex-col pt-4 animate-in fade-in slide-in-from-right duration-700 ${language === 'ar' ? 'text-right items-end' : ''}`}>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white mb-6 sm:mb-10 tracking-tighter leading-[0.85] italic">
                        {localName || product.name}
                    </h1>
                    <div className={`flex items-baseline gap-2 sm:gap-4 mb-8 sm:mb-12 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <span className="text-4xl sm:text-5xl md:text-6xl font-black gradient-text tracking-tighter">{product.price}</span>
                        <span className="text-lg sm:text-2xl font-black text-slate-400 uppercase tracking-widest italic">TND</span>
                    </div>
                    <div className="prose prose-slate max-w-none mb-8 sm:mb-16">
                        <p className={`text-lg sm:text-xl md:text-2xl text-slate-400 font-bold opacity-90 max-w-xl ${language === 'ar' ? 'text-right' : ''}`}>
                            {localDesc || product.description}
                        </p>
                    </div>

                    <div className="mt-auto space-y-6 sm:space-y-8 w-full">
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
