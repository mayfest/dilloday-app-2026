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
/** Pixel width of one 30-minute column (wider = more horizontal space per slot). */
const COLUMN_WIDTH = 152;

const HEADER_TIME_HEIGHT = 44;
const STAGE_TITLE_HEIGHT = 40;
/** Vertical space between stage sections (title + track blocks). */
const STAGE_BLOCK_GAP = 24;
/** Taller track = taller stage row (title + this + gap). */
const TRACK_HEIGHT = 108;
const RAIL_HEIGHT = 4;
/** Gray timeline area inside the red/white stripes. */
const TRACK_CONTENT_HEIGHT = TRACK_HEIGHT - RAIL_HEIGHT * 2;
/** Slimmer card + equal top/bottom inset so it sits vertically centered. */
const ARTIST_CARD_HEIGHT = TRACK_CONTENT_HEIGHT - 10;
const ARTIST_CARD_TOP = (TRACK_CONTENT_HEIGHT - ARTIST_CARD_HEIGHT) / 2;
/** Cards are clipped to their performance duration. Names wrap to extra lines when the slot is too narrow for one line. */
const ARTIST_CARD_HARD_MIN = 56;
/** Below this card width the music-note thumb is hidden so the name has room to wrap legibly. */
const ARTIST_THUMB_HIDE_THRESHOLD = 110;
/** Maximum lines the wrapped artist name will render before truncating with an ellipsis. */
const ARTIST_NAME_MAX_LINES = 3;

/** Vertical time column dividers (track + header tick). */
const TIMELINE_GRID_LINE_WIDTH = 1;
const TIMELINE_GRID_LINE_COLOR = '#767676';

/** Vertical gap between stacked lanes inside a single stage's track. */
const LANE_GAP = 8;

function computeTrackContentHeight(numLanes: number) {
  const safe = Math.max(1, numLanes);
  return (
    ARTIST_CARD_TOP * 2 + safe * ARTIST_CARD_HEIGHT + (safe - 1) * LANE_GAP
  );
}

function computeTrackHeight(numLanes: number) {
  return computeTrackContentHeight(numLanes) + RAIL_HEIGHT * 2;
}

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

type PositionedSlot = {
  slot: FestivalSlot;
  left: number;
  width: number;
  lane: number;
  visible: boolean;
};

/** Greedy lane assignment: a slot drops into the lowest lane whose previous card already ended at or before this card's left edge. */
function layoutStageSlots(
  slots: FestivalSlot[],
  startM: number,
  totalMinutes: number,
  pxPerMinute: number
): { positioned: PositionedSlot[]; numLanes: number } {
  const sorted = [...slots].sort((a, b) => a.startMinutes - b.startMinutes);
  const laneEnds: number[] = [];
  const positioned: PositionedSlot[] = [];

  for (const slot of sorted) {
    const offsetMin = slot.startMinutes - startM;
    const visible = !(
      offsetMin + slot.durationMinutes < 0 || offsetMin > totalMinutes
    );

    const left = Math.max(0, offsetMin * pxPerMinute);
    const proportionalWidth = slot.durationMinutes * pxPerMinute;
    const width = Math.max(ARTIST_CARD_HARD_MIN, proportionalWidth);
    const right = left + width;

    let lane = laneEnds.findIndex((end) => end <= left);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(right);
    } else {
      laneEnds[lane] = right;
    }

    positioned.push({ slot, left, width, lane, visible });
  }

  return { positioned, numLanes: Math.max(1, laneEnds.length) };
}

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

              headerRef.current?.scrollTo({ x, animated: true });

              Object.values(stageRefs.current).forEach((scrollRef) => {
                if (scrollRef) {
                  scrollRef.scrollTo({ x, animated: true });
                }
              });

              return {
                found: true,
                stageIndex,
                slot,
              };
            }
          }

          return {
            found: false,
            stageIndex: -1,
          };
        },
      }),
      [stages, startM, pxPerMinute]
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

        {stages.map((stage) => {
          const { positioned, numLanes } = layoutStageSlots(
            stage.slots,
            startM,
            totalMinutes,
            pxPerMinute
          );
          const trackHeight = computeTrackHeight(numLanes);
          const trackContentHeight = computeTrackContentHeight(numLanes);

          return (
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
                  style={[
                    styles.timelineTrackWrap,
                    { width: timelineWidth, height: trackHeight },
                  ]}
                >
                  <RacingBorder width={timelineWidth} position='top' />
                  <RacingBorder width={timelineWidth} position='bottom' />

                  <View
                    style={[
                      styles.timelineTrack,
                      { width: timelineWidth, height: trackContentHeight },
                    ]}
                  >
                    {Array.from({ length: columnCount + 1 }, (_, i) => (
                      <View
                        key={`${stage.key}-grid-${i}`}
                        style={[styles.gridLine, { left: i * COLUMN_WIDTH }]}
                      />
                    ))}

                    {positioned.map(({ slot, left, width, lane, visible }) => {
                      if (!visible) return null;

                      const top =
                        ARTIST_CARD_TOP +
                        lane * (ARTIST_CARD_HEIGHT + LANE_GAP);
                      const showThumb = width >= ARTIST_THUMB_HIDE_THRESHOLD;

                      return (
                        <Pressable
                          key={slot.id}
                          onPress={() => onPressArtist(slot, stage.name)}
                          style={[
                            styles.artistCard,
                            {
                              left,
                              width,
                              top,
                            },
                          ]}
                        >
                          <View style={styles.artistCardRow}>
                            {showThumb &&
                              (slot.imageUri ? (
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
                              ))}

                            <View
                              style={[
                                styles.artistTextCol,
                                !showThumb && styles.artistTextColNoThumb,
                              ]}
                            >
                              <Text
                                style={styles.artistName}
                                numberOfLines={ARTIST_NAME_MAX_LINES}
                              >
                                {slot.name.toUpperCase()}
                              </Text>
                              <Text style={styles.artistTime} numberOfLines={1}>
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
          );
        })}
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
    borderBottomWidth: TIMELINE_GRID_LINE_WIDTH,
    borderBottomColor: TIMELINE_GRID_LINE_COLOR,
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
    width: TIMELINE_GRID_LINE_WIDTH,
    height: 12,
    backgroundColor: TIMELINE_GRID_LINE_COLOR,
  },
  lastGridLine: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: TIMELINE_GRID_LINE_WIDTH,
    backgroundColor: TIMELINE_GRID_LINE_COLOR,
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
    fontSize: 20,
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
    width: TIMELINE_GRID_LINE_WIDTH,
    backgroundColor: TIMELINE_GRID_LINE_COLOR,
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
    width: 46,
    height: 46,
    borderRadius: 4,
    backgroundColor: '#1a1a1a',
  },
  artistThumbPlaceholder: {
    width: 46,
    height: 46,
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
  artistTextColNoThumb: {
    marginLeft: 0,
  },
  artistName: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 0.25,
  },
  artistTime: {
    color: '#ccc',
    fontSize: 12,
    lineHeight: 15,
    marginTop: 3,
    fontWeight: '600',
  },
});
