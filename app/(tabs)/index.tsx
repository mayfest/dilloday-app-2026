import React, { useEffect, useState } from 'react';

import AnnouncementPanel from '@/components/home/announcement-panel';
import ArtistPanel from '@/components/home/artist-panel';
import TabScreen from '@/components/tab-screen';
import { Colors } from '@/constants/Colors';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    position: 'relative',
    width: '100%',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    padding: 16,
    // marginTop: 65,
    marginHorizontal: 16,
    alignItems: 'flex-start',
  },
  titleSecondary: {
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 4,
    color: Colors.light.background,
  },
  titlePrimary: {
    fontSize: 40,
    fontWeight: '600',
    color: Colors.light.background,
  },
  ticketContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
  contentWrapper: {
    width: '100%',
  },
});

export default function HomeScreen() {
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width
  );
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription.remove();
  }, []);

  return (
    <TabScreen>
      <View style={styles.container}>
        <View style={styles.backgroundImage}>
          <Image
            source={require('../../assets/images/off-white.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode='cover'
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titleSecondary}>Welcome to</Text>
          <Text style={styles.titlePrimary}>DILLO DAY 53</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.contentWrapper}>
            <AnnouncementPanel value='CARNIVAL DILLO IS FINALLY HERE!!!' />
            <ArtistPanel />
          </View>
        </ScrollView>
      </View>
    </TabScreen>
  );
}
