import React from 'react';

import StackScreen from '@/components/stack-screen';
import { Colors } from '@/constants/Colors';
import { SOCIALS } from '@/constants/socials';
import { FontAwesome6 } from '@expo/vector-icons';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SocialsScreen() {
  const open = async (url: string) => {
    if (await Linking.canOpenURL(url)) {
      Linking.openURL(url);
    }
  };

  return (
    <StackScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>DILLO DAY SOCIALS</Text>
        <View style={styles.underline} />
        {SOCIALS.map(({ label, handle, url, icon }, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.row,
              i === SOCIALS.length - 1 && { borderBottomWidth: 0 },
            ]}
            activeOpacity={0.7}
            onPress={() => open(url)}
          >
            <View style={styles.iconWrapper}>
              <FontAwesome6
                name={icon as any}
                size={25}
                color={Colors.light.action}
              />
            </View>
            <Text style={styles.label}>{label.toUpperCase()}</Text>
            <Text style={styles.handle}>{handle}</Text>
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
    fontWeight: '700',
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
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  handle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.action,
  },
});
