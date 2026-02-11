import { useEffect, useState } from 'react';

import AnnouncementFrame from '@/components/announcements/announcement-frame';
import AnnouncementItem from '@/components/announcements/announcement-item';
import StackScreen from '@/components/stack-screen';
import { Announcement, getAnnouncements } from '@/lib/announcement';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
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
    <StackScreen>
      <View style={styles.frameContainer}>
        <AnnouncementFrame />
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
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  frameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 5,
  },
});
