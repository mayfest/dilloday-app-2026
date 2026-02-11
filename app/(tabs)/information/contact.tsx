import React from 'react';

import ContactMayfestIcon from '@/components/information/contact-mayfest';
import { call } from '@/lib/link';
import { theme, toastConfig } from '@/lib/theme';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

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

  if (hour < 13 || (hour === 13 && minute < 30)) {
    return { name: 'Danielle', number: '+12406786015' };
  } else {
    return { name: 'Anya', number: '+13103390032' };
  }
}

export default function ContactScreen() {
  const router = useRouter();
  const handleClose = () => router.back();

  const { name, number } = getCoordinatorNumber();
  const handleCallAccessibility = () => call(number);

  return (
    <View style={styles.container}>
      <View style={styles.modalContent}>
        <View style={styles.modalHandle} />

        <View style={styles.navigationBar}>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={handleClose}
          >
            <Text style={styles.navigationButtonText}>CLOSE</Text>
            <FontAwesome6
              name='xmark'
              size={16}
              color={theme.socialModalText}
            />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <ContactMayfestIcon width={180} height={180} style={styles.svg} />

          <TouchableOpacity
            style={styles.button}
            onPress={() => mail('support@dilloday.com')}
          >
            <FontAwesome6
              name='people-group'
              size={24}
              color={theme.socialModalBackground}
            />
            <Text style={styles.buttonText}>Email Mayfest Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleCallAccessibility}
          >
            <FontAwesome6
              name='universal-access'
              size={24}
              color={theme.socialModalBackground}
            />
            <View>
              <Text style={styles.buttonText}>Call {name} (Accessibility)</Text>
              <Text style={styles.subText}>{number} CST</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => link('https://app.dilloday.com/feedback')}
          >
            <FontAwesome6
              name='mobile'
              size={24}
              color={theme.socialModalBackground}
            />
            <Text style={styles.buttonText}>
              Submit feedback to Mayfest Tech
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        <Toast topOffset={32} config={toastConfig} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%',
  },
  modalContent: {
    width: '100%',
    backgroundColor: theme.socialModalBackground,
    height: '100%',
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  navigationBar: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 8,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  navigationButtonText: {
    color: theme.socialModalText,
    fontSize: 16,
    marginRight: 8,
    fontFamily: theme.bodyBold,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  svg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.socialModalText,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
    borderRadius: 8,
    marginVertical: 12,
    width: '90%',
  },
  buttonText: {
    color: theme.socialModalBackground,
    fontFamily: theme.bodyBold,
    fontSize: 16,
  },
});
