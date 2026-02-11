import { useEffect, useState } from 'react';

import AnnouncementFrame from '@/components/announcements/announcement-frame';
import AnnouncementItem from '@/components/announcements/announcement-item';
import DrawerScreen from '@/components/drawer-screen';
import { Announcement, getAnnouncements } from '@/lib/announcement';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
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

  const ListHeaderComponent = () => (
    <View style={styles.frameContainer}>
      <AnnouncementFrame />
    </View>
  );

  const renderAnnouncementItem = ({ item }: { item: Announcement }) => (
    <AnnouncementItem data={item} key={`announcement-${item.id}`} />
  );

  return (
    <DrawerScreen>
      {announcements && (
        <FlatList
          data={announcements}
          keyExtractor={(item) => `announcement-${item.id}`}
          renderItem={renderAnnouncementItem}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={state === 'loading'}
              onRefresh={() => {
                load();
              }}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </DrawerScreen>
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
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
});
