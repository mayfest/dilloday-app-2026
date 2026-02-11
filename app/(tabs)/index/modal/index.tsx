import React from 'react';

import IntroHand from '@/assets/dillo-sonas/question-icons/intro-hand.svg';
import DilloSonaStackScreen from '@/components/dillo-sona-screen';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function IntroTarotScreen() {
  const router = useRouter();
  const { width } = Dimensions.get('window');

  return (
    <DilloSonaStackScreen hideBackButton={true}>
      <View style={styles.container}>
        <Text style={styles.title}>TAROT READINGS</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: 'modal/[id]',
              params: { id: 'g1' },
            })
          }
        >
          <IntroHand width={width * 0.9} height={width * 0.9} />
        </TouchableOpacity>
        <Text style={styles.subtitle}>press above to learn your future</Text>
      </View>
      <View style={styles.filler} />
    </DilloSonaStackScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  title: {
    marginTop: 16,
    color: '#D9D9D9',
    fontSize: 42,
    fontWeight: '700',
    fontFamily: 'SofiaSansCondensed_900Black',
    letterSpacing: 5,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    color: '#DDD',
    fontSize: 36,
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    letterSpacing: 2,
    textAlign: 'center',
  },
  filler: {
    flex: 1,
  },
});
