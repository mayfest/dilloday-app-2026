import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';

import { FontAwesome6 } from '@expo/vector-icons';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

/** Each grid column represents this many minutes (was 60; half-hour gives 2× width per hour). */
const COLUMN_MINUTES_SPAN = 30;
/** Pixel width of one column (unchanged from old “hour column” footprint). */
const COLUMN_WIDTH = 132;

const HEADER_TIME_HEIGHT = 40;
const STAGE_TITLE_HEIGHT = 28;
const STAGE_BLOCK_GAP = 14;
const TRACK_HEIGHT = 94;
const RAIL_HEIGHT = 4;
/** Gray timeline area inside the red/white stripes. */
const TRACK_CONTENT_HEIGHT = TRACK_HEIGHT - RAIL_HEIGHT * 2;
/** Slimmer card + equal top/bottom inset so it sits vertically centered. */
const ARTIST_CARD_HEIGHT = TRACK_CONTENT_HEIGHT - 10;
const ARTIST_CARD_TOP = (TRACK_CONTENT_HEIGHT - ARTIST_CARD_HEIGHT) / 2;
/** Narrow sets stay tappable/readable without distorting proportional scale too much */
const ARTIST_CARD_MIN_WIDTH = 44;

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
  /** Hour of day (0–23) for the left edge of the timeline. */
  startHour: number;
  /** Minutes past the hour; defaults to 0 (e.g. 45 with startHour 11 → 11:45 AM). */
  startMinute?: number;
  /** Visible window length in whole hours (drawn at half‑hour increments). */
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

const MINUTES_DAY = 24 * 60;

function normalizeMinuteOfDay(totalMinutes: number) {
  return ((Math.floor(totalMinutes) % MINUTES_DAY) + MINUTES_DAY) % MINUTES_DAY;
}

/** 12-hour clock labels for LINEUP timeline (exported for lineup screen alerts). */
export function formatClock(totalMinutes: number) {
  const mins = normalizeMinuteOfDay(totalMinutes);
  const rawHour = Math.floor(mins / 60) % 24;
  const minutes = mins % 60;
  const suffix = rawHour >= 12 ? 'PM' : 'AM';
  const hour12 = rawHour % 12 === 0 ? 12 : rawHour % 12;

  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
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
  ({ stages, startHour, startMinute = 0, hourSpan, onPressArtist }, ref) => {
    const { width: screenWidth } = useWindowDimensions();

    const startM = startHour * 60 + startMinute;
    const totalMinutes = hourSpan * 60;
    const pxPerMinute = COLUMN_WIDTH / COLUMN_MINUTES_SPAN;
    const columnCount =
      totalMinutes <= 0 ? 0 : Math.ceil(totalMinutes / COLUMN_MINUTES_SPAN);

    const timelineWidth = Math.max(columnCount * COLUMN_WIDTH, screenWidth);

    const headerRef = useRef<ScrollView | null>(null);
    const stageRefs = useRef<Record<string, ScrollView | null>>({});
    const isSyncingRef = useRef(false);

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
              const x = Math.max(0, offsetMin * pxPerMinute - 24);
              syncScroll('header', x);
              return { found: true, stageIndex, slot };
            }
          }

          return { found: false, stageIndex: -1 };
        },
      }),
      [stages, startM, syncScroll, pxPerMinute]
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
            {Array.from({ length: columnCount }, (_, i) => {
              const t = startM + i * COLUMN_MINUTES_SPAN;
              return (
                <View
                  key={t}
                  style={[styles.hourCell, { width: COLUMN_WIDTH }]}
                >
                  <Text style={styles.hourText}>{formatClock(t)}</Text>
                  <View style={styles.hourTick} />
                </View>
              );
            })}
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
              <View
                style={[styles.timelineTrackWrap, { width: timelineWidth }]}
              >
                <RacingBorder width={timelineWidth} position='top' />
                <RacingBorder width={timelineWidth} position='bottom' />

                <View style={[styles.timelineTrack, { width: timelineWidth }]}>
                  {Array.from({ length: columnCount + 1 }, (_, i) => (
                    <View
                      key={`${stage.key}-grid-${i}`}
                      style={[styles.gridLine, { left: i * COLUMN_WIDTH }]}
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

                    const left = Math.max(0, offsetMin * pxPerMinute);
                    const proportionalWidth =
                      slot.durationMinutes * pxPerMinute;
                    const width = Math.max(
                      ARTIST_CARD_MIN_WIDTH,
                      proportionalWidth
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
                            top: ARTIST_CARD_TOP,
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

FestivalLineupTimeline.displayName = 'FestivalLineupTimeline';

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
    fontSize: 10,
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
    height: ARTIST_CARD_HEIGHT,
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
