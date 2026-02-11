import React, { useEffect, useRef } from 'react';

import SmokeSvg from '@/assets/dillo-sonas/smoke.svg';
import DilloSonaStackScreen from '@/components/dillo-sona-screen';
import { CardKey, cardMeanings } from '@/constants/dillo-sona-meanings';
import { useDilloSona } from '@/contexts/dillo-sona-context';
import { useRouter } from 'expo-router';
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MeaningScreen() {
  const { tally } = useDilloSona();
  const router = useRouter();
  const { width, height } = Dimensions.get('window');

  // pick the winning key
  const winner = (Object.keys(tally) as Array<keyof typeof tally>).reduce(
    (a, b) => (tally[a] >= tally[b] ? a : b)
  ) as CardKey;

  // fade-in
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <DilloSonaStackScreen>
      <View style={styles.wrapper}>
        <SmokeSvg
          width={width}
          height={height}
          style={StyleSheet.absoluteFill}
          preserveAspectRatio='xMidYMid slice'
        />

        <Animated.View style={[styles.content, { opacity }]}>
          <Text style={styles.title}>
            THE {winner.charAt(0).toUpperCase() + winner.slice(1).toUpperCase()}
          </Text>

          <ScrollView
            style={styles.textContainer}
            contentContainerStyle={styles.textContent}
          >
            <Text style={styles.meaningText}>{cardMeanings[winner]}</Text>
          </ScrollView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.replace('/')}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>exit</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </DilloSonaStackScreen>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#5B004F',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    color: '#D9D9D9',
    fontSize: 48,
    fontFamily: 'SofiaSans_800ExtraBold',
    letterSpacing: 2,
    marginBottom: 24,
  },
  textContainer: {
    flex: 1,
    width: '100%',
  },
  textContent: {
    paddingBottom: 40,
  },
  meaningText: {
    color: '#D9D9D9',
    fontSize: 24,
    lineHeight: 28,
    textAlign: 'center',
    fontFamily: 'SofiaSans_800ExtraBold',
    letterSpacing: 4,
  },
  closeButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#3B0434',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#D9D9D9',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SofiaSans_800ExtraBold',
    letterSpacing: 3,
  },
});
