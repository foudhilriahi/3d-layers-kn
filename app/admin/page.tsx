"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus as updateStatusAction, getOrderItems } from "@/lib/actions";
import { Order } from "@/lib/db";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

function OrderItemRow({ orderId }: { orderId: string }) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            const data = await getOrderItems(orderId);
            setItems(data || []);
            setLoading(false);
        };
        fetchItems();
    }, [orderId]);

    if (loading) return <div className="animate-pulse h-4 w-32 bg-white/10 rounded"></div>;

    return (
        <div className="space-y-3">
            {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
                    <div className="flex flex-col">
                        <span className="text-white font-bold">{item.product_name_snapshot}</span>
                        <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Qté: {item.quantity}</span>
                    </div>
                    <span className="text-blue-400 font-bold">{(item.price_at_time * item.quantity).toFixed(2)} TND</span>
                </div>
            ))}
        </div>
    );
}

export default function AdminDashboard() {
    const { t, language } = useLanguage();
    const [orders, setOrders] = useState<Order[]>([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // Verify password via server action (no hardcoded passwords!)
        try {
            const response = await fetch('/api/admin-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            if (response.ok) {
                setAuthenticated(true);
                setPassword("");
                fetchOrders();
            } else {
                alert("Invalid password");
            }
        } catch {
            alert("Authentication error");
        }
    };

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            await updateStatusAction(orderId, newStatus);
            fetchOrders();
        } catch (error) {
            alert("Error updating order");
        }
    };

    if (!authenticated) {
        return (
            <div className="max-w-sm mx-auto px-4 py-32">
                <div className="glass p-10 rounded-[3rem] shadow-2xl border-white/10 text-center animate-in zoom-in duration-500">
                    <h1 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase italic">{t.admin.login}</h1>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="text-left">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{t.admin.password}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t.admin.enterPassword}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <button type="submit" className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-lg hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 shadow-xl">
                            {t.admin.submit}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-24 animate-in fade-in duration-700">
            <div className={`flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 mb-10 sm:mb-16 ${language === 'ar' ? 'md:flex-row-reverse text-right' : ''}`}>
                <div>
                    <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter italic uppercase mb-2`}>
                        {t.admin.dashboard}
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Vue d'ensemble des commandes</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                    <Link href="/admin/products" className="bg-white/5 border border-white/10 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl text-center">
                        {t.admin.manageProducts}
                    </Link>
                    <button onClick={() => setAuthenticated(false)} className="bg-red-500/10 text-red-500 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl">
                        {t.admin.logout}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {orders.length > 0 ? (
                    orders.map((order: any) => (
                        <div key={order.id} className={`glass p-4 sm:p-6 md:p-10 rounded-[2rem] sm:rounded-[3rem] border-white/10 shadow-2xl animate-in slide-in-from-bottom-8 duration-500 transition-all hover:border-white/20 ${language === 'ar' ? 'text-right' : ''}`}>
                            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 mb-6 sm:mb-10 pb-6 sm:pb-10 border-b border-white/5 ${language === 'ar' ? 'md:flex-row-reverse' : ''}`}>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.admin.table.number}</p>
                                    <p className="text-3xl font-black text-blue-400 font-mono tracking-tighter italic">{order.order_number}</p>
                                    <p className="text-[10px] text-slate-600 font-bold mt-1 uppercase tracking-widest">{new Date(order.created_at).toLocaleString('fr-FR')}</p>
                                </div>
                                <div className={`${language === 'ar' ? 'md:text-left' : 'md:text-right'} w-full md:w-auto`}>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Changer l'état</p>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                        className={`w-full md:w-auto px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest border-none ring-1 transition-all cursor-pointer shadow-lg ${order.status === "pending" ? "bg-amber-500/10 text-amber-500 ring-amber-500/20" :
                                            order.status === "confirmed" ? "bg-blue-500/10 text-blue-500 ring-blue-500/20" :
                                                order.status === "shipped" ? "bg-indigo-500/10 text-indigo-500 ring-indigo-500/20" :
                                                    "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20"
                                            }`}
                                    >
                                        <option value="pending">{t.admin.status.pending} ⏳</option>
                                        <option value="confirmed">{t.admin.status.confirmed} ✅</option>
                                        <option value="shipped">{t.admin.status.shipped} 🚚</option>
                                        <option value="delivered">{t.admin.status.delivered} 📦</option>
                                    </select>
                                </div>
                            </div>

                            <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-12 ${language === 'ar' ? 'dir-rtl' : ''}`}>
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.admin.table.customer}</p>
                                        <p className="font-black text-white text-xl uppercase italic tracking-tight">{order.customer_name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact</p>
                                        <a href={`tel:${order.customer_phone}`} className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 px-4 py-2 rounded-xl text-sm font-black hover:bg-blue-600 hover:text-white transition-all">
                                            📞 {order.customer_phone}
                                        </a>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.admin.table.address}</p>
                                        <p className="text-slate-400 text-sm font-bold leading-relaxed">{order.customer_address}</p>
                                    </div>
                                </div>

                                <div className="lg:col-span-2 bg-white/5 rounded-[2.5rem] p-8 border border-white/5">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">
                                        📋 {language === 'ar' ? 'المنتجات المطلوبة' : language === 'en' ? 'Ordered Items' : 'Détails du panier'}
                                    </p>

                                    <OrderItemRow orderId={order.id} />

                                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Type de paiement</p>
                                            <p className="text-emerald-400 font-black text-xs uppercase tracking-widest">Paiement à la livraison 💵</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">{t.admin.table.amount}</p>
                                            <p className="text-4xl font-black text-white tracking-tighter italic">{order.total_price.toFixed(2)} <span className="text-sm uppercase ml-1">TND</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-20 glass rounded-[3rem] text-center border-dashed border-white/10">
                        <p className="text-4xl mb-6 opacity-20">📭</p>
                        <p className="text-2xl font-black text-slate-500 uppercase tracking-widest italic">{t.admin.noOrders}</p>
                    </div>
                )}
            </div>
        </div>
    );
}