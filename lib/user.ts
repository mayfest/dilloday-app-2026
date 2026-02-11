import { doc, setDoc } from 'firebase/firestore';

import { db } from './app';

export type StudentType = 'undergraduate' | 'graduate-alumni' | 'faculty-staff';

export interface Match {
  name: string;
  email: string;
  contact: string | null;
  message: string;
}

export interface UserState {
  id: string;
  name: string;
  type: StudentType;
  contact: string | null;
  ready: boolean;
  match?: Match;
}

export async function initializeUserState(state: UserState) {
  await setDoc(doc(db, 'users', state.id), state);
}
