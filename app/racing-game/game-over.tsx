import React, { useCallback, useEffect, useState } from 'react';

import GlobalNavivationWrapper from '@/components/navigation/navigation-bar';
import {
  type RacingLeaderboardEntry,
  recordLeaderboardScore,
  subscribeTopLeaderboard,
} from '@/lib/racing-leaderboard';
import {
  RACING_DEV_UNLIMITED_TRIES,
  RACING_REAL_TRIES,
  type RacingPlayerProfile,
  canPlayScored,
  getProfile,
  incrementTriesUsed,
  isLockedOut,
  markPracticeUsed,
} from '@/lib/racing-player-profile';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Mode = 'practice' | 'scored' | 'view-only';
const LOBBY_TAB_BAR_CLEARANCE = 116;

export default function RacingGameOverScreen() {
  const insets = useSafeAreaInsets();
  const {
    score: scoreParam,
    reason,
    endedAt,
    mode: modeParam,
  } = useLocalSearchParams<{
    score?: string;
    reason?: string;
    endedAt?: string;
    mode?: string;
  }>();
  const score = Number.parseInt(scoreParam ?? '0', 10) || 0;
  const mode: Mode =
    modeParam === 'practice'
      ? 'practice'
      : modeParam === 'view-only'
        ? 'view-only'
        : 'scored';

  const [topScores, setTopScores] = useState<RacingLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<RacingPlayerProfile | null>(null);

  // Profile + score-record side-effect (runs once per mount per mode/score).
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const p = await getProfile();

      if (mode === 'practice') {
        const next = await markPracticeUsed();
        if (!cancelled) setProfile(next);
      } else if (mode === 'scored') {
        const next = await incrementTriesUsed();
        if (p?.displayName) {
          try {
            await recordLeaderboardScore({
              userId: p.userId,
              name: p.displayName,
              score,
            });
          } catch (e) {
            console.warn('Racing leaderboard save failed', e);
          }
        }
        if (!cancelled) setProfile(next);
      } else {
        if (!cancelled) setProfile(p);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, score, endedAt]);

  // Live leaderboard subscription — same canonical view across devices.
  useEffect(() => {
    const unsub = subscribeTopLeaderboard(10, (rows) => {
      setTopScores(rows);
      setLoading(false);
    });
    return unsub;
  }, []);

  const renderRow: ListRenderItem<RacingLeaderboardEntry> = useCallback(
    ({ item, index }) => {
      const isYou = profile && item.userId === profile.userId;
      return (
        <View style={[styles.row, index === 0 && styles.rowFirst]}>
          <Text style={styles.rank}>#{index + 1}</Text>
          <Text
            style={[styles.rowName, isYou && styles.rowNameYou]}
            numberOfLines={1}
          >
            {item.name}
            {isYou ? ' (you)' : ''}
          </Text>
          <Text style={styles.rowScore}>{item.topScore}</Text>
        </View>
      );
    },
    [profile]
  );

  const keyExtractor = useCallback(
    (item: RacingLeaderboardEntry) => item.userId,
    []
  );

  const titleText =
    mode === 'practice'
      ? 'Practice complete'
      : mode === 'view-only'
        ? 'Leaderboard'
        : 'Game over';

  const subtitleText =
    mode === 'practice'
      ? `Now you have ${RACING_REAL_TRIES} real attempts — only those count.`
      : mode === 'view-only'
        ? null
        : (reason ?? null);

  const showScoreCard = mode !== 'view-only';
  const canContinueScored =
    mode === 'scored' && profile ? canPlayScored(profile) : false;
  const nextAttempt =
    mode === 'scored' && profile ? profile.realTriesUsed + 1 : null;

  const listHeader = (
    <>
      <Text style={styles.title}>{titleText}</Text>
      {subtitleText ? (
        <Text style={styles.subtitle}>{subtitleText}</Text>
      ) : null}

      {showScoreCard ? (
        <View style={styles.scoreBorderOuter}>
          <View style={styles.curbRow}>
            {Array.from({ length: 24 }).map((_, i) => (
              <View
                key={`score-top-${i}`}
                style={[
                  styles.curbBlock,
                  { backgroundColor: i % 2 === 0 ? '#D62828' : '#F4F4F4' },
                ]}
              />
            ))}
          </View>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>
              {mode === 'practice' ? 'Practice score' : 'Your score'}
            </Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>

          <View style={styles.curbRow}>
            {Array.from({ length: 24 }).map((_, i) => (
              <View
                key={`score-bottom-${i}`}
                style={[
                  styles.curbBlock,
                  { backgroundColor: i % 2 === 0 ? '#D62828' : '#F4F4F4' },
                ]}
              />
            ))}
          </View>
        </View>
      ) : null}

      {showScoreCard && mode === 'practice' ? (
        <View style={styles.gapBetweenScoreAndNextRun} />
      ) : null}

      {mode === 'practice' ? (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.attemptButton,
            pressed && styles.pressed,
          ]}
          onPress={() =>
            router.replace({
              pathname: '/racing-game/play',
              params: { nonce: String(Date.now()), mode: 'scored' },
            })
          }
        >
          <View style={styles.attemptButtonLabelWrap}>
            <Text style={styles.attemptButtonLabel}>
              {RACING_DEV_UNLIMITED_TRIES
                ? 'Start scored run (dev unlimited)'
                : `Start attempt 1 of ${RACING_REAL_TRIES}`}
            </Text>
          </View>
        </Pressable>
      ) : null}

      {showScoreCard && canContinueScored && nextAttempt !== null ? (
        <View style={styles.gapBetweenScoreAndNextRun} />
      ) : null}

      {canContinueScored && nextAttempt !== null ? (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.attemptButton,
            pressed && styles.pressed,
          ]}
          onPress={() =>
            router.replace({
              pathname: '/racing-game/play',
              params: { nonce: String(Date.now()), mode: 'scored' },
            })
          }
        >
          <View style={styles.attemptButtonLabelWrap}>
            <Text style={styles.attemptButtonLabel}>
              {RACING_DEV_UNLIMITED_TRIES
                ? 'Start next run (dev unlimited)'
                : `Start attempt ${nextAttempt} of ${RACING_REAL_TRIES}`}
            </Text>
          </View>
        </Pressable>
      ) : null}

      <Text style={styles.sectionTitle}>Top 10 scores</Text>
    </>
  );

  const listEmpty = () =>
    loading ? (
      <ActivityIndicator color='#fff' style={styles.loader} />
    ) : (
      <Text style={styles.empty}>No scores yet. Play to set one!</Text>
    );

  // Action buttons depend on mode + profile state (scored only; practice CTA lives in header).
  const renderActions = () => {
    if (mode === 'view-only') {
      return null;
    }

    // mode === 'scored'
    const locked = profile ? isLockedOut(profile) : false;

    return (
      <>
        {locked ? (
          <View style={styles.lockedNote}>
            <Text style={styles.lockedNoteText}>
              You've used all {RACING_REAL_TRIES} attempts.
            </Text>
          </View>
        ) : null}
      </>
    );
  };

  return (
    <GlobalNavivationWrapper>
      <View
        style={[
          styles.screen,
          {
            paddingBottom:
              Math.max(insets.bottom, 16) + LOBBY_TAB_BAR_CLEARANCE,
          },
        ]}
      >
        <FlatList
          removeClippedSubviews={false}
          style={styles.listFlex}
          data={topScores}
          keyExtractor={keyExtractor}
          renderItem={renderRow}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={listEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator
        />

        {mode === 'scored' ? (
          <View style={styles.actions}>{renderActions()}</View>
        ) : null}
      </View>
    </GlobalNavivationWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 56,
    paddingHorizontal: 24,
  },
  listFlex: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  title: {
    color: '#FFEB3B',
    fontFamily: 'SofachromeIt',
    fontSize: 30,
    letterSpacing: 1,
    paddingRight: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subtitle: {
    marginTop: 8,
    fontFamily: 'FuturaBold',
    fontSize: 16,
    color: '#c8c8cc',
    textAlign: 'center',
  },
  scoreBorderOuter: {
    marginTop: 28,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#4a4a4a',
  },
  gapBetweenScoreAndNextRun: {
    height: 23,
  },
  curbRow: {
    flexDirection: 'row',
    width: '100%',
    height: 5,
    overflow: 'hidden',
  },
  curbBlock: {
    flex: 1,
    height: '100%',
  },
  scoreCard: {
    padding: 20,
    backgroundColor: '#3d3d42',
    alignItems: 'center',
  },
  scoreLabel: {
    fontFamily: 'FuturaBold',
    fontSize: 15,
    color: '#a8a8ad',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreValue: {
    marginTop: 6,
    fontFamily: 'FuturaBold',
    fontSize: 44,
    color: '#FFEB3B',
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 12,
    fontFamily: 'FuturaBold',
    fontSize: 18,
    color: '#fff',
    textTransform: 'uppercase',
  },
  loader: {
    marginVertical: 24,
  },
  empty: {
    fontFamily: 'FuturaBold',
    color: '#888',
    fontSize: 15,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 10,
    marginBottom: 6,
    backgroundColor: '#3d3d42',
  },
  rowFirst: {
    borderWidth: 1,
    borderColor: '#FFEB3B',
  },
  rank: {
    minWidth: 40,
    marginRight: 4,
    fontFamily: 'FuturaBold',
    fontSize: 16,
    color: '#a8a8ad',
  },
  rowName: {
    flex: 1,
    fontFamily: 'FuturaBold',
    fontSize: 16,
    color: '#fff',
  },
  rowNameYou: {
    color: '#FFEB3B',
  },
  rowScore: {
    fontFamily: 'FuturaBold',
    fontSize: 18,
    color: '#fff',
  },
  actions: {
    gap: 12,
    paddingTop: 8,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#0a7ea4',
  },
  attemptButton: {
    backgroundColor: 'transparent',
    alignSelf: 'center',
    marginTop: 0,
    paddingHorizontal: 22,
    paddingVertical: 6,
    overflow: 'visible',
  },
  attemptButtonLabelWrap: {
    alignSelf: 'center',
    maxWidth: 288,
    backgroundColor: '#FFEB3B',
    transform: [{ skewX: '-10deg' }],
    overflow: 'visible',
  },
  attemptButtonLabel: {
    color: '#001F54',
    fontFamily: 'FuturaBold',
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingVertical: 5,
    paddingHorizontal: 20,
    transform: [{ skewX: '10deg' }],
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
  },
  pressed: {
    opacity: 0.85,
  },
  primaryText: {
    fontFamily: 'FuturaBold',
    color: '#fff',
    fontSize: 17,
  },
  secondaryText: {
    fontFamily: 'FuturaBold',
    color: '#fff',
    fontSize: 17,
  },
  lockedNote: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  lockedNoteText: {
    fontFamily: 'FuturaBold',
    color: '#d0d0d4',
    fontSize: 14,
  },
});
