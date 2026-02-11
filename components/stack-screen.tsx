import React from 'react';

import GlobalNavivationWrapper from '@/components/navigation/navigation-bar';
import { Colors } from '@/constants/Colors';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenBackground from './screen-background';

interface ScreenProps {
  children?: React.ReactNode;
  hideNavBar?: boolean;
}

export default function StackScreen({
  children,
  hideNavBar = false,
}: ScreenProps) {
  const router = useRouter();

  return (
    <GlobalNavivationWrapper hideNavBar={hideNavBar}>
      <View style={styles.container}>
        <ScreenBackground />
        <SafeAreaView style={styles.screen}>
          <View style={styles.navigationBar}>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() => router.back()}
            >
              <FontAwesome6
                name='chevron-left'
                size={16}
                color={Colors.light.background}
              />
              <Text style={styles.navigationButtonText}>BACK</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>{children}</View>
        </SafeAreaView>
      </View>
    </GlobalNavivationWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faefde',
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
