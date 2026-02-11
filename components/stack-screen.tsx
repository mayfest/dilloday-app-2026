import React from 'react';

import GlobalNavivationWrapper from '@/components/navigation/navigation-bar';
import { Colors } from '@/constants/Colors';
import { FontAwesome6 } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface StackScreenProps {
  children?: React.ReactNode;
  hideNavBar?: boolean;
  banner?: React.ReactNode;
}

export default function StackScreen({
  children,
  hideNavBar = true,
  banner,
}: StackScreenProps) {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  const handleGoBack = () => {
    if (canGoBack) {
      navigation.dispatch(CommonActions.goBack());
    }
  };

  return (
    <GlobalNavivationWrapper hideNavBar={hideNavBar}>
      <View style={styles.container}>
        <SafeAreaView style={styles.screen}>
          <View style={styles.headerRow}>
            <View style={styles.backButtonContainer}>
              {canGoBack && (
                <TouchableOpacity
                  style={styles.navigationButton}
                  onPress={handleGoBack}
                >
                  <FontAwesome6
                    name='chevron-left'
                    size={16}
                    color={Colors.light.background}
                  />
                  <Text style={styles.navigationButtonText}>BACK</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.centerSpacer} />
            <View style={styles.backButtonContainer} />
          </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButtonContainer: {
    width: 80,
  },
  centerSpacer: {
    flex: 1,
  },
  bannerRow: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});
