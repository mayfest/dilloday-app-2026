import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { AppStateStatus } from 'react-native';

import { db } from './app';
import { Artists } from './artist';
import { Home } from './home';
import { Schedule } from './schedule';
import { SocialConfig } from './social';
import { UserState } from './user';

export { useConfig } from '@/contexts/config-context';

/** One vendor from `food-trucks` array form (`name`, `image`); omit when using map form below. */
export interface FoodTruckConfigItem {
  /** Stable route id when using array form (generated from name if omitted). */
  id?: string;
  name: string;
  image: string;
}

/** Nested under each truck in map form (`food-trucks.<id>.food-truck-menu`). */
export interface FoodTruckEntryPayload extends FoodTruckConfigItem {
  'food-truck-menu'?: Record<string, string | number>;
  food_truck_menu?: Record<string, string | number>;
}

export interface Config {
  home: Home;
  artists: Artists;
  schedule: Schedule;
  social: SocialConfig;
  /**
   * Either an array of `{ name, image, id? }` (menus via top-level `food_truck_menus`), or a **map**
   * `{ "<slug>": { name, image, "food-truck-menu": { "Item": price } } }`.
   */
  food_trucks?: FoodTruckConfigItem[] | Record<string, FoodTruckEntryPayload>;
  'food-trucks'?: FoodTruckConfigItem[] | Record<string, FoodTruckEntryPayload>;
  /** Alternative: top-level `truck id → menu` (underscore / legacy keys). */
  'food-truck-menu'?: Record<string, Record<string, string | number>>;
  food_truck_menu?: Record<string, Record<string, string | number>>;
  /** @deprecated Prefer `food-truck-menu` / `food_truck_menu`. */
  food_truck_menus?: Record<string, Record<string, string | number>>;
}

export interface ConfigInformation {
  config: Config;
  offline?: boolean;
}

export interface AppState {
  state?: AppStateStatus;
}

export async function getConfig(): Promise<ConfigInformation> {
  try {
    const configDoc = await getDoc(doc(db, 'config', 'config-2026'));

    if (!configDoc.exists()) {
      console.error('Config document does not exist in Firestore');
      throw new Error('config does not exist');
    }

    const configData = configDoc.data();

    if (!configData) {
      console.error('Config document exists but has no data');
      throw new Error('config data is empty');
    }

    const config = configData as Config;
    if (!config.home || !config.artists || !config.schedule || !config.social) {
      console.warn('Config may be incomplete, missing required fields');
    }

    return { config };
  } catch (error) {
    console.error('Error fetching config:', error);
    throw error;
  }
}

export interface ConfigContextObject {
  config: Config | null;
  state: AppState;
  user: User | null;
  userState: UserState | null;
  reload: () => Promise<void>;
  updateUserState: (state?: UserState) => Promise<void>;
}
