import React from 'react';

import { StyleSheet, View } from 'react-native';

import GlobalTabBar from './global-tab-bar';

interface GlobalNavWrapperProps {
  children: React.ReactNode;
  hideNavBar?: boolean;
}

export default function GlobalNavivationWrapper({
  children,
  hideNavBar = false,
}: GlobalNavWrapperProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      {!hideNavBar && <GlobalTabBar />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    paddingBottom: 40,
  },
});
