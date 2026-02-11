import { useCallback, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  variantId: string;
  quantity: number;
}

interface Cart {
  id: string;
  items: CartItem[];
}
const CART_ID_KEY = '@cart_id';

export function useCart() {
  const [cartId, setCartId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);

  const STOREFRONT_TOKEN = 'ptkn_25057bc8-f67f-41c7-95a8-39d6f16d54d1';

  useEffect(() => {
    const loadCartId = async () => {
      try {
        const savedCartId = await AsyncStorage.getItem(CART_ID_KEY);
        console.log('Loaded cartId from storage:', savedCartId);
        if (savedCartId) {
          const cartResponse = await fetch(
            `https://storefront-api.fourthwall.com/v1/carts/${savedCartId}?storefront_token=${STOREFRONT_TOKEN}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (cartResponse.ok) {
            console.log('Cart verified, setting cartId:', savedCartId);
            setCartId(savedCartId);
          } else {
            console.log('Saved cart no longer valid, removing from storage');
            await AsyncStorage.removeItem(CART_ID_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading cartId:', error);
      }
    };

    loadCartId();
  }, []);

  const createCart = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Creating new cart...');
      const response = await fetch(
        `https://storefront-api.fourthwall.com/v1/carts?storefront_token=${STOREFRONT_TOKEN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Cart creation error response:', errorText);
        throw new Error(`Failed to create cart: ${response.status}`);
      }

      const data = await response.json();
      console.log('Cart creation response:', JSON.stringify(data, null, 2));

      // Save cartId to AsyncStorage
      await AsyncStorage.setItem(CART_ID_KEY, data.id);
      console.log('Saved cartId to storage:', data.id);
      setCartId(data.id);
      return data.id;
    } catch (error) {
      console.error('Detailed cart creation error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToCart = useCallback(
    async (variantId: string, quantity: number = 1) => {
      try {
        setIsLoading(true);
        let currentCartId = cartId;
        if (!currentCartId) {
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
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: [
                {
                  variantId,
                  quantity,
                },
              ],
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.log(
            'Add to cart error response:',
            JSON.stringify(data, null, 2)
          );
          throw new Error(`Failed to add item to cart: ${response.status}`);
        }

        console.log('Add to cart response:', JSON.stringify(data, null, 2));

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

  const updateQuantity = useCallback(
    async (variantId: string, quantity: number) => {
      if (!cartId) return;
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://storefront-api.fourthwall.com/v1/carts/${cartId}/update-quantities?storefront_token=${STOREFRONT_TOKEN}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: [{ variantId, quantity }],
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update quantity');
        }

        const updatedCart = await response.json();
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

  const removeFromCart = useCallback(
    async (variantId: string) => {
      if (!cartId) return;
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://storefront-api.fourthwall.com/v1/carts/${cartId}/remove?storefront_token=${STOREFRONT_TOKEN}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: [{ variantId }],
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to remove item');
        }

        const updatedCart = await response.json();
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

  const getCart = useCallback(async () => {
    if (!cartId) return null;
    try {
      const response = await fetch(
        `https://storefront-api.fourthwall.com/v1/carts/${cartId}?storefront_token=${STOREFRONT_TOKEN}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }, [cartId]);

  return {
    cartId,
    isLoading,
    createCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    getCart,
    cart,
    setCart,
  };
}
