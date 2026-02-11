import React from 'react';

import GlobalNavivationWrapper from '@/components/navigation/navigation-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenBackground from './screen-background';

interface ScreenProps {
  children?: React.ReactNode;
  hideNavBar?: boolean;
}

export default function TabScreen({
  children,
  hideNavBar = false,
}: ScreenProps) {
  return (
    <GlobalNavivationWrapper hideNavBar={hideNavBar}>
      <View style={styles.container}>
        <ScreenBackground />
        <SafeAreaView style={styles.content}>{children}</SafeAreaView>
      </View>
    </GlobalNavivationWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf6f0',
  },
  content: {
    flex: 1,
    paddingBottom: 55,
  },
});
