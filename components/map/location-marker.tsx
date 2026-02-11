import React from 'react';

import ParkAttraction from '@/assets/images/parkattraction.svg';
import Popcorn from '@/assets/images/popcorn.svg';
import Tent from '@/assets/images/tent.svg';
import { Animated, StyleSheet } from 'react-native';

const LocationMarker = ({ type, selected, style }) => {
  const MarkerComponent = (() => {
    switch (type) {
      case 'main':
        return Tent;
      case 'fmo':
        return ParkAttraction;
      case 'food':
        return Popcorn;
      default:
        return Tent;
    }
  })();

  // Animate the marker scale based on selection
  const scale = selected.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const opacity = selected.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <MarkerComponent width={40} height={40} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
});

export default LocationMarker;
