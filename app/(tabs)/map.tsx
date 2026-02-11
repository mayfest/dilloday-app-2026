import React from 'react';

import DrawerContent from '@/components/map/drawer-content';
import LocationMarker from '@/components/map/location-marker';
import PanController from '@/components/map/pan-controller';
import TabScreen from '@/components/tab-screen';
import { Animated, AppState, Dimensions, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageZoomViewer from 'react-native-image-zoom-viewer';
import {
  Animated as AnimatedMap,
  AnimatedRegion,
  Marker,
} from 'react-native-maps';

import MapImage from '@/assets/images/dillo-53-map-graphic.png';
import { Colors } from '@/constants/Colors';

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
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

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
      activeTab: 'interactive',
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

  setActiveTab = (tabName: string) => {
    this.setState({ activeTab: tabName });
  };

  renderTabSelector = () => {
    const { activeTab } = this.state;
    if (Platform.OS === 'ios') {
      return (
        <SafeAreaView style={styles.iosTabOuterContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'interactive' && styles.activeTabButton,
              ]}
              onPress={() => this.setActiveTab('interactive')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'interactive' && styles.activeTabText,
              ]}>
                Interactive
              </Text>
              {activeTab === 'interactive' && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'static' && styles.activeTabButton,
              ]}
              onPress={() => this.setActiveTab('static')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'static' && styles.activeTabText,
              ]}>
                Static
              </Text>
              {activeTab === 'static' && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    } else {
      // Android tab rendering
      return (
        <View style={styles.androidTabOuterContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'interactive' && styles.activeTabButton,
              ]}
              onPress={() => this.setActiveTab('interactive')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'interactive' && styles.activeTabText,
              ]}>
                Interactive
              </Text>
              {activeTab === 'interactive' && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'static' && styles.activeTabButton,
              ]}
              onPress={() => this.setActiveTab('static')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'static' && styles.activeTabText,
              ]}>
                Static
              </Text>
              {activeTab === 'static' && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  renderInteractiveView = () => {
    const { panX, panY, animations, canMoveHorizontal, markers, region } = this.state;

    return (
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
    );
  };

  renderStaticView = () => {
    const images = [
      {
        url: '',
        props: {
          source: MapImage
        }
      }
    ];

    return (
      <View style={styles.staticContainer}>
        <ImageZoomViewer
          imageUrls={images}
          backgroundColor="#000000"
          renderIndicator={() => <View />}
          enableSwipeDown={true}
          onSwipeDown={() => this.setActiveTab('interactive')}
          minScale={0.5}
          onMove={(position) => {
            if (position.scale < 0.8) {
              setTimeout(() => this.setActiveTab('interactive'), 300);
            }
          }}
        />
      </View>
    );
  };

  render() {
    const { activeTab } = this.state;
    const contentStyle = Platform.OS === 'ios'
      ? styles.iosContentContainer
      : styles.androidContentContainer;

    return (
      <TabScreen>
        <View style={styles.container}>
          <View style={contentStyle}>
            {activeTab === 'interactive' ?
              this.renderInteractiveView() :
              this.renderStaticView()
            }
          </View>
          {this.renderTabSelector()}
        </View>
      </TabScreen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  iosContentContainer: {
    flex: 1,
    marginTop: 90,
  },
  androidContentContainer: {
    flex: 1,
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
  staticContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  staticMapImage: {
    width: '100%',
    height: '100%',
  },
  item: {
    width: ITEM_WIDTH,
    height: DRAWER_EXPANDED_HEIGHT,
    backgroundColor: '#fff',
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
  // iOS-specific tab styles
  iosTabOuterContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    width: '100%',
    backgroundColor: '#faf6f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  // Android-specific tab styles
  androidTabOuterContainer: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT, // Account for Android status bar
    left: 0,
    right: 0,
    zIndex: 100,
    width: '100%',
    backgroundColor: '#faf6f0',
    elevation: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  tabButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeTabButton: {
  },
  tabText: {
    fontSize: Platform.OS === 'android' ? 16 : 18,
    fontWeight: '500',
    color: '#888',
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#000',
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
});

export default AnimatedViews;
