import React, { useCallback, useEffect, useState } from 'react';

import StackScreen from '@/components/stack-screen';
import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
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
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const STOREFRONT_TOKEN = 'ptkn_25057bc8-f67f-41c7-95a8-39d6f16d54d1';

  const fetchProduct = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    void fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (product && !selectedColor) {
      const unique = new Map<string, Variant['attributes']>();
      product.variants.forEach((v) => {
        const name = v.attributes.color.name;
        if (!unique.has(name)) unique.set(name, v.attributes);
      });
      const first = Array.from(unique.values())[0];
      if (first) setSelectedColor(first.color.name);
    }
  }, [product, selectedColor]);

  useEffect(() => {
    if (selectedColor && product && !selectedVariant) {
      const match = product.variants.find(
        (v) => v.attributes.color.name === selectedColor
      );
      if (match) setSelectedVariant(match);
    }
  }, [selectedColor, product, selectedVariant]);

  const getDefaultImages = (variants: Variant[]) =>
    variants.length ? variants[0].images : [];

  const selectColor = (colorName: string) => {
    setSelectedColor(colorName);
    if (product) {
      const first = product.variants.find(
        (v) => v.attributes.color.name === colorName
      );
      if (first) setSelectedVariant(first);
    }
  };

  const screenShellProps = {
    backgroundColor: '#000' as const,
    backButtonColor: '#fff' as const,
    backButtonFontFamily: 'FuturaBold' as const,
  };

  if (loading) {
    return (
      <StackScreen {...screenShellProps}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size='large' color='#fff' />
        </View>
      </StackScreen>
    );
  }

  if (error || !product) {
    return (
      <StackScreen {...screenShellProps}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            {(error || 'Product not found').toUpperCase()}
          </Text>
        </View>
      </StackScreen>
    );
  }

  const colors = Array.from(
    new Map(
      product.variants.map((v) => [v.attributes.color.name, v.attributes.color])
    ).values()
  );

  return (
    <StackScreen {...screenShellProps}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                selectedVariant?.images[0]?.url ||
                getDefaultImages(product.variants)[0]?.url,
            }}
            style={styles.productImage}
            resizeMode='cover'
          />
        </View>

        <View style={styles.productInfoContainer}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          {selectedVariant?.unitPrice && (
            <Text style={styles.price}>
              ${selectedVariant.unitPrice.value.toFixed(2)}
            </Text>
          )}
          <View style={styles.divider} />

          {colors.length > 1 && (
            <>
              <Text style={styles.sectionLabel}>Color</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.colorOptionsContainer}
              >
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color.name}
                    style={styles.colorOption}
                    onPress={() => selectColor(color.name)}
                  >
                    <View
                      style={[
                        styles.colorSwatch,
                        {
                          backgroundColor: color.swatch,
                          borderColor:
                            selectedColor === color.name
                              ? '#fff'
                              : 'transparent',
                        },
                      ]}
                    />
                    <Text
                      style={
                        selectedColor === color.name
                          ? styles.selectedColorName
                          : styles.colorName
                      }
                    >
                      {color.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.divider} />
            </>
          )}
        </View>

        <View style={styles.viewWebsiteButtonContainer}>
          <TouchableOpacity
            style={styles.viewWebsiteButton}
            onPress={() =>
              Linking.openURL(
                `https://store.dilloday.com/products/${product.slug}`
              )
            }
          >
            <Text style={styles.viewWebsiteButtonText}>VIEW ON WEBSITE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    backgroundColor: '#000',
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: '#fff',
    fontFamily: 'FuturaBold',
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingHorizontal: 24,
    fontSize: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
  },
  productInfoContainer: {
    padding: 20,
    backgroundColor: '#000',
  },
  productName: {
    fontSize: 24,
    fontFamily: 'FuturaBold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#fff',
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'FuturaBold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginVertical: 8,
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 12,
    fontFamily: 'FuturaBold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  colorOption: {
    marginRight: 16,
    alignItems: 'center',
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    marginBottom: 5,
  },
  colorName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)',
    fontFamily: 'FuturaBold',
    textTransform: 'uppercase',
  },
  selectedColorName: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'FuturaBold',
    textTransform: 'uppercase',
  },
  viewWebsiteButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  viewWebsiteButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 60,
  },
  viewWebsiteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'FuturaBold',
    textTransform: 'uppercase',
  },
});
