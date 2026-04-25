import React, { useCallback, useMemo } from 'react';

import GlobalNavivationWrapper from '@/components/navigation/navigation-bar';
import FestivalLineupTimeline, {
  type FestivalSlot,
  type FestivalStage,
} from '@/components/schedule/festival-lineup-timeline';
import { type Config, useConfig } from '@/lib/config';
import type { Stage } from '@/lib/schedule';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_CLEARANCE = 88;
const TIMELINE_START_HOUR = 14;
const TIMELINE_HOUR_SPAN = 9;
const DEFAULT_SLOT_DURATION = 50;

const MOCK_STAGES: FestivalStage[] = [
  {
    key: 'mock-a',
    name: 'MAIN STAGE',
    slots: [
      {
        id: 'm1',
        name: 'Opening act',
        startMinutes: 14 * 60 + 45,
        durationMinutes: 45,
      },
      {
        id: 'm2',
        name: 'Headliner set',
        startMinutes: 17 * 60,
        durationMinutes: 60,
      },
      {
        id: 'm3',
        name: 'Late night',
        startMinutes: 19 * 60 + 30,
        durationMinutes: 55,
      },
    ],
  },
  {
    key: 'mock-b',
    name: 'FMO STAGE',
    slots: [
      {
        id: 'm4',
        name: 'Campus band',
        startMinutes: 15 * 60,
        durationMinutes: 40,
      },
      {
        id: 'm5',
        name: 'DJ set',
        startMinutes: 18 * 60 + 15,
        durationMinutes: 90,
      },
    ],
  },
  {
    key: 'mock-c',
    name: 'THE BURROW',
    slots: [
      {
        id: 'm6',
        name: 'Acoustic hour',
        startMinutes: 14 * 60 + 30,
        durationMinutes: 60,
      },
      {
        id: 'm7',
        name: 'Student showcase',
        startMinutes: 16 * 60 + 45,
        durationMinutes: 50,
      },
    ],
  },
];

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

function formatClockLabel(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
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

  const startM = TIMELINE_START_HOUR * 60;
  const endM = startM + TIMELINE_HOUR_SPAN * 60;

  return sorted.map(({ key, stage }) => {
    const slots: FestivalSlot[] = stage.artists.map((artistId, idx) => {
      const a = config.artists[artistId];
      const parsed = parseArtistTime(a?.time);

      let startMinutes = parsed ?? startM + idx * 55 + Math.floor(idx / 2) * 12;

      if (startMinutes < startM) startMinutes = startM + idx * 40;
      if (startMinutes >= endM - 30) startMinutes = endM - 40 - idx * 5;

      return {
        id: artistId,
        name: a?.name ?? 'Artist',
        startMinutes,
        durationMinutes: DEFAULT_SLOT_DURATION,
        imageUri: a?.image,
      };
    });

    return {
      key,
      name: stage.name.toUpperCase(),
      slots,
    };
  });
}

export default function LineupScreen() {
  const insets = useSafeAreaInsets();
  const { config } = useConfig();

  const stages = useMemo(() => {
    if (!config) return MOCK_STAGES;
    const configStages = buildStagesFromConfig(config);
    return configStages.length > 0 ? configStages : MOCK_STAGES;
  }, [config]);

  const onPressArtist = useCallback(
    (slot: FestivalSlot, stageName: string) => {
      if (config?.artists?.[slot.id]) {
        router.push({
          pathname: '/(tabs)/schedule/artist',
          params: {
            artist: slot.id,
            stage: stageName,
          },
        });
      } else {
        Alert.alert(
          slot.name,
          `${stageName}\nStarts ${formatClockLabel(slot.startMinutes)}`
        );
      }
    },
    [config]
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
          <Text style={styles.lineupTitle}>LINEUP</Text>
        </View>

        <ScrollView
          style={styles.timelineScroll}
          contentContainerStyle={styles.timelineScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <FestivalLineupTimeline
            stages={stages}
            startHour={TIMELINE_START_HOUR}
            hourSpan={TIMELINE_HOUR_SPAN}
            onPressArtist={onPressArtist}
          />
        </ScrollView>
      </View>
    </GlobalNavivationWrapper>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    overflow: 'visible',
  },
  lineupTitle: {
    color: '#FFEB3B',
    fontFamily: 'Sofachrome',
    fontSize: 29,
    fontStyle: 'italic',
    letterSpacing: 1,
    paddingRight: 8,
  },
  timelineScroll: {
    flex: 1,
  },
  timelineScrollContent: {
    // fontFamily: 'Sofachrome',
    paddingBottom: 12,
    flexGrow: 1,
  },
});
