import Constants from 'expo-constants';
import { isDevice } from 'expo-device';
import {
  AndroidImportance,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
} from 'expo-notifications';
import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

import { db } from './app';

function handleRegistrationError(message: string) {
  Toast.show({
    type: 'error',
    text1: 'Failed to register notifications.',
    text2: message,
  });
}

export async function registerForPushNotifications() {
  if (Platform.OS === 'android') {
    setNotificationChannelAsync('default', {
      name: 'default',
      importance: AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (isDevice) {
    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted.');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found.');
    }

    try {
      const pushTokenString = (
        await getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      await savePushNotificationToken(pushTokenString);
      return pushTokenString;
    } catch (e: any) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Physical device required.');
  }
}

export async function savePushNotificationToken(token: string) {
  const getToken = await getDocs(
    query(
      collection(db, 'notification-tokens-2025'),
      where('token', '==', token)
    )
  );

  if (getToken.docs.length > 0) {
    return;
  }

  await addDoc(collection(db, 'notification-tokens-2025'), {
    token,
    platform: Platform.OS,
    time: Timestamp.now(),
  });
}
