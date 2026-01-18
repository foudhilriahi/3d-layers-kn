"use client";

import { useCart } from "@/lib/CartContext";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { useState, useMemo } from "react";
import { createOrder } from "@/lib/actions";
import { TUNISIAN_DATA } from "@/lib/tunisia-cities";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
    const { t, language } = useLanguage();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [orderData, setOrderData] = useState<any>(null);

    // Form selection states
    const [selectedGov, setSelectedGov] = useState("");
    const [selectedDel, setSelectedDel] = useState("");
    const [phone, setPhone] = useState("+216 ");
    const [phoneError, setPhoneError] = useState(false);
    const [fullName, setFullName] = useState("");
    const [fullNameError, setFullNameError] = useState("");

    const delegations = useMemo(() => {
        const gov = TUNISIAN_DATA.find(g => g.governorate === selectedGov);
        return gov ? gov.delegations : [];
    }, [selectedGov]);

    const validateFullName = (name: string) => {
        // Check if empty
        if (!name.trim()) {
            setFullNameError("Full name is required");
            return false;
        }

        // Check length (min 3, max 100)
        if (name.trim().length < 3 || name.trim().length > 100) {
            setFullNameError("Full name must be between 3 and 100 characters");
            return false;
        }

        // Only letters (including accented), spaces, and hyphens
        // Allows: A-Z, a-z, àâäéèêëïîôöùûüœæ, spaces, and hyphens
        const nameRegex = /^[a-zA-Z\s\-àâäéèêëïîôöùûüœæÀÂÄÉÈÊËÏÎÔÖÙÛÜŒÆ]+$/;
        if (!nameRegex.test(name.trim())) {
            setFullNameError("Full name can only contain letters, spaces, and hyphens");
            return false;
        }

        // Check for multiple consecutive spaces
        if (/\s{2,}/.test(name)) {
            setFullNameError("Multiple consecutive spaces are not allowed");
            return false;
        }

        setFullNameError("");
        return true;
    };

    const validatePhone = (num: string) => {
        // Must be exactly "+216 " + 8 digits = 13 characters
        if (num.length !== 13) return false;
        if (!num.startsWith("+216 ")) return false;

        const digits = num.slice(5);
        if (!/^\d{8}$/.test(digits)) return false;

        // Valid Tunisian mobile/landline prefixes: 2, 4, 5, 7, 9
        const firstDigit = digits[0];
        if (!['2', '4', '5', '7', '9'].includes(firstDigit)) return false;

        // Blacklist obvious fake numbers
        const sequences = [
            "12345678", "87654321", "00000000", "11111111", "22222222",
            "33333333", "44444444", "55555555", "66666666", "77777777",
            "88888888", "99999999"
        ];
        if (sequences.includes(digits)) return false;

        return true;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;

        // Ensure it always starts with +216 
        if (!val.startsWith("+216 ")) {
            val = "+216 " + val.replace(/^\+?2?1?6?\s?/, "");
        }

        // Only allow digits after the prefix
        const prefix = "+216 ";
        const rest = val.slice(prefix.length).replace(/\D/g, "").slice(0, 8);

        setPhone(prefix + rest);
        setPhoneError(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateFullName(fullName)) {
            return;
        }

        if (!validatePhone(phone)) {
            setPhoneError(true);
            return;
        }

        setStatus('loading');

        const fullAddress = `${selectedDel}, ${selectedGov}`;

        const data = {
            fullName: fullName.trim(),
            address: fullAddress,
            phone: phone,
            items: cart.map(item => ({
                id: item.product.id,
                quantity: item.quantity,
                price: item.product.price,
                name: item.product.name
            })),
            totalPrice: totalPrice + 10
        };

        try {
            const order = await createOrder(data);
            setOrderData(order);
            setStatus('success');
            clearCart();
        } catch (error) {
            console.error(error);
            setStatus('idle');
            alert("Error creating order");
        }
    };

    if (status === 'success') {
        return (
            <div className="max-w-3xl mx-auto px-4 py-32 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">✓</div>
                <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter italic">{t.checkout.success}</h1>
                <p className="text-xl text-slate-400 mb-12 font-bold">{t.checkout.successDesc}</p>
                <div className="glass p-8 rounded-[3rem] border-white/10 mb-12 text-left">
                    <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">{t.checkout.orderSummary}</p>
                    <div className="space-y-2 text-white font-bold">
                        <p>{t.checkout.orderNum} <span className="text-blue-400">{orderData?.order_number}</span></p>
                        <p>{t.checkout.total}: <span className="text-blue-400">{orderData?.total_price?.toFixed(2)} TND</span></p>
                        <p className="text-green-500 text-xs mt-4 uppercase tracking-widest italic">Paiement à la livraison après inspection</p>
                    </div>
                </div>
                <Link href="/" className="inline-block bg-white text-slate-900 px-12 py-5 rounded-full font-black text-lg hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 shadow-2xl">
                    {t.checkout.backToShop}
                </Link>
            </div>
        );
    }

    if (totalItems === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-32 text-center">
                <div className="text-8xl mb-8 animate-bounce opacity-20">🛒</div>
                <h1 className="text-4xl font-black text-white mb-8 tracking-tighter uppercase italic opacity-50">
                    {language === 'ar' ? 'سلتك فارغة' : language === 'en' ? 'Your basket is empty' : 'Votre panier est vide'}
                </h1>
                <Link href="/" className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-full font-black text-lg hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 shadow-2xl">
                    {t.checkout.backToShop} →
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white mb-8 sm:mb-12 md:mb-16 tracking-tighter italic uppercase ${language === 'ar' ? 'text-right' : ''}`}>
                {language === 'ar' ? 'سلة التسوق' : language === 'en' ? 'Your Shopping Bag' : 'Votre Panier'}
            </h1>

            <div className="grid lg:grid-cols-12 gap-16">
                {/* Left Side: Product List and Delivery Info */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="space-y-6">
                        {cart.map((item) => {
                            const localName = language === 'en' ? item.product.name_en : language === 'ar' ? item.product.name_ar : item.product.name;
                            return (
                                <div key={item.product.id} className={`glass p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 group hover:border-white/20 transition-all duration-500 ${language === 'ar' ? 'sm:flex-row-reverse text-right' : ''}`}>
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-white p-2 sm:p-3 flex-shrink-0 shadow-inner">
                                        <img src={item.product.image_url} alt={localName || item.product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-black text-white mb-1 italic">
                                            {localName || item.product.name}
                                        </h3>
                                        <p className="text-blue-400 font-bold mb-4">{item.product.price.toFixed(2)} TND</p>
                                        <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                            <div className="flex items-center dark-glass rounded-full border-white/10">
                                                <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center text-white hover:text-blue-400 transition-colors">-</button>
                                                <span className="w-8 text-center text-white font-black text-sm">{item.quantity}</span>
                                                <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center text-white hover:text-blue-400 transition-colors">+</button>
                                            </div>
                                            <button type="button" onClick={() => removeFromCart(item.product.id)} className="text-red-500/50 hover:text-red-500 text-xs font-black uppercase tracking-widest transition-colors">
                                                {language === 'ar' ? 'حذف' : 'Supprimer'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Delivery Information Box */}
                    <div className="glass p-8 rounded-[2.5rem] border-white/10 space-y-4 animate-in slide-in-from-left duration-700">
                        <div className="flex items-center gap-4 text-blue-400">
                            <span className="text-3xl">🏠</span>
                            <h3 className="text-xl font-black uppercase tracking-tighter italic">Livraison à domicile express</h3>
                        </div>
                        <p className="text-slate-400 font-bold text-lg leading-relaxed">
                            Nous livrons à domicile partout en Tunisie pour seulement <span className="text-white">10 TND</span>.
                            Le paiement se fait <span className="text-emerald-400">en espèces (cash)</span> à la livraison.
                            Vous avez le droit de vérifier votre colis avant de payer !
                        </p>
                    </div>
                </div>

                {/* Right Side: Sticky Form */}
                <div className="lg:col-span-5">
                    <div className="glass p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[3rem] border-white/10 sticky top-24 sm:top-32 shadow-2xl animate-in slide-in-from-right duration-700">
                        <h2 className={`text-2xl sm:text-3xl font-black text-white mb-6 sm:mb-8 italic uppercase tracking-tighter ${language === 'ar' ? 'text-right' : ''}`}>
                            Confirmer la commande
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className={`space-y-6 ${language === 'ar' ? 'text-right' : ''}`}>
                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${fullNameError ? 'text-red-500' : 'text-slate-500'}`}>{t.checkout.fullName}</label>
                                    <input
                                        name="fullName"
                                        required
                                        type="text"
                                        maxLength={100}
                                        placeholder="Votre Nom et Prénom"
                                        value={fullName}
                                        onChange={(e) => {
                                            setFullName(e.target.value);
                                            setFullNameError("");
                                        }}
                                        onBlur={() => validateFullName(fullName)}
                                        className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-white font-bold focus:outline-none transition-colors ${fullNameError ? 'border-red-500 ring-1 ring-red-500/50' : 'border-white/10 focus:border-blue-500'}`}
                                    />
                                    {fullNameError && (
                                        <p className="mt-2 text-[10px] font-black text-red-500 uppercase italic animate-bounce">
                                            {fullNameError}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Gouvernorat</label>
                                        <select
                                            value={selectedGov}
                                            onChange={(e) => { setSelectedGov(e.target.value); setSelectedDel(""); }}
                                            required
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 py-4 text-white font-bold focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                                        >
                                            <option value="" disabled>Sélectionner</option>
                                            {TUNISIAN_DATA.map(g => (
                                                <option key={g.governorate} value={g.governorate}>{g.governorate}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Délégation</label>
                                        <select
                                            value={selectedDel}
                                            onChange={(e) => setSelectedDel(e.target.value)}
                                            required
                                            disabled={!selectedGov}
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 py-4 text-white font-bold focus:outline-none focus:border-blue-500 transition-colors appearance-none disabled:opacity-50"
                                        >
                                            <option value="" disabled>Sélectionner</option>
                                            {delegations.map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${phoneError ? 'text-red-500' : 'text-slate-500'}`}>
                                        {t.checkout.phone}
                                    </label>
                                    <input
                                        name="phone"
                                        required
                                        type="tel"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-white font-bold focus:outline-none transition-colors ${phoneError ? 'border-red-500 ring-1 ring-red-500/50' : 'border-white/10 focus:border-blue-500'}`}
                                    />
                                    {phoneError && (
                                        <p className="mt-2 text-[10px] font-black text-red-500 uppercase italic animate-bounce">
                                            {t.checkout.phoneError}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10 space-y-4 text-white font-bold">
                                <div className="flex justify-between items-center text-sm text-slate-500">
                                    <span>Produits</span>
                                    <span>{(totalPrice).toFixed(2)} TND</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-slate-500">
                                    <span>Livraison express</span>
                                    <span className="text-blue-400">+ 10.00 TND</span>
                                </div>
                                <div className={`flex justify-between items-center pt-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-slate-500 font-black uppercase tracking-widest text-xs">Total à payer</span>
                                    <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white italic tracking-tighter">{(totalPrice + 10).toFixed(2)} <span className="text-base sm:text-lg uppercase">TND</span></span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-white hover:text-slate-900 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {status === 'loading' ? t.checkout.processing : (
                                        <div className={`flex items-center justify-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                            {t.checkout.confirm}
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
