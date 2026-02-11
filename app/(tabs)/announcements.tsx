import { useEffect, useState } from 'react';

import AnnouncementItem from '@/components/announcements/announcement-item';
// import LoadingIndicator from '@/components/LoadingIndicator';
import TabScreen from '@/components/tab-screen';
import { Announcement, getAnnouncements } from '@/lib/announcement';
import { FontAwesome6 } from '@expo/vector-icons';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function AnnouncementScreen() {
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(
    null
  );
  const [state, setState] = useState<'loading' | 'error' | 'idle'>('loading');

  const load = () => {
    setState('loading');
    getAnnouncements()
      .then((announcements) => {
        setAnnouncements(
          announcements.sort((a, b) => b.sent.toMillis() - a.sent.toMillis())
        );
        setState('idle');
      })
      .catch((err: Error) => {
        Toast.show({
          type: 'error',
          text1: 'Failed to load announcements.',
          text2: err.message,
        });
        setState('error');
      });
  };

  useEffect(() => {
    load();
  }, []);
  return (
    <TabScreen>
      <View style={styles.title}>
        <FontAwesome6
          name='bullhorn'
          solid
          size={24}
          // color={Colors.light.cardAlt}
          color='#faefde'
          style={styles.titleStar}
        />
        <Text style={styles.titleText}>Announcements</Text>
        <FontAwesome6
          name='bullhorn'
          solid
          size={24}
          // color={Colors.light.cardAlt}
          color='#faefde'
          style={styles.titleStar}
        />
      </View>
      {announcements && (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={state === 'loading'}
              onRefresh={() => {
                load();
              }}
            />
          }
        >
          {announcements.map((announcement) => (
            <AnnouncementItem
              data={announcement}
              key={`announcement-${announcement.id}`}
            />
          ))}
        </ScrollView>
      )}
      {/* {!announcements && state === 'loading' && <LoadingIndicator />} */}
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    gap: 20,
    borderRadius: 16,
    paddingVertical: 8,
    marginTop: 16,
    marginHorizontal: 32,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    backgroundColor: '#172b59',
  },
  titleStar: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    // color: Colors.light.cardAlt,
    color: '#faefde',
  },
  content: {
    flex: 1,
  },
});
