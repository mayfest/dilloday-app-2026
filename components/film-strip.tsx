import React from 'react';

import { Colors } from '@/constants/Colors';
import { StyleSheet, View } from 'react-native';

const S = 7;
const C = Colors.light.cardAlt;
const HOLE_COUNT = 6;

export function FilmStrip({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  return (
    <View style={[styles.strip, style]}>
      <View style={styles.holeColumn}>
        {Array.from({ length: HOLE_COUNT }).map((_, i) => (
          <View key={i} style={styles.hole} />
        ))}
      </View>
      <View style={styles.content}>{children}</View>
      <View style={styles.holeColumn}>
        {Array.from({ length: HOLE_COUNT }).map((_, i) => (
          <View key={i} style={styles.hole} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    borderWidth: S * 0.5,
    borderColor: C,
    backgroundColor: C,
    paddingVertical: S * 1.5,
    paddingHorizontal: S * 2,
    overflow: 'hidden',
  },
  holeColumn: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hole: {
    width: S * 1.5,
    height: S * 1.5,
    margin: S * 0.5,
    borderRadius: S * 0.3,
    backgroundColor: Colors.light.text,
  },
  content: {
    flex: 1,
    marginHorizontal: S,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
