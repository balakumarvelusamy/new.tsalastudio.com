'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { filterItems, saveItem, deleteItem } from '../services/api';
import secureLocalStorage from 'react-secure-storage';

import config from '../config.json';

export interface CartItem {
    id: string; // Product ID
    name: string;
    image: string;
    price: number;
    quantity: number;
    type?: string; // 'product', 'course', 'workshop'
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: CartItem) => 'added' | 'updated';
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    shippableCartTotal: number; // Total value of items that attract shipping
    shippingCost: number;
    taxAmount: number;
    grandTotal: number;
    userId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // Initial load
    useEffect(() => {
        const initializeCart = async () => {
            // Check for logged-in user
            let uuid = null;
            try {
                if (typeof window !== 'undefined') {
                    uuid = secureLocalStorage.getItem('tsalauuid') as string;
                }
            } catch (err) {
                console.error("Error accessing secure storage:", err);
            }

            setUserId(uuid);

            if (uuid) {
                try {
                    // Fetch from API for user
                    // Using 'cart' as it makes more sense.
                    const serverItems = await filterItems('userid', uuid, 'type', 'cart');

                    // Transformation with safety checks
                    const mappedItems: CartItem[] = Array.isArray(serverItems) ? serverItems.map((item: any) => {
                        const originalId = item.productid || (item.id && item.id.includes('-') ? item.id.split('-').pop() : item.id);
                        return {
                            id: originalId || item.id,
                            name: item.name || 'Unknown Product',
                            image: item.image || '',
                            price: Number(item.price) || 0,
                            quantity: Number(item.quantity) || 1,
                            type: item.itemtype || 'product' // Retrieve saved type or default
                        };
                    }) : [];

                    setCartItems(mappedItems);
                } catch (e) {
                    console.error("Failed to fetch server cart:", e);
                }
            } else {
                // Guest: Load from localStorage
                const storedCart = localStorage.getItem('tsalacart');
                if (storedCart) {
                    try {
                        setCartItems(JSON.parse(storedCart));
                    } catch (e) {
                        console.error("Failed to parse cart from local storage", e);
                    }
                }
            }
            setIsLoaded(true);
        };

        initializeCart();
    }, []);

    // Sync to Storage/API on change
    // For API: We handle save on action (addToCart/etc) rather than effect to avoid circular loops or excessive calls
    // For LocalStorage: We keep effect for guest
    useEffect(() => {
        if (isLoaded && !userId) {
            localStorage.setItem('tsalacart', JSON.stringify(cartItems));
        }
    }, [cartItems, isLoaded, userId]);

    const addToCart = (product: CartItem) => {
        let action: 'added' | 'updated' = 'added';

        // Optimistic Update
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

        // API Sync if Logged In
        if (userId) {
            // Calculate new quantity for the specific item
            // We need to look at the *next* state, but inside the setter we only have prev.
            // Using the logic: existing quantity + add quantity
            // We can't easily access the "updated" state here without a ref or helper, 
            // but we can re-derive it.

            // Wait, we need the CURRENT total quantity to save. 
            // SetTimeout to let state settle? No, better to calculate explicit new value.

            // Helper to get current item count
            const currentItem = cartItems.find(i => i.id === product.id);
            const newQuantity = (currentItem?.quantity || 0) + product.quantity;

            const cartItemPayload = {
                id: `cart-${userId}-${product.id}`, // Deterministic ID
                userid: userId,
                type: 'cart',
                productid: product.id, // Explicitly save product ID
                name: product.name,
                image: product.image,
                price: product.price,
                quantity: newQuantity,
                itemtype: product.type // Save the item type
            };

            saveItem(cartItemPayload).catch(console.error);
        }

        return action;
    };

    const removeFromCart = (id: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));

        if (userId) {
            deleteItem(`cart-${userId}-${id}`).catch(console.error);
        }
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;

        setCartItems((prevItems) =>
            prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
        );

        if (userId) {
            const item = cartItems.find(i => i.id === id);
            if (item) {
                const cartItemPayload = {
                    id: `cart-${userId}-${id}`,
                    userid: userId,
                    type: 'cart',
                    productid: id,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: quantity,
                    itemtype: item.type // Preserve type
                };
                saveItem(cartItemPayload).catch(console.error);
            }
        }
    };

    const clearCart = async () => {
        setCartItems([]); // Optimistic UI clear

        if (userId) {
            try {
                // Fetch all cart items for this user from DB to ensure we get everything
                const serverItems = await filterItems('userid', userId, 'type', 'cart');

                if (serverItems && Array.isArray(serverItems)) {
                    // Execute deletions in parallel
                    await Promise.all(serverItems.map((item: any) =>
                        deleteItem(item.id).catch((err) => console.error(`Failed to delete item ${item.id}`, err))
                    ));
                    console.log("Cart cleared from server for user:", userId);
                }
            } catch (error) {
                console.error("Error clearing server cart:", error);
            }
        }
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Filter items that attract shipping
    const shippableItems = cartItems.filter(item =>
        !item.type || (item.type !== 'course' && item.type !== 'workshop')
    );

    // Calculate total value of shippable items
    const shippableCartTotal = shippableItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Shipping Logic form Config
    // Only apply shipping if there are shippable items and their total is less than threshold
    // If no shippable items (e.g. only digital courses), shipping is 0.
    const shippingCost = shippableItems.length > 0 && shippableCartTotal < config.freeshippingcost
        ? config.shippingcost
        : 0;

    // Tax Logic form Config
    const taxAmount = cartTotal * (config.taxpercentage / 100);

    const grandTotal = cartTotal + shippingCost + taxAmount;

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, shippableCartTotal, shippingCost, taxAmount, grandTotal, userId }}>
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
