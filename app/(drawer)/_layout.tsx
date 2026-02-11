import TabBar from '@/components/navigation/tab-bar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { View } from 'react-native';

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  const routes = [
    { key: 'announcements', name: 'announcements' },
    { key: 'schedule', name: 'schedule' },
    { key: 'index', name: 'index' },
    { key: 'map', name: 'map' },
    { key: 'information', name: 'information' },
  ];

  const handleNavigation = (name: string) => {
    switch (name) {
      case 'index':
        router.push('/(tabs)/');
        break;
      case 'settings':
        router.push('/(drawer)/settings');
        break;
      case 'products':
        router.push('/(drawer)/products');
        break;
      case 'cart':
        router.push('/(drawer)/cart');
        break;
      default:
        router.push(`/(tabs)/${name}`);
    }
  };

  const navigation = {
    emit: ({
      type,
      target,
      canPreventDefault,
    }: {
      type: string;
      target?: string;
      canPreventDefault?: boolean;
    }) => ({
      defaultPrevented: false,
      preventDefault: () => {},
      type: type,
      target: target,
      canPreventDefault: canPreventDefault ?? true,
    }),
    navigate: (name: string) => {
      handleNavigation(name);
    },
    setParams: () => {},
    jumpTo: (name: string) => {
      handleNavigation(name);
    },
    goBack: () => {
      router.back();
    },
    isFocused: () => true,
    getParent: () => null,
    getState: () => ({
      routes,
      index: -1,
      key: 'drawer-tab-state',
      routeNames: routes.map((r) => r.name),
      stale: false,
      type: 'tab',
    }),
  };

  return (
    <View style={{ flex: 1 }}>
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
          name='products'
          options={{
            drawerLabel: 'Products',
            title: 'Products',
          }}
        />

        <Drawer.Screen
          name='settings'
          options={{
            drawerLabel: 'Settings',
            title: 'Settings',
          }}
        />
      </Drawer>
      <TabBar
        state={{
          routes,
          index: -1,
          key: 'drawer-tab-state',
          routeNames: routes.map((r) => r.name),
          stale: false,
          type: 'tab',
        }}
        navigation={navigation as any}
        icons={{
          announcements: 'bullhorn',
          schedule: 'calendar',
          index: 'house-chimney',
          map: 'map',
          information: 'circle-info',
          explore: 'compass',
          settings: 'gear',
          products: 'shopping-bag',
        }}
      />
    </View>
  );
}
