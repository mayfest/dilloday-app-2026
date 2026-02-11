import { doc, getDoc } from 'firebase/firestore';
import { db } from "./app";

export const fetchSwshPhotos = async (): Promise<string[]> =>{
  const configDoc = await getDoc(doc(db, 'config', 'config'));
  
  if(!configDoc.exists()){
    throw new Error('config not found');
  }

  const data = configDoc.data();
  const rawUrls: string[] = data.swsh_photos || [];

  //filtering bad entries just in case
  const cleaned = rawUrls.map(url => url.trim()).filter(Boolean);
  return cleaned;
};
