import {
  Timestamp,
  collection,
  doc,
  getDocs,
  limit as fbLimit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

import { db } from './app';

const COLLECTION = 'racing-leaderboard-2026';

/** One entry per unique userId — holds that user's best score so far. */
export type RacingLeaderboardEntry = {
  userId: string;
  name: string;
  topScore: number;
  recordedAt: string;
};

/** Upsert the user's top score to Firestore. If the new score is lower than
 *  what's already stored for this userId, the existing doc is left alone. */
export async function recordLeaderboardScore(args: {
  userId: string;
  name: string;
  score: number;
}): Promise<void> {
  if (!args.userId) return;
  const score = Math.max(0, Math.floor(args.score));
  const ref = doc(db, COLLECTION, args.userId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists()) {
      const existing = snap.data() as { topScore?: number };
      if (
        typeof existing.topScore === 'number' &&
        existing.topScore >= score
      ) {
        return;
      }
    }
    tx.set(ref, {
      name: args.name,
      topScore: score,
      recordedAt: serverTimestamp(),
    });
  });
}

function mapDoc(d: QueryDocumentSnapshot): RacingLeaderboardEntry {
  const data = d.data() as {
    name?: string;
    topScore?: number;
    recordedAt?: Timestamp;
  };
  return {
    userId: d.id,
    name: typeof data.name === 'string' ? data.name : 'Anonymous',
    topScore: typeof data.topScore === 'number' ? data.topScore : 0,
    recordedAt: data.recordedAt
      ? data.recordedAt.toDate().toISOString()
      : new Date().toISOString(),
  };
}

function topQuery(n: number) {
  return query(
    collection(db, COLLECTION),
    orderBy('topScore', 'desc'),
    fbLimit(n)
  );
}

export async function getTopLeaderboard(
  n = 10
): Promise<RacingLeaderboardEntry[]> {
  const snap = await getDocs(topQuery(n));
  return snap.docs.map(mapDoc);
}

/** Real-time subscription to the top-N leaderboard. The callback fires
 *  immediately with the current list and again whenever any user's score
 *  changes — so every device sees the same canonical view from Firestore.
 *  Returns an unsubscribe function; call it on unmount. */
export function subscribeTopLeaderboard(
  n: number,
  onUpdate: (rows: RacingLeaderboardEntry[]) => void,
  onError?: (err: Error) => void
): () => void {
  return onSnapshot(
    topQuery(n),
    (snap) => onUpdate(snap.docs.map(mapDoc)),
    (err) => {
      console.warn('Racing leaderboard subscribe failed', err);
      onError?.(err);
    }
  );
}
