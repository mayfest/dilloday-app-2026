import { useEffect } from 'react';

import Layout from '@/components/root-layout';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
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
      {/* <CartProvider>
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
              drawerItemStyle: { paddingLeft: 16 },
              drawerStyle: {
                paddingTop: 40,
                width: '70%',
                backgroundColor: Colors[colorScheme ?? 'light'].background,
              },
            }}
          >
            <Drawer.Screen
              name='(drawer)'
              options={{
                drawerLabel: 'Settings',
                title: 'Settings',
                drawerIcon: () => null,
              }}
            />
            <Drawer.Screen
              name='(tabs)'
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
      </CartProvider> */}
      <Layout />
    </GestureHandlerRootView>
  );
}
