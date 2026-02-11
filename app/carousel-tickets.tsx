// CarouselPartnerPage.tsx
import React from 'react';

import DilloDayAppIcon from '@/assets/icons/app-icon.png';
import LineLeapLogo from '@/assets/images/company-logos/line-leap-logo.png';
import CarouselTicketsBanner from '@/components/banners/carousel-tickets-banner';
import CarouselIcon from '@/components/carousel-tickets/carousel-icon';
import DrawerScreen from '@/components/drawer-screen';
import AccordionItem from '@/components/faq/accordion-item';
import { Colors } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const IOS_URL = 'https://apps.apple.com/us/app/lineleap/id960804043';
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=io.Lineleap';

export default function CarouselPartnerPage() {
  const width = Dimensions.get('window').width;
  const iconSize = width * 0.6;

  function openLink(url: string) {
    Linking.openURL(url).catch(() => console.warn('Could not open URL:', url));
  }

  const STEPS: Array<{
    title: string;
    content: Array<string | React.ReactNode>;
  }> = [
    {
      title: 'Step 1: Install & Open LineLeap',
      content: [
        <Text key='step1-1' style={styles.stepText}>
          Download and install the LineLeap app from the{' '}
          <Text style={styles.link} onPress={() => openLink(IOS_URL)}>
            App Store
          </Text>{' '}
          or{' '}
          <Text style={styles.link} onPress={() => openLink(ANDROID_URL)}>
            Google Play
          </Text>
          .
        </Text>,
        'Open the app to get started.',
      ],
    },
    {
      title: 'Step 2: Create Your Free Account',
      content: [
        "Tap 'Sign Up' and enter your email and a secure password.",
        'Verify your email address if prompted.',
      ],
    },
    {
      title: 'Step 3: Find Dillo Day 2025',
      content: [
        'Use the search bar at the top of the LineLeap app.',
        "Type 'Dillo Day 2025 Carousel' and select our event from the list.",
      ],
    },
    {
      title: 'Step 4: Claim Your Carousel Pass',
      content: [
        'Browse available time slots and pick one you like.',
        "Tap 'RSVP', fill out any additional information needed, and confirm your reservation time for the carousel.",
        'You MUST RSVP TO THE CAROUSEL PASS IN THE LINELEAP APP.',
        'You MUST show your RSVP to the carousel pass at the carousel entrance in order to ride the carousel.',
        'Carousel passes are limited and will be available on a first-come, first-served basis so be sure to reserve your spot early!',
      ],
    },
  ];

  return (
    <DrawerScreen banner={<CarouselTicketsBanner />}>
      <StatusBar style='dark' />
      <ScrollView
        contentContainerStyle={[
          styles.wrapper,
          {
            marginTop: 36,
            // ensure enough bottom padding so disclaimer never gets cut off
            paddingBottom: iconSize + 80,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.backgroundContainer}>
          <View style={styles.contentOverlay}>
            <Text style={styles.introText}>
              We’ve partnered with LineLeap to bring you a special carousel
              experience at Dillo Day 2025! Please read through all of the steps
              below carefully to claim and reserve your carousel pass.
            </Text>

            <View style={styles.partnerHeader}>
              <Image
                source={DilloDayAppIcon}
                style={styles.logo}
                resizeMode='contain'
              />
              <Text style={styles.partnerX}>×</Text>
              <Image
                source={LineLeapLogo}
                style={styles.logo}
                resizeMode='contain'
              />
            </View>

            <View style={styles.stepsContainer}>
              {STEPS.map((step, idx) => (
                <AccordionItem
                  key={idx}
                  title={step.title}
                  content={step.content}
                />
              ))}
            </View>

            <View style={styles.carouselIconContainer}>
              <CarouselIcon width={iconSize} height={iconSize} />
            </View>

            <Text style={[styles.disclaimer, { marginBottom: 10 }]}>
              This is a paid partnership with Line Leap by which Dillo Day
              benefits from. By using the Line Leap app, you agree to their
              terms and conditions. Dillo Day nor the Dillo Day Technology
              Committee are not responsible for any issues that may arise from
              using the app. Please contact Line Leap support for any questions
              or concerns.
            </Text>
          </View>
        </View>
      </ScrollView>
    </DrawerScreen>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
  },
  backgroundContainer: {
    position: 'relative',
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
  },
  contentOverlay: {
    width: '100%',
    alignItems: 'center',
  },
  introText: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
    fontFamily: 'Poppins_600SemiBold',
  },
  partnerHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    height: 100,
  },
  logo: {
    borderRadius: 8,
    width: 90,
    height: 90,
  },
  partnerX: {
    fontSize: 36,
    fontWeight: '700',
    marginHorizontal: 6,
    color: Colors.light.text,
  },
  stepsContainer: {
    width: '100%',
    marginTop: 8,
  },
  stepText: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 22,
    marginBottom: 12,
    fontFamily: 'Poppins_400Regular',
  },
  link: {
    color: '#2296f2',
    textDecorationLine: 'underline',
  },
  carouselIconContainer: {
    marginTop: 24,
    marginBottom: 20,
  },
  disclaimer: {
    fontSize: 14,
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 8,
    fontFamily: 'Poppins_400Regular',
  },
});
