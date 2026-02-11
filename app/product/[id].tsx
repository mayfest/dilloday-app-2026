import React, { useEffect, useState } from 'react';

import { useCartContext } from '@/app/contexts/cart-context';
import { ThemedText } from '@/components/ThemedText';
import StackScreen from '@/components/stack-screen';
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

interface Variant {
  id: string;
  name: string;
  unitPrice: { value: number; currency: string };
  attributes: {
    description: string;
    color: { name: string; swatch: string };
    size: { name: string };
  };
  images: { id: string; url: string }[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  variants: Variant[];
}

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart, isLoading: isCartLoading } = useCartContext();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const STOREFRONT_TOKEN = 'ptkn_25057bc8-f67f-41c7-95a8-39d6f16d54d1';

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && !selectedColor) {
      const unique = new Map<string, Variant['attributes']>();
      product.variants.forEach((v) => {
        const name = v.attributes.color.name;
        if (!unique.has(name)) {
          unique.set(name, v.attributes);
        }
      });
      const first = Array.from(unique.values())[0];
      if (first) setSelectedColor(first.color.name);
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(
        `https://storefront-api.fourthwall.com/v1/products/${id}?storefront_token=${STOREFRONT_TOKEN}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProduct(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultImages = (vars: Variant[]) =>
    vars.length ? vars[0].images : [];

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      return Alert.alert('Error', 'Please select a size first');
    }
    try {
      await addToCart(selectedVariant.id);
      Alert.alert('Success', 'Item added to cart');
    } catch {
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  // --- Render ---
  if (loading) {
    return (
      <StackScreen>
        <View style={styles.centerContainer}>
          <ActivityIndicator size='large' color='#173885' />
        </View>
      </StackScreen>
    );
  }

  if (error || !product) {
    return (
      <StackScreen>
        <View style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>
            {error || 'Not found'}
          </ThemedText>
        </View>
      </StackScreen>
    );
  }

  return (
    <StackScreen>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          <Image
            source={{
              uri:
                selectedVariant?.images[0]?.url ||
                getDefaultImages(product.variants)[0]?.url,
            }}
            style={styles.productImage}
            resizeMode='cover'
          />

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

          {/* Color */}
          <ThemedText style={styles.sectionTitle}>Color</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.colorContainer}
          >
            {Array.from(
              new Map(
                product.variants.map((v) => [
                  v.attributes.color.name,
                  v.attributes,
                ])
              ).values()
            ).map((attr) => (
              <TouchableOpacity
                key={attr.color.name}
                onPress={() => {
                  setSelectedColor(attr.color.name);
                  setSelectedVariant(null);
                }}
                style={styles.colorButton}
              >
                <View
                  style={[
                    styles.colorOuter,
                    selectedColor === attr.color.name && styles.colorSelected,
                  ]}
                >
                  <View
                    style={[
                      styles.colorInner,
                      { backgroundColor: attr.color.swatch },
                    ]}
                  />
                </View>
                <ThemedText
                  style={[
                    styles.colorName,
                    selectedColor === attr.color.name && styles.colorNameSel,
                  ]}
                >
                  {attr.color.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Size */}
          <ThemedText style={styles.sectionTitle}>Size</ThemedText>
          <View style={styles.sizeContainer}>
            {product.variants
              .filter((v) => v.attributes.color.name === selectedColor)
              .map((v) => (
                <TouchableOpacity
                  key={v.id}
                  onPress={() => setSelectedVariant(v)}
                  style={[
                    styles.sizeButton,
                    selectedVariant?.id === v.id && styles.sizeSel,
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.sizeText,
                      selectedVariant?.id === v.id && styles.sizeTextSel,
                    ]}
                  >
                    {v.attributes.size.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
          </View>

          {/* Add to Cart */}
          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={isCartLoading || !selectedVariant}
            style={[
              styles.addButton,
              (isCartLoading || !selectedVariant) && styles.disabled,
            ]}
          >
            <ThemedText style={styles.addText}>
              {isCartLoading
                ? 'Adding…'
                : !selectedVariant
                  ? 'Select Size'
                  : 'Add to Cart'}
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#173885' },
  scrollView: { padding: 16, backgroundColor: '#173885' },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: { color: '#fff' },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  productName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
  },
  price: { fontSize: 20, color: '#fff', marginTop: 8 },
  description: { color: '#fff', marginTop: 16, lineHeight: 24 },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  colorContainer: { flexDirection: 'row' },
  colorButton: { alignItems: 'center', marginRight: 12 },
  colorOuter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSelected: { borderColor: '#fff' },
  colorInner: { width: 32, height: 32, borderRadius: 16 },
  colorName: { color: '#fff', fontSize: 12, marginTop: 4 },
  colorNameSel: { fontWeight: '600' },
  sizeContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  sizeButton: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  sizeSel: { backgroundColor: 'rgba(255,255,255,0.2)' },
  sizeText: { color: '#fff' },
  sizeTextSel: { fontWeight: '600' },
  addButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 32,
    marginBottom: 100,
    alignItems: 'center',
  },
  addText: { color: '#007AFF', fontWeight: '600' },
  disabled: { backgroundColor: 'rgba(255,255,255,0.5)' },
});
