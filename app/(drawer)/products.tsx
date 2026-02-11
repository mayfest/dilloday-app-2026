import { useEffect, useState } from 'react';

import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  images: {
    id: string;
    url: string;
    width: number;
    height: number;
  }[];
  variants: {
    id: string;
    price?: {
      amount: number;
      currency: string;
    };
  }[];
}

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const STOREFRONT_TOKEN = 'ptkn_25057bc8-f67f-41c7-95a8-39d6f16d54d1';

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        'https://storefront-api.fourthwall.com/v1/collections/camp-collectionnnn/products?storefront_token=' +
          STOREFRONT_TOKEN,
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
      setProducts(data.results || []);
      setError(null);
    } catch (error) {
      console.error('Detailed error:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to fetch products'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderProductItem = ({ item }: { item: Product }) => {
    const hasDiscount =
      item.variants?.[0]?.price?.amount &&
      item.variants[0].price.amount < 10000;

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push(`/(drawer)/product/${item.slug}`)}
      >
        <View style={styles.imageContainer}>
          {item.images?.[0] && (
            <Image
              source={{ uri: item.images[0].url }}
              style={styles.productImage}
              resizeMode='cover'
            />
          )}
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <ThemedText style={styles.discountText}>SALE</ThemedText>
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <ThemedText style={styles.productName} numberOfLines={1}>
            {item.name}
          </ThemedText>

          <ThemedText style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </ThemedText>

          {item.variants?.[0]?.price && (
            <View style={styles.priceContainer}>
              <ThemedText style={styles.price}>
                ${(item.variants[0].price.amount / 100).toFixed(2)}{' '}
                <ThemedText style={styles.currency}>
                  {item.variants[0].price.currency}
                </ThemedText>
              </ThemedText>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size='large' color='#173885' />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity onPress={fetchProducts} style={styles.retryButton}>
          <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {products.length === 0 ? (
        <View style={styles.centerContainer}>
          <ThemedText style={styles.emptyText}>No products found</ThemedText>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </ThemedView>
  );
}

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - CARD_MARGIN * 6) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#173885',
    paddingTop: 100,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#173885',
  },
  listContainer: {
    padding: CARD_MARGIN,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN * 2,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH, // Make it square
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#173885',
  },
  currency: {
    fontSize: 14,
    color: '#8E8E93',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#173885',
    fontWeight: '600',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
  },
});
