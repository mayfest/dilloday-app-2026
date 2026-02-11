import React from 'react';

import StackScreen from '@/components/stack-screen';
import { Colors } from '@/constants/Colors';
import { SPONSOR_BOOTHS } from '@/constants/sponsor-booths';
import { useLocalSearchParams } from 'expo-router';
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SponsorDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sponsor = SPONSOR_BOOTHS.find(
    (s) => s.name.replace(/\s+/g, '-').toLowerCase() === id
  );

  if (!sponsor) return null;

  const handleVisitWebsite = () => {
    if (sponsor.url) {
      Linking.openURL(sponsor.url);
    }
  };

  return (
    <StackScreen>
      <ScrollView contentContainerStyle={styles.container}>
        {sponsor.name === 'Pretty Cool Ice Cream' ? (
          <View style={styles.imageContainer}>
            <View style={styles.PrettyCoolBackground}>
              <Image
                source={sponsor.logo}
                style={styles.PrettyCoolImage}
                resizeMode='contain'
              />
            </View>
          </View>
        ) : (
          <Image
            source={sponsor.logo}
            style={styles.hero}
            resizeMode='contain'
          />
        )}

        {/* page title is now the activity name */}
        <Text style={styles.sectionTitle}>{sponsor.activity.name}</Text>

        <View style={styles.divider} />

        <View style={styles.activityContainer}>
          <Text style={styles.description}>{sponsor.activity.description}</Text>

          {sponsor.url && (
            <TouchableOpacity
              style={styles.websiteButton}
              onPress={handleVisitWebsite}
            >
              <Text style={styles.websiteButtonText}>Visit Website</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  hero: {
    width: width - 48,
    height: (width - 48) * 0.5,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 26,
    fontFamily: 'Poppins_700Bold',
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.text,
    marginVertical: 16,
    alignSelf: 'stretch',
  },
  activityContainer: {
    width: '100%',
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins_400Regular',
    color: Colors.light.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  websiteButton: {
    backgroundColor: Colors.light.action,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 24,
  },
  websiteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityImage: {
    width: '100%',
    height: '100%',
  },
  PrettyCoolBackground: {
    width: 80,
    height: 60,
    padding: 2,
    backgroundColor: '#f297a7',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  PrettyCoolContainer: {
    width: '100%',
    height: 600,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  PrettyCoolImage: {
    width: '100%',
    height: '100%',
  },
});
