import StorePageBanner from '@/components/banners/store-banner';
import DrawerScreen from '@/components/drawer-screen';
import { Colors } from '@/constants/Colors';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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

interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  images: { id: string; url: string; width: number; height: number }[];
  variants: {
    id: string;
    unitPrice?: {
      value: number;
      currency: string;
    };
  }[];
}

const { width } = Dimensions.get('window');
const H_GUTTER = 12;
const V_GUTTER = 12;
const CARD_GAP = 8;
const CARD_WIDTH = (width - H_GUTTER * 2 - CARD_GAP) / 2;
const IMAGE_HEIGHT = CARD_WIDTH;
const INFO_BAR_HEIGHT = 110;

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const STOREFRONT_TOKEN = 'ptkn_25057bc8-f67f-41c7-95a8-39d6f16d54d1';

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `https://storefront-api.fourthwall.com/v1/collections/carnival-dillo/products?storefront_token=${STOREFRONT_TOKEN}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { results } = await res.json();
      setProducts(results || []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const variant = item.variants[0];
    const price = variant?.unitPrice;
    const value = price?.value ?? 0;
    const curr = price?.currency ?? '';

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push(`/products/${item.slug}`)}
      >
        <Image
          source={{ uri: item.images[0]?.url }}
          style={styles.productImage}
          resizeMode='cover'
        />
        <View style={styles.infoBar}>
          <ThemedText style={styles.infoName} numberOfLines={3}>
            {item.name}
          </ThemedText>
          <ThemedText style={styles.infoPrice}>
            ${value} {curr}
          </ThemedText>
        </View>
        <TouchableOpacity style={styles.favoriteIcon}>
          <FontAwesome6 name='heart' size={18} color={Colors.light.text} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const ListHeaderComponent = () => (
    <View style={styles.bannerWrapper}>
      <StorePageBanner />
    </View>
  );

  return (
    <DrawerScreen>
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size='large' color='#173885' />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity onPress={fetchProducts} style={styles.retryButton}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      ) : products.length === 0 ? (
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
          ListHeaderComponent={ListHeaderComponent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </DrawerScreen>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    paddingLeft: 15,
    paddingBottom: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: H_GUTTER,
    paddingBottom: V_GUTTER,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: V_GUTTER,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: V_GUTTER,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: IMAGE_HEIGHT,
  },
  infoBar: {
    height: INFO_BAR_HEIGHT,
    backgroundColor: Colors.light.text,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  infoName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  infoPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    paddingTop: 4,
    fontFamily: 'Poppins_600SemiBold',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
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
    fontSize: 16,
    color: '#1C1C1E',
  },
});
