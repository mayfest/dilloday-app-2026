import InfoPageBanner from '@/components/banners/info-banner';
import DrawerScreen from '@/components/drawer-screen';
import NineOneOneButton from '@/components/information/911-button';
import ContactMayfestIcon from '@/components/information/contact-mayfest';
import NUPDIcon from '@/components/information/nupud';
import SisFormIcon from '@/components/information/sis-icon';
import SmartDilloIcon from '@/components/information/smart-dillo-icon';
import ScreenBackground from '@/components/screen-background';
import { VERSION } from '@/lib/app';
import { call } from '@/lib/link';
import { Link, useRouter } from 'expo-router';
import {
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function InfoScreenTwo() {
  const router = useRouter();
  const windowWidth = Dimensions.get('window').width;

  // Determine if we're on an iPad based on screen width
  const isIpad = windowWidth >= 768;

  // Calculate button sizes - using more aggressive scaling for iPads
  const BUTTON_SIZE = isIpad ? Math.round(windowWidth * 0.3) : 175;
  const SMALL_BUTTON_SIZE = isIpad ? Math.round(windowWidth * 0.25) : 140;

  // Log the dimensions to debug
  console.log('Screen width:', windowWidth);
  console.log('Button size:', BUTTON_SIZE);

  return (
    <DrawerScreen banner={<InfoPageBanner />}>
      <ScreenBackground />
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.buttonRow}>
            <Link href='/information/contact' style={styles.buttonWrapper}>
              <ContactMayfestIcon
                style={styles.svg}
                height={BUTTON_SIZE}
                width={BUTTON_SIZE}
              />
            </Link>
            <TouchableOpacity
              onPress={() => call('18474913456')}
              style={styles.buttonWrapper}
            >
              <NUPDIcon
                style={styles.svg}
                height={BUTTON_SIZE}
                width={BUTTON_SIZE}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => call('911')}
              style={styles.buttonWrapper}
            >
              <NineOneOneButton
                style={styles.svg}
                height={BUTTON_SIZE - (isIpad ? 25 : 20)}
                width={BUTTON_SIZE - (isIpad ? 25 : 20)}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/smart-dillo')}
              style={styles.buttonWrapper}
            >
              <SmartDilloIcon
                style={styles.svg}
                height={SMALL_BUTTON_SIZE}
                width={SMALL_BUTTON_SIZE}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://tally.so/r/w258Ej')}
              style={styles.buttonWrapper}
            >
              <SisFormIcon
                style={styles.svg}
                height={SMALL_BUTTON_SIZE}
                width={SMALL_BUTTON_SIZE}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.version}>v{VERSION}</Text>
        </View>
      
      </View>
    </DrawerScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 800, // Prevent excessive spreading on very large screens
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  buttonWrapper: {
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
  },
  text: {
    textAlign: 'center',
    // color: theme.dark,
    // fontFamily: theme.bodyRegular,
    marginBottom: 12,
    opacity: 0.75,
  },
  version: {
    textAlign: 'center',
    // color: theme.dark,
    // fontFamily: theme.bodyBold,
    marginTop: 12,
    marginBottom: 20,
    opacity: 0.5,
  },
});
