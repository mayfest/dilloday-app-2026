import React from 'react';

import GlobalNavivationWrapper from '@/components/navigation/navigation-bar';
import {
  sofachromeTitleContainer,
  sofachromeTitleTextStyle,
} from '@/constants/sofachrome-screen-title';
import { call, link, mail } from '@/lib/link';
import { toastConfig } from '@/lib/theme';
import { FontAwesome6 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

/** Space above the floating `GlobalTabBar` (height + offset) — keep in sync with `global-tab-bar.tsx`. */
const TAB_BAR_CLEARANCE = 116;

function getCoordinatorNumber() {
  const now = new Date();
  const fmt = now.toLocaleTimeString('en-US', {
    timeZone: 'America/Chicago',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  const [hourStr, minuteStr] = fmt.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  /* 
    TODO update name and numbers, need to get info from promo or prog??? 
  */
  if (hour < 16 || (hour === 16 && minute < 30)) {
    return { name: 'Ozge Unver', number: '+12244887073' };
  } else {
    return { name: 'Tyler Kang', number: '+18475330224' };
  }
}

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  const { name, number } = getCoordinatorNumber();
  const handleCallAccessibility = () => call(number);

  return (
    <GlobalNavivationWrapper>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingBottom: Math.max(insets.bottom, 8) + TAB_BAR_CLEARANCE,
          },
        ]}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          bounces
        >
          <View style={styles.titleContainer}>
            <Text style={styles.screenTitle}>Call Mayfest</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => void mail('support@dilloday.com')}
          >
            <View style={styles.buttonInner}>
              <FontAwesome6
                name='people-group'
                size={22}
                color='#fff'
                style={styles.buttonIcon}
              />
              <View style={styles.buttonLabelCol}>
                <Text style={styles.buttonText}>Email Mayfest Support</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleCallAccessibility}
          >
            <View style={styles.buttonInner}>
              <FontAwesome6
                name='universal-access'
                size={22}
                color='#fff'
                style={styles.buttonIcon}
              />
              <View style={styles.buttonLabelCol}>
                <Text style={styles.buttonText}>
                  Call {name} (Accessibility)
                </Text>
                <Text style={styles.subText}>{number}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => void link('https://app.dilloday.com/feedback')}
          >
            <View style={styles.buttonInner}>
              <FontAwesome6
                name='mobile'
                size={22}
                color='#fff'
                style={styles.buttonIcon}
              />
              <View style={styles.buttonLabelCol}>
                <Text style={styles.buttonText}>
                  Submit feedback to Mayfest Tech
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>

        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        <Toast topOffset={32} config={toastConfig} />
      </View>
    </GlobalNavivationWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  titleContainer: {
    alignSelf: 'stretch',
    ...sofachromeTitleContainer(),
    marginBottom: 28,
  },
  screenTitle: {
    ...sofachromeTitleTextStyle(32, { lineHeight: 40 }),
    letterSpacing: 0.5,
  },
  button: {
    alignItems: 'stretch',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 12,
    marginVertical: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '90%',
    maxWidth: 420,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    gap: 14,
  },
  buttonIcon: {
    paddingTop: 2,
  },
  buttonLabelCol: {
    flex: 1,
    alignItems: 'flex-start',
    minWidth: 0,
  },
  buttonText: {
    alignSelf: 'stretch',
    color: '#fff',
    fontFamily: 'FuturaBold',
    fontSize: 15,
    letterSpacing: 0.5,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  subText: {
    alignSelf: 'stretch',
    color: '#fff',
    fontFamily: 'FuturaBold',
    fontSize: 13,
    letterSpacing: 0.4,
    marginTop: 6,
    opacity: 0.9,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
});
