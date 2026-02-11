import React from 'react';

import PriceMarker from '@/components/map/animated-price-marker';
import PanController from '@/components/map/pan-controller';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import {
  Animated as AnimatedMap,
  AnimatedRegion,
  Marker,
} from 'react-native-maps';

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const ITEM_SPACING = 10;
const ITEM_PREVIEW = 10;
const ITEM_WIDTH = screen.width - 2 * ITEM_SPACING - 2 * ITEM_PREVIEW;
const SNAP_WIDTH = ITEM_WIDTH + ITEM_SPACING;
const ITEM_PREVIEW_HEIGHT = 150;
const DRAWER_EXPANDED_HEIGHT = 1500;
const DRAWER_PREVIEW_HEIGHT = 250;
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

  const isNotIndex = panX.interpolate({
    inputRange: [xRight - 1, xRight, xLeft, xLeft + 1],
    outputRange: [1, 0, 0, 1],
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

  const scale = ONE; // Remove scaling effect

  const opacity = Animated.multiply(isNotIndex, 0.5).interpolate({
    inputRange: [0, 0.5],
    outputRange: [1, 0.5],
  });

  const markerOpacity = isNotIndex.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.6],
  });

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
  constructor(props: any) {
    super(props);

    const markers = [
      {
        id: 0,
        amount: 99,
        coordinate: {
          latitude: LATITUDE,
          longitude: LONGITUDE,
        },
      },
      {
        id: 1,
        amount: 199,
        coordinate: {
          latitude: LATITUDE + 0.004,
          longitude: LONGITUDE - 0.004,
        },
      },
      {
        id: 2,
        amount: 285,
        coordinate: {
          latitude: LATITUDE - 0.004,
          longitude: LONGITUDE - 0.004,
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
      region: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
    };
  }

  componentDidMount() {
    const { region, panX, panY, markers } = this.state;
    panX.addListener(this.onPanXChange);
    panY.addListener(this.onPanYChange);

    // Initialize map region
    this.updateMapRegion(0);
  }

  componentWillUnmount() {
    const { panX, panY, region } = this.state;
    panX.removeListener(this.onPanXChange);
    panY.removeListener(this.onPanYChange);
    region.stopAnimation();
  }

  updateMapRegion = (index: number) => {
    const { markers, region } = this.state;
    if (index >= 0 && index < markers.length) {
      const marker = markers[index];
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
          snapSpacingX={SNAP_WIDTH}
          yBounds={[-DRAWER_EXPANDED_HEIGHT, 0]}
          xBounds={[-SNAP_WIDTH * (markers.length - 1), 0]}
          panY={panY}
          panX={panX}
        >
          <AnimatedMap
            provider={this.props.provider}
            style={styles.map}
            region={region}
          >
            {markers.map((marker: any, i: any) => {
              const { selected, markerOpacity, markerScale } = animations[i];
              return (
                <Marker key={marker.id} coordinate={marker.coordinate}>
                  <PriceMarker
                    style={{
                      opacity: markerOpacity,
                      transform: [{ scale: markerScale }],
                    }}
                    amount={marker.amount}
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
                />
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
    backgroundColor: 'red',
    marginHorizontal: ITEM_SPACING / 2,
    overflow: 'hidden',
    borderRadius: 3,
    borderColor: '#000',
  },
});

export default AnimatedViews;
