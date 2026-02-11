import { useEffect, useState } from 'react';

import { ArrowSignSVG } from '@/components/arrow-sign';
import SwshPageBanner from '@/components/banners/swsh-banner';
import DrawerScreen from '@/components/drawer-screen';
import { CircularReel } from '@/components/swsh-integration/circle-reel';
import { CurvedHeader } from '@/components/swsh-integration/curved-text-view';
import { Colors } from '@/constants/Colors';
import { REEL_SIZE } from '@/constants/circle-reel';
import { fetchSwshPhotos } from '@/lib/swsh';
import { FontAwesome6 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SwshPage() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [defaultImages, setDefaultImages] = useState<string[]>([]);

  useEffect(() => {
    setModalVisible(true);
    const loadImages = async () => {
      try {
        const images = await fetchSwshPhotos();
        setDefaultImages(images);
      } catch (error) {
        console.error('Error loading images:', error);
        setDefaultImages(
          Array.from(
            { length: 10 },
            (_, i) => `https://picsum.photos/200?${i + 1}`
          )
        );
      }
    };

    loadImages();
  }, []);

  const handleOpenSwsh = () => {
    Linking.openURL('https://www.joinswsh.com/album/pg5rftklzxfb');
  };

  return (
    <DrawerScreen
      banner={
        <View style={styles.bannerWrapper}>
          <SwshPageBanner />
        </View>
      }
    >
      <StatusBar style='dark' />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <CurvedHeader text='DILLO DAY x SWSH' size={REEL_SIZE} />
        <CircularReel size={REEL_SIZE} defaultImages={defaultImages} />

        {/* Replace SwshRedirectButton with our new ArrowSignSVG component */}
        <ArrowSignSVG
          text='Add your your Pictures!'
          onPress={handleOpenSwsh}
          width={320}
          height={60}
          textColor='#b33b3b'
          borderColor='#b33b3b'
          backgroundColor='#f0e6c3'
          fontSize={20}
        />

        <StatusBar style='dark' />
        <Modal
          animationType='slide'
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.navigationBar}>
                <TouchableOpacity
                  style={styles.navigationButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.navigationButtonText}>CLOSE</Text>
                  <FontAwesome6 name='xmark' size={16} color='#FFFFFF' />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.modalScrollContent}>
                <Text style={styles.titleSecondary}>Welcome to</Text>
                <Text style={styles.titlePrimary}>DILLO DAY x SWSH</Text>
                <Text style={styles.text}>
                  Share your Dillo Day memories with the Northwestern community!
                  We've partnered with SWSH to create a special photo album
                  where you can upload and view pictures from the festival.
                </Text>
                <Text style={styles.text}>
                  Simply click the button below to add your photos to the
                  community album. You can also view photos shared by other
                  attendees in the circular reel above.
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </DrawerScreen>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {},
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // align at top
  },
  liftedGroup: {
    transform: [{ translateY: -20 }], // move up by 20px
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    height: '90%',
    backgroundColor: Colors.light.text,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
  },
  navigationBar: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 8,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  navigationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
    fontWeight: '400',
  },
  modalScrollContent: {
    alignItems: 'center',
    padding: 16,
    paddingBottom: 64,
  },
  titlePrimary: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 1,
  },
  titleSecondary: {
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
    lineHeight: 24,
  },
});
