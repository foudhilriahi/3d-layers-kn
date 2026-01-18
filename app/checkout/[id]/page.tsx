"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/cart');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}