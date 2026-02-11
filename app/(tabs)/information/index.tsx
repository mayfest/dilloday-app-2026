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
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function InfoScreenTwo() {
  const router = useRouter();
  const windowWidth = Dimensions.get('window').width;

  // Determine if we're on an iPad based on screen width
  const isIpad = windowWidth >= 768;

  // Base maximums
  const MAX_BUTTON = 160;
  const MAX_SMALL = 140;

  // Dynamically scale, but never exceed the max values
  const BUTTON_SIZE = Math.min(
    isIpad ? windowWidth * 0.3 : MAX_BUTTON,
    MAX_BUTTON
  );
  const SMALL_BUTTON_SIZE = Math.min(
    isIpad ? windowWidth * 0.25 : MAX_SMALL,
    MAX_SMALL
  );
  const SIS_BUTTON_SIZE = Math.min(SMALL_BUTTON_SIZE + 30, MAX_BUTTON);

  return (
    <DrawerScreen banner={<InfoPageBanner />}>
      <ScreenBackground />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
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
                height={SIS_BUTTON_SIZE + 50}
                width={SIS_BUTTON_SIZE + 50}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.version}>v{VERSION}</Text>
        </ScrollView>
      </View>
    </DrawerScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 800,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    gap: 25,
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
  version: {
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
    opacity: 0.5,
  },
});
