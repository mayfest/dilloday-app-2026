import React from 'react';

import BalloonLogo from '@/assets/images/balloonlogopink.svg';
import { FontAwesome6 } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type ValidRoutePath = '/' | '/schedule' | '/map' | '/information';

type TabRoute = {
  key: string;
  name: string;
  icon: string;
  path: ValidRoutePath | null;
};

export default function GlobalTabBar() {
  const router = useRouter();
  const navigation = useNavigation();
  const pathname = usePathname();

  const tabRoutes: TabRoute[] = [
    { key: 'more', name: 'more', icon: 'bars', path: null },
    { key: 'schedule', name: 'schedule', icon: 'calendar', path: '/schedule' },
    { key: 'index', name: 'index', icon: 'house-chimney', path: '/' },
    { key: 'map', name: 'map', icon: 'map', path: '/map' },
    {
      key: 'information',
      name: 'information',
      icon: 'circle-info',
      path: '/information',
    },
  ];

  const getIsActive = (path: ValidRoutePath | null): boolean => {
    if (!path) return false;
    return pathname === path;
  };

  const handlePress = (route: TabRoute): void => {
    if (route.name === 'more') {
      try {
        // Using the DrawerActions from @react-navigation/native
        navigation.dispatch(DrawerActions.openDrawer());
      } catch (e) {
        console.log('Failed to open drawer:', e);
        // As fallback navigate to information page
        if (route.path) {
          router.push('/information');
        }
      }
    } else if (route.path) {
      router.push(route.path);
    }
  };

  return (
    <View style={styles.container}>
      {tabRoutes.map((route) => (
        <TouchableOpacity
          key={route.key}
          style={styles.tabButton}
          onPress={() => handlePress(route)}
        >
          <View
            style={[
              styles.iconContainer,
              getIsActive(route.path) && styles.activeIconContainer,
            ]}
          >
            {route.name === 'index' ? (
              <BalloonLogo width={32} height={32} />
            ) : (
              <FontAwesome6
                name={route.icon}
                size={18}
                color={getIsActive(route.path) ? '#173885' : '#F6F2A3'}
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Styles remain the same...

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#173885',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  activeIconContainer: {
    backgroundColor: '#F6F2A3',
    borderRadius: 20,
  },
});
