// app/sponsors/index.tsx
import React from 'react';

import SponsorsPageBanner from '@/components/banners/sponsors-banner';
import DrawerScreen from '@/components/drawer-screen';
import { Colors } from '@/constants/Colors';
import { SPONSOR_BOOTHS } from '@/constants/sponsor-booths';
import { SPONSORS } from '@/constants/sponsors';
import { Link, useRouter } from 'expo-router';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SponsorsScreen() {
  const router = useRouter();

  const openUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <DrawerScreen banner={<SponsorsPageBanner />}>
      <ScrollView contentContainerStyle={styles.container}>
        <Link href='/sponsors/claim-promo' asChild>
          <TouchableOpacity style={styles.promoContainer}>
            <Text style={styles.promoText}>
              Exclusive claim deal — tap to learn more
            </Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.underline} />

        {SPONSORS.map(({ name, logo, url }, i) => {
          console.log('name', name);
          const hasBooth = SPONSOR_BOOTHS.some((b) => b.name === name);

          const handlePress = () => {
            if (hasBooth) {
              router.push({
                pathname: '/sponsors/sponsor-details',
                params: { name },
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
                i === SPONSORS.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              {name === 'Pretty Cool Ice Cream' ? (
                <View style={styles.logoWrapper}>
                  <Image
                    source={logo}
                    style={styles.logo}
                    resizeMode='contain'
                  />
                </View>
              ) : (
                <View style={styles.logoWrapper}>
                  <Image
                    source={logo}
                    style={styles.logo}
                    resizeMode='contain'
                  />
                </View>
              )}
              <Text style={styles.name}>{name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </DrawerScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  underline: {
    height: 1,
    backgroundColor: Colors.light.text,
    marginVertical: 16,
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
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  PrettyCoolBackground: {
    width: 80,
    height: 40,
    padding: 8,
    backgroundColor: '#f297a7',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontFamily: 'Poppins_600SemiBold',
  },
  promoContainer: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.text,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  promoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
  },
});
