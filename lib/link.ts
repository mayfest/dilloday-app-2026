import { Linking } from 'react-native';
import Toast from 'react-native-toast-message';

export async function link(url: string) {
  if (await Linking.canOpenURL(url)) {
    await Linking.openURL(url);
  } else {
    Toast.show({
      type: 'error',
      text1: 'Unable to open link.',
      text2: 'The link is invalid or your device does not support it.',
    });
  }
}

export async function mail(email: string) {
  try {
    await Linking.openURL(`mailto:${email}`);
  } catch {
    Toast.show({
      type: 'error',
      text1: 'Unable to launch mail.',
      text2: 'Your device does not support email.',
    });
  }
}

export async function call(tel: string) {
  await Linking.openURL(`tel:${tel}`);
}
