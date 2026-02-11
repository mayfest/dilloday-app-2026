import React, { useEffect } from 'react';

import TabScreen from '@/components/tab-screen';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function MoreScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const parentNavigation = navigation.getParent();

    if (parentNavigation) {
      parentNavigation.dispatch(DrawerActions.openDrawer());
      const unsubscribe = navigation.addListener('focus', () => {
        parentNavigation.dispatch(DrawerActions.openDrawer());
      });
      return unsubscribe;
    }
    return;
  }, [navigation]);

  return (
    <TabScreen>
      <View style={styles.container}>
        {/* This screen content will be covered by the drawer when it opens */}
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
