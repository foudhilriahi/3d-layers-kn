"use client";

import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
    const { t } = useLanguage();
    const [activeModal, setActiveModal] = useState<"terms" | "privacy" | null>(null);

    const Modal = ({ type, onClose }: { type: "terms" | "privacy"; onClose: () => void }) => (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 md:p-12">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-2xl glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-white/20 animate-in fade-in zoom-in duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 p-6">
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-full glass hover:bg-white hover:text-slate-900 flex items-center justify-center transition-all group"
                    >
                        <span className="text-2xl font-light group-hover:rotate-90 transition-transform">✕</span>
                    </button>
                </div>

                <h2 className="text-4xl font-black italic tracking-tighter mb-8 gradient-text">
                    {type === "terms" ? "Conditions d'Utilisation" : "Politique de Confidentialité"}
                </h2>

                <div className="space-y-6 text-slate-300 overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar leading-relaxed font-medium">
                    {type === "terms" ? (
                        <>
                            <section>
                                <h3 className="text-white font-black uppercase tracking-widest text-xs mb-2">Acceptation</h3>
                                <p>En utilisant ce site, vous acceptez nos conditions d'utilisation. Nous nous réservons le droit de modifier ces termes à tout moment.</p>
                            </section>
                            <section>
                                <h3 className="text-white font-black uppercase tracking-widest text-xs mb-2">Commandes</h3>
                                <p>Toutes les commandes sont sujettes à disponibilité. Les prix peuvent être modifiés sans préavis. Nous confirmons chaque commande par téléphone.</p>
                            </section>
                            <section>
                                <h3 className="text-white font-black uppercase tracking-widest text-xs mb-2">Livrance</h3>
                                <p>La livraison est effectuée en Tunisie via nos partenaires logistiques. Les délais sont donnés à titre indicatif.</p>
                            </section>
                        </>
                    ) : (
                        <>
                            <section>
                                <h3 className="text-white font-black uppercase tracking-widest text-xs mb-2">Données Collectées</h3>
                                <p>Nous collectons uniquement votre nom, adresse et numéro de téléphone pour le traitement et la livraison de vos commandes.</p>
                            </section>
                            <section>
                                <h3 className="text-white font-black uppercase tracking-widest text-xs mb-2">Utilisation</h3>
                                <p>Vos données ne sont jamais vendues à des tiers. Elles sont uniquement utilisées pour confirmer vos achats et organiser la livraison.</p>
                            </section>
                            <section>
                                <h3 className="text-white font-black uppercase tracking-widest text-xs mb-2">Sécurité</h3>
                                <p>Nous mettons en œuvre des mesures de sécurité pour protéger vos informations personnelles contre tout accès non autorisé.</p>
                            </section>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <footer className="mt-24 pt-16 pb-12 border-t border-slate-100 dark:border-white/5 relative bg-slate-900 text-white z-[200]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center md:text-left">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 mb-8 sm:mb-12">
                    <div className="space-y-4 sm:space-y-6">
                        <Link href="/" className="text-2xl sm:text-3xl font-black italic tracking-tighter hover:text-blue-200 transition-colors">
                            <span className="gradient-text">3D LAYERS</span>
                        </Link>
                        <p className="text-slate-400 font-bold leading-relaxed max-w-sm mx-auto md:mx-0 text-sm sm:text-base">
                            {t.footer.aboutDesc}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xs font-black tracking-[0.2em] uppercase text-slate-400 opacity-50">Status</h3>
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{t.footer.operational}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xs font-black tracking-[0.2em] uppercase text-slate-400 opacity-50">Connect</h3>
                        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 justify-center md:justify-start">
                            <a
                                href="https://www.instagram.com/3d_layers_kn/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-4 p-2 pr-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-slate-900 transition-all duration-500"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </div>
                                <span className="text-sm font-black tracking-tight">3d_layers_kn</span>
                            </a>

                            <div className="group relative flex items-center gap-2 sm:gap-4 p-2 pr-4 sm:pr-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/40 transition-all duration-500 cursor-help">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl overflow-hidden shadow-lg bg-white relative flex-shrink-0">
                                    <img src="/qrcode.jpg" alt="Scan" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <span className="text-xs sm:text-sm font-black tracking-tight">Scan Me</span>
                                <div className="hidden sm:block absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 mb-4 p-4 bg-white rounded-3xl shadow-2xl scale-0 group-hover:scale-100 transition-all duration-500 origin-bottom z-[300] pointer-events-none">
                                    <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-4 sm:border-8 border-white">
                                        <img src="/qrcode.jpg" alt="Scan Large" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="text-slate-900 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-center mt-2">Scannez pour commander</div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-center">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        &copy; 2025 • 3d_layers_kn • Crafted in Tunisia
                    </div>
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveModal("terms")}
                            className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-blue-500 transition-colors"
                        >
                            Terms
                        </button>
                        <button
                            onClick={() => setActiveModal("privacy")}
                            className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-blue-500 transition-colors"
                        >
                            Privacy
                        </button>
                    </div>
                </div>
            </div>

            {activeModal && <Modal type={activeModal} onClose={() => setActiveModal(null)} />}
        </footer>
    );
}
