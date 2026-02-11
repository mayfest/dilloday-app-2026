import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import your SVG as a React component:
import BalloonLogoPink from '../../assets/images/balloonlogopink.svg';

const { width } = Dimensions.get('window');

export default function OnboardingStep1() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/onboarding/step-2');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <BalloonLogoPink width={width * 0.6} height={width * 0.6} />
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>Welcome to Dillo Day!</Text>
        <Text style={styles.text}>
          We’re thrilled to have you here—let’s get you set up so you can explore maps, schedules, and more.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.dots}>
        {/* simple indicator; you can swap this for a dynamic pager */}
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF5E7',  // light cream
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  hero: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copy: {
    flex: 1,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#B9572F',  // your “Coachella”‐inspired terracotta
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 40,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8E8E93',
    margin: 6,
  },
  activeDot: {
    backgroundColor: '#B9572F',
  },
});
