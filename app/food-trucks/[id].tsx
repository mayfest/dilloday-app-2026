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
    return Object.entries(raw).map(([item, price]) => ({
      item,
      price: `$${parseFloat(price).toFixed(2)}`,
    }));
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
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={appState.state === 'loading'}
            onRefresh={() => config.reload?.()}
          />
        }
      >
        {/* Hero image at 50% width */}
        <Image source={meta.logo} style={styles.hero} resizeMode='contain' />

        {/* Title constrained to one line */}
        <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
          {meta.name} Menu
        </Text>

        <View style={styles.divider} />

        {menu.length > 0 ? (
          menu.map((m, i) => (
            <View key={i} style={styles.menuRow}>
              <Text style={styles.item} numberOfLines={2} ellipsizeMode='tail'>
                {m.item}
              </Text>
              <Text style={styles.price}>{m.price}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            We currently don't have a menu for {meta.name}. We will update this
            page as soon as we have it!
          </Text>
        )}
      </ScrollView>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  hero: {
    width: width * 0.5, // half the screen
    aspectRatio: 2, // keep your original ratio
    height: '80%', // 50% of the screen height
    alignSelf: 'center',
    marginBottom: 24,
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
});
