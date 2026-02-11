import React, { useEffect, useRef, useState } from 'react';

import StackScreen from '@/components/stack-screen';
import { Colors } from '@/constants/Colors';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { smartDilloImages } from '../constants/smart-dillo-links';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.9;
const SIDE_PADDING = (width - ITEM_WIDTH) / 2;

export default function SmartDilloScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const dotPosition = Animated.divide(scrollX, ITEM_WIDTH);

  useEffect(() => {
    if (!autoplay) return;
    const iv = setInterval(() => {
      const next = (currentIndex + 1) % smartDilloImages.length;
      setCurrentIndex(next);
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
    }, 5000);
    return () => clearInterval(iv);
  }, [currentIndex, autoplay]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
    setCurrentIndex(newIndex);
  };

  const openLink = async () => {
    const url =
      'https://www.northwestern.edu/wellness/hpaw/campaigns/smart-dillo/index.html';
    if (await Linking.canOpenURL(url)) await Linking.openURL(url);
  };

  const renderItem = ({ item }) => (
    <View style={styles.slideContainer}>
      <Image
        source={{ uri: item.src }}
        style={styles.slideImage}
        resizeMode='contain'
      />
    </View>
  );

  return (
    <StackScreen>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Smart Dillo</Text>
        <Text style={styles.sectionTitleText}>
          Be Smart. Be Safe. Be Responsible.
        </Text>
        <FlatList
          ref={flatListRef}
          data={smartDilloImages}
          renderItem={renderItem}
          keyExtractor={(_, i) => i.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          decelerationRate='fast'
          snapToInterval={ITEM_WIDTH}
          snapToAlignment='start'
          onScroll={handleScroll}
          onScrollBeginDrag={() => setAutoplay(false)}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          contentContainerStyle={styles.carouselContentContainer}
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
          })}
          initialScrollIndex={0}
        />

        <View style={styles.dotsContainer}>
          {smartDilloImages.map((_, i) => {
            const opacity = dotPosition.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            const size = dotPosition.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [4, 6, 4],
              extrapolate: 'clamp',
            });
            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setAutoplay(false);
                  setCurrentIndex(i);
                  flatListRef.current?.scrollToIndex({
                    index: i,
                    animated: true,
                  });
                }}
                style={styles.dotButton}
              >
                <Animated.View
                  style={[styles.dot, { opacity, width: size, height: size }]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.description}>
          In conjunction with Northwestern's student-run end of year music
          festival, Dillo Day, the Smart Dillo campaign provides guidance on
          creating a safe community and enjoyable experience for everyone
          throughout the day.
        </Text>

        <TouchableOpacity onPress={openLink}>
          <Text style={styles.link}>
            Learn more about the Smart Dillo campaign
          </Text>
        </TouchableOpacity>
      </View>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.light.action,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },

  sectionTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.action,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },

  carouselContentContainer: {
    paddingHorizontal: SIDE_PADDING,
  },
  slideContainer: {
    width: ITEM_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: '100%',
    height: width * 1.1,
    borderRadius: 8,
  },

  dotsContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  dotButton: { padding: 3 },
  dot: {
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#331d58',
    backgroundColor: '#4e2a84',
    marginHorizontal: 2,
  },

  description: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.light.text,
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  link: {
    fontSize: 16,
    color: '#4e2a84',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
