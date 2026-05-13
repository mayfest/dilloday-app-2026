import React from 'react';

import GlobalNavivationWrapper from '@/components/navigation/navigation-bar';
import { StyleSheet, View } from 'react-native';
import {
  SafeAreaView,
  type Edge,
} from 'react-native-safe-area-context';

import ScreenBackground from './screen-background';

interface ScreenProps {
  children?: React.ReactNode;
  hideNavBar?: boolean;
  banner?: React.ReactNode;
  /** Defaults to all edges. Omit `top` when the screen draws its own top inset (e.g. map header). */
  safeAreaEdges?: Edge[];
}

export default function TabScreen({
  children,
  hideNavBar = false,
  safeAreaEdges,
}: ScreenProps) {
  return (
    <GlobalNavivationWrapper hideNavBar={hideNavBar}>
      <View style={styles.container}>
        <ScreenBackground />
        <SafeAreaView style={styles.content} edges={safeAreaEdges}>
          {children}
        </SafeAreaView>
      </View>
    </GlobalNavivationWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    // paddingBottom: 40,
  },
});
