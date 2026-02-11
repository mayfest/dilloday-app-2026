import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  variantId: string;
  quantity: number;
}

interface Cart {
  id: string;
  items: CartItem[];
}

// Define the shape of everything you want to expose via context
interface CartContextValue {
  cartId: string | null;
  cart: Cart | null;
  isLoading: boolean;
  createCart: () => Promise<string>;
  addToCart: (variantId: string, quantity?: number) => Promise<Cart>;
  updateQuantity: (
    variantId: string,
    quantity: number
  ) => Promise<Cart | undefined>;
  removeFromCart: (variantId: string) => Promise<Cart | undefined>;
  getCart: () => Promise<Cart | null>;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
}

// The actual context object
const CartContext = createContext<CartContextValue | undefined>(undefined);

// Where you’ll store your single source of truth
const CART_ID_KEY = '@cart_id';
const STOREFRONT_TOKEN = 'ptkn_25057bc8-f67f-41c7-95a8-39d6f16d54d1';

/**
 * The provider that wraps your entire app,
 * sharing the same cart state across all screens.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // On mount, load any existing cart ID from storage & verify it
  useEffect(() => {
    const loadCartId = async () => {
      try {
        const savedCartId = await AsyncStorage.getItem(CART_ID_KEY);
        if (savedCartId) {
          const cartResponse = await fetch(
            `https://storefront-api.fourthwall.com/v1/carts/${savedCartId}?storefront_token=${STOREFRONT_TOKEN}`
          );
          if (cartResponse.ok) {
            // Valid cart
            setCartId(savedCartId);
          } else {
            // Cart ID invalid or expired; clear it
            await AsyncStorage.removeItem(CART_ID_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading cartId:', error);
      }
    };

    loadCartId();
  }, []);

  /**
   * Create a new cart if none exists.
   */
  const createCart = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Creating new cart...');
      const response = await fetch(
        `https://storefront-api.fourthwall.com/v1/carts?storefront_token=${STOREFRONT_TOKEN}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: [] }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Cart creation error response:', errorText);
        throw new Error(`Failed to create cart: ${response.status}`);
      }

      const data = await response.json();
      await AsyncStorage.setItem(CART_ID_KEY, data.id);
      setCartId(data.id);
      console.log('Cart created:', data.id);
      return data.id;
    } catch (error) {
      console.error('Detailed cart creation error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add an item to the cart.
   */
  const addToCart = useCallback(
    async (variantId: string, quantity: number = 1) => {
      try {
        setIsLoading(true);
        let currentCartId = cartId;
        if (!currentCartId) {
          // No cart yet, create one first
          currentCartId = await createCart();
        }

        console.log('Adding to cart:', {
          variantId,
          quantity,
          cartId: currentCartId,
        });

        const response = await fetch(
          `https://storefront-api.fourthwall.com/v1/carts/${currentCartId}/add?storefront_token=${STOREFRONT_TOKEN}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: [{ variantId, quantity }],
            }),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          console.log('Add to cart error response:', JSON.stringify(data));
          throw new Error(`Failed to add item to cart: ${response.status}`);
        }

        console.log('Add to cart response:', JSON.stringify(data));
        // This is the updated cart object
        setCart(data);

        return data;
      } catch (error) {
        console.error('Detailed add to cart error:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, createCart]
  );

  /**
   * Update the quantity of a given item in the cart.
   */
  const updateQuantity = useCallback(
    async (variantId: string, quantity: number) => {
      if (!cartId) return;
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://storefront-api.fourthwall.com/v1/carts/${cartId}/update-quantities?storefront_token=${STOREFRONT_TOKEN}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: [{ variantId, quantity }],
            }),
          }
        );
        if (!response.ok) {
          throw new Error('Failed to update quantity');
        }
        const updatedCart = await response.json();
        // Optionally update local state
        setCart(updatedCart);
        return updatedCart;
      } catch (error) {
        console.error('Error updating quantity:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [cartId]
  );

  /**
   * Remove an item from the cart.
   */
  const removeFromCart = useCallback(
    async (variantId: string) => {
      if (!cartId) return;
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://storefront-api.fourthwall.com/v1/carts/${cartId}/remove?storefront_token=${STOREFRONT_TOKEN}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: [{ variantId }],
            }),
          }
        );
        if (!response.ok) {
          throw new Error('Failed to remove item');
        }
        const updatedCart = await response.json();
        setCart(updatedCart);
        return updatedCart;
      } catch (error) {
        console.error('Error removing item:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [cartId]
  );

  /**
   * Fetch the entire cart from the server (e.g. to refresh).
   */
  const getCart = useCallback(async () => {
    if (!cartId) return null;
    try {
      const response = await fetch(
        `https://storefront-api.fourthwall.com/v1/carts/${cartId}?storefront_token=${STOREFRONT_TOKEN}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Optionally update local state
      setCart(data);
      return data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }, [cartId]);

  return (
    <CartContext.Provider
      value={{
        cartId,
        cart,
        isLoading,
        createCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        getCart,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * A simple hook to consume the CartContext in any component/screen.
 */
export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a <CartProvider>');
  }
  return context;
}
