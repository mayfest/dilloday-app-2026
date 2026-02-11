import FoodPageBanner from '@/components/banners/food-banner copy';
import DrawerScreen from '@/components/drawer-screen';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { FOOD_TRUCKS } from '@/constants/food-trucks';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const H_GUTTER = 12;
const V_GUTTER = 12;
const CARD_GAP = 8;
const CARD_WIDTH = (width - H_GUTTER * 2 - CARD_GAP) / 2;
const IMAGE_HEIGHT = CARD_WIDTH;
const INFO_BAR_HEIGHT = 90;

export default function FoodTrucksScreen() {
  const router = useRouter();

  const renderFoodTruckItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.foodTruckCard}
        onPress={() => router.push(`/food-trucks/${item.id}`)}
      >
        <View style={styles.imageContainer}>
          {item.id === 'dAndD' ? (
            <Image
              source={item.logo}
              style={styles.whiteLogoBlackBackground}
              resizeMode='contain'
            />
          ) : item.id === 'soulAndSmoke' ? (
            <Image
              source={item.logo}
              style={styles.whiteLogoBlackBackground}
              resizeMode='contain'
            />
          ) : (
            <Image
              source={item.logo}
              style={styles.logoImage}
              resizeMode='contain'
            />
          )}
        </View>
        <View style={styles.infoBar}>
          <ThemedText style={styles.infoName} numberOfLines={2}>
            {item.name}
          </ThemedText>
          <ThemedText style={styles.infoType}>
            {item.type}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeaderComponent = () => (
    <View style={styles.bannerWrapper}>
      <FoodPageBanner />
    </View>
  );

  return (
    <DrawerScreen>
      <FlatList
        data={FOOD_TRUCKS}
        keyExtractor={(item) => item.id}
        renderItem={renderFoodTruckItem}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={ListHeaderComponent}
        showsVerticalScrollIndicator={false}
      />
    </DrawerScreen>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    paddingLeft: 15,
    paddingBottom: 15,
    width: '100%',
  },
  listContainer: {
    paddingHorizontal: H_GUTTER,
    paddingBottom: V_GUTTER * 2,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: V_GUTTER,
  },
  foodTruckCard: {
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
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '75%',
    height: '75%',
  },
  wideLogoImage: {
    width: '65%',
    height: '65%',
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
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  infoType: {
    fontSize: 14,
    fontWeight: '600',
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
  whiteLogoBlackBackground: {
    width: '75%',
    height: '75%',
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 8,
  }
});
