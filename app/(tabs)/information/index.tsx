import Call911 from '@/assets/images/911.svg';
import CallNUPD from '@/assets/images/call-NUPD.svg';
import SIS from '@/assets/images/call-SIS.svg';
import CallMayfest from '@/assets/images/call-mayfest.svg';
import SmartDillo from '@/assets/images/smart-dillo.svg';
import DrawerScreen from '@/components/drawer-screen';
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
    <DrawerScreen>
      <View style={styles.titleContainer}>
        <Text style={styles.lineupTitle}>INFO</Text>
      </View>
      {/* <ScreenBackground /> */}
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => router.push('/smart-dillo')}
              style={styles.buttonWrapper}
            >
              <SmartDillo
                style={styles.svg}
                height={SMALL_BUTTON_SIZE + 40}
                width={SMALL_BUTTON_SIZE + 40}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.replace('/information/contact')}
              style={styles.buttonWrapper}
            >
              <CallMayfest
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
              <Call911
                style={styles.svg}
                height={BUTTON_SIZE + 20}
                width={BUTTON_SIZE + 20}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => call('18474913456')}
              style={styles.buttonWrapper}
            >
              <CallNUPD
                style={styles.svg}
                height={BUTTON_SIZE + 20}
                width={BUTTON_SIZE + 20}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://tally.so/r/w258Ej')}
              style={styles.buttonWrapper}
            >
              <SIS
                style={styles.svg}
                height={SIS_BUTTON_SIZE}
                width={SIS_BUTTON_SIZE + 375}
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
    // paddingVertical: 30,
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
    gap: 0,
    width: '100%',
  },
  buttonWrapper: {
    marginHorizontal: 10,
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
  titleContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
    overflow: 'visible',
  },
  lineupTitle: {
    color: '#FFEB3B',
    fontFamily: 'SofachromeIt',
    fontSize: 38,
    letterSpacing: 1,
    paddingRight: 8,
  },
});
