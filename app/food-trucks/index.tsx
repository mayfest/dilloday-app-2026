import React, { useCallback, useMemo, useRef } from 'react';

import { ThemedText } from '@/components/ThemedText';
import DrawerScreen from '@/components/drawer-screen';
import LoadingIndicator from '@/components/loading-indicator';
import {
  sofachromeTitleTextStyle
} from '@/constants/sofachrome-screen-title';
import { useConfig } from '@/lib/config';
import {
  type ResolvedFoodTruck,
  getFoodTrucksFromConfig,
} from '@/lib/food-trucks';
import { FontAwesome6 } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
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
  const { config } = useConfig();
  const listRef = useRef<FlatList<ResolvedFoodTruck>>(null);

  const trucks = useMemo(() => getFoodTrucksFromConfig(config), [config]);

  const renderFoodTruckItem = ({ item }: { item: ResolvedFoodTruck }) => (
    <TouchableOpacity
      style={styles.foodTruckCard}
      onPress={() => router.push(`/food-trucks/${item.id}`)}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.logoImage}
            resizeMode='contain'
          />
        ) : (
          <View style={styles.logoPlaceholder} />
        )}
      </View>
      <View style={styles.infoBar}>
        <ThemedText style={styles.infoName} numberOfLines={2}>
          {item.name}
        </ThemedText>
        <View style={styles.infoChevronWrap}>
          <FontAwesome6
            name='chevron-down'
            size={14}
            color='#fff'
            style={styles.infoChevron}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  useFocusEffect(
    useCallback(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    }, [])
  );

  if (!config) {
    return (
      <DrawerScreen>
        <View style={styles.titleContainer}>
          <Text style={styles.foodTitle}>Food</Text>
        </View>
        <LoadingIndicator />
      </DrawerScreen>
    );
  }

  return (
    <DrawerScreen>
      <View style={styles.titleContainer}>
        <Text
          style={styles.foodTitle}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
        >
          Food
        </Text>
      </View>
      {trucks.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>
            Food truck list is not available yet. Check back soon.
          </Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={trucks}
          keyExtractor={(item) => item.id}
          renderItem={renderFoodTruckItem}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
      <View style={{ height: 40 }} />
    </DrawerScreen>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    width: '100%',
    marginVertical: 16,
  },
  foodTitle: {
    ...sofachromeTitleTextStyle(38),
    letterSpacing: 1,
    paddingRight: 8,
    width: '100%',
    textAlign: 'center',
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
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: V_GUTTER,
    borderWidth: 1,
    borderColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '75%',
    height: '75%',
  },
  logoPlaceholder: {
    width: '60%',
    height: '60%',
    backgroundColor: '#222',
    borderRadius: 8,
  },
  infoBar: {
    height: INFO_BAR_HEIGHT,
    backgroundColor: '#000',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  infoName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'FuturaBold',
    textTransform: 'uppercase',
  },
  infoChevronWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 8,
    alignItems: 'center',
  },
  infoChevron: {
    marginVertical: 0,
  },
  emptyWrap: {
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontFamily: 'Futura',
    textAlign: 'center',
    fontSize: 16,
  },
});
