import React, { useCallback, useRef } from 'react';

import CarButton from '@/assets/racing-game/car-button.svg';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

interface DilloSpeedwayButtonProps {
  // value: string;
}

function RacingBorder({ position }: { position: 'top' | 'bottom' }) {
  return (
    <View
      pointerEvents='none'
      style={[
        styles.racingBorder,
        position === 'top' ? styles.racingBorderTop : styles.racingBorderBottom,
      ]}
    >
      {Array.from({ length: 18 }).map((_, i) => (
        <View
          key={`${position}-${i}`}
          style={[
            styles.racingBorderSegment,
            {
              backgroundColor: i % 2 === 0 ? '#D62828' : '#F4F4F4',
            },
          ]}
        />
      ))}
    </View>
  );
}

export default function DilloSpeedwayButton({}: DilloSpeedwayButtonProps) {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const carSize = 150;
  const carX = useRef(new Animated.Value(0)).current;

  const runCarAnimation = useCallback(() => {
    // Start near the right edge (respecting the same 18px "padding" feel).
    const startX = Math.max(0, windowWidth - carSize - 18);
    const offLeftX = -carSize - 20;
    const offRightX = windowWidth + carSize + 20;

    carX.stopAnimation();
    carX.setValue(startX);

    Animated.timing(carX, {
      toValue: offLeftX,
      duration: 1600,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      // Jump to right side (off-screen), then animate back and stop.
      carX.setValue(offRightX);
      Animated.timing(carX, {
        toValue: startX,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  }, [carSize, carX, windowWidth]);

  useFocusEffect(
    useCallback(() => {
      runCarAnimation();
      return () => {
        carX.stopAnimation();
      };
    }, [carX, runCarAnimation])
  );

  return (
    <TouchableOpacity
      style={[styles.container, { width: windowWidth }]}
      activeOpacity={0.8}
      onPress={() => {
        router.navigate({
          pathname: '/racing-game',
        });
      }}
    >
      <View style={styles.titleRow}>
        <Text style={styles.title}>DILLO RACING</Text>
      </View>

      <View style={[styles.road, { width: windowWidth }]}>
        <RacingBorder position='top' />
        <Animated.View
          pointerEvents='none'
          style={[
            styles.carWrapper,
            {
              transform: [{ translateX: carX }, { translateY: -carSize / 2 }],
            },
          ]}
        >
          <CarButton width={carSize} height={carSize} />
        </Animated.View>
        <RacingBorder position='bottom' />

        {/* Optional content area if you want to add text later */}
        {/* <View style={styles.textHeader}>
          <Text style={styles.header}>ANNOUNCEMENT</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{value}</Text>
        </View> */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#FFEB3B',
    fontSize: 20,
    fontFamily: 'FuturaBold',
  },
  titleRow: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
    alignItems: 'flex-end',
  },
  road: {
    width: '100%',
    height: 100,
    backgroundColor: '#858687',
    position: 'relative',
    overflow: 'hidden',
  },
  carWrapper: {
    position: 'absolute',
    top: '50%',
    left: 0,
    zIndex: 1,
  },
  racingBorder: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 5,
    flexDirection: 'row',
    zIndex: 2,
  },
  racingBorderTop: {
    top: 0,
  },
  racingBorderBottom: {
    bottom: 0,
  },
  racingBorderSegment: {
    flex: 1,
    height: '100%',
  },
  container: {
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginTop: 0,
    marginBottom: 0,
    alignSelf: 'center',
  },
  contentContainer: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    padding: 10,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 30,
    flex: 1,
  },
  text: {
    fontSize: 19,
    color: '#000',
    paddingLeft: 10,
    fontFamily: 'Futura',
    marginBottom: 12,
  },
  textHeader: {
    height: 45,
    backgroundColor: '#1472B9',
    borderTopRightRadius: 30,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  header: {
    fontSize: 20,
    color: '#FFF',
    fontFamily: 'FuturaBold',
  },
});
