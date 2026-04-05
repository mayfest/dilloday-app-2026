import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'racing-leaderboard-v1';
const MAX_ENTRIES = 100;

export type RacingLeaderboardEntry = {
  /** Stable key for list rendering (older saves may omit this) */
  id?: string;
  score: number;
  recordedAt: string;
};

export async function recordLeaderboardScore(score: number): Promise<void> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  let list: RacingLeaderboardEntry[] = [];
  try {
    list = raw ? (JSON.parse(raw) as RacingLeaderboardEntry[]) : [];
    if (!Array.isArray(list)) {
      list = [];
    }
  } catch {
    list = [];
  }

  list.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    score: Math.max(0, Math.floor(score)),
    recordedAt: new Date().toISOString(),
  });

  list.sort((a, b) => b.score - a.score);
  const trimmed = list.slice(0, MAX_ENTRIES);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export async function getTopLeaderboard(
  limit = 10
): Promise<RacingLeaderboardEntry[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  let list: RacingLeaderboardEntry[] = [];
  try {
    list = raw ? (JSON.parse(raw) as RacingLeaderboardEntry[]) : [];
    if (!Array.isArray(list)) {
      list = [];
    }
  } catch {
    list = [];
  }

  list.sort((a, b) => b.score - a.score);
  return list.slice(0, limit);
}
