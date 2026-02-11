import storage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const VERSION = '1.0.2';

const firebaseConfig = {
  apiKey: 'AIzaSyALC7_uNBF4IFQmr-CXOYa6s3slDka1KYc',
  authDomain: 'app.dilloday.com',
  projectId: 'dillo-day',
  storageBucket: 'dillo-day.appspot.com',
  messagingSenderId: '1025535388888',
  appId: '1:1025535388888:web:19f69f2fbf19e0682cfbad',
};

export const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(storage),
});
export const auth = getAuth(app);
export const db = getFirestore(app);
