import { FontAwesome6 } from '@expo/vector-icons';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

const HOUR_WIDTH = 132;
const HEADER_TIME_HEIGHT = 40;
const STAGE_TITLE_HEIGHT = 28;
const STAGE_BLOCK_GAP = 14;
const TRACK_HEIGHT = 94;
const RAIL_HEIGHT = 4;

export const STAGE_BLOCK_HEIGHT =
  STAGE_TITLE_HEIGHT + 6 + TRACK_HEIGHT + STAGE_BLOCK_GAP;

export type FestivalSlot = {
  id: string;
  name: string;
  startMinutes: number;
  durationMinutes: number;
  imageUri?: string;
};

export type FestivalStage = {
  key: string;
  name: string;
  slots: FestivalSlot[];
};

type Props = {
  stages: FestivalStage[];
  startHour: number;
  hourSpan: number;
  onPressArtist: (slot: FestivalSlot, stageName: string) => void;
};

export type FestivalLineupTimelineHandle = {
  scrollToArtist: (artistName: string) => {
    found: boolean;
    stageIndex: number;
    slot?: FestivalSlot;
  };
};

function formatClock(totalMinutes: number) {
  const rawHour = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const suffix = rawHour >= 12 ? 'PM' : 'AM';
  const hour12 = rawHour % 12 === 0 ? 12 : rawHour % 12;

  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

function formatHourLabel(hour24: number) {
  const suffix = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:00 ${suffix}`;
}

function RacingBorder({
  width,
  position,
}: {
  width: number;
  position: 'top' | 'bottom';
}) {
  const segments = Math.max(8, Math.ceil(width / 28));

  return (
    <View
      pointerEvents='none'
      style={[
        styles.racingBorder,
        position === 'top' ? styles.racingBorderTop : styles.racingBorderBottom,
        { width },
      ]}
    >
      {Array.from({ length: segments }, (_, i) => (
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

const FestivalLineupTimeline = forwardRef<FestivalLineupTimelineHandle, Props>(
  ({ stages, startHour, hourSpan, onPressArtist }, ref) => {
    const { width: screenWidth } = useWindowDimensions();

    const startM = startHour * 60;
    const totalMinutes = hourSpan * 60;
    const timelineWidth = Math.max(hourSpan * HOUR_WIDTH, screenWidth);

    const headerRef = useRef<ScrollView | null>(null);
    const stageRefs = useRef<Record<string, ScrollView | null>>({});
    const isSyncingRef = useRef(false);

    const hours = Array.from({ length: hourSpan }, (_, i) => startHour + i);

    const syncScroll = useCallback((source: 'header' | string, x: number) => {
      if (isSyncingRef.current) {
        return;
      }

      isSyncingRef.current = true;

      if (source !== 'header') {
        headerRef.current?.scrollTo({ x, animated: false });
      }

      Object.entries(stageRefs.current).forEach(([key, ref]) => {
        if (key !== source) {
          ref?.scrollTo({ x, animated: false });
        }
      });

      requestAnimationFrame(() => {
        isSyncingRef.current = false;
      });
    }, []);

    const handleScroll =
      (source: 'header' | string) =>
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        syncScroll(source, event.nativeEvent.contentOffset.x);
      };

    useImperativeHandle(
      ref,
      () => ({
        scrollToArtist: (artistName: string) => {
          const normalized = artistName.trim().toLowerCase();
          if (!normalized) {
            return { found: false, stageIndex: -1 };
          }

          for (let stageIndex = 0; stageIndex < stages.length; stageIndex++) {
            const stage = stages[stageIndex];
            const slot = stage.slots.find((s) =>
              s.name.toLowerCase().includes(normalized)
            );

            if (slot) {
              const offsetMin = slot.startMinutes - startM;
              const x = Math.max(0, (offsetMin / 60) * HOUR_WIDTH - 24);
              syncScroll('header', x);
              return { found: true, stageIndex, slot };
            }
          }

          return { found: false, stageIndex: -1 };
        },
      }),
      [stages, startM, syncScroll]
    );

    return (
      <View style={styles.container}>
        <ScrollView
          ref={headerRef}
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll('header')}
        >
          <View style={[styles.timeRow, { width: timelineWidth }]}>
            {hours.map((hour) => (
              <View key={hour} style={[styles.hourCell, { width: HOUR_WIDTH }]}>
                <Text style={styles.hourText}>{formatHourLabel(hour)}</Text>
                <View style={styles.hourTick} />
              </View>
            ))}
            <View style={styles.lastGridLine} />
          </View>
        </ScrollView>

        {stages.map((stage) => (
          <View key={stage.key} style={styles.stageBlock}>
            <View style={styles.stageTitleWrap}>
              <Text style={styles.stageName}>{stage.name}</Text>
            </View>

            <ScrollView
              ref={(r) => {
                stageRefs.current[stage.key] = r;
              }}
              horizontal
              bounces={false}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={handleScroll(stage.key)}
            >
              <View style={[styles.timelineTrackWrap, { width: timelineWidth }]}>
                <RacingBorder width={timelineWidth} position='top' />
                <RacingBorder width={timelineWidth} position='bottom' />

                <View style={[styles.timelineTrack, { width: timelineWidth }]}>
                  {Array.from({ length: hourSpan + 1 }, (_, i) => (
                    <View
                      key={`${stage.key}-grid-${i}`}
                      style={[styles.gridLine, { left: i * HOUR_WIDTH }]}
                    />
                  ))}

                  {stage.slots.map((slot) => {
                    const offsetMin = slot.startMinutes - startM;

                    if (
                      offsetMin + slot.durationMinutes < 0 ||
                      offsetMin > totalMinutes
                    ) {
                      return null;
                    }

                    const left = Math.max(0, (offsetMin / 60) * HOUR_WIDTH);
                    const width = Math.max(
                      slot.imageUri ? 172 : 132,
                      (slot.durationMinutes / 60) * HOUR_WIDTH + 18
                    );

                    return (
                      <Pressable
                        key={slot.id}
                        onPress={() => onPressArtist(slot, stage.name)}
                        style={[
                          styles.artistCard,
                          {
                            left,
                            width,
                            top: 9,
                          },
                        ]}
                      >
                        <View style={styles.artistCardRow}>
                          {slot.imageUri ? (
                            <Image
                              source={{ uri: slot.imageUri }}
                              style={styles.artistThumb}
                              resizeMode='cover'
                            />
                          ) : (
                            <View style={styles.artistThumbPlaceholder}>
                              <FontAwesome6
                                name='music'
                                size={14}
                                color='#888'
                              />
                            </View>
                          )}

                          <View style={styles.artistTextCol}>
                            <Text style={styles.artistName} numberOfLines={2}>
                              {slot.name.toUpperCase()}
                            </Text>
                            <Text style={styles.artistTime}>
                              {formatClock(slot.startMinutes)}
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </ScrollView>
          </View>
        ))}
      </View>
    );
  }
);

export default FestivalLineupTimeline;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  timeRow: {
    height: HEADER_TIME_HEIGHT,
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
    position: 'relative',
  },
  hourCell: {
    height: HEADER_TIME_HEIGHT,
    justifyContent: 'flex-start',
    paddingTop: 4,
    position: 'relative',
  },
  hourText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.9,
  },
  hourTick: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    height: 10,
    backgroundColor: '#555',
  },
  lastGridLine: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#555',
  },
  stageBlock: {
    marginBottom: STAGE_BLOCK_GAP,
  },
  stageTitleWrap: {
    height: STAGE_TITLE_HEIGHT,
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  stageName: {
    color: '#FFEB3B',
    fontFamily: 'FuturaBold',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  timelineTrackWrap: {
    position: 'relative',
    height: TRACK_HEIGHT,
    justifyContent: 'center',
  },
  timelineTrack: {
    height: TRACK_HEIGHT - RAIL_HEIGHT * 2,
    marginVertical: RAIL_HEIGHT,
    backgroundColor: '#232323',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  racingBorder: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    height: RAIL_HEIGHT,
    overflow: 'hidden',
    borderRadius: 1,
    zIndex: 3,
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
  gridLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#3b3b3b',
  },
  artistCard: {
    position: 'absolute',
    height: TRACK_HEIGHT - 18,
    backgroundColor: '#2f2f2f',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#4a4a4a',
    overflow: 'hidden',
  },
  artistCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  artistThumb: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#1a1a1a',
  },
  artistThumbPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  artistTextCol: {
    marginLeft: 8,
    flex: 1,
    minWidth: 0,
  },
  artistName: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  artistTime: {
    color: '#ccc',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },
});