import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import GlobalNavivationWrapper from '@/components/navigation/navigation-bar';
import FestivalLineupTimeline, {
  type FestivalLineupTimelineHandle,
  type FestivalSlot,
  type FestivalStage,
  formatClock as formatAmPmClock,
} from '@/components/schedule/festival-lineup-timeline';
import {
  MAIN_STAGE_TICKET_RENDERED_HEIGHT,
  getMainStageTicketSvgWidth,
} from '@/components/schedule/main-stage-ticket';
import type { Artist } from '@/lib/artist';
import { type Config, useConfig } from '@/lib/config';
import type { Stage } from '@/lib/schedule';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** ~60px bar + `GlobalTabBar` bottom offset + buffer — keep in sync with `global-tab-bar.tsx`. */
const TAB_BAR_CLEARANCE = 116;
/** Matches “LINEUP” title and artist sheet background. */
const LINEUP_ACCENT_YELLOW = '#FFEB3B';
const TIMELINE_START_HOUR = 11;
const TIMELINE_START_MINUTE = 30;
/** Total window length in hours; ticks every 30 min (timeline starts at first tick). */
const TIMELINE_HOUR_SPAN = 12;
/** Fallback length (minutes) only when inference is impossible. */
const DEFAULT_SLOT_DURATION = 50;
const MIN_SET_DURATION_MINUTES = 15;
const MAX_SET_DURATION_MINUTES = 8 * 60;

function parseArtistTime(time?: string): number | null {
  if (!time) return null;

  const t = time.trim().toUpperCase();
  const match = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/);
  if (!match) return null;

  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const ap = match[3];

  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;

  return h * 60 + m;
}

function stageSortRank(key: string, stage: Stage): number {
  const p = stage.position;
  if (typeof p === 'number' && !Number.isNaN(p)) return p;

  const k = key.toLowerCase();
  const n = stage.name.toLowerCase();

  if (k.includes('main') || n.includes('main')) return 10;
  if (k.includes('fmo') || n.includes('fmo') || n.includes('members only'))
    return 20;
  if (k.includes('lakefill') || n.includes('lakefill')) return 30;

  return 100;
}

function buildStagesFromConfig(config: Config): FestivalStage[] {
  if (!config.schedule) return [];

  const sorted = Object.entries(config.schedule)
    .map(([key, stage]) => ({ key, stage }))
    .sort((a, b) => {
      const ra = stageSortRank(a.key, a.stage);
      const rb = stageSortRank(b.key, b.stage);
      if (ra !== rb) return ra - rb;
      return a.key.localeCompare(b.key);
    });

  const startM = TIMELINE_START_HOUR * 60 + TIMELINE_START_MINUTE;
  const endM = startM + TIMELINE_HOUR_SPAN * 60;

  return sorted.map(({ key, stage }) => {
    type Row = {
      idx: number;
      id: string;
      artist: Artist | undefined;
      startMinutes: number;
    };

    const rows: Row[] = stage.artists
      .map((artistId, idx) => {
        const a = config.artists[artistId];
        const parsed = parseArtistTime(a?.time);

        let startMinutes =
          parsed ?? startM + idx * 55 + Math.floor(idx / 2) * 12;

        if (startMinutes < startM) startMinutes = startM + idx * 40;
        if (startMinutes >= endM - 30) startMinutes = endM - 40 - idx * 5;

        return {
          idx,
          id: artistId,
          artist: a,
          startMinutes,
        };
      })
      .sort((a, b) => {
        if (a.startMinutes !== b.startMinutes)
          return a.startMinutes - b.startMinutes;
        return a.idx - b.idx;
      });

    const slots: FestivalSlot[] = rows.map((row, i) => {
      const nextStart = i < rows.length - 1 ? rows[i + 1].startMinutes : null;
      const durationMinutes = resolveSetDurationMinutes(
        row.startMinutes,
        row.artist,
        nextStart,
        i >= rows.length - 1,
        endM
      );

      return {
        id: row.id,
        name: row.artist?.name ?? 'Artist',
        startMinutes: row.startMinutes,
        durationMinutes,
        imageUri: row.artist?.image,
      };
    });

    return {
      key,
      name: stage.name.toUpperCase(),
      slots,
    };
  });
}

