// lib/food-trucks.ts
import { doc, getDoc } from 'firebase/firestore';

import { db } from './app';

export interface FoodMenuItem {
  item: string;
  price: string;
}

// Firestore path: collection "config", document "config-2025"
const MENUS_COLLECTION = 'config';
const MENUS_DOC = 'config-2025';
const MENUS_FIELD = 'food_truck_menus';

async function fetchRawMenusMap(): Promise<
  Record<string, Record<string, string>>
> {
  const snap = await getDoc(doc(db, MENUS_COLLECTION, MENUS_DOC));
  if (!snap.exists()) {
    console.warn(`No document at ${MENUS_COLLECTION}/${MENUS_DOC}`);
    return {};
  }
  const data = snap.data();
  // unwrap the map field
  return (data[MENTION_FIELD] as Record<string, Record<string, string>>) || {};
}

export async function getFoodTruckMenu(id: string): Promise<FoodMenuItem[]> {
  const raw = await fetchRawMenusMap();
  const mapForTruck = raw[id];
  if (!mapForTruck || typeof mapForTruck !== 'object') {
    return [];
  }
  return Object.entries(mapForTruck).map(([item, price]) => ({
    item,
    price: `$${parseFloat(price).toFixed(2)}`,
  }));
}
