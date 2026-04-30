import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'racing-leaderboard-v2';
const LEGACY_STORAGE_KEY = 'racing-leaderboard-v1';
const MAX_ENTRIES = 100;

/** One entry per unique userId — holds that user's best score so far. */
export type RacingLeaderboardEntry = {
  userId: string;
  name: string;
  topScore: number;
  recordedAt: string;
};

let _legacyCleared = false;
async function clearLegacyOnce(): Promise<void> {
  if (_legacyCleared) return;
  _legacyCleared = true;
  try {
    await AsyncStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

async function readEntries(): Promise<RacingLeaderboardEntry[]> {
  await clearLegacyOnce();
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as RacingLeaderboardEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e) =>
        e &&
        typeof e.userId === 'string' &&
        typeof e.name === 'string' &&
        typeof e.topScore === 'number' &&
        typeof e.recordedAt === 'string'
    );
  } catch {
    return [];
  }
}

async function writeEntries(list: RacingLeaderboardEntry[]): Promise<void> {
  list.sort((a, b) => b.topScore - a.topScore);
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(list.slice(0, MAX_ENTRIES))
  );
}

/** Upsert the user's top score. If the new score is lower than what's
 *  already stored for this userId, the entry is left alone. */
export async function recordLeaderboardScore(args: {
  userId: string;
  name: string;
  score: number;
}): Promise<void> {
  const score = Math.max(0, Math.floor(args.score));
  const list = await readEntries();
  const existing = list.find((e) => e.userId === args.userId);
  if (existing) {
    if (score > existing.topScore) {
      existing.topScore = score;
      existing.recordedAt = new Date().toISOString();
      existing.name = args.name; // keep latest name in case of edits
      await writeEntries(list);
    }
    return;
  }
  list.push({
    userId: args.userId,
    name: args.name,
    topScore: score,
    recordedAt: new Date().toISOString(),
  });
  await writeEntries(list);
}

export async function getTopLeaderboard(
  limit = 10
): Promise<RacingLeaderboardEntry[]> {
  const list = await readEntries();
  list.sort((a, b) => b.topScore - a.topScore);
  return list.slice(0, limit);
}
