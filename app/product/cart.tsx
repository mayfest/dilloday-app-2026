import { useEffect, useState } from 'react';

import { useCartContext } from '@/app/contexts/cart-context';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

interface CartVariant {
  id: string;
  name: string;
  unitPrice: {
    value: number;
    currency: string;
  };
  attributes: {
    color: {
      name: string;
    };
    size: {
      name: string;
    };
  };
  images: {
    id: string;
    url: string;
  }[];
}

interface CartItem {
  quantity: number;
  variant: CartVariant;
}

interface Cart {
  id: string;
  items: CartItem[];
}

export default function CartScreen() {
  // const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cartId, updateQuantity, removeFromCart, getCart, cart, setCart } =
    useCartContext();

  const fetchCart = async () => {
    if (!cartId) {
      setLoading(false);
      return;
    }

    try {
      const cartData = await getCart();
      setCart(cartData);
      setError(null);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (variantId: string, quantity: number) => {
    try {
      await updateQuantity(variantId, quantity);
      fetchCart();
    } catch (error) {
      Alert.alert('Error', 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (variantId: string) => {
    try {
      await removeFromCart(variantId);
      fetchCart();
    } catch (error) {
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  const startCheckout = async () => {
    // Implement checkout flow based on your requirements
    Alert.alert('Starting checkout process...');
  };

  useEffect(() => {
    fetchCart();
  }, [cartId]);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#fff' />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity onPress={fetchCart} style={styles.retryButton}>
          <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.emptyText}>Your cart is empty</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.container}>
          {cart.items.map((item) => (
            <View key={item.variant.id} style={styles.cartItem}>
              <Image
                source={{ uri: item.variant.images[0]?.url }}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <ThemedText style={styles.itemName}>
                  {item.variant.name}
                </ThemedText>
                <ThemedText style={styles.itemAttributes}>
                  {item.variant.attributes.color.name} -{' '}
                  {item.variant.attributes.size.name}
                </ThemedText>
                <ThemedText style={styles.itemPrice}>
                  ${(item.variant.unitPrice.value * item.quantity).toFixed(2)}{' '}
                  {item.variant.unitPrice.currency}
                </ThemedText>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      handleUpdateQuantity(item.variant.id, item.quantity - 1)
                    }
                    style={styles.quantityButton}
                    disabled={item.quantity <= 1}
                  >
                    <ThemedText style={styles.quantityButtonText}>-</ThemedText>
                  </TouchableOpacity>

                  <ThemedText style={styles.quantityText}>
                    {item.quantity}
                  </ThemedText>

                  <TouchableOpacity
                    onPress={() =>
                      handleUpdateQuantity(item.variant.id, item.quantity + 1)
                    }
                    style={styles.quantityButton}
                  >
                    <ThemedText style={styles.quantityButtonText}>+</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleRemoveItem(item.variant.id)}
                style={styles.removeButton}
              >
                <ThemedText style={styles.removeButtonText}>×</ThemedText>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.totalContainer}>
            <ThemedText style={styles.totalText}>Total:</ThemedText>
            <ThemedText style={styles.totalAmount}>
              ${(cart.total || 0).toFixed(2)}
            </ThemedText>
          </View>

          <TouchableOpacity
            onPress={startCheckout}
            style={styles.checkoutButton}
          >
            <ThemedText style={styles.checkoutButtonText}>
              Proceed to Checkout
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#173885',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingTop: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#173885',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#173885',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
  },
  retryButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#173885',
    fontWeight: '600',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  itemAttributes: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#173885',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#173885',
    fontWeight: '600',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    color: '#1C1C1E',
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 24,
    color: '#FF3B30',
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  checkoutButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 32,
  },
  checkoutButtonText: {
    color: '#173885',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
