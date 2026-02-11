import { useEffect } from 'react';

import { CartProvider } from '@/app/contexts/cart-context';
import { ConfigContextProvider } from '@/app/contexts/config-context';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConfigContextProvider>
        <CartProvider>
          <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
          >
            <Drawer
              screenOptions={{
                headerShown: false,
                drawerType: 'front',
                drawerActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                drawerInactiveTintColor:
                  Colors[colorScheme ?? 'light'].tabIconDefault,
                drawerItemStyle: { paddingLeft: 12 },
                drawerStyle: {
                  paddingTop: 40,
                  width: '80%',
                  backgroundColor: Colors[colorScheme ?? 'light'].background,
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
                      color={color}
                    />
                  ),
                }}
              />
              <Drawer.Screen
                name='products'
                options={{
                  drawerLabel: 'Products',
                  title: 'Products',
                  drawerIcon: ({ color }) => (
                    <FontAwesome6 name='bag-shopping' size={20} color={color} />
                  ),
                }}
              />

              <Drawer.Screen
                name='product/[id]'
                options={{
                  drawerItemStyle: { display: 'none' },
                }}
              />

              <Drawer.Screen
                name='product/cart'
                options={{
                  drawerItemStyle: { display: 'none' },
                }}
              />

              <Drawer.Screen
                name='(drawer)/product/[id]'
                options={{
                  drawerItemStyle: { display: 'none' },
                }}
              />

              <Drawer.Screen
                name='announcements'
                options={{
                  title: 'Announcements',
                  drawerIcon: ({ color }) => (
                    <FontAwesome6 name='bullhorn' size={20} color={color} />
                  ),
                }}
              />

              <Drawer.Screen
                name='activites'
                options={{
                  title: 'Activities',
                  drawerIcon: ({ color }) => (
                    <FontAwesome6 name='street-view' size={20} color={color} />
                  ),
                }}
              />

              <Drawer.Screen
                name='games'
                options={{
                  title: 'Games',
                  drawerIcon: ({ color }) => (
                    <FontAwesome6 name='gamepad' size={20} color={color} />
                  ),
                }}
              />

              <Drawer.Screen
                name='settings'
                options={{
                  title: 'Settings',
                  drawerIcon: ({ color }) => (
                    <FontAwesome6 name='gear' size={20} color={color} />
                  ),
                }}
              />

              <Drawer.Screen
                name='swsh'
                options={{
                  title: 'Photo Album',
                  drawerIcon: ({ color }) => (
                    <FontAwesome6 name='camera' size={20} color={color} />
                  ),
                }}
              />

              <Drawer.Screen
                name='food-trucks'
                options={{
                  title: 'Food Trucks',
                  drawerIcon: ({ color }) => (
                    <FontAwesome6 name='utensils' size={20} color={color} />
                  ),
                }}
              />

              <Drawer.Screen
                name='food-trucks/[id]'
                options={{
                  drawerItemStyle: { display: 'none' },
                }}
              />

              <Drawer.Screen
                name='faq'
                options={{
                  title: 'FAQ',
                  drawerIcon: ({ color }) => (
                    <FontAwesome6 name='circle-info' size={20} color={color} />
                  ),
                }}
              />

              <Drawer.Screen
                name='socials'
                options={{
                  title: 'Socials',
                  drawerIcon: ({ color }) => (
                    <FontAwesome6 name='share-nodes' size={20} color={color} />
                  ),
                }}
              />

              <Drawer.Screen
                name='smart-dillo'
                options={{
                  title: 'Smart Dillo',
                  drawerIcon: ({ color }) => (
                    <FontAwesome6 name='shield' size={20} color={color} />
                  ),
                }}
              />

              <Drawer.Screen
                name='sponsors'
                options={{
                  title: 'Sponsors',
                  drawerIcon: ({ color }) => (
                    <FontAwesome6 name='handshake' size={20} color={color} />
                  ),
                }}
              />

              <Drawer.Screen
                name='artist'
                options={{
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
            <StatusBar style='auto' />
          </ThemeProvider>
        </CartProvider>
      </ConfigContextProvider>
    </GestureHandlerRootView>
  );
}
