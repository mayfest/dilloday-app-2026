import { useEffect, useState } from 'react';

import { Colors } from '@/constants/Colors';
import ConfigContextProvider from '@/contexts/config-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AppState as AppStateType, Config, getConfig } from '@/lib/config';
import { registerForPushNotifications } from '@/lib/notifications';
import { Cabin_400Regular } from '@expo-google-fonts/cabin';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Rye_400Regular } from '@expo-google-fonts/rye';
import {
  SofiaSans_400Regular,
  SofiaSans_500Medium,
  SofiaSans_700Bold,
  SofiaSans_800ExtraBold,
} from '@expo-google-fonts/sofia-sans';
import {
  SofiaSansCondensed_400Regular,
  SofiaSansCondensed_600SemiBold,
  SofiaSansCondensed_700Bold,
  SofiaSansCondensed_800ExtraBold,
  SofiaSansCondensed_900Black,
} from '@expo-google-fonts/sofia-sans-condensed';
import { FontAwesome6 } from '@expo/vector-icons';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Rye_400Regular,
    Poppins_400Regular,
    Cabin_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
    Poppins_600SemiBold,
    SofiaSans_400Regular,
    SofiaSansCondensed_400Regular,
    SofiaSansCondensed_700Bold,
    SofiaSansCondensed_800ExtraBold,
    SofiaSansCondensed_900Black,
    SofiaSans_500Medium,
    SofiaSans_700Bold,
    SofiaSans_800ExtraBold,
    SofiaSansCondensed_600SemiBold,
  });
  const [state, setState] = useState<AppStateType>({});
  const [notificationToken, setNotificationToken] = useState<string | null>(
    null
  );
  const [config, setConfig] = useState<Config | null>(null);

  const reload = async () => {
    if (!notificationToken) {
      const token = await registerForPushNotifications();
      if (token) {
        setNotificationToken(token);
      }
    }
    const { config } = await getConfig();
    if (config) {
      setConfig(config);
    }
  };

  useEffect(() => {
    reload();

    const changeEvent = AppState.addEventListener('change', (newState) => {
      setState((prev) => ({ ...prev, state: newState }));
    });

    const init = async () => {
      if (loaded) {
        SplashScreen.hideAsync();
      }

      const token = await registerForPushNotifications();
      if (token) {
        setNotificationToken(token);
        // console.log('Notification Token:', token); // Optional: For debugging
      }
    };

    init();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const DISABLED_SWIPE_ROUTES = [
    'product/[id]',
    'food-trucks/[id]',
    'sponsors/[id]',
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConfigContextProvider>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <Drawer
            screenOptions={({ route }) => ({
              headerShown: false,
              drawerType: 'slide',
              drawerActiveTintColor: Colors.light.tint,
              drawerInactiveTintColor: Colors.light.tabIconDefault,
              drawerItemStyle: {
                paddingLeft: 12,
                paddingVertical: 8,
              },
              drawerStyle: {
                paddingTop: 40,
                width: '80%',
                backgroundColor: Colors.light.background,
              },
              drawerLabelStyle: {
                color: '#fff',
                fontSize: 20,
                fontFamily: 'Poppins_500Medium',
              },
              // disable drawer-swipe whenever route.name is in our list
              swipeEnabled: !DISABLED_SWIPE_ROUTES.includes(route.name),
            })}
          >
            <Drawer.Screen
              name='(tabs)'
              options={{
                drawerLabel: 'Home',
                title: 'Home',
                drawerIcon: ({ color }) => (
                  <FontAwesome6
                    name='house-chimney'
                    size={20}
                    color={Colors.light.tint}
                  />
                ),
              }}
            />

            {/* <Drawer.Screen
              name='product/[id]'
              options={{
                drawerItemStyle: { display: 'none' },
              }}
            /> */}

            <Drawer.Screen
              name='announcements'
              options={{
                title: 'Announcements',
                drawerIcon: ({ color }) => (
                  <FontAwesome6
                    name='bullhorn'
                    size={20}
                    color={Colors.light.tint}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name='food-trucks'
              options={{
                title: 'Food Trucks',
                drawerIcon: ({ color }) => (
                  <FontAwesome6
                    name='utensils'
                    size={20}
                    color={Colors.light.tint}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name='carousel-tickets'
              options={{
                title: 'Carousel Tickets',
                drawerIcon: ({ color }) => (
                  <FontAwesome6
                    name='ticket-simple'
                    size={20}
                    color={Colors.light.tint}
                  />
                ),
              }}
            />
            {/* <Drawer.Screen
              name='activities'
              options={{
                title: 'Sponsor Booths',
                drawerIcon: ({ color }) => (
                  <FontAwesome6
                    name='street-view'
                    size={20}
                    color={Colors.light.tint}
                  />
                ),
              }}
            /> */}
            <Drawer.Screen
              name='swsh'
              options={{
                title: 'Photo Album',
                drawerIcon: ({ color }) => (
                  <FontAwesome6
                    name='camera'
                    size={20}
                    color={Colors.light.tint}
                  />
                ),
              }}
            />

            <Drawer.Screen
              name='smart-dillo'
              options={{
                title: 'Smart Dillo',
                drawerIcon: ({ color }) => (
                  <FontAwesome6
                    name='shield'
                    size={20}
                    color={Colors.light.tint}
                  />
                ),
              }}
            />
            {/* <Drawer.Screen
              name='food-trucks/[id]'
              options={{
                drawerItemStyle: { display: 'none' },
              }}
            /> */}

            <Drawer.Screen
              name='faq'
              options={{
                title: 'FAQ',
                drawerIcon: ({ color }) => (
                  <FontAwesome6
                    name='circle-info'
                    size={20}
                    color={Colors.light.tint}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name='socials'
              options={{
                title: 'Socials',
                drawerIcon: ({ color }) => (
                  <FontAwesome6
                    name='share-nodes'
                    size={20}
                    color={Colors.light.tint}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name='products'
              options={{
                drawerLabel: 'Dillo Store',
                title: 'Products',
                drawerIcon: ({ color }) => (
                  <FontAwesome6
                    name='bag-shopping'
                    size={20}
                    color={Colors.light.tint}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name='sponsors'
              options={{
                title: 'Sponsors',
                drawerIcon: ({ color }) => (
                  <FontAwesome6
                    name='handshake'
                    size={20}
                    color={Colors.light.tint}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name='+not-found'
              options={{
                drawerItemStyle: { display: 'none' },
                title: '404',
              }}
            />
          </Drawer>
          <StatusBar style='auto' />
        </ThemeProvider>
      </ConfigContextProvider>
    </GestureHandlerRootView>
  );
}
