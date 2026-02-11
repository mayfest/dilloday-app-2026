import React from 'react';

import StackScreen from '@/components/stack-screen';
import { Colors } from '@/constants/Colors';
import { SPONSORS } from '@/constants/sponsors';
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
  const open = async (url?: string) => {
    if (url && (await Linking.canOpenURL(url))) {
      Linking.openURL(url);
    }
  };

  return (
    <StackScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>DILLO 53 SPONSORS</Text>
        <View style={styles.underline} />

        {SPONSORS.map(({ name, logo, url }, i) => (
          <TouchableOpacity
            key={name}
            activeOpacity={url ? 0.7 : 1}
            onPress={() => open(url)}
            style={[
              styles.row,
              i === SPONSORS.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            {name === 'Pretty Cool' ? (
              <View style={styles.PrettyCoolBackground}>
                <Image source={logo} style={styles.logo} resizeMode='contain' />
              </View>
            ) : (
              <View style={styles.logoWrapper}>
                <Image source={logo} style={styles.logo} resizeMode='contain' />
              </View>
            )}
            <Text style={styles.name}>{name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    color: Colors.light.text,
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
  },
});
