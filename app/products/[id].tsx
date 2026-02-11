import React, { useEffect, useRef, useState } from 'react';

import { useCartContext } from '@/app/contexts/cart-context';
import { ThemedText } from '@/components/ThemedText';
import StackScreen from '@/components/stack-screen';
import { Colors } from '@/constants/Colors';
import { FontAwesome6 } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
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

const { height } = Dimensions.get('window');
const DRAWER_HEIGHT = height * 0.6;

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart, isLoading: isCartLoading } = useCartContext();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const drawerTranslateY = useRef(new Animated.Value(DRAWER_HEIGHT)).current;
  const drawerOpacity = useRef(new Animated.Value(0)).current;

  const STOREFRONT_TOKEN = 'ptkn_25057bc8-f67f-41c7-95a8-39d6f16d54d1';
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          drawerTranslateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > DRAWER_HEIGHT / 3) {
          closeDrawer();
        } else {
          Animated.spring(drawerTranslateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

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

  useEffect(() => {
    // Set the first variant of the selected color as the default selected variant
    if (selectedColor && product) {
      const variantsByColor = product.variants.filter(
        (v) => v.attributes.color.name === selectedColor
      );
      if (variantsByColor.length > 0 && !selectedVariant) {
        setSelectedVariant(variantsByColor[0]);
      }
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

  const getDefaultImages = (vars: Variant[]) =>
    vars.length ? vars[0].images : [];

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      return openSizeSelector();
    }
    try {
      await addToCart(selectedVariant.id, quantity);
      Alert.alert('Success', 'Item added to cart');
    } catch {
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const toggleFavorite = () => {
    Alert.alert('Added to favorites');
  };

  const openSizeSelector = () => {
    setShowSizeSelector(true);
    Animated.parallel([
      Animated.timing(drawerTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(drawerOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(drawerTranslateY, {
        toValue: DRAWER_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(drawerOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSizeSelector(false);
    });
  };

  const selectSize = (variant: Variant) => {
    setSelectedVariant(variant);
    closeDrawer();
  };

  const selectColor = (colorName: string) => {
    setSelectedColor(colorName);
    // Find the first variant with the selected color
    if (product) {
      const firstVariantWithColor = product.variants.find(
        (v) => v.attributes.color.name === colorName
      );
      setSelectedVariant(firstVariantWithColor || null);
    }
  };

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

  const variantsByColor = product.variants.filter(
    (v) => v.attributes.color.name === selectedColor
  );

  const sizes = variantsByColor.map((v) => ({
    id: v.id,
    name: v.attributes.size.name,
    price: v.unitPrice.value,
  }));

  const uniqueColors = Array.from(
    new Map(
      product.variants.map((v) => [v.attributes.color.name, v.attributes.color])
    ).values()
  );

  return (
    <StackScreen>
      <ScrollView>
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
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={toggleFavorite}
          >
            <FontAwesome6 name='heart' size={24} color='#FF6B6B' />
          </TouchableOpacity>
        </View>
        <View style={styles.productInfoContainer}>
          <Text
            style={styles.productName}
            numberOfLines={2}
            ellipsizeMode='tail'
          >
            {product.name}
          </Text>

          {selectedVariant?.unitPrice && (
            <Text style={styles.price}>
              ${selectedVariant.unitPrice.value.toFixed(2)}
            </Text>
          )}
          <View style={styles.divider} />
          {uniqueColors.length > 1 && (
            <>
              <Text style={styles.sectionLabel}>Color</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.colorOptionsContainer}
              >
                {uniqueColors.map((color) => (
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
                      style={[
                        styles.colorName,
                        selectedColor === color.name &&
                          styles.selectedColorName,
                      ]}
                    >
                      {color.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.divider} />
            </>
          )}
          <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>SIZE</Text>
            <TouchableOpacity
              style={styles.sizeDropdown}
              onPress={openSizeSelector}
            >
              <Text style={styles.sizeText}>
                {selectedVariant
                  ? selectedVariant.attributes.size.name
                  : 'Select Size'}
              </Text>
              <FontAwesome6 name='chevron-down' size={16} color='#fff' />
            </TouchableOpacity>
          </View>
          <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>QUANTITY</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decrementQuantity}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={incrementQuantity}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={isCartLoading}
            style={[
              styles.addToCartButton,
              isCartLoading && styles.disabledButton,
            ]}
          >
            <Text style={styles.addToCartText}>
              {isCartLoading ? 'Adding…' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {showSizeSelector && (
        <Modal
          visible={showSizeSelector}
          transparent={true}
          animationType='none'
          onRequestClose={closeDrawer}
        >
          <TouchableWithoutFeedback onPress={closeDrawer}>
            <Animated.View
              style={[styles.drawerOverlay, { opacity: drawerOpacity }]}
            >
              <Animated.View
                style={[
                  styles.drawerContainer,
                  { transform: [{ translateY: drawerTranslateY }] },
                ]}
                {...panResponder.panHandlers}
              >
                <View style={styles.drawerHandle} />

                <View style={styles.drawerHeader}>
                  <Text style={styles.drawerTitle}>SIZE</Text>
                  <TouchableOpacity onPress={closeDrawer}>
                    <FontAwesome6 name='xmark' size={20} color='#fff' />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.sizeListContainer}>
                  {sizes.map((size) => (
                    <TouchableOpacity
                      key={size.id}
                      style={styles.sizeItem}
                      onPress={() =>
                        selectSize(
                          variantsByColor.find((v) => v.id === size.id)!
                        )
                      }
                    >
                      <View style={styles.sizeInfoContainer}>
                        <Text style={styles.sizeItemText}>{size.name}</Text>
                        <Text style={styles.sizePriceText}>
                          ${size.price.toFixed(2)}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.sizeRadio,
                          selectedVariant?.id === size.id &&
                            styles.sizeRadioSelected,
                        ]}
                      >
                        {selectedVariant?.id === size.id && (
                          <View style={styles.sizeRadioInner} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Animated.View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </StackScreen>
  );
}

const styles = StyleSheet.create({
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
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  productInfoContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Poppins_600SemiBold',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
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
    color: '#000',
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
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Poppins_400Regular',
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Poppins_600SemiBold',
  },
  sizeDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.action,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: 130,
  },
  sizeText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: '600',
    marginRight: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.action,
    borderRadius: 25,
    paddingHorizontal: 8,
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    width: 28,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  addToCartButton: {
    backgroundColor: Colors.light.action,
    borderRadius: 6,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  addToCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
  },
  disabledButton: {
    opacity: 0.7,
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawerContainer: {
    backgroundColor: Colors.light.background,
    height: DRAWER_HEIGHT,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  drawerHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#DDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sizeListContainer: {
    flex: 1,
  },
  sizeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sizeInfoContainer: {
    flexDirection: 'column',
  },
  sizeItemText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 4,
  },
  sizePriceText: {
    fontSize: 14,
    color: '#ccc',
    fontFamily: 'Poppins_400Regular',
  },
  sizeRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeRadioSelected: {
    borderColor: '#fff',
    borderWidth: 2,
  },
  sizeRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});
