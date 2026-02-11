import React, { useCallback, useEffect, useRef } from 'react';

import { Colors } from '@/constants/Colors';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface Artist {
  name: string;
  time: string;
  image: string;
  description?: string;
}

interface Props {
  visible: boolean;
  artist: Artist | null;
  onClose: () => void;
}

export default function ArtistDetailModal({ visible, artist, onClose }: Props) {
  const screenHeight = Dimensions.get('window').height;

  // 1) panY for the slide
  const panY = useRef(new Animated.Value(screenHeight)).current;

  // 2) backdropOpacity for the fade
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // On open: slide up AND fade in backdrop
  useEffect(() => {
    if (visible) {
      panY.setValue(screenHeight);
      backdropOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(panY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, panY, backdropOpacity, screenHeight]);

  // close: slide down + fade out
  const closeModal = useCallback(() => {
    Animated.parallel([
      Animated.timing(panY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, [panY, backdropOpacity, screenHeight, onClose]);

  // panResponder for swipe-down
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) panY.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 80) closeModal();
        else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!artist) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType='none'
      onRequestClose={closeModal}
    >
      {/* fade-in/fade-out backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        {/* sliding panel */}
        <Animated.View
          style={[styles.modal, { transform: [{ translateY: panY }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.indicator} />
          <View style={styles.content}>
            <Image source={{ uri: artist.image }} style={styles.image} />
            <Text style={styles.name}>{artist.name}</Text>
            <Text style={styles.time}>{artist.time}</Text>
            {artist.description && (
              <Text style={styles.desc}>{artist.description}</Text>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    height: '70%',
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 8,
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 8,
    color: '#fff',
  },
  time: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
  desc: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Poppins_400Regular',
    color: '#fff',
  },
});
