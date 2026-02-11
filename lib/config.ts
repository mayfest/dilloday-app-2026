import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { AppStateStatus } from 'react-native';

import { db } from './app';
import { Artists } from './artist';
import { Home } from './home';
import { Schedule } from './schedule';
import { SocialConfig } from './social';
import { UserState } from './user';

export { useConfig } from '@/app/contexts/config-context';

export interface Config {
  home: Home;
  artists: Artists;
  schedule: Schedule;
  social: SocialConfig;
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
    const configDoc = await getDoc(doc(db, 'config', 'config'));

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
