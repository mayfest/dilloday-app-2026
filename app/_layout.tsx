import { useEffect, useState } from 'react';

import { Colors } from '@/constants/Colors';
import ConfigContextProvider from '@/contexts/config-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { registerForPushNotifications } from '@/lib/notifications';
import { Cabin_400Regular } from '@expo-google-fonts/cabin';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Rye_400Regular } from '@expo-google-fonts/rye';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
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
  });
  const [checked, setChecked] = useState(false);
  const [firstLaunch, setFirstLaunch] = useState(false);
  const [notificationToken, setNotificationToken] = useState<string | null>(
    null
  );
  const router = useRouter();

  // check AsyncStorage once
  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem('hasSeenOnboarding');
      if (!seen) {
        setFirstLaunch(true);
        router.replace('/onboarding/step-1');
      }
      setChecked(true);
    })();
  }, []);

  // // don’t show anything until fonts+splash are ready AND we know firstLaunch
  if (!checked || !loaded) {
    return null;
  }

  // **key change**: if firstLaunch, hand off to child routes
  if (firstLaunch) {
    return <Slot />;
  }


  useEffect(() => {
    const init = async () => {
      if (loaded) {
        SplashScreen.hideAsync();
      }

      const token = await registerForPushNotifications();
      if (token) {
        setNotificationToken(token);
        console.log('Notification Token:', token); // Optional: For debugging
      }
    };

    init();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConfigContextProvider>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <Drawer
            screenOptions={{
              headerShown: false,
              drawerType: 'slide',
              drawerActiveTintColor: Colors[colorScheme ?? 'light'].tint,
              drawerInactiveTintColor:
                Colors[colorScheme ?? 'light'].tabIconDefault,
              drawerItemStyle: {
                paddingLeft: 12,
                paddingVertical: 8,
              },
              drawerStyle: {
                paddingTop: 40,
                width: '80%',
                backgroundColor: Colors[colorScheme ?? 'light'].background,
              },
              drawerLabelStyle: {
                color: '#ffffff',
                fontSize: 20,
                fontFamily: 'Poppins_500Medium',
              },
            }}
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
            />
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
