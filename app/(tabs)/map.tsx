// MapScreen.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import MapImage from '@/assets/images/dillo_map_no_caro.png';
import DrawerContent from '@/components/map/drawer-content';
import IconMarker from '@/components/map/location-marker';
import TabScreen from '@/components/tab-screen';
import { Colors } from '@/constants/Colors';
import { useFocusEffect } from 'expo-router';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import MapView, { Callout, Marker, Region } from 'react-native-maps';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 42.053722;
const LONGITUDE = -87.67225;
const LATITUDE_DELTA = 0.0111;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const ITEM_SPACING = 10;
const ITEM_PREVIEW = 10;
const ITEM_WIDTH = screen.width - 2 * ITEM_SPACING - 2 * ITEM_PREVIEW;
const SNAP_WIDTH = ITEM_WIDTH + ITEM_SPACING;
const DRAWER_PREVIEW_HEIGHT = 325;

const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const INITIAL_REGION: Region = {
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

interface MarkerData {
  id: string;
  type:
    | 'main'
    | 'fmo'
    | 'burrow'
    | 'food'
    | 'medical'
    | 'restroom'
    | 'restroomAccessible'
    | 'programming-event'
    | 'sponsor'
    | 'exit'
    | 'exitEndOfDay'
    | 'exitSouth'
    | 'artistMerch'
    | 'entrance'
    | 'water'
    | 'beerGarden'
    | 'lunasPub'
    | 'restArea'
    | 'info';
  icon:
    | 'truck'
    | 'store'
    | 'restroom'
    | 'door-open'
    | 'record-vinyl'
    | 'tent'
    | 'briefcase-medical'
    | 'water'
    | 'door-closed'
    | 'magnifying-glass-location'
    | 'ticket-simple'
    | 'person-booth'
    | 'id-card'
    | 'users'
    | 'exit'
    | 'food'
    | 'star'
    | 'info-circle';
  label: string;
  coordinate: { latitude: number; longitude: number };
}

const getDrawerItemLayout = (_: unknown, index: number) => ({
  length: SNAP_WIDTH,
  offset: SNAP_WIDTH * index,
  index,
});

const markers: MarkerData[] = [
  {
    id: 'a',
    type: 'entrance',
    icon: 'door-open',
    label: 'Entrance',
    coordinate: {
      latitude: 42.053833,
      longitude: -87.67275,
    },
  },
  {
    id: 'b',
    type: 'artistMerch',
    icon: 'store',
    label: 'Artist Merch',
    coordinate: { latitude: 42.053666667, longitude: -87.669944444 },
  },
  {
    id: 'c',
    type: 'food',
    icon: 'truck',
    label: 'Food Trucks',
    coordinate: { latitude: 42.054823, longitude: -87.670859 },
  },
  {
    id: 'd',
    type: 'fmo',
    icon: 'record-vinyl',
    label: 'FMO Stage',
    coordinate: { latitude: 42.055339, longitude: -87.670925 },
  },
  {
    id: 'e',
    type: 'main',
    icon: 'record-vinyl',
    label: 'Main Stage',
    coordinate: { latitude: 42.057273, longitude: -87.670835 },
  },
  {
    id: 'u',
    type: 'burrow',
    icon: 'record-vinyl',
    label: 'The Burrow',
    coordinate: { latitude: 42.053167, longitude: -87.671611 },
  },
  {
    id: 'f',
    type: 'restroom',
    icon: 'restroom',
    label: 'Restrooms',
    coordinate: { latitude: 42.053611, longitude: -87.671639 },
  },
  {
    id: 't',
    type: 'restroomAccessible',
    icon: 'restroom',
    label: 'Restrooms (accessible)',
    coordinate: { latitude: 42.054472, longitude: -87.670306 },
  },
  {
    id: 'g',
    type: 'medical',
    icon: 'briefcase-medical',
    label: 'Medical Tent',
    coordinate: { latitude: 42.056806, longitude: -87.6705 },
  },
  {
    id: 'h',
    type: 'water',
    icon: 'water',
    label: 'Water Station',
    coordinate: { latitude: 42.056889, longitude: -87.67125 },
  },
  {
    id: 'z',
    type: 'water',
    icon: 'water',
    label: 'Water Station',
    coordinate: { latitude: 42.056306, longitude: -87.670444 },
  },
  {
    id: 'w',
    type: 'water',
    icon: 'water',
    label: 'Water Station',
    coordinate: { latitude: 42.052277778, longitude: -87.669666667 },
  },
  {
    id: 'v',
    type: 'water',
    icon: 'water',
    label: 'Water Station',
    coordinate: { latitude: 42.053639, longitude: -87.672278 },
  },
  {
    id: 'y',
    type: 'programming-event',
    icon: 'star',
    label: 'Programming Areas',
    coordinate: { latitude: 42.053166667, longitude: -87.670277778 },
  },
  {
    id: 'x',
    type: 'info',
    icon: 'info-circle',
    label: 'Info Desk',
    coordinate: { latitude: 42.052388889, longitude: -87.67025 },
  },
  {
    id: 'n',
    type: 'beerGarden',
    icon: 'id-card',
    label: 'Beer Garden',
    coordinate: { latitude: 42.05725, longitude: -87.671361 },
  },
  {
    id: 'p',
    type: 'lunasPub',
    icon: 'id-card',
    label: "Drinking Space (Luna's Pub)",
    coordinate: { latitude: 42.05325, longitude: -87.672278 },
  },
  {
    id: 'q',
    type: 'restArea',
    icon: 'person-booth',
    label: 'Sponsors and Vendors',
    coordinate: { latitude: 42.052888889, longitude: -87.669777778 },
  },
  {
    id: 's',
    type: 'sponsor',
    icon: 'person-booth',
    label: 'Sponsors and Vendors',
    coordinate: { latitude: 42.055587, longitude: -87.670527 },
  },
  {
    id: 'r',
    type: 'sponsor',
    icon: 'person-booth',
    label: 'Sponsors and Vendors',
    coordinate: { latitude: 42.054, longitude: -87.670722222 },
  },
  {
    id: 'i',
    type: 'exit',
    icon: 'door-closed',
    label: 'North Exit',
    coordinate: { latitude: 42.056806, longitude: -87.671917 },
  },
  {
    id: 'j',
    type: 'exitEndOfDay',
    icon: 'door-closed',
    label: 'End of Day Exit',
    coordinate: { latitude: 42.057306, longitude: -87.670251 },
  },
  {
    id: 'k',
    type: 'exitSouth',
    icon: 'door-closed',
    label: 'South Exit',
    coordinate: { latitude: 42.052361, longitude: -87.671167 },
  },
];

// Compute map boundaries so the user can pan but not stray too far
const PADDING = 0.0005;
const lats = markers.map((m) => m.coordinate.latitude);
const lngs = markers.map((m) => m.coordinate.longitude);
const southWest = {
  latitude: Math.min(...lats) - PADDING,
  longitude: Math.min(...lngs) - PADDING,
};
const northEast = {
  latitude: Math.max(...lats) + PADDING,
  longitude: Math.max(...lngs) + PADDING,
};

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
  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef<(Marker | null)[]>([]);
  const drawerRef = useRef<FlatList<MarkerData>>(null);
  const drawerWasDragged = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'interactive' | 'static'>(
    'interactive'
  );
  const [mapResetKey, setMapResetKey] = useState(0);

  const { width: vw, height: vh } = useWindowDimensions();
  const staticMapSize = useMemo(() => {
    const src = Image.resolveAssetSource(MapImage);
    const iw = src?.width ?? vw;
    const ih = src?.height ?? vh;
    return fitImageToViewport(iw, ih, vw, vh);
  }, [vw, vh]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setActiveIndex(0);
        setActiveTab('interactive');
        setMapResetKey((k) => k + 1);
      };
    }, [])
  );

  useEffect(() => {
    if (activeTab !== 'interactive') return;
    // Use scrollToIndex + getItemLayout so the visible drawer card matches
    // activeIndex. scrollToOffset(activeIndex * SNAP_WIDTH) does not stay in
    // sync with padding + centered snap and can show the wrong location.
    const frame = requestAnimationFrame(() => {
      drawerRef.current?.scrollToIndex({
        index: activeIndex,
        animated: true,
        viewPosition: 0.5,
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [activeTab, activeIndex]);

  useEffect(() => {
    if (activeTab === 'interactive' && mapRef.current?.setMapBoundaries) {
      mapRef.current.setMapBoundaries(northEast, southWest);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'interactive') return;
    const m = markers[activeIndex];
    markerRefs.current.forEach((r, i) => {
      if (i !== activeIndex) r?.hideCallout();
    });
    const map = mapRef.current;
    if (map?.animateCamera) {
      map.animateCamera(
        { center: m.coordinate, pitch: 0, heading: 0, zoom: 15 },
        { duration: 200 }
      );
    } else {
      map?.animateToRegion(
        {
          ...m.coordinate,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        200
      );
    }
    setTimeout(() => markerRefs.current[activeIndex]?.showCallout(), 200);
  }, [activeIndex, activeTab]);

  const handleMarkerPress = (index: number) => {
    setActiveIndex(index);
  };

  const renderTabSelector = () => {
    const Container = Platform.OS === 'ios' ? SafeAreaView : View;
    const containerStyle =
      Platform.OS === 'ios'
        ? styles.iosTabOuterContainer
        : styles.androidTabOuterContainer;

    return (
      <Container style={containerStyle}>
        <View style={styles.tabContainer}>
          {(['interactive', 'static'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab.toUpperCase()}
              </Text>
              {activeTab === tab && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>
      </Container>
    );
  };

  const renderInteractive = () => (
    <>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
        scrollEnabled
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {markers.map((m, i) => (
          <Marker
            key={m.id}
            coordinate={m.coordinate}
            ref={(r) => (markerRefs.current[i] = r)}
            anchor={{ x: 0.5, y: 1 }}
            calloutAnchor={{ x: 0.5, y: -0.1 }}
            onPress={() => handleMarkerPress(i)}
          >
            <IconMarker icon={m.icon} selected={i === activeIndex} />
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutText}>{m.label}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.drawer}>
        <FlatList
          ref={drawerRef}
          data={markers}
          keyExtractor={(i) => i.id}
          horizontal
          bounces={false}
          decelerationRate='fast'
          snapToInterval={SNAP_WIDTH}
          snapToAlignment='center'
          showsHorizontalScrollIndicator={false}
          getItemLayout={getDrawerItemLayout}
          onScrollToIndexFailed={({ index }) => {
            requestAnimationFrame(() => {
              drawerRef.current?.scrollToIndex({
                index,
                animated: false,
                viewPosition: 0.5,
              });
            });
          }}
          contentContainerStyle={{
            paddingHorizontal: (screen.width - ITEM_WIDTH) / 2,
          }}
          onMomentumScrollEnd={(e) => {
            // Ignore momentum events not caused by user drag.
            // On initial mount/layout, FlatList can emit momentum callbacks that
            // would otherwise snap selection to an unintended marker.
            if (!drawerWasDragged.current) return;
            drawerWasDragged.current = false;
            const idx = Math.round(e.nativeEvent.contentOffset.x / SNAP_WIDTH);
            setActiveIndex(Math.max(0, Math.min(idx, markers.length - 1)));
          }}
          onScrollBeginDrag={() => {
            drawerWasDragged.current = true;
          }}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <DrawerContent type={item.type} />
            </View>
          )}
        />
      </View>
    </>
  );

  const renderStatic = () => (
    <View key={mapResetKey} style={styles.staticContainer}>
      <Image
        source={MapImage}
        style={[staticMapSize, styles.staticMapImage]}
        resizeMode='contain'
      />
    </View>
  );

  return (
    <TabScreen>
      <View key={mapResetKey} style={styles.container}>
        {renderTabSelector()}
        {activeTab === 'interactive' ? renderInteractive() : renderStatic()}
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  iosTabOuterContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  androidTabOuterContainer: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#000',
    elevation: 4,
  },

  tabContainer: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  tabText: {
    fontSize: Platform.OS === 'android' ? 16 : 18,
    fontWeight: '500',
    color: '#fff',
    fontFamily: 'FuturaBold',
  },

  activeTabText: {
    color: '#fff',
    fontWeight: '700',
  },

  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    width: '50%',
    height: 3,
    backgroundColor: Colors.light.text,
    borderRadius: 1.5,
  },

  staticContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  staticMapImage: {
    transform: [{ translateY: -36 }],
  },

  drawer: {
    position: 'absolute',
    bottom: 0,
    height: DRAWER_PREVIEW_HEIGHT,
    width: '100%',
  },

  item: {
    width: ITEM_WIDTH,
    marginHorizontal: ITEM_SPACING / 2,
    backgroundColor: '#000',
    borderRadius: 12,
    borderColor: '#000',
    borderWidth: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  callout: {
    minWidth: 100,
    alignItems: 'center',
    padding: 6,
    backgroundColor: 'white',
  },

  calloutText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
