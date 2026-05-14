// MapScreen.tsx — static venue map image only
import React, { useMemo, useState } from 'react';

import MapImage from '@/assets/images/dillo_map_no_caro.jpeg';
import TabScreen from '@/components/tab-screen';
import {
  sofachromeTitleContainer,
  sofachromeTitleTextStyle,
} from '@/constants/sofachrome-screen-title';
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

const MAP_AREA_TOP_INSET = 10;

/** Matches `react-native-image-zoom-viewer` fit logic (`image-viewer.component.js`). */
function fitImageToViewport(
  intrinsicW: number,
  intrinsicH: number,
  viewportW: number,
  viewportH: number
) {
  let width = intrinsicW;
  let height = intrinsicH;
  if (width > viewportW) {
    const widthPixel = viewportW / width;
    width *= widthPixel;
    height *= widthPixel;
  }
  if (height > viewportH) {
    const heightPixel = viewportH / height;
    width *= heightPixel;
    height *= heightPixel;
  }
  return { width, height };
}

export default function MapScreen() {
  const { width: vw, height: vh } = useWindowDimensions();
  const [mapBox, setMapBox] = useState<{ w: number; h: number } | null>(null);
  const staticMapSize = useMemo(() => {
    const src = Image.resolveAssetSource(MapImage);
    const iw = src?.width ?? vw;
    const ih = src?.height ?? vh;
    const boxW = mapBox?.w ?? vw;
    const boxH =
      mapBox?.h ?? Math.max(1, vh - MAP_AREA_TOP_INSET - 96);
    return fitImageToViewport(iw, ih, boxW, boxH);
  }, [vw, vh, mapBox]);

  return (
    <TabScreen>
      <View style={styles.container}>
        <View style={styles.titleBar}>
          <Text style={styles.title}>MAP</Text>
        </View>
        <View
          style={styles.mapArea}
          onLayout={({ nativeEvent: { layout } }) => {
            const h = layout.height - MAP_AREA_TOP_INSET;
            if (layout.width > 0 && h > 0) {
              setMapBox({ w: layout.width, h });
            }
          }}
        >
          <Image source={MapImage} style={staticMapSize} resizeMode='contain' />
        </View>
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  titleBar: {
    ...sofachromeTitleContainer(),
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 4,
    backgroundColor: '#000',
  },
  title: sofachromeTitleTextStyle(36),
  mapArea: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: MAP_AREA_TOP_INSET,
    backgroundColor: '#000',
    overflow: 'visible',
  },
});
