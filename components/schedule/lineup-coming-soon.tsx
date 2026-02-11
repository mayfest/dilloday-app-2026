import React, { useEffect, useRef, useState } from 'react';

import MyDynamicSvg from '@/components/schedule/fmo-stage-ticket';
import MainStageTicket from '@/components/schedule/main-stage-ticket';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Animated,
  BackHandler,
  Dimensions,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LineupComingSoonModal({ visible, onClose }) {
  // Get screen dimensions and track changes
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const router = useRouter();

  // Animation value for the modal's position
  const panY = useRef(new Animated.Value(0)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  // Reset the position when the modal becomes visible
  useEffect(() => {
    if (visible) {
      resetPosition();
    }
  }, [visible]);

  const resetPosition = () => {
    Animated.spring(panY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  // Setup pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Only allow downward swipes
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // If swipe distance is greater than threshold, close the modal
        if (gestureState.dy > 50) {
          closeModal();
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const closeModal = () => {
    // Animate the modal off-screen
    Animated.timing(panY, {
      toValue: dimensions.height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      panY.setValue(0);
      handleBackNavigation(); // Use the navigation handler instead of just onClose
    });
  };

  useEffect(() => {
    // Update dimensions on screen rotation or size change
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    // Handle hardware back button on Android
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (visible) {
          handleBackNavigation();
          return true; // Prevent default behavior
        }
        return false;
      }
    );

    return () => {
      subscription?.remove();
      backHandler.remove();
    };
  }, [visible]);

  const handleBackNavigation = () => {
    // First close the modal
    onClose();

    // Navigate to the home tab
    router.push('/(tabs)');
  };

  const { width, height } = dimensions;

  // Determine if device is iPad
  const isIpad = width >= 768;
  const isLargeDevice = !isIpad && width >= 428;

  console.log('Device info:', { width, height, isIpad, isLargeDevice });

  // Calculate responsive ticket positions based on screen size
  // Only used for non-iPad devices
  const ticketPositions = [
    {
      x: isLargeDevice ? width * 0.1 : width * 0.05,
      bottom: isLargeDevice ? height * 0.2 : height * 0.15,
      angle: -30,
      isMainStage: true,
    },
    {
      x: isLargeDevice ? width * 0.2 : width * 0.1,
      bottom: isLargeDevice ? height * 0.3 : height * 0.25,
      angle: -15,
      isMainStage: false,
    },
  ];

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={handleBackNavigation}
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[styles.modalContent, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          {/* Swipe indicator */}
          <View style={styles.swipeIndicatorContainer}>
            <View style={styles.swipeIndicator} />
          </View>

          <View style={styles.navigationBar}>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={handleBackNavigation}
            >
              <Text
                style={[
                  styles.navigationButtonText,
                  isIpad && { fontSize: 18 },
                ]}
              >
                GO BACK
              </Text>
              <FontAwesome6
                name='arrow-right'
                size={isIpad ? 18 : 16}
                color='#FFFFFF'
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.contentContainer,
              isIpad && styles.ipadContentContainer,
            ]}
          >
            <View
              style={[
                styles.textContentContainer,
                isIpad && styles.ipadTextContainer,
              ]}
            >
              <Text style={[styles.heading, isIpad && styles.ipadHeading]}>
                DILLO DAY SCHEDULE COMING SOON
              </Text>
              <Text style={[styles.comingSoonText, isIpad && styles.ipadText]}>
                The Dillo Day lineup hasn't been fully announced yet and we're
                working hard to finalize our schedule. For now, please make sure
                to follow us on Instagram at @dillo_day for the latest
                information and updates!
              </Text>

              {/* Additional iPad-only content */}
              {isIpad && (
                <View style={styles.ipadAdditionalInfo}>
                  <Text style={styles.ipadInfoText}>
                    We're excited to share the full lineup with you soon!
                  </Text>
                  <Text style={styles.ipadInfoText}>
                    Stay tuned for artist announcements and event details.
                  </Text>
                </View>
              )}
            </View>

            {/* Only render tickets on non-iPad devices */}
            {!isIpad && (
              <View style={styles.ticketsContainer}>
                {ticketPositions.map((position, index) => (
                  <View
                    key={index}
                    style={[
                      styles.ticket,
                      {
                        left: position.x,
                        bottom: position.bottom,
                        transform: [{ rotate: `${position.angle}deg` }],
                        width: isLargeDevice ? 150 : 120,
                        height: isLargeDevice ? 100 : 80,
                      },
                    ]}
                  >
                    {position.isMainStage ? (
                      <MyDynamicSvg artistName='Coming Soon' time='TBA' />
                    ) : (
                      <MainStageTicket artistName='Coming Soon' time='TBA' />
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    height: '90%',
    backgroundColor: '#173885',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
  },
  swipeIndicatorContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
  },
  swipeIndicator: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
    fontWeight: '400',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'flex-start',
  },
  ipadContentContainer: {
    justifyContent: 'center', // Center content vertically on iPad
    paddingTop: 0,
  },
  textContentContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
  ipadTextContainer: {
    maxWidth: 700,
    paddingHorizontal: 30,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  ipadHeading: {
    fontSize: 42,
    marginBottom: 30,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  ipadText: {
    fontSize: 22,
    marginHorizontal: 40,
    lineHeight: 30,
    marginBottom: 30,
  },
  ipadAdditionalInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  ipadInfoText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
    opacity: 0.8,
  },
  ticketsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  ticket: {
    position: 'absolute',
    opacity: 1,
  },
});
