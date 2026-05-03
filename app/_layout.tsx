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
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { AppState, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const appTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: '#000',
      card: '#000',
    },
  };
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Sofachrome: require('../assets/fonts/Sofachrome-Rg.otf'),
    SofachromeIt: require('../assets/fonts/Sofachrome-Rg-It.otf'),
    Futura: require('../assets/fonts/FuturaCyrillicMedium.ttf'),
    FuturaBold: require('../assets/fonts/FuturaCyrillicBold.ttf'),
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
  const [, setAppStateSnapshot] = useState<AppStateType>({});
  const [notificationToken, setNotificationToken] = useState<string | null>(
    null
  );
  const [, setRemoteConfig] = useState<Config | null>(null);

  const reload = async () => {
    if (!notificationToken) {
      const token = await registerForPushNotifications();
      if (token) {
        setNotificationToken(token);
      }
    }
    const { config: nextConfig } = await getConfig();
    if (nextConfig) {
      setRemoteConfig(nextConfig);
    }
  };

  useEffect(() => {
    void reload();

    const appStateSub = AppState.addEventListener('change', (newState) => {
      setAppStateSnapshot((prev) => ({ ...prev, state: newState }));
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

    void init();
    return () => appStateSub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fonts gate + push/config bootstrap; reload uses latest state via setters
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
        <ThemeProvider value={appTheme}>
          <Drawer
            drawerContent={(props) => (
              <View style={styles.drawerContentRoot}>
                <DrawerContentScrollView
                  {...props}
                  contentContainerStyle={styles.drawerScrollContent}
                >
                  <DrawerItemList {...props} />
                </DrawerContentScrollView>

                <View pointerEvents='none' style={styles.drawerRacingStripe}>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <View
                      key={`drawer-stripe-${i}`}
                      style={[
                        styles.drawerRacingStripeSegment,
                        {
                          backgroundColor: i % 2 === 0 ? '#D62828' : '#F4F4F4',
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}
            screenOptions={({ route }) => ({
              headerShown: false,
              drawerType: 'slide',
              drawerActiveTintColor: Colors.light.tint,
              drawerInactiveTintColor: Colors.light.tabIconDefault,
              drawerItemStyle: {
                paddingLeft: 12,
                paddingVertical: 0,
                marginRight: 12,
                marginVertical: 8,
                minHeight: 52,
                justifyContent: 'center',
              },
              drawerStyle: {
                width: '80%',
                backgroundColor: '#858687',
              },
              drawerLabelStyle: {
                color: '#000',
                fontSize: 20,
                fontFamily: 'Futura',
                textTransform: 'none',
                marginVertical: 0,
                includeFontPadding: false,
              },
              // disable drawer-swipe whenever route.name is in our list
              swipeEnabled: !DISABLED_SWIPE_ROUTES.includes(route.name),
            })}
          >
            {/* <Drawer.Screen
              name='(tabs)'
              options={{
                drawerLabel: 'Home',
                title: 'Home',
                drawerItemStyle: { display: 'none' },
                drawerIcon: ({ color }) => (
                  <FontAwesome6
                    name='house-chimney'
                    size={20}
                    color='#FFEB3B'
                  />
                ),
              }}
            /> */}

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
                  <FontAwesome6 name='bullhorn' size={20} color='#FFEB3B' />
                ),
              }}
            />
            <Drawer.Screen
              name='lineup'
              options={{
                title: 'Lineup',
                drawerItemStyle: { display: 'none' },
              }}
            />
            <Drawer.Screen
              name='food-trucks'
              options={{
                title: 'Food Trucks',
                drawerIcon: ({ color }) => (
                  <FontAwesome6 name='utensils' size={20} color='#FFEB3B' />
                ),
              }}
            />
            {/* <Drawer.Screen
              name='carousel-tickets'
              options={{
                title: 'Carousel Tickets',
                drawerItemStyle: { display: 'none' },
                drawerIcon: ({ color }) => (
                  <FontAwesome6
                    name='ticket-simple'
                    size={20}
                    color='#FFEB3B'
                  />
                ),
              }}
            /> */}
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
            {/* <Drawer.Screen
              name='swsh'
              options={{
                title: 'Photo Album',
                drawerItemStyle: { display: 'none' },
                drawerIcon: ({ color }) => (
                  <FontAwesome6 name='camera' size={20} color='#FFEB3B' />
                ),
              }}
            /> */}

            <Drawer.Screen
              name='smart-dillo'
              options={{
                title: 'Smart Dillo',
                drawerIcon: ({ color }) => (
                  <FontAwesome6 name='shield' size={20} color='#FFEB3B' />
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
                  <FontAwesome6 name='circle-info' size={20} color='#FFEB3B' />
                ),
              }}
            />
            <Drawer.Screen
              name='socials'
              options={{
                title: 'Socials',
                drawerIcon: ({ color }) => (
                  <FontAwesome6 name='share-nodes' size={20} color='#FFEB3B' />
                ),
              }}
            />
            <Drawer.Screen
              name='products'
              options={{
                drawerLabel: 'Dillo Store',
                title: 'Products',
                drawerIcon: ({ color }) => (
                  <FontAwesome6 name='bag-shopping' size={20} color='#FFEB3B' />
                ),
              }}
            />
            <Drawer.Screen
              name='sponsors'
              options={{
                title: 'Sponsors',
                drawerIcon: ({ color }) => (
                  <FontAwesome6 name='handshake' size={20} color='#FFEB3B' />
                ),
              }}
            />
            <Drawer.Screen
              name='racing-game'
              options={{
                title: 'Racing game',
                drawerItemStyle: { display: 'none' },
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
          <StatusBar style='light' />
        </ThemeProvider>
      </ConfigContextProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContentRoot: {
    flex: 1,
    position: 'relative',
  },
  drawerScrollContent: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingRight: 16,
  },
  drawerRacingStripe: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 8,
    flexDirection: 'column',
  },
  drawerRacingStripeSegment: {
    flex: 1,
    width: '100%',
  },
});
