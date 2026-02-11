import React, { useEffect, useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import StackScreen from '@/components/stack-screen';
import { Colors } from '@/constants/Colors';
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

  useEffect(() => {
    fetchProduct();
  }, [id]);

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
  }, [product]);

  useEffect(() => {
    if (selectedColor && product && !selectedVariant) {
      const match = product.variants.find(
        (v) => v.attributes.color.name === selectedColor
      );
      if (match) setSelectedVariant(match);
    }
  }, [selectedColor, product]);

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

  if (loading) {
    return (
      <StackScreen>
        <View style={styles.centerContainer}>
          <ActivityIndicator size='large' color={Colors.light.action} />
        </View>
      </StackScreen>
    );
  }

  if (error || !product) {
    return (
      <StackScreen>
        <View style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>
            {error || 'Product not found'}
          </ThemedText>
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
    <StackScreen>
      <ScrollView contentContainerStyle={styles.contentContainer}>
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
                              ? '#000'
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
            <Text style={styles.viewWebsiteButtonText}>View on Website</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#000',
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
  },
  productName: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Poppins_600SemiBold',
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Poppins_600SemiBold',
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
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
  selectedColorName: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular',
  },
  viewWebsiteButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  viewWebsiteButton: {
    backgroundColor: Colors.light.action,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  viewWebsiteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});
