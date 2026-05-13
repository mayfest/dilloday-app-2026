import React, { useCallback, useEffect, useMemo, useState } from 'react';

import InfoSpeedwayHome from '@/assets/images/info-speedway-home.svg';
import MapSpeedwayHome from '@/assets/images/map-speedway-home.svg';
import AnnouncementPanel from '@/components/home/announcement-panel';
import ArtistPanel from '@/components/home/artist-panel';
import DilloSpeedwayButton from '@/components/home/dillo-speedway';
import LoadingIndicator from '@/components/loading-indicator';
import TabScreen from '@/components/tab-screen';
import {
  sofachromeTitleTextStyle
} from '@/constants/sofachrome-screen-title';
import { getAnnouncements } from '@/lib/announcement';
import { isArtistAnnounced } from '@/lib/artist';
import { useConfig } from '@/lib/config';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

/** From `map-speedway-home.svg` viewBox */
// const MAP_SVG = { width: 210, height: 105 };
const MAP_SVG = { width: 200, height: 95 };
/** From `info-speedway-home.svg` viewBox */
const INFO_SVG = { width: 216, height: 72 };

/** Resize the map SVG (1 = native pixel size from the asset). */
const MAP_SCALE = 1;
/** Resize the info SVG (1 = native pixel size from the asset). */
const INFO_SCALE = 1;

function parseClockMinutes(time?: string): number | null {
  if (!time) return null;
  const t = time.trim().toUpperCase();
  const match = t.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/);
  if (!match) return null;

  let h = parseInt(match[1], 10);
  const m = match[2] ? parseInt(match[2], 10) : 0;
  const ap = match[3];

  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;

  return h * 60 + m;
}

/**
 * Times are same-calendar-day minutes only. The next slot can be “earlier” on
 * the clock (e.g. 11 AM after 1:45 PM) when the next day’s first acts sort
 * first — we must not treat NOW as running until that next morning start.
 */
const ASSUMED_MAX_SET_MINUTES = 150;

/** After this (local clock), if no act has start > now, NEXT is the earliest “morning” act. */
const NIGHT_NEXT_MORNING_AFTER = 19 * 60;
/** “Morning restart” window for picking NEXT after a festival night (local clock). */
const MORNING_BAND_START = 6 * 60;
const MORNING_BAND_END = 13 * 60;

function slotEndMinutesForNow(
  current: { minutes: number },
  next: { minutes: number } | null
): number {
  if (next == null) {
    return current.minutes + ASSUMED_MAX_SET_MINUTES;
  }
  if (next.minutes > current.minutes) {
    return next.minutes;
  }
  return current.minutes + ASSUMED_MAX_SET_MINUTES;
}

