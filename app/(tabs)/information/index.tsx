import InfoPageBanner from '@/components/banners/info-banner';
import DrawerScreen from '@/components/drawer-screen';
import NineOneOneButton from '@/components/information/911-button';
import ContactMayfestIcon from '@/components/information/contact-mayfest';
import NUPDIcon from '@/components/information/nupud';
import SmartDilloIcon from '@/components/information/smart-dillo-icon';
import ScreenBackground from '@/components/screen-background';
import { VERSION } from '@/lib/app';
import { call } from '@/lib/link';
import { Link, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BUTTON_SIZE = 175;

export default function InfoScreenTwo() {
  const router = useRouter();

  return (
    <DrawerScreen
      banner={
        <View style={styles.bannerWrapper}>
          <InfoPageBanner />
        </View>
      }
    >
      <ScreenBackground />
      <View style={styles.container}>
        <View>
          <View style={styles.buttonRow}>
            <Link href='/information/contact'>
              <ContactMayfestIcon style={styles.svg} />
            </Link>

            <TouchableOpacity onPress={() => router.push('/smart-dillo')}>
              <SmartDilloIcon style={styles.svg} />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => call('911')}>
              <NineOneOneButton style={styles.svg} height={170} width={170} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => call('18474913456')}>
              <NUPDIcon style={styles.svg} />
            </TouchableOpacity>
          </View>

          <Text style={styles.version}>v{VERSION}</Text>
        </View>
      </View>
    </DrawerScreen>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    paddingTop: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 16,
    gap: 12,
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
    marginTop: 8,
    marginBottom: 20,
    opacity: 0.5,
  },
});
