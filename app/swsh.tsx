import { useEffect, useState } from 'react';

import SwshPageBanner from '@/components/banners/swsh-banner';
import DrawerScreen from '@/components/drawer-screen';
import { CircularReel } from '@/components/swsh-integration/circle-reel';
import { CurvedHeader } from '@/components/swsh-integration/curved-text-view';
import { SwshRedirectButton } from '@/components/swsh-integration/swsh-redirect-button';
import { Colors } from '@/constants/Colors';
import { REEL_SIZE } from '@/constants/circle-reel';
import { fetchSwshPhotos } from '@/lib/swsh';
import { FontAwesome6 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  Modal,
  Platform,
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
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  // Check if device is an iPad
  const isIPad =
    Platform.OS === 'ios' && Math.min(windowWidth, windowHeight) >= 768;

  useEffect(() => {
    setModalVisible(true);
    const loadImages = async () => {
      try {
        const images = await fetchSwshPhotos();
        console.log('Fetched images:', images);
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

  return (
    <DrawerScreen banner={<SwshPageBanner />}>
      <StatusBar style='dark' />
      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingTop: insets.top },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <CurvedHeader text='DILLO DAY x SWSH' size={REEL_SIZE} />
          <CircularReel size={REEL_SIZE} defaultImages={defaultImages} />
          <SwshRedirectButton
            text='Add your Dillo Day pics to SWSH!'
            url='https://www.joinswsh.com/album/nv8py0svl0l6'
          />
          <View style={styles.spacer} />
        </View>
      </ScrollView>

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
                We've partnered with SWSH to create a special photo album where
                you can upload and view pictures from the festival.
              </Text>
              <Text style={styles.text}>
                To add your photos, press the "CLOSE" button and then click on
                the "Add your Dillo Day pics to SWSH!" button above. This will
                take you to the SWSH website where you can upload your images.
                You can also view other photos that have been shared by your
                fellow Dillo Day attendees.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </DrawerScreen>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  bannerWrapper: {
    paddingLeft: 16,
    width: '100%',
    paddingHorizontal: 1,
  },
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 40, // Add padding at the bottom for scrolling
  },
  spacer: {
    height: 60, // Extra space at the bottom for better scrolling
  },
  liftedGroup: {
    transform: [{ translateY: -20 }],
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
    height: '80%',
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
