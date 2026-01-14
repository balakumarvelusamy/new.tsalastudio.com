'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import config from '../config.json';

export interface CartItem {
    id: string; // Product ID
    name: string;
    image: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: CartItem) => 'added' | 'updated';
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    shippingCost: number;
    taxAmount: number;
    grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('tsalacart');
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart from local storage", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever cart changes, but only after initial load
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('tsalacart', JSON.stringify(cartItems));
        }
    }, [cartItems, isLoaded]);

    const addToCart = (product: CartItem) => {
        let action: 'added' | 'updated' = 'added';
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            if (existingItem) {
                action = 'updated';
                return prevItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + product.quantity }
                        : item
                );
            } else {
                return [...prevItems, product];
            }
        });
        return action;
    };

    const removeFromCart = (id: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setCartItems((prevItems) =>
            prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Shipping Logic form Config
    const shippingCost = cartTotal >= config.freeshippingcost ? 0 : config.shippingcost;

    // Tax Logic form Config
    const taxAmount = cartTotal * (config.taxpercentage / 100);

    const grandTotal = cartTotal + shippingCost + taxAmount;

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, shippingCost, taxAmount, grandTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
