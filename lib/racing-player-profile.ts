import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const STORAGE_KEY = 'racing-player-profile-v1';

export const RACING_REAL_TRIES = 3;

export type RacingPlayerProfile = {
  userId: string;
  displayName: string | null;
  practiceUsed: boolean;
  realTriesUsed: number;
};

function freshProfile(): RacingPlayerProfile {
  return {
    userId: Crypto.randomUUID(),
    displayName: null,
    practiceUsed: false,
    realTriesUsed: 0,
  };
}

function isValid(p: unknown): p is RacingPlayerProfile {
  if (!p || typeof p !== 'object') return false;
  const r = p as Partial<RacingPlayerProfile>;
  return (
    typeof r.userId === 'string' &&
    (r.displayName === null || typeof r.displayName === 'string') &&
    typeof r.practiceUsed === 'boolean' &&
    typeof r.realTriesUsed === 'number'
  );
}

async function writeProfile(p: RacingPlayerProfile): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export async function getProfile(): Promise<RacingPlayerProfile> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (isValid(parsed)) return parsed;
    } catch {
      /* fall through to fresh */
    }
  }
  const p = freshProfile();
  await writeProfile(p);
  return p;
}

export async function setName(name: string): Promise<RacingPlayerProfile> {
  const p = await getProfile();
  const next = { ...p, displayName: name.trim() };
  await writeProfile(next);
  return next;
}

export async function markPracticeUsed(): Promise<RacingPlayerProfile> {
  const p = await getProfile();
  if (p.practiceUsed) return p;
  const next = { ...p, practiceUsed: true };
  await writeProfile(next);
  return next;
}

export async function incrementTriesUsed(): Promise<RacingPlayerProfile> {
  const p = await getProfile();
  const next = {
    ...p,
    realTriesUsed: Math.min(RACING_REAL_TRIES, p.realTriesUsed + 1),
  };
  await writeProfile(next);
  return next;
}

export function canPlayScored(p: RacingPlayerProfile): boolean {
  return p.practiceUsed && p.realTriesUsed < RACING_REAL_TRIES;
}

export function isLockedOut(p: RacingPlayerProfile): boolean {
  return p.realTriesUsed >= RACING_REAL_TRIES;
}

export async function resetProfile(): Promise<RacingPlayerProfile> {
  const p = freshProfile();
  await writeProfile(p);
  return p;
}
