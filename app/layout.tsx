import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { CartProvider } from "@/lib/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: '--font-outfit',
});

export const metadata: Metadata = {
    title: "3d_layers_kn - 3D Printed Products",
    description: "High-quality, custom 3D printed products",
    icons: "/favicon.ico",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <LanguageProvider>
            <CartProvider>
                <html lang="fr" className={`dark ${inter.variable} ${outfit.variable}`}>
                    <body className="font-sans min-h-screen relative selection:bg-blue-900 selection:bg-blue-400/30 selection:text-white pb-20 md:pb-0">
                        <Navbar />
                        <main>
                            {children}
                        </main>
                        <Footer />
                        <MobileNav />
                    </body>
                </html>
            </CartProvider>
        </LanguageProvider>
    );
}