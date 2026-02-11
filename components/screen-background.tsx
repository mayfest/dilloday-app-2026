import { useEffect, useState } from 'react';

import { Asset } from 'expo-asset';
import { StyleSheet, View } from 'react-native';

export default function ScreenBackground() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const preloadImage = async () => {
      try {
        await Asset.fromModule(
          require('../assets/images/off-white.png')
        ).downloadAsync();
        setIsImageLoaded(true);
      } catch (error) {
        console.error('Error preloading image:', error);
        setIsImageLoaded(true);
      }
    };

    preloadImage();
  }, []);

  return (
    <View style={styles.backgroundImage}>
      {/* <Image
        source={require('../assets/images/off-white.png')}
        style={styles.image}
        resizeMode='cover'
        defaultSource={require('../assets/images/off-white.png')}
        onLoad={() => setIsImageLoaded(true)}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
    backgroundColor: '#faefde',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
