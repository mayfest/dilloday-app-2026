import React, { useCallback, useEffect, useRef } from 'react';

import { Colors } from '@/constants/Colors';
import { FontAwesome6 } from '@expo/vector-icons';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  const modalHeight = screenHeight * 0.7;

  const panY = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Animate in/out on visible change
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
    ]).start(onClose);
  }, [panY, backdropOpacity, screenHeight, onClose]);

  // Only the small handle lets you drag down
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
      <View style={styles.container}>
        {/* backdrop — catches taps outside modal */}
        <Pressable style={styles.backdropTouchable} onPress={closeModal}>
          <Animated.View
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          />
        </Pressable>

        {/* sliding modal */}
        <Animated.View
          style={[
            styles.modal,
            {
              height: modalHeight,
              transform: [{ translateY: panY }],
            },
          ]}
        >
          {/* navigation bar with CLOSE button */}
          <View style={styles.navigationBar}>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={closeModal}
            >
              <Text style={styles.navigationButtonText}>CLOSE</Text>
              <FontAwesome6 name='xmark' size={16} color='#FFFFFF' />
            </TouchableOpacity>
          </View>

          {/* scrollable content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <Image source={{ uri: artist.image }} style={styles.image} />
            <Text style={styles.name}>{artist.name}</Text>
            <Text style={styles.time}>{artist.time}</Text>
            {artist.description && (
              <Text style={styles.desc}>{artist.description}</Text>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdropTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  navigationBar: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    padding: 8,
    backgroundColor: Colors.light.background,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  navigationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
    fontWeight: '400',
  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    alignItems: 'center',
    paddingTop: 0,
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
