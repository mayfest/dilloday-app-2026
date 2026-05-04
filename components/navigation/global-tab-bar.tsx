import React from 'react';

import DilloLogoHome from '@/assets/images/speedway-logo.svg';
import { FontAwesome6 } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type ValidRoutePath = '/' | '/lineup' | '/map' | '/information';

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
    { key: 'schedule', name: 'schedule', icon: 'calendar', path: '/lineup' },
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
        navigation.dispatch(DrawerActions.openDrawer());
      } catch (e) {
        console.log('Failed to open drawer:', e);

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
              route.name === 'index' && styles.homeIconContainer,
              route.name !== 'index' &&
                getIsActive(route.path) &&
                styles.activeIconContainer,
              route.name === 'index' &&
                getIsActive(route.path) &&
                styles.homeActiveIconContainer,
            ]}
          >
            {route.name === 'index' ? (
              <DilloLogoHome
                width={38}
                height={38}
                color={getIsActive(route.path) ? '#FFEB3B' : '#000000'}
                style={styles.homeLogo}
              />
            ) : (
              <FontAwesome6
                name={route.icon}
                size={22}
                color={getIsActive(route.path) ? '#FFEB3B' : '#000000'}
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
    bottom: 48,
    left: '2.5%',
    right: 0,
    backgroundColor: '#FFEB3B',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 100,
    alignItems: 'center',
    height: 60,
    width: '95%',
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
  homeIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'transparent',
  },
  homeActiveIconContainer: {
    backgroundColor: '#000000',
  },
  homeLogo: {
    marginLeft: 1,
  },
  activeIconContainer: {
    backgroundColor: '#000000',
    borderRadius: 20,
  },
});