export default function HomeScreen() {
  const { config } = useConfig();
  const [latestMessage, setLatestMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [nowMinutes, setNowMinutes] = useState(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });
  const router = useRouter();

  const mapWidth = MAP_SVG.width * MAP_SCALE;
  const mapHeight = MAP_SVG.height * MAP_SCALE;
  const infoWidth = INFO_SVG.width * INFO_SCALE;
  const infoHeight = INFO_SVG.height * INFO_SCALE;

  const bumpClock = useCallback(() => {
    const d = new Date();
    setNowMinutes(d.getHours() * 60 + d.getMinutes());
  }, []);

  useEffect(() => {
    bumpClock();
    const id = setInterval(bumpClock, 60_000);
    return () => clearInterval(id);
  }, [bumpClock]);

  useFocusEffect(
    useCallback(() => {
      bumpClock();
    }, [bumpClock])
  );

  const allTimedArtists = useMemo(() => {
    const allArtists = config?.artists ? Object.values(config.artists) : [];
    return allArtists
      .filter((a): a is NonNullable<(typeof allArtists)[number]> => !!a)
      .map((a) => ({ artist: a, minutes: parseClockMinutes(a.time) }))
      .filter(
        (
          x
        ): x is {
          artist: NonNullable<(typeof allArtists)[number]>;
          minutes: number;
        } => typeof x.minutes === 'number'
      )
      .sort((a, b) => a.minutes - b.minutes);
  }, [config?.artists]);

  /** Announced acts only — drives NEXT and whether NOW may show a name. */
  const availableTimedArtists = useMemo(
    () => allTimedArtists.filter((x) => isArtistAnnounced(x.artist)),
    [allTimedArtists]
  );

  const { currentAll, nextAll } = useMemo(() => {
    if (allTimedArtists.length === 0) {
      return { currentAll: null, nextAll: null };
    }
    let currentIndex = -1;
    for (let i = allTimedArtists.length - 1; i >= 0; i--) {
      if (allTimedArtists[i].minutes <= nowMinutes) {
        currentIndex = i;
        break;
      }
    }
    if (currentIndex < 0) {
      return { currentAll: null, nextAll: allTimedArtists[0] };
    }
    const currentAll = allTimedArtists[currentIndex];
    const nextAll =
      currentIndex < allTimedArtists.length - 1
        ? allTimedArtists[currentIndex + 1]
        : null;
    return { currentAll, nextAll };
  }, [allTimedArtists, nowMinutes]);

  const slotEnd =
    currentAll != null ? slotEndMinutesForNow(currentAll, nextAll) : null;

  /** In [current start, slot end); slot end caps overnight gaps (see slotEndMinutesForNow). */
  const showSlotPlaying =
    currentAll != null &&
    slotEnd != null &&
    nowMinutes >= currentAll.minutes &&
    nowMinutes < slotEnd;

  /** NOW text only when that slot is “live” and the act is announced (`available !== false`). */
  const showNowPlaying =
    !!currentAll &&
    showSlotPlaying &&
    isArtistAnnounced(currentAll.artist);

  const currentArtistName = showNowPlaying
    ? (currentAll.artist.name ?? '')
    : '';
  const currentArtistTime = showNowPlaying
    ? (currentAll.artist.time ?? '')
    : '';

  const { nextArtistName, nextArtistTime } = useMemo(() => {
    if (availableTimedArtists.length === 0) {
      return { nextArtistName: '', nextArtistTime: '' };
    }
    const upcoming = availableTimedArtists.find((t) => t.minutes > nowMinutes);
    if (upcoming) {
      return {
        nextArtistName: upcoming.artist.name ?? '',
        nextArtistTime: upcoming.artist.time ?? '',
      };
    }
    if (nowMinutes >= NIGHT_NEXT_MORNING_AFTER) {
      const morning = availableTimedArtists.filter(
        (t) =>
          t.minutes >= MORNING_BAND_START && t.minutes < MORNING_BAND_END
      );
      if (morning.length > 0) {
        const earliest = morning.reduce((a, b) =>
          a.minutes <= b.minutes ? a : b
        );
        return {
          nextArtistName: earliest.artist.name ?? '',
          nextArtistTime: earliest.artist.time ?? '',
        };
      }
    }
    const last = availableTimedArtists[availableTimedArtists.length - 1]!;
    return {
      nextArtistName: last.artist.name ?? '',
      nextArtistTime: last.artist.time ?? '',
    };
  }, [availableTimedArtists, nowMinutes]);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await getAnnouncements();
      // sort newest first
      data.sort((a, b) => b.sent.toMillis() - a.sent.toMillis());
      if (data.length > 0) {
        setLatestMessage(data[0].title);
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Couldn’t load announcement',
        text2: err.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  // pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadAnnouncements();
  };

  return (
    <TabScreen>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.titleContainer}>
            <Text
              style={styles.lineupTitle}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
            >
              DILLO 54
            </Text>
          </View>

          <ArtistPanel
            now={{ artist: currentArtistName, time: currentArtistTime }}
            next={{ artist: nextArtistName, time: nextArtistTime }}
          />

          {loading ? (
            <LoadingIndicator />
          ) : (
            <AnnouncementPanel
              value={latestMessage || 'No announcements right now.'}
            />
          )}

          <View style={styles.infoButtons}>
            <TouchableOpacity onPress={() => router.push('/map')}>
              <MapSpeedwayHome width={mapWidth} height={mapHeight} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/information')}>
              <InfoSpeedwayHome width={infoWidth} height={infoHeight} />
            </TouchableOpacity>
          </View>
          <DilloSpeedwayButton />
        </ScrollView>
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
  titleContainer: {
    alignItems: 'center',
    width: '100%',
    marginVertical: 16,
  },
  lineupTitle: {
    ...sofachromeTitleTextStyle(38),
    letterSpacing: 1,
    paddingRight: 8,
    width: '100%',
    textAlign: 'center',
  },
  lineup: {
    width: '100%',
    gap: 3,
    marginBottom: 0,
  },
  infoButtons: {
    paddingTop: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 15,
    marginBottom: 0,
  },
  racingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
