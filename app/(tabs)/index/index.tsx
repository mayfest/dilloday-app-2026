import React, { useEffect, useState } from 'react';

import HomeWelcomeBanner from '@/components/banners/home-banner';
import DilloSonaBall from '@/components/dillosonas/dillo-sona-ball';
import AnnouncementPanel from '@/components/home/announcement-panel';
import ArtistPanel from '@/components/home/artist-panel';
import LoadingIndicator from '@/components/loading-indicator';
import TabScreen from '@/components/tab-screen';
import { getAnnouncements } from '@/lib/announcement';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function HomeScreen() {
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width
  );
  const [latestMessage, setLatestMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => sub.remove();
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await getAnnouncements();
      // sort newest first
      data.sort((a, b) => b.sent.toMillis() - a.sent.toMillis());
      if (data.length > 0) {
        setLatestMessage(data[0].title);
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Couldn’t load announcement',
        text2: err.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  // pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadAnnouncements();
  };

  return (
    <TabScreen>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.titleContainer}>
            <HomeWelcomeBanner />
          </View>
          {loading ? (
            <LoadingIndicator />
          ) : (
            <AnnouncementPanel
              value={latestMessage || 'No announcements right now.'}
            />
          )}
          <ArtistPanel />

          <View style={styles.tarotWrapper}>
            <TouchableOpacity onPress={() => router.push('./modal')}>
              <DilloSonaBall />
            </TouchableOpacity>
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
  scrollViewContent: {
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  tarotWrapper: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 80,
  },
});
