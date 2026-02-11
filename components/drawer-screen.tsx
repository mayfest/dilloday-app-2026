import GlobalNavivationWrapper from '@/components/navigation/navigation-bar';
import { Colors } from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenBackground from './screen-background';

interface StackScreenProps {
  children?: React.ReactNode;
  hideNavBar?: boolean;
  banner?: React.ReactNode;
}

export default function DrawerScreen({
  children,
  hideNavBar = false,
  banner,
}: StackScreenProps) {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  return (
    <GlobalNavivationWrapper hideNavBar={hideNavBar}>
      <View style={styles.container}>
        <ScreenBackground />
        <SafeAreaView style={styles.screen}>
          {banner && <View style={styles.bannerRow}>{banner}</View>}
          <View style={styles.content}>{children}</View>
        </SafeAreaView>
      </View>
    </GlobalNavivationWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf6f0',
  },
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  navigationButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
});
