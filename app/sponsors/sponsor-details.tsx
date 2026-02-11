// app/sponsors/sponsor-details.tsx
import React from 'react';

import StackScreen from '@/components/stack-screen';
import { Colors } from '@/constants/Colors';
import { SPONSOR_BOOTHS } from '@/constants/sponsor-booths';
import { useLocalSearchParams } from 'expo-router';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

export default function SponsorDetailsModal() {
  const { name } = useLocalSearchParams<{ name: string }>();
  console.log('name', name);
  const sponsor = SPONSOR_BOOTHS.find((b) => b.name === name)!;

  const { activity, logo, url } = sponsor;

  return (
    <StackScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={logo} style={styles.logo} resizeMode='contain' />
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
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
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
    backgroundColor: Colors.light.text,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
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
