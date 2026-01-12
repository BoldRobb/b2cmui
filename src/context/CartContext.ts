import React, { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorageCart } from '../hooks/useLocalStorageCart';

type CartContextType = ReturnType<typeof useLocalStorageCart>;

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const cart = useLocalStorageCart();
  
  return React.createElement(
    CartContext.Provider,
    { value: cart },
    children
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};