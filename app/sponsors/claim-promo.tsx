import React, { useCallback, useEffect, useState } from 'react';

import StackScreen from '@/components/stack-screen';
import { Colors } from '@/constants/Colors';
import {
  ActivityIndicator,
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
const IMAGE_HEIGHT = width * 1.1;

const OptimizedImage = ({ source, style, alt }: any) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const onLoadStart = () => {
    setLoading(true);
    setError(false);
  };
  const onLoadEnd = () => setLoading(false);
  const onError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <View style={[style, styles.imageWrapper]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={Colors.light.action} />
        </View>
      )}
      <Image
        source={source}
        style={[style, loading && { opacity: 0.3 }]}
        resizeMode='contain'
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
        onError={onError}
        fadeDuration={100}
        accessible
        accessibilityLabel={alt}
      />
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load image</Text>
        </View>
      )}
    </View>
  );
};

export default function ClaimPromoScreen() {
  const flyer = require('@/assets/images/claim-promo.jpeg');
  const openStore = useCallback(async () => {
    const url = 'https://apps.apple.com/us/app/claim/id1643003868';
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  }, []);

  return (
    <StackScreen>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* 1) Flyer image */}
        <OptimizedImage
          source={flyer}
          style={styles.flyerImage}
          alt='Get paid to eat with Claim promo flyer'
        />

        {/* 2) Intro paragraph */}
        <Text style={styles.description}>
          Dillo Day has partnered with Claim to send you cash back at your
          favorite spots. Simply use the codes below in the Claim app to earn
          real money when you grab a bite!
        </Text>

        {/* 3) Codes list */}
        <View style={styles.codesContainer}>
          <Text style={styles.codeItem}>Kung Fu Tea — DILLOTEA</Text>
          <Text style={styles.codeItem}>Starbucks — DILLOCOFFEE</Text>
          <Text style={styles.codeItem}>Cold Stone — DILLOCREAM</Text>
        </View>

        {/* 4) Download button */}
        <TouchableOpacity style={styles.downloadButton} onPress={openStore}>
          <Text style={styles.downloadButtonText}>
            Download Claim on the App Store
          </Text>
        </TouchableOpacity>

        {/* 5) FTC / Apple disclaimer */}
        <Text style={styles.disclaimer}>
          This is a paid sponsorship deal with Claim. We’ve disclosed this in
          accordance with FTC guidelines and Apple App Store policies.
        </Text>
      </ScrollView>
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  flyerImage: {
    width: width * 0.9,
    height: IMAGE_HEIGHT,
    borderRadius: 8,
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 5,
    borderRadius: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },

  description: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.light.text,
    marginBottom: 16,
    fontFamily: 'Poppins_400Regular',
  },
  codesContainer: {
    width: '100%',
    marginBottom: 24,
  },
  codeItem: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.action,
    marginVertical: 4,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  downloadButton: {
    backgroundColor: Colors.light.text,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 24,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Poppins_600SemiBold',
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.light.text,
    opacity: 0.7,
    paddingHorizontal: 16,
    fontFamily: 'Poppins_400Regular',
  },
});
