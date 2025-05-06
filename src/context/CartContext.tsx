import React, { createContext, useState, useContext, useEffect } from 'react';
import { notification } from 'antd';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  
  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    }
  }, []);
  
  // Mettre à jour le localStorage à chaque changement du panier
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    setTotalItems(cartItems.reduce((total, item) => total + item.quantity, 0));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
    
    notification.success({
      message: 'Produit ajouté',
      description: `${product.name} a été ajouté à votre panier.`,
      placement: 'bottomRight',
      duration: 2,
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);
      return newItems;
    });
    
    notification.info({
      message: 'Produit retiré',
      description: 'Le produit a été retiré de votre panier.',
      placement: 'bottomRight',
      duration: 2,
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
    notification.info({
      message: 'Panier vidé',
      description: 'Tous les produits ont été retirés de votre panier.',
      placement: 'bottomRight',
      duration: 2,
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      calculateTotal,
      totalItems
    }}>
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