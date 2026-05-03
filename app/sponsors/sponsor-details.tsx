// app/sponsors/sponsor-details.tsx
import React, { useEffect, useState } from 'react';

import StackScreen from '@/components/stack-screen';
import { Colors } from '@/constants/Colors';
import { SPONSOR_BOOTHS } from '@/constants/sponsor-booths';
import { getSponsors } from '@/lib/sponsors';
import { useLocalSearchParams } from 'expo-router';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const WHITE_BG_SPONSORS = new Set([
  'Crossroads',
  "Stand Up by L'Oreal Paris",
  'Postmates',
  'Vacation',
]);

export default function SponsorDetailsModal() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const sponsor = SPONSOR_BOOTHS.find((b) => b.name === name)!;
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    getSponsors()
      .then((sponsors) => {
        const match = sponsors.find((s) => s.name === name);
        if (match) setLogoUrl(match.logoUrl ?? undefined);
      })
      .catch((e) => console.error('Failed to load sponsor logo:', e));
  }, [name]);

  const { activity, url } = sponsor;
  const needsWhiteBg = WHITE_BG_SPONSORS.has(name);

  return (
    <StackScreen backgroundColor={Colors.dark.background} backButtonColor='#fff'>
      <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: Colors.dark.background }}>
        <View style={[styles.logoWrapper, needsWhiteBg && styles.logoWrapperWhite]}>
          <Image source={{ uri: logoUrl }} style={styles.logo} resizeMode='contain' />
        </View>
        <Text style={styles.title}>{activity.name}</Text>
        <Text style={styles.location}>{activity.location}</Text>
        <Text style={styles.description}>{activity.description}</Text>
        {url && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL(url)}
          >
            <Text style={styles.buttonText}>Visit Website</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    height: '100%',
  },
  logoWrapper: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapperWhite: {
    backgroundColor: '#fff',
    padding: 8,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  location: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.light.action,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.light.text,
    fontWeight: '700',
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 16,
    color: Colors.light.text,
  },
});
