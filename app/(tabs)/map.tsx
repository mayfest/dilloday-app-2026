import MapImage from '@/assets/images/dillo-53-map-graphic.png';
import TabScreen from '@/components/tab-screen';
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function StaticMapScreen() {
  return (
    <TabScreen>
      <View style={styles.container}>
        <Image
          source={MapImage}
          style={styles.mapImage}
          resizeMode="contain"
        />
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    height: "100%",
    alignItems: 'center',
  },
  mapImage: {
    width: width,
    height: height,
    backgroundColor: '#000',
  },
});
