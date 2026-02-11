import BalloonLogo from '@/assets/images/balloonlogopink.svg';
import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEffect, useState } from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

import { fetchSwshPhotos } from '@/lib/swsh';

const { width } = Dimensions.get('window');
const REEL_SIZE = 480;
const CENTER = REEL_SIZE / 2;
const IMAGE_WIDTH = 75;
const IMAGE_HEIGHT = 100;
const RADIUS = CENTER - 66;

// const images = [
//   'https://picsum.photos/200?1',
//   'https://picsum.photos/200?2',
//   'https://picsum.photos/200?3',
//   'https://picsum.photos/200?4',
//   'https://picsum.photos/200?5',
//   'https://picsum.photos/200?6',
//   'https://picsum.photos/200?7',
//   'https://picsum.photos/200?8',
//   'https://picsum.photos/200?9',
//   'https://picsum.photos/200?10',
// ];



export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();
  const rotation = useSharedValue(0);
  const autoRotation = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      rotation.value -= event.translationX / 800;
    },
    onEnd: (event) => {
      rotation.value = withDecay({
        velocity: -event.velocityX / 1000,
        deceleration: 0.9999,
      });
    },
  });

  //fetching images from firebase
  const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
      const loadImages = async () => {
        const urls = await fetchSwshPhotos();
        const selected = urls.sort(() => 0.5 - Math.random()).slice(0, 10);
        setImages(selected);
      };
      loadImages();
    }, []);

  // run a looping animation (360 degrees every 30 seconds)
    useEffect(() => {
    autoRotation.value = withRepeat(
      withTiming(Math.PI * 2, {
        duration: 30000, // 30s full spin
        easing: Easing.linear,
      }),
      -1 // infinite
    );
  }, []);

    const rotatingStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${rotation.value + autoRotation.value}rad` }],
    }));

  return (
    <View className="flex-1 bg-white items-center" style={{ paddingTop: insets.top }}>
      <View className="mt-10 w-[480px] h-[480px] items-center justify-center relative">

        {/*Red Circle Background FIRST */}
        <View
          style={{
            position: 'absolute',
            width: REEL_SIZE,
            height: REEL_SIZE,
            borderRadius: REEL_SIZE / 2,
            backgroundColor: '#991B1B', // red-800
            zIndex: 0,
          }}
        />

        {/* Reel Image Layer — Renders on top of red background */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: REEL_SIZE,
                height: REEL_SIZE,
                zIndex: 1,
              },
              rotatingStyle,
            ]}
          >
            {images.map((uri, index) => {
              const angle = (index / images.length) * 2 * Math.PI;
              const x = CENTER + RADIUS * Math.cos(angle) - IMAGE_WIDTH / 2;
              const y = CENTER + RADIUS * Math.sin(angle) - IMAGE_HEIGHT / 2;
              const staticRotation = (angle * 180) / Math.PI - 90;

              return (
                <Image
                  key={index}
                  source={{ uri }}
                  style={[
                    styles.image,
                    {
                      left: x,
                      top: y,
                      transform: [{ rotate: `${staticRotation}deg` }],
                    },
                  ]}
                />
              );
            })}
          </Animated.View>
        </PanGestureHandler>

        {/* Balloon Center Layer — Renders above everything since we aren't doing anything */}
        <View className="w-[216px] h-[216px] rounded-full bg-red-900 items-center justify-center z-10 absolute">
          <View className="w-[200px] h-[200px] rounded-full bg-white items-center justify-center">
            <BalloonLogo width={168} height={168} />
          </View>
        </View>
      </View>

      {/* Upload Button */}
      <TouchableOpacity
        className="mt-10 bg-yellow-300 px-6 py-3 rounded-xl"
        onPress={() =>
          Linking.openURL('https://www.joinswsh.com/album/pg5rftklzxfb')
        }
      >
        <Text className="text-black font-bold">
          Add your Dillo Day pics to Swsh!
        </Text>
      </TouchableOpacity>

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 16,
  },
});
