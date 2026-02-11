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
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const REEL_SIZE = 480;
const CENTER = REEL_SIZE / 2;
const IMAGE_WIDTH = 96;
const IMAGE_HEIGHT = 128;
const RADIUS = CENTER - 80;

const images = [
  'https://picsum.photos/200?1',
  'https://picsum.photos/200?2',
  'https://picsum.photos/200?3',
  'https://picsum.photos/200?4',
  'https://picsum.photos/200?5',
  'https://picsum.photos/200?6',
  'https://picsum.photos/200?7',
  'https://picsum.photos/200?8',
  'https://picsum.photos/200?9',
  'https://picsum.photos/200?10',
];

export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();
  const rotation = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      rotation.value += event.translationX / 200;
    },
    onEnd: (event) => {
      rotation.value = withDecay({
        velocity: event.velocityX / 1000,
        deceleration: 0.995,
      });
    },
  });

  const rotatingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}rad` }],
  }));

  return (
    <View
      className='flex-1 bg-[#ffffff] items-center'
      style={{ paddingTop: insets.top }}
    >
      <View className='mt-10 w-[480px] h-[480px] items-center justify-center relative'>
        {/* Reel Rotation Layer */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[StyleSheet.absoluteFill, rotatingStyle]}>
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

        {/* Background Red Circle */}
        <View className='absolute w-[480px] h-[480px] rounded-full bg-red-800' />

        {/* Inner Circle with Balloon */}
        <View className='w-[216px] h-[216px] rounded-full bg-red-900 items-center justify-center z-10 absolute'>
          <View className='w-[200px] h-[200px] rounded-full bg-white items-center justify-center'>
            <BalloonLogo width={168} height={168} />
          </View>
        </View>
      </View>

      {/* Upload Button */}
      <TouchableOpacity
        className='mt-10 bg-yellow-300 px-6 py-3 rounded-xl'
        onPress={() =>
          Linking.openURL('https://www.joinswsh.com/album/pg5rftklzxfb')
        }
      >
        <Text className='text-black font-bold'>
          Add your Dillo Day pics to Swsh!
        </Text>
      </TouchableOpacity>

      <StatusBar style='dark' />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
  },
});
