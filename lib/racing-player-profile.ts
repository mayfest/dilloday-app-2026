import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const STORAGE_KEY = 'racing-player-profile-v1';

export const RACING_REAL_TRIES = 3;

/** When true, the 3-try cap is bypassed: `canPlayScored` always allows another
 *  attempt (after practice), `isLockedOut` never returns true, and
 *  `incrementTriesUsed` does not consume a try. Defaults to __DEV__ so dev
 *  builds get unlimited plays and release builds enforce the cap.
 *
 *  To exercise the locked-out flow in dev, flip this to `false` temporarily
 *  and call `resetProfile()` (or set realTriesUsed = 3 manually). */
export const RACING_DEV_UNLIMITED_TRIES = __DEV__;

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
  if (RACING_DEV_UNLIMITED_TRIES) return p;
  const next = {
    ...p,
    realTriesUsed: Math.min(RACING_REAL_TRIES, p.realTriesUsed + 1),
  };
  await writeProfile(next);
  return next;
}

export function canPlayScored(p: RacingPlayerProfile): boolean {
  if (!p.practiceUsed) return false;
  if (RACING_DEV_UNLIMITED_TRIES) return true;
  return p.realTriesUsed < RACING_REAL_TRIES;
}

export function isLockedOut(p: RacingPlayerProfile): boolean {
  if (RACING_DEV_UNLIMITED_TRIES) return false;
  return p.realTriesUsed >= RACING_REAL_TRIES;
}

export async function resetProfile(): Promise<RacingPlayerProfile> {
  const p = freshProfile();
  await writeProfile(p);
  return p;
}
