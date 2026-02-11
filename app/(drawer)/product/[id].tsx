import { useEffect, useState } from 'react';

import { useCartContext } from '@/app/contexts/cart-context';
// import { useCart } from '@/hooks/useCart';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';

interface Variant {
  id: string;
  name: string;
  unitPrice: {
    value: number;
    currency: string;
  };
  attributes: {
    description: string;
    color: {
      name: string;
      swatch: string;
    };
    size: {
      name: string;
    };
  };
  stock: {
    type: string;
  };
  images: {
    id: string;
    url: string;
    width: number;
    height: number;
  }[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  variants: Variant[];
}

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { addToCart, isLoading: isCartLoading } = useCartContext();

  const STOREFRONT_TOKEN = 'ptkn_25057bc8-f67f-41c7-95a8-39d6f16d54d1';

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && !selectedColor) {
      const colors = getUniqueColors(product.variants);
      if (colors.length > 0) {
        setSelectedColor(colors[0].color.name);
      }
    }
  }, [product]);

  const getDefaultImages = (variants: Variant[]) => {
    if (!variants || variants.length === 0) return [];
    return variants[0].images;
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `https://storefront-api.fourthwall.com/v1/products/${id}?storefront_token=${STOREFRONT_TOKEN}`,
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
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to fetch product'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) {
      Alert.alert('Error', 'Please select a size first');
      return;
    }

    try {
      await addToCart(selectedVariant.id);
      Alert.alert('Success', 'Item added to cart');
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const getUniqueColors = (variants: Variant[]) => {
    const uniqueColors = new Map();
    variants.forEach((variant) => {
      if (!uniqueColors.has(variant.attributes.color.name)) {
        uniqueColors.set(variant.attributes.color.name, variant.attributes);
      }
    });
    return Array.from(uniqueColors.values());
  };

  const getSizesForColor = (variants: Variant[], colorName: string) => {
    return variants
      .filter((v) => v.attributes.color.name === colorName)
      .map((v) => ({
        size: v.attributes.size.name,
        variant: v,
      }));
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#fff' />
      </ThemedView>
    );
  }

  if (error || !product) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>
          {error || 'Product not found'}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.container}>
          {/* Product Image */}
          {(selectedVariant?.images?.[0] ||
            getDefaultImages(product.variants)?.[0]) && (
            <Image
              source={{
                uri:
                  selectedVariant?.images?.[0]?.url ||
                  getDefaultImages(product.variants)[0].url,
              }}
              style={styles.productImage}
              resizeMode='cover'
            />
          )}

          <ThemedText style={styles.productName}>{product.name}</ThemedText>

          {selectedVariant?.unitPrice && (
            <ThemedText style={styles.price}>
              ${selectedVariant.unitPrice.value.toFixed(2)}{' '}
              {selectedVariant.unitPrice.currency}
            </ThemedText>
          )}

          <ThemedText style={styles.description}>
            {product.description}
          </ThemedText>

          {product.variants && product.variants.length > 0 && (
            <>
              <ThemedText style={styles.sectionTitle}>Color</ThemedText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.colorContainer}
              >
                {getUniqueColors(product.variants).map((attributes) => (
                  <TouchableOpacity
                    key={attributes.color.name}
                    onPress={() => {
                      setSelectedColor(attributes.color.name);
                      setSelectedVariant(null);
                    }}
                    style={styles.colorButton}
                  >
                    <ThemedView
                      style={[
                        styles.colorOuterCircle,
                        selectedColor === attributes.color.name &&
                          styles.selectedColorBorder,
                      ]}
                    >
                      <ThemedView
                        style={[
                          styles.colorInnerCircle,
                          { backgroundColor: attributes.color.swatch },
                        ]}
                      />
                    </ThemedView>
                    <ThemedText
                      style={[
                        styles.colorName,
                        selectedColor === attributes.color.name &&
                          styles.selectedColorText,
                      ]}
                    >
                      {attributes.color.name}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <ThemedText style={styles.sectionTitle}>Size</ThemedText>
              <View style={styles.sizeContainer}>
                {selectedColor &&
                  getSizesForColor(product.variants, selectedColor).map(
                    ({ size, variant }) => (
                      <TouchableOpacity
                        key={variant.id}
                        onPress={() => setSelectedVariant(variant)}
                        style={[
                          styles.sizeButton,
                          selectedVariant?.id === variant.id &&
                            styles.selectedSizeButton,
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.sizeText,
                            selectedVariant?.id === variant.id &&
                              styles.selectedSizeText,
                          ]}
                        >
                          {variant.attributes.size.name}
                        </ThemedText>
                      </TouchableOpacity>
                    )
                  )}
              </View>
            </>
          )}

          <View style={styles.addToCartContainer}>
            <TouchableOpacity
              onPress={handleAddToCart}
              disabled={isCartLoading || !selectedVariant}
              style={[
                styles.addToCartButton,
                (isCartLoading || !selectedVariant) && styles.disabledButton,
              ]}
            >
              <ThemedText style={styles.addToCartText}>
                {isCartLoading
                  ? 'Adding to Cart...'
                  : !selectedVariant
                    ? 'Select a Size'
                    : 'Add to Cart'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#173885',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#173885',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#173885',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#173885',
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
  container: {
    padding: 16,
    backgroundColor: '#173885',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  productName: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
    color: '#fff',
  },
  price: {
    fontSize: 20,
    color: '#fff',
    marginTop: 8,
  },
  description: {
    marginTop: 16,
    lineHeight: 24,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    color: '#fff',
  },
  colorContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  colorButton: {
    alignItems: 'center',
    marginRight: 12,
  },
  colorOuterCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorBorder: {
    borderColor: '#fff',
  },
  colorInnerCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    color: '#fff',
  },
  selectedColorText: {
    color: '#fff',
    fontWeight: '600',
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeButton: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSizeButton: {
    borderColor: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sizeText: {
    color: '#fff',
    fontWeight: '500',
  },
  selectedSizeText: {
    color: '#fff',
    fontWeight: '600',
  },
  addToCartContainer: {
    marginTop: 32,
    marginBottom: 100,
  },
  addToCartButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  addToCartText: {
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '600',
  },
});
