import { useCallback } from 'react';

import { useLocalSearchParams } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

import World from '../../racing-game-src/World';

/** Matches `World` game surface (`backgroundColor: 'gray'` → #808080) */
const RACING_SURFACE = '#808080';

export type RacingMode = 'practice' | 'scored';

export default function RacingGamePlayScreen() {
  const { nonce, mode } = useLocalSearchParams<{
    nonce?: string;
    mode?: string;
  }>();
  const remountKey = nonce ?? 'initial';
  const racingMode: RacingMode = mode === 'practice' ? 'practice' : 'scored';

  useFocusEffect(
    useCallback(() => {
      void SystemUI.setBackgroundColorAsync(RACING_SURFACE);
      return () => {
        void SystemUI.setBackgroundColorAsync('#000000');
      };
    }, [])
  );

  return (
    <View style={styles.root}>
      <World key={remountKey} mode={racingMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: RACING_SURFACE,
  },
});
