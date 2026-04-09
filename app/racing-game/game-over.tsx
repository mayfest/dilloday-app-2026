import { goToTabHome } from '@/lib/go-tab-home';
import { getTopLeaderboard, type RacingLeaderboardEntry } from '@/lib/racing-leaderboard';
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

function formatShortDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function RacingGameOverScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { score: scoreParam, reason, endedAt } = useLocalSearchParams<{
    score?: string;
    reason?: string;
    endedAt?: string;
  }>();
  const score = Number.parseInt(scoreParam ?? '0', 10) || 0;

  const [topScores, setTopScores] = useState<RacingLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

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
    void loadBoard();
  }, [loadBoard, endedAt, scoreParam]);

  const renderRow: ListRenderItem<RacingLeaderboardEntry> = useCallback(
    ({ item, index }) => (
      <View
        style={[styles.row, index === 0 && styles.rowFirst]}
      >
        <Text style={styles.rank}>{index + 1}.</Text>
        <Text style={styles.rowScore}>{item.score}</Text>
        <Text style={styles.rowDate}>{formatShortDate(item.recordedAt)}</Text>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: RacingLeaderboardEntry, index: number) =>
      item.id ?? `${item.recordedAt}-${index}`,
    []
  );

  const listHeader = (
    <>
      <Text style={styles.title}>Game over</Text>
      {reason ? <Text style={styles.subtitle}>{reason}</Text> : null}

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
          <Text style={styles.scoreLabel}>Your score</Text>
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

      <Text style={styles.sectionTitle}>Top 10 scores</Text>
    </>
  );

  const listEmpty = () =>
    loading ? (
      <ActivityIndicator color="#fff" style={styles.loader} />
    ) : (
      <Text style={styles.empty}>No scores yet. Play again to set one!</Text>
    );

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

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.button, styles.primary, pressed && styles.pressed]}
          onPress={() => router.replace('/racing-game')}
        >
          <Text style={styles.primaryText}>Play again</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, styles.secondary, pressed && styles.pressed]}
          onPress={() => goToTabHome(navigation.dispatch)}
        >
          <Text style={styles.secondaryText}>Back to home</Text>
        </Pressable>
      </View>
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
  rowScore: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  rowDate: {
    fontSize: 13,
    color: '#888',
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
});
