import React, { useCallback, useMemo } from 'react';

import GlobalNavivationWrapper from '@/components/navigation/navigation-bar';
import FestivalLineupTimeline, {
  type FestivalSlot,
  type FestivalStage,
} from '@/components/schedule/festival-lineup-timeline';
import { useConfig } from '@/lib/config';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_CLEARANCE = 88;
const TIMELINE_START_HOUR = 14;
const TIMELINE_HOUR_SPAN = 9;

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

function formatClockLabel(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function LineupScreen() {
  const insets = useSafeAreaInsets();
  const { config } = useConfig();

  const stages = useMemo(() => {
    return MOCK_STAGES;
  }, []);

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
