import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import type { Cart } from '@/types/shop';

interface ShopContextValue {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (variantCode: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

// ─── Axios Instance ───────────────────────────────────────────────────────────

// Ensure trailing slash for baseURL
const rawBaseURL = import.meta.env.VITE_SYLIUS_API_URL || 'http://localhost:8080/api/v2/shop';
const SYLIUS_API_URL = rawBaseURL.endsWith('/') ? rawBaseURL : `${rawBaseURL}/`;

const syliusApi = axios.create({
  baseURL: SYLIUS_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ─── Context ──────────────────────────────────────────────────────────────────

const ShopContext = createContext<ShopContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const createCart = useCallback(async () => {
    try {
      // Relative path: orders
      const res = await syliusApi.post('orders', { localeCode: 'en_US' });
      const newCart = res.data;
      localStorage.setItem('sylius_cart_token', newCart.tokenValue);
      setCart(newCart);
    } catch (err) {
      console.warn('Sylius API offline. Falling back to local cart.');
      const localCart = {
        tokenValue: 'local_cart_' + Date.now(),
        items: [],
        total: 0,
        currencyCode: 'USD',
        isLocal: true // flag to know it's a fallback
      } as unknown as Cart;
      localStorage.setItem('local_mock_cart', JSON.stringify(localCart));
      setCart(localCart);
    }
  }, []);

  // Initialize cart or fetch existing one from localStorage
  useEffect(() => {
    const initCart = async () => {
      const storedToken = localStorage.getItem('sylius_cart_token');
      const mockCartStr = localStorage.getItem('local_mock_cart');
      
      if (storedToken) {
        try {
          // Relative path: orders/{token}, no leading slash
          const res = await syliusApi.get(`orders/${storedToken}`);
          setCart(res.data);
        } catch (err) {
          console.warn('Sylius API returning error. Trying local mock cart.');
          if (mockCartStr) {
             setCart(JSON.parse(mockCartStr));
          } else {
             createCart();
          }
        }
      } else if (mockCartStr) {
        setCart(JSON.parse(mockCartStr));
      } else {
        createCart();
      }
      setIsLoading(false);
    };

    initCart();
  }, [createCart]);

  const addToCart = async (variantCode: string, quantity: number) => {
    if (!cart) return;
    try {
      if ((cart as any).isLocal) {
         // Local Fallback logic
         const newItem = { id: variantCode + Date.now(), productVariant: variantCode, productName: variantCode, quantity, unitPrice: 9900 };
         const updatedCart = { ...cart, items: [...cart.items, newItem], total: cart.total + (9900 * quantity) };
         localStorage.setItem('local_mock_cart', JSON.stringify(updatedCart));
         setCart(updatedCart);
         return;
      }
      
      // Relative path: orders/{token}/items
      const res = await syliusApi.post(`orders/${cart.tokenValue}/items`, {
        productVariant: variantCode,
        quantity,
      });
      setCart(res.data);
    } catch (err) {
      console.error('Failed to add to cart', err);
      // Fallback update
      const newItem = { id: variantCode + Date.now(), productVariant: variantCode, productName: variantCode, quantity, unitPrice: 9900 };
      const updatedCart = { ...cart, items: [...cart.items, newItem], total: cart.total + (9900 * quantity), isLocal: true } as any;
      localStorage.setItem('local_mock_cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!cart) return;
    try {
      if ((cart as any).isLocal) {
         const newItems = cart.items.filter(i => i.id !== itemId);
         const updatedCart = { ...cart, items: newItems, total: newItems.reduce((acc, curr) => acc + (curr.unitPrice * curr.quantity), 0) };
         localStorage.setItem('local_mock_cart', JSON.stringify(updatedCart));
         setCart(updatedCart);
         return;
      }
      
      // Relative path: orders/{token}/items/{id}
      const res = await syliusApi.delete(`orders/${cart.tokenValue}/items/${itemId}`);
      setCart(res.data);
    } catch (err) {
      console.error('Failed to remove from cart', err);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!cart) return;
    try {
      if ((cart as any).isLocal) {
         const newItems = cart.items.map(i => i.id === itemId ? { ...i, quantity } : i);
         const updatedCart = { ...cart, items: newItems, total: newItems.reduce((acc, curr) => acc + (curr.unitPrice * curr.quantity), 0) };
         localStorage.setItem('local_mock_cart', JSON.stringify(updatedCart));
         setCart(updatedCart);
         return;
      }
      
      // Relative path: orders/{token}/items/{id}
      const res = await syliusApi.patch(`orders/${cart.tokenValue}/items/${itemId}`, {
        quantity,
      });
      setCart(res.data);
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  };

  const clearCart = async () => {
    localStorage.removeItem('sylius_cart_token');
    createCart();
  };

  return (
    <ShopContext.Provider value={{ cart, isLoading, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </ShopContext.Provider>
  );
}

export { ShopContext };
