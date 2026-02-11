import TabScreen from '@/components/tab-screen';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ImageZoomViewer from 'react-native-image-zoom-viewer';

export default function MapScreen() {
  return (
    <TabScreen>
      <View style={styles.container}>
        <ImageZoomViewer
          imageUrls={[{ url: 'https://i.imgur.com/RwQ6U0G.jpeg' }]}
          backgroundColor="#000000"
          minScale={0.5}
          renderIndicator={() => <View />}
          style={styles.zoomViewer}
        />
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',   // vertical centering
    alignItems: 'center',       // horizontal centering
    backgroundColor: '#000000', // match your viewer bg
  },
  zoomViewer: {
    width: '100%',
    height: '100%',
  },
});

