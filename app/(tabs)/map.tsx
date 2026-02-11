import React from 'react';

import DrawerContent from '@/components/map/drawer-content';
import LocationMarker from '@/components/map/location-marker';
import PanController from '@/components/map/pan-controller';
import { Animated, AppState, Dimensions, StyleSheet, View } from 'react-native';
import {
  Animated as AnimatedMap,
  AnimatedRegion,
  Marker,
} from 'react-native-maps';

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 42.055126;
const LONGITUDE = -87.670787;
const LATITUDE_DELTA = 0.0111;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const ITEM_SPACING = 10;
const ITEM_PREVIEW = 10;
const ITEM_WIDTH = screen.width - 2 * ITEM_SPACING - 2 * ITEM_PREVIEW;
const SNAP_WIDTH = ITEM_WIDTH + ITEM_SPACING;
const DRAWER_EXPANDED_HEIGHT = screen.height * 0.6;
const DRAWER_PREVIEW_HEIGHT = 300;
const ONE = new Animated.Value(1);

function getMarkerState(panX: any, panY: any, scrollY: any, i: any) {
  const xLeft = -SNAP_WIDTH * i + SNAP_WIDTH / 2;
  const xRight = -SNAP_WIDTH * i - SNAP_WIDTH / 2;
  const xPos = -SNAP_WIDTH * i;

  const isIndex = panX.interpolate({
    inputRange: [xRight - 1, xRight, xLeft, xLeft + 1],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });

  const selected = panX.interpolate({
    inputRange: [xRight, xPos, xLeft],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  const translateY = Animated.multiply(
    isIndex,
    scrollY.interpolate({
      inputRange: [0, 1],
      outputRange: [0, DRAWER_PREVIEW_HEIGHT - DRAWER_EXPANDED_HEIGHT],
      extrapolate: 'clamp',
    })
  );

  const translateX = panX;

  const scale = ONE;

  const opacity = 1;

  const markerOpacity = 1;

  const markerScale = selected.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return {
    translateY,
    translateX,
    scale,
    opacity,
    selected,
    markerOpacity,
    markerScale,
  };
}

class AnimatedViews extends React.Component<any, any> {
  private panXListener: string | undefined;
  private panYListener: string | undefined;
  private mounted: boolean;
  private appStateSubscription: any;

  constructor(props: any) {
    super(props);

    this.mounted = false;
    const markers = [
      {
        id: 0,
        type: 'food',
        coordinate: {
          latitude: LATITUDE,
          longitude: LONGITUDE,
        },
      },
      {
        id: 1,
        type: 'main',
        coordinate: {
          latitude: 42.057024,
          longitude: -87.670867,
        },
      },
      {
        id: 2,
        type: 'food',
        coordinate: {
          latitude: 42.053377,
          longitude: -87.670265,
        },
      },
    ];

    const panX = new Animated.Value(0);
    const panY = new Animated.Value(0);

    const scrollY = panY.interpolate({
      inputRange: [-DRAWER_EXPANDED_HEIGHT, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const animations = markers.map((m, i) =>
      getMarkerState(panX, panY, scrollY, i)
    );

    this.state = {
      panX,
      panY,
      animations,
      index: 0,
      canMoveHorizontal: true,
      markers,
      mapKey: 0,
      region: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { region, panX, panY } = this.state;

    panX.setValue(0);
    panY.setValue(0);

    this.panXListener = panX.addListener(this.onPanXChange);
    this.panYListener = panY.addListener(this.onPanYChange);

    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange
    );

    this.resetMapRegion();
  }

  componentWillUnmount() {
    this.mounted = false;
    const { panX, panY, region } = this.state;

    if (this.panXListener) {
      panX.removeListener(this.panXListener);
    }
    if (this.panYListener) {
      panY.removeListener(this.panYListener);
    }
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }

    panX.setValue(0);
    panY.setValue(0);

    region.stopAnimation();
  }

  handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === 'active') {
      const panX = new Animated.Value(0);
      const panY = new Animated.Value(0);

      const scrollY = panY.interpolate({
        inputRange: [-DRAWER_EXPANDED_HEIGHT, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });

      const animations = this.state.markers.map((m, i) =>
        getMarkerState(panX, panY, scrollY, i)
      );

      if (this.panXListener) {
        this.state.panX.removeListener(this.panXListener);
      }
      if (this.panYListener) {
        this.state.panY.removeListener(this.panYListener);
      }

      this.panXListener = panX.addListener(this.onPanXChange);
      this.panYListener = panY.addListener(this.onPanYChange);

      const newRegion = new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });

      this.resetMapRegion = this.resetMapRegion.bind(this);
      this.updateMapRegion = this.updateMapRegion.bind(this);
      this.onPanXChange = this.onPanXChange.bind(this);
      this.onPanYChange = this.onPanYChange.bind(this);
      this.handleAppStateChange = this.handleAppStateChange.bind(this);

      this.setState(
        (prevState) => ({
          mapKey: prevState.mapKey + 1,
          region: newRegion,
          panX,
          panY,
          animations,
        }),
        () => {
          setTimeout(() => {
            if (this.mounted) {
              this.updateMapRegion(this.state.index);
            }
          }, 100);
        }
      );
    }
  };

  resetMapRegion = () => {
    if (!this.mounted) return;

    const { region } = this.state;
    if (!region) return;

    region.stopAnimation();

    region.setValue({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  updateMapRegion = (index: number) => {
    if (!this.mounted) return;

    const { markers, region } = this.state;
    if (!markers || !region) return;

    if (index >= 0 && index < markers.length) {
      const marker = markers[index];
      if (marker && marker.coordinate) {
        region.stopAnimation();

        region
          .timing({
            ...marker.coordinate,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
            duration: 250,
            useNativeDriver: false,
          })
          .start();
      }
    }
  };

  onPanXChange = ({ value }: any) => {
    const { markers, index } = this.state;
    const newIndex = Math.min(
      markers.length - 1,
      Math.max(0, Math.floor((-1 * value + SNAP_WIDTH / 2) / SNAP_WIDTH))
    );

    if (index !== newIndex) {
      this.setState({ index: newIndex }, () => {
        this.updateMapRegion(newIndex);
      });
    }
  };

  onPanYChange = ({ value }: any) => {
    const { canMoveHorizontal } = this.state;
    const shouldBeMovable = Math.abs(value) < DRAWER_PREVIEW_HEIGHT / 2;

    if (shouldBeMovable !== canMoveHorizontal) {
      this.setState({ canMoveHorizontal: shouldBeMovable });
    }
  };

  render() {
    const { panX, panY, animations, canMoveHorizontal, markers, region } =
      this.state;

    return (
      <View style={styles.container}>
        <PanController
          style={styles.container}
          vertical
          horizontal={canMoveHorizontal}
          xMode='snap'
          yMode='decay'
          snapSpacingX={SNAP_WIDTH}
          yBounds={[-DRAWER_EXPANDED_HEIGHT, 0]}
          xBounds={[-SNAP_WIDTH * (markers.length - 1), 0]}
          panY={panY}
          panX={panX}
          key={`controller-${this.state.mapKey}`}
        >
          <AnimatedMap
            key={`map-${this.state.mapKey}`}
            provider={this.props.provider}
            style={styles.map}
            region={region}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          >
            {markers.map((marker: any, i: any) => {
              const { selected, markerOpacity, markerScale } = animations[i];
              return (
                <Marker key={marker.id} coordinate={marker.coordinate}>
                  <LocationMarker
                    style={{
                      opacity: markerOpacity,
                      transform: [{ scale: markerScale }],
                    }}
                    type={marker.type}
                    selected={selected}
                  />
                </Marker>
              );
            })}
          </AnimatedMap>
          <View style={styles.itemContainer}>
            {markers.map((marker: any, i: any) => {
              const { translateY, translateX, scale, opacity } = animations[i];
              return (
                <Animated.View
                  key={marker.id}
                  style={[
                    styles.item,
                    {
                      opacity,
                      transform: [{ translateY }, { translateX }, { scale }],
                    },
                  ]}
                >
                  <DrawerContent type={marker.type} />
                </Animated.View>
              );
            })}
          </View>
        </PanController>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  itemContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    paddingHorizontal: ITEM_SPACING / 2 + ITEM_PREVIEW,
    position: 'absolute',
    paddingTop: screen.height - DRAWER_PREVIEW_HEIGHT,
  },
  map: {
    backgroundColor: 'transparent',
    ...StyleSheet.absoluteFillObject,
  },
  item: {
    width: ITEM_WIDTH,
    height: DRAWER_EXPANDED_HEIGHT,
    backgroundColor: '#FFB1CD',
    marginHorizontal: ITEM_SPACING / 2,
    overflow: 'hidden',
    borderRadius: 12,
    borderColor: '#FFB1CD',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default AnimatedViews;
