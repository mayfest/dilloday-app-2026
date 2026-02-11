import React, { useEffect, useRef } from 'react';

import { theme, toastConfig } from '@/lib/theme';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

interface ScreenProps {
  children?: React.ReactNode;
  closeRoute?: string;
}

export default function ModalScreen({ children, closeRoute }: ScreenProps) {
  const router = useRouter();
  const { height } = Dimensions.get('window');
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (closeRoute) {
        router.replace(closeRoute);
      } else {
        router.back();
      }
    });
  };

  return (
    <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
      <TouchableOpacity
        style={styles.backgroundOverlay}
        activeOpacity={1}
        onPress={handleClose}
      />

      <Animated.View
        style={[
          styles.modalContent,
          {
            maxHeight: height * 0.7,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.modalHandle} />

        <View style={styles.navigationBar}>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={handleClose}
          >
            <Text style={styles.navigationButtonText}>CLOSE</Text>
            <FontAwesome6
              name='xmark'
              size={16}
              color={theme.socialModalText}
            />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          {children}
        </ScrollView>

        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        <Toast topOffset={32} config={toastConfig} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: theme.socialModalBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    zIndex: 1,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  navigationBar: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 8,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  navigationButtonText: {
    color: theme.socialModalText,
    fontSize: 16,
    marginRight: 8,
    fontFamily: theme.bodyBold,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
