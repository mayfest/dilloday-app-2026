import React from 'react';

import FoodPageBanner from '@/components/banners/food-banner copy';
import { FilmStrip } from '@/components/film-strip';
import StackScreen from '@/components/stack-screen';
import { Colors } from '@/constants/Colors';
import { FOOD_TRUCKS } from '@/constants/food-trucks';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;
const LOGO_HEIGHT = CARD_WIDTH * 0.6;

export default function FoodTrucksScreen() {
  const router = useRouter();

  return (
    <StackScreen banner={
                          <View style={styles.bannerWrapper}>
                            <FoodPageBanner />
                          </View>}>
      <FlatList
        data={FOOD_TRUCKS}
        keyExtractor={(t) => t.id}
        numColumns={2}
        contentContainerStyle={styles.container}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ width: CARD_WIDTH }}
            activeOpacity={0.8}
            onPress={() => router.push(`/food-trucks/${item.id}`)}
          >
            <FilmStrip style={{ width: '100%' }}>
              <View
                style={[
                  styles.logoWrapper,
                  { width: CARD_WIDTH * 0.9, height: LOGO_HEIGHT },
                ]}
              >
                {item.id === 'dAndD' ? (
                  <Image
                    source={item.logo}
                    style={styles.wideLogo}
                    resizeMode='contain'
                  />
                ) : (
                  <Image
                    source={item.logo}
                    style={styles.logo}
                    resizeMode='contain'
                  />
                )}
              </View>
            </FilmStrip>
          </TouchableOpacity>
        )}
      />
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    paddingLeft: 15,
    paddingBottom: 15,
  },
  container: {
    padding: CARD_MARGIN,
    paddingBottom: CARD_MARGIN * 2,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN + 12,
  },
  logoWrapper: {
    borderRadius: 6, 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logo: {
    width: '75%',
    height: '75%',
  },
  wideLogo: {
    width: '65%',
    height: '65%',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
  },
});
