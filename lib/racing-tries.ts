import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'racing-tries-daily-v1';

/** Max full-game runs per local calendar day (resets at midnight). */
export const RACING_PLAYS_PER_DAY = 10;

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

type TriesState = {
  date: string;
  used: number;
};

async function readState(): Promise<TriesState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  let state: TriesState = { date: todayKey(), used: 0 };
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as TriesState;
      if (parsed && typeof parsed.used === 'number' && typeof parsed.date === 'string') {
        state = parsed;
      }
    } catch {
      /* ignore */
    }
  }
  if (state.date !== todayKey()) {
    state = { date: todayKey(), used: 0 };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  return state;
}

export async function getRacingTriesRemaining(): Promise<number> {
  const state = await readState();
  return Math.max(0, RACING_PLAYS_PER_DAY - state.used);
}

/** Returns false if no tries left today. */
export async function consumeRacingTry(): Promise<boolean> {
  const state = await readState();
  if (state.used >= RACING_PLAYS_PER_DAY) {
    return false;
  }
  const next: TriesState = { ...state, used: state.used + 1 };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return true;
}
