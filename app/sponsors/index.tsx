// app/sponsors/index.tsx
import React, { useEffect, useState } from 'react';

import DrawerScreen from '@/components/drawer-screen';
import { Colors } from '@/constants/Colors';
import { SPONSOR_BOOTHS } from '@/constants/sponsor-booths';
import { Sponsor, getSponsors } from '@/lib/sponsors';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
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

export default function SponsorsScreen() {
  const router = useRouter();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSponsors()
      .then(setSponsors)
      .catch((e) => console.error('Failed to load sponsors:', e))
      .finally(() => setLoading(false));
  }, []);

  const openUrl = (url?: string) => {
    if (url && url !== '---') Linking.openURL(url);
  };

  return (
    <DrawerScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>Sponsors</Text>
        </View>

        {loading ? (
          <ActivityIndicator
            color={Colors.light.text}
            style={{ marginTop: 32 }}
          />
        ) : (
          sponsors.map(({ name, logoUrl, url }, i) => {
            const hasBooth = SPONSOR_BOOTHS.some((b) => b.name === name);

            const handlePress = () => {
              if (hasBooth) {
                router.push({
                  pathname: '/sponsors/sponsor-details',
                  params: { name, logoUrl },
                });
              } else {
                openUrl(url);
              }
            };

            return (
              <TouchableOpacity
                key={name}
                activeOpacity={0.7}
                onPress={handlePress}
                style={[
                  styles.row,
                  i === sponsors.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View
                  style={[
                    styles.logoWrapper,
                    WHITE_BG_SPONSORS.has(name) && styles.logoWrapperWhite,
                  ]}
                >
                  <Image
                    source={{ uri: logoUrl }}
                    style={styles.logo}
                    resizeMode='contain'
                  />
                </View>
                <Text style={styles.name}>{name}</Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </DrawerScreen>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
    overflow: 'visible',
  },
  pageTitle: {
    color: '#FFEB3B',
    fontFamily: 'SofachromeIt',
    fontSize: 32,
    letterSpacing: 1,
    paddingRight: 8,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1.25,
    borderBottomColor: Colors.light.text,
  },
  logoWrapper: {
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapperWhite: {
    backgroundColor: '#fff',
    padding: 4,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  name: {
    flex: 1,
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.text,
    fontFamily: 'FuturaBold',
    textTransform: 'uppercase',
  },
});
