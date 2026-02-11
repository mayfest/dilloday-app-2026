import React, { useCallback, useEffect, useRef, useState } from 'react';

import SMARTPageBanner from '@/components/banners/SMART-banner';
import DrawerScreen from '@/components/drawer-screen';
import { Colors } from '@/constants/Colors';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const smartDilloImages = [
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-cover.png'),
    alt: 'Smart Dillo 2025 Cover',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-popcorn.png'),
    alt: 'Eat Early, Eat Often',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-hydratation.png'),
    alt: 'Stay Hydrated',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-safety.png'),
    alt: 'Stick to Your Limits with Alcohol',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-substances.png'),
    alt: 'Other Substances',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-amnesty.png'),
    alt: 'Call, Stay, Cooperate for Amnesty',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-consent.png'),
    alt: 'Consent',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-sex.png'),
    alt: 'Safer Sex',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-safety.png'),
    alt: 'Stay Off the Rocks and Roofs',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-urination.png'),
    alt: 'Public Urination',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-respect.png'),
    alt: 'Respect the Neighborhood',
  },
];

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.9;
const SIDE_PADDING = (width - ITEM_WIDTH) / 2;

const OptimizedImage = ({ source, style, alt }) => {
  // Set a shorter timeout for local images since they should load quickly
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Add this useEffect to ensure loading spinner disappears even if callbacks fail
  useEffect(() => {
    // For local images, we should set a backup timer to hide the spinner
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second backup timeout

    return () => clearTimeout(timer);
  }, []);

  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setError(false);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  return (
    <View style={[style, styles.imageWrapper]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={Colors.light.action} />
        </View>
      )}

      <Image
        source={source}
        style={[style, loading && { opacity: 0.3 }]}
        resizeMode='contain'
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        fadeDuration={100}
        accessible={true}
        accessibilityLabel={alt}
      />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load image</Text>
        </View>
      )}
    </View>
  );
};

export default function SmartDilloScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const dotPosition = Animated.divide(scrollX, ITEM_WIDTH);
  const handleMomentumScrollEnd = useCallback((e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
    setCurrentIndex(newIndex);
  }, []);

  const openLink = useCallback(async () => {
    const url =
      'https://www.northwestern.edu/wellness/hpaw/campaigns/smart-dillo/index.html';
    if (await Linking.canOpenURL(url)) await Linking.openURL(url);
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.slideContainer}>
        <OptimizedImage
          source={item.source}
          style={styles.slideImage}
          alt={item.alt}
        />
      </View>
    ),
    []
  );

  // Handle scroll events
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  useEffect(() => {
    if (!autoplay) return;

    const iv = setInterval(() => {
      const next = (currentIndex + 1) % smartDilloImages.length;
      setCurrentIndex(next);
      flatListRef.current?.scrollToIndex({
        index: next,
        animated: true,
        viewPosition: 0.5,
      });
    }, 5000);

    return () => clearInterval(iv);
  }, [currentIndex, autoplay]);

  const renderDots = useCallback(() => {
    return smartDilloImages.map((_, i) => {
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
          accessibilityLabel={`Go to slide ${i + 1}: ${smartDilloImages[i].alt}`}
        >
          <Animated.View
            style={[styles.dot, { opacity, width: size, height: size }]}
          />
        </TouchableOpacity>
      );
    });
  }, [dotPosition]);

  return (
    <DrawerScreen>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bannerWrapper}>
          <SMARTPageBanner />
        </View>

        <View style={styles.container}>
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
            // Performance optimizations
            removeClippedSubviews={true}
            maxToRenderPerBatch={3}
            windowSize={5}
            initialNumToRender={2}
          />

          <View style={styles.dotsContainer}>{renderDots()}</View>

          <Text style={styles.description}>
            In conjunction with Northwestern's student-run end of year music
            festival, Dillo Day, the Smart Dillo campaign provides guidance on
            creating a safe community and enjoyable experience for everyone
            throughout the day.
          </Text>

          <TouchableOpacity
            onPress={openLink}
            style={styles.linkButton}
            accessibilityLabel='Learn more about the Smart Dillo campaign'
            accessibilityRole='link'
          ></TouchableOpacity>
        </View>
      </ScrollView>
    </DrawerScreen>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  bannerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 15,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  sectionTitleText: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.light.action,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'Rye_400Regular',
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
  imageWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  dotButton: {
    padding: 3,
  },
  dot: {
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#331d58',
    backgroundColor: '#4e2a84',
    marginHorizontal: 2,
  },
  description: {
    fontSize: 12,
    textAlign: 'left',
    color: Colors.light.text,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    fontFamily: 'Poppins_400Regular',
  },
  linkButton: {
    marginTop: 5,
    paddingVertical: 8,
  },
  link: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: '#4e2a84',
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontFamily: 'Rye_400Regular',
    marginBottom: 80,
  },
});
