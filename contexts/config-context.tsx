import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { auth, db } from '@/lib/app';
import {
  AppState as AppStateType,
  Config,
  ConfigContextObject,
  getConfig,
} from '@/lib/config';
import { registerForPushNotifications } from '@/lib/notifications';
import { UserState } from '@/lib/user';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { AppState } from 'react-native';

const ConfigContext = createContext<ConfigContextObject>(
  {} as ConfigContextObject
);
export const useConfig = () => useContext(ConfigContext);

interface ConfigContextProviderProps {
  children: ReactNode;
}

export default function ConfigContextProvider({
  children,
}: ConfigContextProviderProps) {
  const [state, setState] = useState<AppStateType>({});
  const [config, setConfig] = useState<Config | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [notificationToken, setNotificationToken] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = async () => {
    try {
      setLoading(true);
      if (!notificationToken) {
        try {
          const token = await registerForPushNotifications();
          if (token) {
            setNotificationToken(token);
          }
        } catch (notificationError) {
          console.error(
            'Failed to register for push notifications:',
            notificationError
          );
        }
      }
      try {
        const configInfo = await getConfig();
        setConfig(configInfo.config);
      } catch (configError) {
        console.error('Failed to load config:', configError);
      }

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.email!));
          if (userDoc.exists()) {
            setUserState(userDoc.data() as UserState);
          }
        } catch (userError) {
          console.error('Failed to load user data:', userError);
        }
      }

      setError(null);
    } catch (e) {
      console.error('Reload function failed:', e);
      setError(e instanceof Error ? e : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const updateUserState = async (state?: UserState) => {
    try {
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
    } catch (e) {
      console.error('Failed to update user state:', e);
    }
  };

  useEffect(() => {
    reload().catch((e) => {
      console.error('Initial data load failed:', e);
      setError(e instanceof Error ? e : new Error('Initial data load failed'));
      setLoading(false);
    });
    const changeEvent = AppState.addEventListener('change', (newState) => {
      setState({
        ...state,
        state: newState,
      });
    });

    // const interval = setInterval(() => {
    //   if (state.state === 'active') {
    //     reload().catch(e => console.error("Periodic reload failed:", e));
    //   }
    // }, 1000 * 60 * 2);

    const authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        getDoc(doc(db, 'users', currentUser.email!))
          .then((userDoc) => {
            if (userDoc.exists()) {
              setUserState(userDoc.data() as UserState);
            }
            setUser(currentUser);
          })
          .catch((e) => {
            console.error('Error fetching user data:', e);
            setUser(currentUser);
          });
      } else {
        setUser(null);
        setUserState(null);
      }
    });
    return () => {
      changeEvent.remove();
      // clearInterval(interval);
      authUnsubscribe();
    };
  }, []);

  return (
    <ConfigContext.Provider
      value={{
        config,
        state,
        user,
        userState,
        reload,
        updateUserState,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
