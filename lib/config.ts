import { createContext, useContext } from 'react';

import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { AppStateStatus } from 'react-native';

import { db } from './app';
import { Artists } from './artist';
import { Home } from './home';
import { Schedule } from './schedule';
import { SocialConfig } from './social';
import { UserState } from './user';

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
  const configDoc = await getDoc(doc(db, 'config', 'config'));
  if (!configDoc.exists()) {
    throw new Error('config does not exist');
  }

  const config = configDoc.data() as Config;
  return { config };
}

export interface ConfigContextObject {
  config: Config | null;
  state: AppState;
  user: User | null;
  userState: UserState | null;
  reload: () => Promise<void>;
  updateUserState: (state?: UserState) => Promise<void>;
}

export const ConfigContext = createContext<ConfigContextObject>(
  {} as ConfigContextObject
);

export const ConfigProvider = ConfigContext.Provider;

export const useConfig = () => useContext(ConfigContext);
