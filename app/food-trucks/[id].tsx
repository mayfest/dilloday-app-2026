import React, { useMemo } from 'react';

import DrawerScreen from '@/components/drawer-screen';
import LoadingIndicator from '@/components/loading-indicator';
import StackScreen from '@/components/stack-screen';
import { Colors } from '@/constants/Colors';
import { FOOD_TRUCKS, FoodTruckMeta } from '@/constants/food-trucks';
import { useConfig } from '@/lib/config';
import { useLocalSearchParams } from 'expo-router';
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function FoodTruckDetail() {
  const { config, state: appState } = useConfig();
  const { id } = useLocalSearchParams<{ id: string }>();
  const meta = FOOD_TRUCKS.find((t) => t.id === id) as FoodTruckMeta;

  if (!meta) return null;

  const menu = useMemo(() => {
    if (!config || !id) return [];
    const raw = config.food_truck_menus[id] ?? {};
    return Object.entries(raw)
      .map(([item, price]) => ({
        item,
        price: `${parseFloat(price).toFixed(2)}`,
        numericPrice: parseFloat(price), // Keep numeric value for sorting
      }))
      .sort((a, b) => b.numericPrice - a.numericPrice); // Sort highest to lowest
  }, [config, id]);

  if (!config) {
    return (
      <DrawerScreen>
        <LoadingIndicator />
      </DrawerScreen>
    );
  }

  return (
    <StackScreen>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl
              refreshing={appState.state === 'loading'}
              onRefresh={() => config.reload?.()}
            />
          }
        >
          {/* Hero image at 50% width */}
          {meta.name === 'D&Ds' || meta.name == 'Soul & Smoke' ? (
            <Image
              source={meta.logo}
              style={styles.blackHero}
              resizeMode='contain'
            />
          ) : (
            <Image
              source={meta.logo}
              style={styles.hero}
              resizeMode='contain'
            />
          )}

          {/* Title constrained to one line */}
          <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
            {meta.name} Menu
          </Text>

          <View style={styles.divider} />

          {menu.length > 0 ? (
            menu.map((m, i) => (
              <View key={i} style={styles.menuRow}>
                <Text
                  style={styles.item}
                  numberOfLines={2}
                  ellipsizeMode='tail'
                >
                  {m.item}
                </Text>
                <Text style={styles.price}>${m.price}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              We currently don't have a menu for {meta.name}. We will update
              this page as soon as we have it!
            </Text>
          )}
          {menu.length > 0 && (
            <Text style={styles.noticeText}>
              All prices are in USD and are before tax and optinal gratuity.
            </Text>
          )}
        </ScrollView>
      </View>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 60,
  },
  hero: {
    width: width * 0.8, // 80% of screen width
    aspectRatio: 2, // keep your original ratio
    height: undefined, // Let aspectRatio determine height
    alignSelf: 'center',
    marginBottom: 24,
  },
  blackHero: {
    width: width * 0.8, // 80% of screen width
    aspectRatio: 2,
    height: undefined, // Let aspectRatio determine height
    alignSelf: 'center',
    marginBottom: 24,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.light.text,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.text,
    marginVertical: 12,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.text,
  },
  item: {
    flex: 1, // allow wrapping
    fontSize: 18,
    color: Colors.light.text,
    flexWrap: 'wrap',
    marginRight: 12, // space before price
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    flexShrink: 0, // prevent shrinking price
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.light.text,
    marginTop: 20,
  },
  noticeText: {
    textAlign: 'center',
    color: Colors.light.text,
    marginTop: 20,
    fontSize: 16,
  },
});