/** Firestore may persist `durationMinutes` as number or (if mistyped) string. */
function readExplicitDurationMinutes(artist?: Artist): number | null {
  if (!artist) return null;
  const raw = artist.durationMinutes as unknown;
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) return raw;
  if (typeof raw === 'string') {
    const n = Number(raw.trim());
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

/** Length of each visual bar comes from explicit config, span to endTime, gap to next act, or a safe default. */
function resolveSetDurationMinutes(
  startMinutes: number,
  artist: Artist | undefined,
  nextStartMinutes: number | null,
  isLast: boolean,
  endBoundMinutes: number
): number {
  const clampBand = (d: number) =>
    Math.max(
      MIN_SET_DURATION_MINUTES,
      Math.min(MAX_SET_DURATION_MINUTES, Math.round(d))
    );

  const explicit = readExplicitDurationMinutes(artist);

  if (explicit != null) {
    return clampBand(explicit);
  }

  const endParsed = artist?.endTime ? parseArtistTime(artist.endTime) : null;

  if (endParsed != null) {
    const span = endParsed - startMinutes;
    if (span > 0) {
      return clampBand(span);
    }
  }

  if (!isLast && nextStartMinutes != null) {
    const gap = nextStartMinutes - startMinutes;
    if (gap >= MIN_SET_DURATION_MINUTES) {
      return clampBand(gap);
    }
    return MIN_SET_DURATION_MINUTES;
  }

  const remainingTail = Math.max(
    endBoundMinutes - startMinutes,
    MIN_SET_DURATION_MINUTES
  );
  const fallbackLast = Math.min(DEFAULT_SLOT_DURATION, remainingTail);

  return clampBand(Math.max(MIN_SET_DURATION_MINUTES, fallbackLast));
}

/** Pull license plate up over hero image (~12–14% of ticket height). */
const PLATE_OVERLAP_RATIO = 0.13;

export default function LineupScreen() {
  const { artist } = useLocalSearchParams();
  const timelineRef = useRef<FestivalLineupTimelineHandle>(null);
  const { width: windowWidth } = useWindowDimensions();
  const headlinerTicketImageWidth = getMainStageTicketSvgWidth(windowWidth);
  const heroImageHeight = MAIN_STAGE_TICKET_RENDERED_HEIGHT;
  const plateOverlapY = Math.round(heroImageHeight * PLATE_OVERLAP_RATIO);
  const insets = useSafeAreaInsets();
  const { config } = useConfig();
  const [selectedArtist, setSelectedArtist] = useState<{
    slot: FestivalSlot;
    stage: string;
  } | null>(null);
  const [timelineKey, setTimelineKey] = useState(0);

  const artistData = useMemo(() => {
    if (!selectedArtist) return undefined;
    return config?.artists?.[selectedArtist.slot.id];
  }, [selectedArtist, config]);

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(0)).current;

  const closeArtistModal = useCallback(() => {
    const h = Dimensions.get('window').height;
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: h,
        duration: 260,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => setSelectedArtist(null));
  }, [backdropOpacity, sheetTranslateY]);

  useEffect(() => {
    if (!selectedArtist) return;

    const h = Dimensions.get('window').height;
    backdropOpacity.setValue(0);
    sheetTranslateY.setValue(h);

    Animated.parallel([
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      closeArtistModal();
      return true;
    });

    return () => sub.remove();
  }, [selectedArtist, backdropOpacity, sheetTranslateY, closeArtistModal]);

  const stages = useMemo(() => {
    if (!config?.schedule) return [];
    return buildStagesFromConfig(config).filter((s) => s.slots.length > 0);
  }, [config]);

  const scheduleLoading = config === null;
  const scheduleEmpty =
    config !== null &&
    (!config.schedule ||
      Object.keys(config.schedule).length === 0 ||
      stages.length === 0);

  const onPressArtist = useCallback((slot: FestivalSlot, stageName: string) => {
    setSelectedArtist({ slot, stage: stageName });
  }, []);

  useEffect(() => {
    if (!artist) return;

    const timer = setTimeout(() => {
      const result = timelineRef.current?.scrollToArtist(String(artist));

      if (result?.found && result.slot) {
        const slot = result.slot;

        setTimeout(() => {
          onPressArtist(slot, stages[result.stageIndex].name);
          router.setParams({ artist: undefined });
        }, 400);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [artist, onPressArtist, stages]);

  useFocusEffect(
    useCallback(() => {
      setTimelineKey((key) => key + 1);
    }, [])
  );

  return (
    <GlobalNavivationWrapper>
      <View
        style={[
          styles.root,
          {
            paddingTop: insets.top,
            paddingBottom: Math.max(insets.bottom, 8) + TAB_BAR_CLEARANCE,
          },
        ]}
      >
        <StatusBar style='light' />

        <View style={styles.topBar}>
          <View
            style={styles.lineupTitleWrap}
            collapsable={Platform.OS === 'android' ? false : undefined}
          >
            <Text style={styles.lineupTitle}>LINEUP</Text>
          </View>
        </View>

        <ScrollView
          style={styles.timelineScroll}
          showsVerticalScrollIndicator={false}
        >
          {scheduleLoading ? (
            <View style={styles.scheduleFallback}>
              <ActivityIndicator size='large' color={LINEUP_ACCENT_YELLOW} />
              <Text style={styles.scheduleFallbackText}>Loading lineup…</Text>
            </View>
          ) : scheduleEmpty ? (
            <View style={styles.scheduleFallback}>
              <Text style={styles.scheduleFallbackText}>
                No lineup is published in the app config yet. When stages and
                artists are added in Firebase, they will appear here.
              </Text>
            </View>
          ) : (
            <FestivalLineupTimeline
              key={timelineKey}
              ref={timelineRef}
              stages={stages}
              startHour={TIMELINE_START_HOUR}
              startMinute={TIMELINE_START_MINUTE}
              hourSpan={TIMELINE_HOUR_SPAN}
              onPressArtist={onPressArtist}
            />
          )}
        </ScrollView>

        <Modal
          visible={!!selectedArtist}
          animationType='none'
          transparent
          onRequestClose={closeArtistModal}
        >
          <View style={styles.modalContainer}>
            <Animated.View
              pointerEvents='box-none'
              style={[styles.backdropWrap, { opacity: backdropOpacity }]}
            >
              <Pressable
                style={StyleSheet.absoluteFill}
                accessibilityRole='button'
                accessibilityLabel='Close artist details'
                onPress={closeArtistModal}
              >
                <View style={styles.backdrop} />
              </Pressable>
            </Animated.View>

            <Animated.View
              style={[
                styles.popupSheetWrap,
                { transform: [{ translateY: sheetTranslateY }] },
              ]}
            >
              <View
                style={[
                  styles.popupSheet,
                  { paddingBottom: insets.bottom + 20 },
                ]}
              >
                <View style={styles.dragHandle} />

                <ScrollView showsVerticalScrollIndicator={false}>
                  {selectedArtist && (
                    <View style={styles.contentContainer}>
                      <View
                        style={[
                          styles.heroPlateStack,
                          { width: headlinerTicketImageWidth },
                        ]}
                      >
                        <Image
                          source={{
                            uri:
                              artistData?.image ||
                              selectedArtist.slot.imageUri ||
                              'https://via.placeholder.com/400',
                          }}
                          style={[
                            styles.artistHeroImage,
                            {
                              width: '100%',
                              height: heroImageHeight,
                            },
                          ]}
                          resizeMode='cover'
                        />

                        <View
                          style={[
                            styles.plateCard,
                            { marginTop: -plateOverlapY, width: '100%' },
                          ]}
                        >
                          <View style={styles.plateHeader}>
                            <View style={styles.locBadge}>
                              <Text style={styles.locText}>L.A., CA</Text>
                            </View>
                            <Text style={styles.plateStageText}>
                              {selectedArtist.stage}
                            </Text>
                            <View style={styles.timeBadge}>
                              <Text style={styles.timeText}>
                                {formatAmPmClock(
                                  selectedArtist.slot.startMinutes
                                )}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.plateBody}>
                            <Text style={styles.plateArtistName}>
                              {selectedArtist.slot.name
                                .split(' ')
                                .join('\n')
                                .toUpperCase()}
                            </Text>
                          </View>

                          <View style={styles.plateFooter}>
                            <Text style={styles.footerSubtext}>
                              NIGHTTIME HEADLINER
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* 3. Bio Text */}
                      <Text style={styles.bioText}>
                        {artistData?.description ||
                          'No biography available for this artist.'}
                      </Text>

                      <Pressable
                        style={styles.closeBtn}
                        onPress={closeArtistModal}
                      >
                        <Text style={styles.closeBtnText}>Close</Text>
                      </Pressable>
                    </View>
                  )}
                </ScrollView>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </View>
    </GlobalNavivationWrapper>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  topBar: {
    alignItems: 'center',
    backgroundColor: '#000',
    overflow: 'visible',
    paddingTop: 18,
    paddingBottom: 14,
    paddingHorizontal: 8,
    width: '100%',
    zIndex: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2a2a2a',
  },
  lineupTitleWrap: {
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
    paddingHorizontal: 32,
    paddingVertical: 2,
  },
  lineupTitle: {
    color: LINEUP_ACCENT_YELLOW,
    fontFamily: 'SofachromeIt',
    fontSize: 29,
    lineHeight: 44,
    textAlign: 'center',
    overflow: 'visible',
  },
  timelineScroll: { flex: 1 },
  scheduleFallback: {
    flex: 1,
    minHeight: 200,
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  scheduleFallbackText: {
    color: '#ccc',
    fontFamily: 'Futura',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },

  modalContainer: { flex: 1, justifyContent: 'flex-end' },
  backdropWrap: StyleSheet.absoluteFillObject,
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  popupSheetWrap: {
    zIndex: 1,
    width: '100%',
    height: '60%',
  },

  popupSheet: {
    flex: 1,
    backgroundColor: LINEUP_ACCENT_YELLOW,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 32,
  },

  heroPlateStack: {
    alignSelf: 'center',
    position: 'relative',
    zIndex: 0,
  },

  artistHeroImage: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    position: 'relative',
    zIndex: 0,
  },

  // License Plate Card
  plateCard: {
    backgroundColor: '#FFFBE6',
    borderRadius: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    position: 'relative',
    zIndex: 1,
  },
  plateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  locBadge: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  locText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  timeBadge: {
    backgroundColor: '#FFB300',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  timeText: { color: 'black', fontSize: 10, fontWeight: 'bold' },
  plateStageText: { color: '#D32F2F', fontWeight: '900', fontSize: 14 },

  plateBody: { paddingVertical: 10 },
  plateArtistName: {
    fontFamily: 'Sofachrome',
    fontSize: 26,
    color: '#1A365D',
    textAlign: 'center',
    lineHeight: 32,
  },
  plateFooter: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    width: '100%',
    paddingTop: 5,
    alignItems: 'center',
  },

  footerSubtext: {
    fontSize: 10,
    color: '#2D5A27',
    fontWeight: 'bold',
  },

  bioText: {
    marginTop: 20,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Futura',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  closeBtn: {
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 12,
  },
  closeBtnText: {
    color: 'white',
    fontFamily: 'FuturaBold',
    fontSize: 15,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
