import React, { useEffect, useRef, useState } from 'react';

import { Colors } from '@/constants/Colors';
import { useConfig } from '@/lib/config';
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface DotPosition {
  x: number;
  y: number;
}

type PatternFunction = (dots: DotPosition[]) => NodeJS.Timeout;

export default function ArtistPanel(): React.ReactElement {
  const { config } = useConfig();
  const panels = config?.home?.panels ?? [];
  const nowKey = panels.find((p) => p.type === 'schedule-now')?.value;
  const nextKey = panels.find((p) => p.type === 'schedule-next')?.value;

  const nowArtist =
    nowKey && config?.artists ? config.artists[nowKey] : undefined;
  const nextArtist =
    nextKey && config?.artists ? config.artists[nextKey] : undefined;

  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const [dots, setDots] = useState<DotPosition[]>([]);
  const [brightDots, setBrightDots] = useState<Set<number>>(new Set());
  const patternIndex = useRef(0);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const DOT_SIZE = 20;
  const SPACING = DOT_SIZE + 15;
  const PATTERN_DURATION = 3000;
  const BORDER_TOP = 25;
  const BORDER_BOTTOM = 25;
  const BORDER_LEFT = 25;
  const BORDER_RIGHT = 25;

  const handleLayout = (e: LayoutChangeEvent) =>
    setLayout(e.nativeEvent.layout);

  useEffect(() => {
    const { width: w, height: h } = layout;
    if (!w || !h) return;

    const topY = BORDER_TOP / 2 - DOT_SIZE / 2;
    const botY = h - BORDER_BOTTOM / 2 - DOT_SIZE / 2;
    const leftX = BORDER_LEFT / 2 - DOT_SIZE / 2;
    const rightX = w - BORDER_RIGHT / 2 - DOT_SIZE / 2;

    const countH = Math.floor((w - BORDER_LEFT - BORDER_RIGHT) / SPACING) + 1;
    const countV = Math.floor((h - BORDER_TOP - BORDER_BOTTOM) / SPACING) + 1;

    const stepX =
      (w - BORDER_LEFT - BORDER_RIGHT - DOT_SIZE) / Math.max(1, countH - 1);
    const stepY =
      (h - BORDER_TOP - BORDER_BOTTOM - DOT_SIZE) / Math.max(1, countV - 1);

    const newDots: DotPosition[] = [];
    for (let i = 0; i < countH; i++) {
      newDots.push({ x: BORDER_LEFT + i * stepX, y: topY });
    }
    for (let i = 0; i < countV; i++) {
      newDots.push({ x: rightX, y: BORDER_TOP + i * stepY });
    }
    for (let i = countH - 1; i >= 0; i--) {
      newDots.push({ x: BORDER_LEFT + i * stepX, y: botY });
    }
    for (let i = countV - 1; i >= 0; i--) {
      newDots.push({ x: leftX, y: BORDER_TOP + i * stepY });
    }
    setDots(newDots);
  }, [layout]);

  const patterns = React.useMemo<PatternFunction[]>(
    () => [
      (all) => {
        let idx = 0;
        return setInterval(() => {
          setBrightDots(new Set([idx]));
          idx = (idx + 1) % all.length;
        }, 100);
      },
      (all) => {
        let idx = 0,
          trail = 5;
        return setInterval(() => {
          const s = new Set<number>();
          for (let i = 0; i < trail; i++) {
            s.add((idx + i) % all.length);
          }
          setBrightDots(s);
          idx = (idx + 1) % all.length;
        }, 100);
      },
      (all) =>
        setInterval(() => {
          const s = new Set<number>();
          for (let i = 0; i < all.length / 3; i++) {
            s.add(Math.floor(Math.random() * all.length));
          }
          setBrightDots(s);
        }, 300),
      (all) => {
        let on = false;
        return setInterval(() => {
          setBrightDots(on ? new Set<number>() : new Set(all.map((_, i) => i)));
          on = !on;
        }, 500);
      },
    ],
    []
  );

  useEffect(() => {
    if (dots.length === 0) return;
    if (intervalId.current) clearInterval(intervalId.current);
    if (timeoutId.current) clearTimeout(timeoutId.current);

    function start() {
      intervalId.current = patterns[patternIndex.current](dots);
      timeoutId.current = setTimeout(() => {
        if (intervalId.current) clearInterval(intervalId.current);
        patternIndex.current = (patternIndex.current + 1) % patterns.length;
        start();
      }, PATTERN_DURATION);
    }
    start();
    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, [dots, patterns]);

  return (
    <View style={styles.container}>
      <View style={styles.marquee} onLayout={handleLayout}>
        {dots.map(({ x, y }, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { left: x, top: y },
              brightDots.has(i) && styles.dotBright,
            ]}
          />
        ))}

        <View style={styles.content}>
          <Text style={styles.header}>NOW SHOWING</Text>
          <Text style={styles.artistName}>
            {nowArtist?.name ?? 'Unknown Artist'}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.header}>NEXT UP</Text>
          <Text style={styles.artistName}>{nextArtist?.name ?? 'TBD'}</Text>
        </View>
      </View>
    </View>
  );
}

interface Styles {
  container: ViewStyle;
  marquee: ViewStyle;
  content: ViewStyle;
  header: TextStyle;
  artistName: TextStyle;
  divider: ViewStyle;
  dot: ViewStyle;
  dotBright: ViewStyle;
}
const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 8,
  },
  marquee: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.light.alert,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    position: 'absolute',
    top: 25,
    left: 25,
    right: 25,
    bottom: 25,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Poppins_600SemiBold',
    color: '#2E4172',
    letterSpacing: 1,
    marginBottom: 4,
  },
  artistName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2E4172',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  divider: {
    width: '95%',
    height: 2,
    backgroundColor: '#2E4172',
    marginVertical: 12,
  },
  dot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F9E79F',
    zIndex: 1,
    shadowColor: '#F9E79F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
  },
  dotBright: {
    backgroundColor: '#fff',
    shadowColor: '#FFEB3B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
});
