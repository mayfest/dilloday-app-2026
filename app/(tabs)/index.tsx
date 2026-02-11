import React, { useEffect, useState } from 'react';

import COMINGSOONBanner from '@/components/banners/COMINGSOON-banner';
import HomeWelcomeBanner from '@/components/banners/home-banner';
import AnnouncementPanel from '@/components/home/announcement-panel';
import ArtistPanel from '@/components/home/artist-panel';
import TabScreen from '@/components/tab-screen';
import { Colors } from '@/constants/Colors';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

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
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.titleContainer}>
            <HomeWelcomeBanner />
          </View>
          <View style={styles.contentWrapper}>
            <AnnouncementPanel value='CARNIVAL DILLO IS FINALLY HERE!!!' />
            <ArtistPanel />
            <View style={styles.tarotWrapper}>
              {/* <GrassLBanner/> */}
              <COMINGSOONBanner />
              {/* <GrassRBanner/> */}
            </View>
          </View>
        </ScrollView>
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: 'center',
  },
  titleSecondary: {
    fontSize: 18,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 4,
    color: Colors.light.background,
    fontFamily: 'Rye_400Regular',
  },
  titlePrimary: {
    fontSize: 40,
    fontWeight: '600',
    color: Colors.light.background,
    fontFamily: 'Rye_400Regular',
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
  tarotWrapper: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
