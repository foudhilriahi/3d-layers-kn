"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from './db';

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save cart to localStorage (debounced)
    useEffect(() => {
        if (isInitialized) {
            const timeoutId = setTimeout(() => {
                localStorage.setItem('cart', JSON.stringify(cart));
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [cart, isInitialized]);

    // Memoized callbacks for better performance
    const addToCart = useCallback((product: Product, quantity: number = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, quantity }];
        });
    }, []);

    const removeFromCart = useCallback((productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity <= 0) {
            setCart(prev => prev.filter(item => item.product.id !== productId));
            return;
        }
        setCart(prev => prev.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
        ));
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    // Memoized calculations to prevent recalculation on every render
    const totalItems = useMemo(() => 
        cart.reduce((sum, item) => sum + item.quantity, 0), 
        [cart]
    );
    
    const totalPrice = useMemo(() => 
        Math.round(cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) * 1000) / 1000,
        [cart]
    );

    // Memoized context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
    }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');;
    }
    return context;
}
