import React from 'react';

import StackScreen from '@/components/stack-screen';
import { Colors } from '@/constants/Colors';
import { FOOD_TRUCKS } from '@/constants/food-trucks';
import { useLocalSearchParams } from 'expo-router';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function FoodTruckDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const truck = FOOD_TRUCKS.find((t) => t.id === id);
  if (!truck) return null;

  return (
    <StackScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={truck.logo} style={styles.hero} resizeMode='contain' />
        <Text style={styles.title}>{truck.name} Menu</Text>
        <View style={styles.divider} />

        {truck.menu.map((m, i) => (
          <View key={i} style={styles.menuRow}>
            <Text style={styles.item}>{m.item}</Text>
            <Text style={styles.price}>{m.price}</Text>
          </View>
        ))}
      </ScrollView>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  hero: {
    width: width - 48,
    height: (width - 48) * 0.5,
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
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.text,
  },
  item: {
    fontSize: 18,
    color: Colors.light.text,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
});
