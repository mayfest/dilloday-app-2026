import React, { useEffect, useRef, useState } from 'react';

import ArtistDetailModal from '@/components/home/artist-detail-modal';
import LoadingIndicator from '@/components/loading-indicator';
import { Colors } from '@/constants/Colors';
import { useConfig } from '@/lib/config';
import {
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';

interface DotPosition {
  x: number;
  y: number;
}

type PatternFunction = (dots: DotPosition[]) => NodeJS.Timeout;

export default function ArtistPanel(): React.ReactElement {
  const { height: screenHeight } = useWindowDimensions();
  const { config, loading } = useConfig();
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
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const marqueeHeight = Math.min(screenHeight * 0.75, 475);
  // Initialize countdown with 0s to prevent NaN issues
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const patternIndex = useRef(0);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const countdownId = useRef<NodeJS.Timeout | null>(null);

  const DOT_SIZE = 20;
  const SPACING = DOT_SIZE + 15;
  const PATTERN_DURATION = 3000;
  const BORDER_TOP = 25;
  const BORDER_BOTTOM = 25;
  const BORDER_LEFT = 25;
  const BORDER_RIGHT = 25;

  const handleLayout = (e: LayoutChangeEvent) =>
    setLayout(e.nativeEvent.layout);

  // Calculate countdown to Dillo Day
  useEffect(() => {
    // Calculate countdown initially to avoid flashing NaN
    const calculateCountdown = () => {
      try {
        // strict ISO-8601 string
        const dilloDay = Date.parse('2025-05-18T00:00:00');

        const now = new Date().getTime();
        const difference = dilloDay - now;

        // Check if difference is valid before calculation
        if (isNaN(difference) || difference < 0) {
          console.error('Invalid countdown difference:', difference);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
      } catch (error) {
        console.error('Error calculating countdown:', error);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };

    const updateCountdown = () => {
      setCountdown(calculateCountdown());
    };

    // Calculate immediately on mount
    updateCountdown();

    // Then set up interval
    countdownId.current = setInterval(updateCountdown, 1000);

    return () => {
      if (countdownId.current) clearInterval(countdownId.current);
    };
  }, []);

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
    if (nowArtist?.image) {
      Image.prefetch(nowArtist.image);
    }
    if (nextArtist?.image) {
      Image.prefetch(nextArtist.image);
    }
  }, [nowArtist, nextArtist]);

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

  // Render content based on whether nowKey/nextKey are 'countdown' or artist keys
  const renderNowContent = () => {
    if (nowKey === 'countdown') {
      return (
        <>
          <Text style={styles.header}>DILLO DAY COUNTDOWN</Text>
          <Text style={styles.countdownText}>
            {!isNaN(countdown.days) ? countdown.days : 0}d{' '}
            {!isNaN(countdown.hours) ? countdown.hours : 0}h{' '}
            {!isNaN(countdown.minutes) ? countdown.minutes : 0}m{' '}
            {!isNaN(countdown.seconds) ? countdown.seconds : 0}s
          </Text>
        </>
      );
    } else {
      return (
        <View>
          <Text style={styles.header}>NOW SHOWING</Text>
          <Text style={styles.artistName}>
            {nowArtist?.name ?? 'Unknown Artist'}
          </Text>
          <View style={styles.timeStageRow}>
            <Text style={[styles.timeStageText, styles.timeLeft]}>
              {/* {nowArtist?.time ?? 'TBD'} */}
              {nowArtist?.stage === 'main' ? 'Main Stage' : nowArtist?.stage}
            </Text>
            {/* <Text style={styles.timeStageBar}>|</Text> */}
            <Text style={[styles.timeStageText, styles.timeRight]}>
              {/* {nowArtist?.stage === 'main' ? 'Main Stage' : nowArtist?.stage}
               */}
              {nowArtist?.time ?? 'TBD'}
            </Text>
          </View>
        </View>
      );
    }
  };

  const renderNextContent = () => {
    if (nextKey === 'countdown') {
      return (
        <>
          <Text style={styles.header}>DILLO DAY</Text>
          <Text style={styles.artistName}>May 17, 2025</Text>
        </>
      );
    } else {
      return (
        <View>
          <Text style={styles.header}>NEXT UP</Text>
          <Text style={styles.artistName}>{nextArtist?.name ?? 'TBD'}</Text>
          <View style={styles.timeStageRow}>
            <Text style={[styles.timeStageText, styles.timeLeft]}>
              {nextArtist?.stage === 'main' ? 'Main Stage' : nowArtist?.stage}
              {/* {nowArtist?.time ?? 'TBD'} */}
            </Text>
            {/* <Text style={styles.timeStageBar}>|</Text> */}
            <Text style={[styles.timeStageText, styles.timeRight]}>
              {/* {nowArtist?.stage === 'main' ? 'Main Stage' : nowArtist?.stage}
               */}
              {nextArtist?.time ?? 'TBD'}
            </Text>
          </View>
        </View>
      );
    }
  };

  const openModal = (key: string) => {
    setSelectedKey(key);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedKey(null);
  };

  if (loading || !config?.home?.panels?.length) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <View style={styles.container}>
        <View
          style={[styles.marquee, { height: marqueeHeight }]}
          onLayout={handleLayout}
        >
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
            <TouchableOpacity
              onPress={() => nowKey !== 'countdown' && openModal(nowKey!)}
              style={styles.touchableBlock}
            >
              {renderNowContent()}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              onPress={() => nextKey !== 'countdown' && openModal(nextKey!)}
              style={styles.touchableBlock}
            >
              {renderNextContent()}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ArtistDetailModal
        visible={modalVisible}
        artist={selectedKey ? config.artists[selectedKey] : null}
        onClose={closeModal}
      />
    </>
  );
}

interface Styles {
  container: ViewStyle;
  marquee: ViewStyle;
  content: ViewStyle;
  header: TextStyle;
  artistName: TextStyle;
  artistTime: TextStyle;
  countdownText: TextStyle;
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
    height: 350,
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
    fontFamily: 'Poppins_700Bold',
    color: '#2E4172',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.light.text,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 10,
    textAlign: 'center',
  },
  artistTime: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 16,
    textAlign: 'center',
  },
  countdownText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E4172',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  divider: {
    width: '100%',
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
  touchableBlock: {
    width: '100%',
    alignItems: 'center',
  },
  timeStageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    width: '100%',
  },
  timeStageText: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.light.text,
  },
  timeLeft: {
    flex: 1,
    // marginRight: 10,
    textAlign: 'left', // hugs the pipe from the left
  },
  timeStageBar: {
    width: 20,
    textAlign: 'center', // bar itself is centered in its box
  },
  timeRight: {
    flex: 1,
    textAlign: 'right', // hugs the pipe from the right
  },
});
