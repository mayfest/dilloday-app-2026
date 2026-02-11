import React, { useEffect, useRef } from 'react';

import SmokeSvg from '@/assets/dillo-sonas/smoke.svg';
import DilloSonaStackScreen from '@/components/dillo-sona-screen';
import {
  OptionConfig,
  QuestionConfig,
  questions,
} from '@/constants/dillo-sona-questions';
import { useDilloSona } from '@/contexts/dillo-sona-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function QuestionScreen() {
  const params = useLocalSearchParams();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const config: QuestionConfig | undefined = id ? questions[id] : undefined;
  const { add } = useDilloSona();
  const router = useRouter();
  const { width, height } = Dimensions.get('window');

  // animated opacity
  const opacity = useRef(new Animated.Value(0)).current;

  // fade in on mount / when question id changes
  useEffect(() => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [id]);

  if (!config) {
    return (
      <DilloSonaStackScreen hideBackButton={true}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Question “{id}” not found.</Text>
        </View>
      </DilloSonaStackScreen>
    );
  }

  const onChoose = (optKey: string) => {
    // fade out, then navigate
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      const opt = config.options.find((o) => o.key === optKey)!;
      add(opt.tally);
      const nextScreen =
        opt.next === 'result' ? '/modal/result' : `/modal/${opt.next}`;
      router.push(nextScreen as any);
    });
  };

  const isBinary = config.options.length === 2;

  return (
    <DilloSonaStackScreen>
      <View style={styles.wrapper}>
        <SmokeSvg
          width={width}
          height={height}
          style={StyleSheet.absoluteFill}
          preserveAspectRatio='xMidYMid slice'
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity }}>
            {isBinary ? (
              <View style={styles.binaryWrapper}>
                <Text style={styles.promptBinary}>{config.prompt}</Text>
                <Text style={styles.orText}>
                  {config.options[0].label}
                  {'\n'}OR{'\n'}
                  {config.options[1].label}
                </Text>
                <View style={styles.binaryContainer}>
                  {config.options.map((opt) => (
                    <TouchableOpacity
                      key={opt.key}
                      onPress={() => onChoose(opt.key)}
                      activeOpacity={0.8}
                      style={styles.binaryOption}
                    >
                      <opt.Icon width={width * 0.4} height={width * 0.4} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <>
                <Text style={styles.prompt}>{config.prompt}</Text>
                <View
                  style={[
                    styles.container,
                    config.options.length > 2 && styles.containerWrap,
                  ]}
                >
                  {config.options.map((opt: OptionConfig) => (
                    <TouchableOpacity
                      key={opt.key}
                      style={[
                        styles.option,
                        config.options.length > 2 && styles.optionHalf,
                      ]}
                      onPress={() => onChoose(opt.key)}
                      activeOpacity={0.8}
                    >
                      <opt.Icon width={width * 0.4} height={width * 0.4} />
                      <Text style={styles.label}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </View>
    </DilloSonaStackScreen>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 30,
  },

  prompt: {
    color: '#D9D9D9',
    fontSize: 26,
    textAlign: 'center',
    fontFamily: 'SofiaSans_800ExtraBold',
    letterSpacing: 3,
    lineHeight: 40,
  },

  promptBinary: {
    color: '#D9D9D9',
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'SofiaSans_800ExtraBold',
    letterSpacing: 3,
    lineHeight: 36,
  },

  orText: {
    color: '#D9D9D9',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'SofiaSans_800ExtraBold',
    letterSpacing: 3,
    lineHeight: 32,
  },

  binaryWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  containerWrap: {
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  binaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },

  binaryOption: {
    alignItems: 'center',
  },

  option: {
    alignItems: 'center',
  },
  optionHalf: {
    width: '45%',
    marginVertical: 16,
    alignItems: 'center',
  },

  label: {
    marginTop: 8,
    color: '#D9D9D9',
    fontFamily: 'SofiaSansCondensed_700Bold',
    letterSpacing: 2,
    fontSize: 16,
    textAlign: 'center',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorText: {
    color: '#FFF',
    fontSize: 18,
  },
});
