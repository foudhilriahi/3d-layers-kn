"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Product } from "@/lib/db";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useState, useCallback, memo } from "react";
import Image from "next/image";

// Memoized Product Card to prevent unnecessary re-renders
const ProductCard = memo(function ProductCard({ 
    product, 
    language, 
    t, 
    addingId, 
    onQuickAdd 
}: { 
    product: Product; 
    language: string; 
    t: any; 
    addingId: string | null;
    onQuickAdd: (product: Product) => void;
}) {
    const localName = language === 'en' ? product.name_en : language === 'ar' ? product.name_ar : product.name;
    const localDesc = language === 'en' ? product.description_en : language === 'ar' ? product.description_ar : product.description;

    return (
        <div className="group glass rounded-2xl sm:rounded-[3rem] p-3 sm:p-6 futuristic-card flex flex-col h-full overflow-hidden border-white/10 hover:border-white/20 transition-all duration-500">
            {/* Image Container */}
            <div className="relative aspect-square rounded-xl sm:rounded-[2.5rem] overflow-hidden mb-4 sm:mb-8 bg-white shadow-inner border border-slate-100 p-3 sm:p-6">
                <Link href={`/products/${product.id}`} className="block w-full h-full" prefetch={false}>
                    <img
                        src={product.image_url}
                        alt={localName || product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                        decoding="async"
                    />
                </Link>

                {/* Quick Add Button */}
                {product.stock > 0 && (
                    <button
                        onClick={() => onQuickAdd(product)}
                        className={`absolute bottom-4 right-4 w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 z-20 ${addingId === product.id ? 'bg-green-500 text-white scale-110' : 'bg-slate-900/90 text-white hover:bg-blue-600'}`}
                        title={language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                    >
                        {addingId === product.id ? '✓' : '🛒'}
                    </button>
                )}

                <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-black text-white shadow-2xl border border-white/5">
                    {product.price} TND
                </div>
            </div>

            <div className="px-1 sm:px-2 flex flex-col flex-grow">
                <Link href={`/products/${product.id}`} prefetch={false}>
                    <h3 className={`text-lg sm:text-2xl font-black text-white mb-1 sm:mb-2 truncate group-hover:text-blue-400 transition-colors tracking-tight italic ${language === 'ar' ? 'text-right' : ''}`}>
                        {localName || product.name}
                    </h3>
                </Link>

                <div className={`mb-2 sm:mb-4 flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full border ${product.stock > 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                        <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                        <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {product.stock > 0 ? `${product.stock} ${t.product.available}` : t.product.outOfStock}
                        </span>
                    </div>
                </div>

                <p className={`text-slate-400 text-sm sm:text-base mb-4 sm:mb-8 line-clamp-2 leading-relaxed flex-grow font-medium opacity-70 ${language === 'ar' ? 'text-right' : ''}`}>
                    {localDesc || product.description}
                </p>

                <Link
                    href={`/products/${product.id}`}
                    prefetch={false}
                    className={`w-full text-center py-3 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 sm:gap-3 transition-all active:scale-95 group/btn ${product.stock > 0 ? 'bg-white text-slate-900 hover:bg-blue-600 hover:text-white shadow-xl' : 'bg-slate-800 text-slate-500 cursor-not-allowed pointer-events-none border border-white/5'}`}
                >
                    {product.stock > 0 ? t.home.view : t.product.outOfStock}
                    {product.stock > 0 && (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    )}
                </Link>
            </div>
        </div>
    );
});

export default function ProductGrid({ products }: { products: Product[] }) {
    const { t, language } = useLanguage();
    const { addToCart } = useCart();
    const [addingId, setAddingId] = useState<string | null>(null);

    // Memoized callback to prevent re-creating function on each render
    const handleQuickAdd = useCallback((product: Product) => {
        setAddingId(product.id);
        addToCart(product, 1);
        setTimeout(() => setAddingId(null), 1500);
    }, [addToCart]);

    return (
        <div className="min-h-screen">
            {/* Hero Section - Full width with proper spacing */}
            <section className="relative w-full bg-gradient-to-b from-slate-900 via-slate-900/95 to-transparent pt-24 sm:pt-32 md:pt-40 pb-8 sm:pb-12 md:pb-16 px-4">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 sm:top-32 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-28 sm:top-40 right-1/4 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-2">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 md:mb-8 tracking-tight leading-none uppercase">
                        <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent italic">
                            {t.home.title.split(' ')[0]}
                        </span>
                        <span className="block text-white mt-1 sm:mt-2">
                            {t.home.title.split(' ').slice(1).join(' ')}
                        </span>
                    </h1>
                    
                    <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-300 font-medium">
                            {t.home.subtitle}
                        </span>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8 lg:gap-12">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                language={language}
                                t={t}
                                addingId={addingId}
                                onQuickAdd={handleQuickAdd}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 rounded-3xl border border-dashed border-white/10 bg-white/5">
                        <div className="animate-bounce mb-8 text-7xl">✨</div>
                        <p className="text-3xl text-slate-400 font-bold">{t.home.noProducts}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
