import { goToTabHome } from '@/lib/go-tab-home';
import {
  getTopLeaderboard,
  recordLeaderboardScore,
  type RacingLeaderboardEntry,
} from '@/lib/racing-leaderboard';
import {
  RACING_REAL_TRIES,
  canPlayScored,
  getProfile,
  incrementTriesUsed,
  isLockedOut,
  markPracticeUsed,
  type RacingPlayerProfile,
} from '@/lib/racing-player-profile';
import { useNavigation } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
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

export default function RacingGameOverScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { score: scoreParam, reason, endedAt, mode: modeParam } =
    useLocalSearchParams<{
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

  const loadBoard = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await getTopLeaderboard(10);
      setTopScores(rows);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const p = await getProfile();

      if (mode === 'practice') {
        const next = await markPracticeUsed();
        if (!cancelled) setProfile(next);
      } else if (mode === 'scored') {
        const next = await incrementTriesUsed();
        if (p.displayName) {
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

      if (!cancelled) await loadBoard();
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, score, loadBoard, endedAt]);

  const renderRow: ListRenderItem<RacingLeaderboardEntry> = useCallback(
    ({ item, index }) => {
      const isYou = profile && item.userId === profile.userId;
      return (
        <View style={[styles.row, index === 0 && styles.rowFirst]}>
          <Text style={styles.rank}>{index + 1}.</Text>
          <Text style={[styles.rowName, isYou && styles.rowNameYou]} numberOfLines={1}>
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

  const listHeader = (
    <>
      <Text style={styles.title}>{titleText}</Text>
      {subtitleText ? <Text style={styles.subtitle}>{subtitleText}</Text> : null}

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

      <Text style={styles.sectionTitle}>Top 10 scores</Text>
    </>
  );

  const listEmpty = () =>
    loading ? (
      <ActivityIndicator color="#fff" style={styles.loader} />
    ) : (
      <Text style={styles.empty}>No scores yet. Play to set one!</Text>
    );

  // Action buttons depend on mode + profile state.
  const renderActions = () => {
    if (mode === 'practice') {
      return (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.primary,
            pressed && styles.pressed,
          ]}
          onPress={() =>
            router.replace({
              pathname: '/racing-game/play',
              params: { nonce: String(Date.now()), mode: 'scored' },
            })
          }
        >
          <Text style={styles.primaryText}>
            Start attempt 1 of {RACING_REAL_TRIES}
          </Text>
        </Pressable>
      );
    }

    if (mode === 'view-only') {
      return (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.secondary,
            pressed && styles.pressed,
          ]}
          onPress={() => goToTabHome(navigation.dispatch)}
        >
          <Text style={styles.secondaryText}>Back to home</Text>
        </Pressable>
      );
    }

    // mode === 'scored'
    const canContinue = profile ? canPlayScored(profile) : false;
    const locked = profile ? isLockedOut(profile) : false;
    const next = profile ? profile.realTriesUsed + 1 : null;

    return (
      <>
        {canContinue && next !== null ? (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.primary,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              router.replace({
                pathname: '/racing-game/play',
                params: { nonce: String(Date.now()), mode: 'scored' },
              })
            }
          >
            <Text style={styles.primaryText}>
              Start attempt {next} of {RACING_REAL_TRIES}
            </Text>
          </Pressable>
        ) : null}
        {locked ? (
          <View style={styles.lockedNote}>
            <Text style={styles.lockedNoteText}>
              You've used all {RACING_REAL_TRIES} attempts.
            </Text>
          </View>
        ) : null}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.secondary,
            pressed && styles.pressed,
          ]}
          onPress={() => goToTabHome(navigation.dispatch)}
        >
          <Text style={styles.secondaryText}>Back to home</Text>
        </Pressable>
      </>
    );
  };

  return (
    <View style={[styles.screen, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <FlatList
        style={styles.listFlex}
        data={topScores}
        keyExtractor={keyExtractor}
        renderItem={renderRow}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator
      />

      <View style={styles.actions}>{renderActions()}</View>
    </View>
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
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
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
  curbRow: {
    flexDirection: 'row',
    width: '100%',
    height: 10,
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
    fontSize: 15,
    color: '#a8a8ad',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreValue: {
    marginTop: 6,
    fontSize: 44,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  loader: {
    marginVertical: 24,
  },
  empty: {
    color: '#888',
    fontSize: 15,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#3d3d42',
  },
  rowFirst: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  rank: {
    width: 32,
    fontSize: 16,
    fontWeight: '600',
    color: '#a8a8ad',
  },
  rowName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  rowNameYou: {
    color: '#0a7ea4',
  },
  rowScore: {
    fontSize: 18,
    fontWeight: '700',
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
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
  },
  pressed: {
    opacity: 0.85,
  },
  primaryText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
  lockedNote: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  lockedNoteText: {
    color: '#d0d0d4',
    fontSize: 14,
  },
});
