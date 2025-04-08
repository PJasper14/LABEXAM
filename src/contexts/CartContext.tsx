import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product, CartState } from '../types';

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  updateQuantity: (productId: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, setState] = useState<CartState>({
    items: [],
    total: 0
  });

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const addToCart = (product: Product, quantity: number) => {
    const existingItem = state.items.find(item => item.product.id === product.id);
    
    let updatedItems: CartItem[];
    
    if (existingItem) {
      updatedItems = state.items.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      );
    } else {
      updatedItems = [...state.items, { product, quantity }];
    }
    
    const total = calculateTotal(updatedItems);
    
    setState({
      items: updatedItems,
      total
    });
  };

  const removeFromCart = (productId: number) => {
    const updatedItems = state.items.filter(item => item.product.id !== productId);
    const total = calculateTotal(updatedItems);
    
    setState({
      items: updatedItems,
      total
    });
  };

  const clearCart = () => {
    setState({
      items: [],
      total: 0
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedItems = state.items.map(item => 
      item.product.id === productId 
        ? { ...item, quantity } 
        : item
    );
    
    const total = calculateTotal(updatedItems);
    
    setState({
      items: updatedItems,
      total
    });
  };

  return (
    <CartContext.Provider value={{ 
      ...state, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      updateQuantity 
    }}>
      {children}
    </CartContext.Provider>
  );
}; 