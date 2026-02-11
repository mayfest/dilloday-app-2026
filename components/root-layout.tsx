import { useEffect, useState } from 'react';

import { auth, db } from '@/lib/app';
import {
  AppState as AppStateType,
  Config,
  ConfigProvider,
  getConfig,
} from '@/lib/config';
import { registerForPushNotifications } from '@/lib/notifications';
// import { toastConfig } from '@/lib/theme';
import { UserState } from '@/lib/user';
import { Stack } from 'expo-router';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { AppState } from 'react-native';

export default function Layout() {
  const [state, setState] = useState<AppStateType>({});
  const [config, setConfig] = useState<Config | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [notificationToken, setNotificationToken] = useState<string | null>(
    null
  );

  const reload = async () => {
    if (!notificationToken) {
      const token = await registerForPushNotifications();
      if (token) {
        setNotificationToken(token);
      }
    }
    const { config } = await getConfig();
    setConfig(config);

    if (!user) {
      return;
    }

    const userDoc = await getDoc(doc(db, 'users', user.email!));
    if (userDoc.exists()) {
      setUserState(userDoc.data() as UserState);
    }
  };

  const updateUserState = async (state?: UserState) => {
    if (state) {
      setUserState(state);
      return;
    }

    if (!user) {
      return;
    }

    const userDoc = await getDoc(doc(db, 'users', user.email!));
    if (userDoc.exists()) {
      setUserState(userDoc.data() as UserState);
    }
  };

  useEffect(() => {
    reload();

    const changeEvent = AppState.addEventListener('change', (newState) => {
      setState({
        ...state,
        state: newState,
      });
    });

    const interval = setInterval(
      () => {
        if (state.state === 'active') {
          reload();
        }
      },
      1000 * 60 * 2
    );

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getDoc(doc(db, 'users', user.email!)).then((userDoc) => {
          if (userDoc.exists()) {
            setUserState(userDoc.data() as UserState);
          }
          setUser(user);
        });
      } else {
        setUser(null);
        setUserState(null);
      }
    });

    return () => {
      changeEvent.remove();
      clearInterval(interval);
      authUnsubscribe();
    };
  }, []);

  return (
    <ConfigProvider
      value={{
        config,
        state,
        user,
        userState,
        reload,
        updateUserState,
      }}
    >
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='artist' options={{ headerShown: false }} />
        <Stack.Screen
          name='contact'
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name='social'
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack>
      {/* <Toast topOffset={64} config={toastConfig} /> */}
    </ConfigProvider>
  );
}
