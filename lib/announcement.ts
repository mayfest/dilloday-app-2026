import { Timestamp, collection, getDocs } from 'firebase/firestore';

import { db } from './app';

export interface Announcement {
  id: string;
  level: 0 | 1 | 2 | 3;
  title: string;
  notification: string;
  message: string;
  sent: Timestamp;
}

export async function getAnnouncements() {
  const docs = await getDocs(collection(db, 'announcements'));
  return docs.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id }) as Announcement
  );
}
