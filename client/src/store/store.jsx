import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      // ignore storage errors
    }
  }, [cart]);

  function addToCart(product, qty = 1) {
    if (!product) return;
    setCart((prev) => {
      const id = product._id || product.id;
      const existing = prev.find((p) => (p._id || p.id) === id);
      if (existing) {
        return prev.map((p) => (p._id || p.id) === id ? { ...p, quantity: (p.quantity || 1) + qty } : p);
      }
      return [...prev, { ...(product || {}), quantity: qty }];
    });
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((p) => (p._id || p.id) !== productId));
  }

  function updateQuantity(productId, quantity) {
    setCart((prev) => prev.map((p) => (p._id || p.id) === productId ? { ...p, quantity } : p));
  }

  function clearCart() {
    setCart([]);
  }

  const totalItems = cart.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const totalPrice = cart.reduce((sum, p) => sum + (p.quantity || 0) * (parseFloat(p.price) || 0), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

export default { CartProvider, useCart };
