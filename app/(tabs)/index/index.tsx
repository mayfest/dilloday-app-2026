import React, { useEffect, useState } from 'react';

import InfoSpeedwayHome from '@/assets/images/info-speedway-home.svg';
import MapSpeedwayHome from '@/assets/images/map-speedway-home.svg';
import AnnouncementPanel from '@/components/home/announcement-panel';
import ArtistPanel from '@/components/home/artist-panel';
import DilloSpeedwayButton from '@/components/home/dillo-speedway';
import LoadingIndicator from '@/components/loading-indicator';
import TabScreen from '@/components/tab-screen';
import { getAnnouncements } from '@/lib/announcement';
import { useConfig } from '@/lib/config';
import { useRouter } from 'expo-router';
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

export default function HomeScreen() {
  const { config } = useConfig();
  const [latestMessage, setLatestMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const router = useRouter();

  const mapWidth = MAP_SVG.width * MAP_SCALE;
  const mapHeight = MAP_SVG.height * MAP_SCALE;
  const infoWidth = INFO_SVG.width * INFO_SCALE;
  const infoHeight = INFO_SVG.height * INFO_SCALE;

  const nowMinutes = (() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  })();

  const allArtists = config?.artists ? Object.values(config.artists) : [];
  const timedArtists = allArtists
    .filter((a) => a?.available !== false)
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

  const currentTimed =
    timedArtists.length === 0
      ? null
      : ([...timedArtists].reverse().find((x) => x.minutes <= nowMinutes) ??
        timedArtists[0]);

  const currentArtistName = currentTimed?.artist?.name ?? 'TBA';
  const currentArtistTime = currentTimed?.artist?.time ?? '';

  const nextTimed =
    timedArtists.length === 0
      ? null
      : (timedArtists.find((x) => x.minutes > nowMinutes) ?? timedArtists[0]);

  const nextArtistName = nextTimed?.artist?.name ?? 'TBA';
  const nextArtistTime = nextTimed?.artist?.time ?? '';

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
            <Text style={styles.lineupTitle}>DILLO 54</Text>
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
    marginVertical: 16,
    overflow: 'visible',
  },
  lineupTitle: {
    color: '#FFEB3B',
    fontFamily: 'SofachromeIt',
    fontSize: 38,
    letterSpacing: 1,
    paddingRight: 8,
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
});
