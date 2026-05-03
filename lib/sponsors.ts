import { doc, getDoc } from 'firebase/firestore';
import { db } from './app';

export interface Sponsor {
  name: string;
  logoUrl: string;
  url: string;
  order: number;
}

function resolveLogoUrl(raw: string): string {
  if (!raw.startsWith('gs://')) return raw;
  // gs://bucket/path/to/file → https://firebasestorage.googleapis.com/v0/b/bucket/o/encoded-path?alt=media
  const withoutProtocol = raw.slice('gs://'.length);
  const slashIndex = withoutProtocol.indexOf('/');
  const bucket = withoutProtocol.slice(0, slashIndex);
  const path = withoutProtocol.slice(slashIndex + 1);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(path)}?alt=media`;
}

export async function getSponsors(): Promise<Sponsor[]> {
  const configDoc = await getDoc(doc(db, 'config', 'config-2026'));
  if (!configDoc.exists()) throw new Error('config-2026 not found');
  const data = configDoc.data();
  const sponsors: Sponsor[] = data?.sponsors ?? [];
  return [...sponsors]
    .sort((a, b) => a.order - b.order)
    .map((s) => ({ ...s, logoUrl: resolveLogoUrl(s.logoUrl) }));
}
