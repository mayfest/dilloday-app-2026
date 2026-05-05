import React, { useCallback, useMemo, useState } from 'react';

import DrawerScreen from '@/components/drawer-screen';
import LoadingIndicator from '@/components/loading-indicator';
import StackScreen from '@/components/stack-screen';
import { Colors } from '@/constants/Colors';
import { useConfig } from '@/lib/config';
import { parseMenuForTruck, resolveFoodTruckById } from '@/lib/food-trucks';
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
  const { config, reload } = useConfig();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [refreshing, setRefreshing] = useState(false);

  const meta = useMemo(
    () => (config && id ? resolveFoodTruckById(config, id) : undefined),
    [config, id]
  );

  const menu = useMemo(
    () => (config && id ? parseMenuForTruck(config, id) : []),
    [config, id]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await reload();
    } finally {
      setRefreshing(false);
    }
  }, [reload]);

  if (!config) {
    return (
      <DrawerScreen>
        <LoadingIndicator />
      </DrawerScreen>
    );
  }

  if (!meta) {
    return (
      <StackScreen backgroundColor='#000' backButtonColor='#fff'>
        <View style={styles.container}>
          <Text style={styles.emptyText}>Food truck not found.</Text>
        </View>
      </StackScreen>
    );
  }

  const title = `${meta.name} Menu`;

  return (
    <StackScreen backgroundColor='#000' backButtonColor='#fff'>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {meta.image ? (
            <Image
              source={{ uri: meta.image }}
              style={styles.hero}
              resizeMode='contain'
            />
          ) : (
            <View style={styles.heroPlaceholder} />
          )}

          <Text style={styles.title}>{title}</Text>

          <View style={styles.divider} />

          {menu.length > 0 ? (
            menu.map((m, i) => (
              <View key={`${m.item}-${i}`} style={styles.menuRow}>
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
              We currently don&apos;t have a menu for {meta.name}. We will
              update this page as soon as we have it!
            </Text>
          )}
          {menu.length > 0 && (
            <Text style={styles.noticeText}>
              All prices are in USD and are before tax and optional gratuity.
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
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 60,
    backgroundColor: '#000',
  },
  hero: {
    width: width * 0.8,
    aspectRatio: 2,
    height: undefined,
    alignSelf: 'center',
    marginBottom: 24,
    backgroundColor: '#000',
  },
  heroPlaceholder: {
    width: width * 0.8,
    aspectRatio: 2,
    alignSelf: 'center',
    marginBottom: 24,
    backgroundColor: '#222',
    borderRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.light.text,
    marginBottom: 8,
    fontFamily: 'FuturaBold',
    textTransform: 'uppercase',
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
    flex: 1,
    fontSize: 18,
    color: Colors.light.text,
    flexWrap: 'wrap',
    marginRight: 12,
    fontFamily: 'Futura',
    textTransform: 'none',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    flexShrink: 0,
    fontFamily: 'Futura',
    textTransform: 'none',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.light.text,
    marginTop: 20,
    fontFamily: 'Futura',
    textTransform: 'none',
  },
  noticeText: {
    textAlign: 'center',
    color: Colors.light.text,
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'Futura',
    textTransform: 'none',
  },
});
