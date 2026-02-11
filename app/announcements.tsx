import { useEffect, useState } from 'react';

import AnnouncementFrame from '@/components/announcements/announcement-frame';
import AnnouncementItem from '@/components/announcements/announcement-item';
import DrawerScreen from '@/components/drawer-screen';
import LoadingIndicator from '@/components/loading-indicator';
import { Announcement, getAnnouncements } from '@/lib/announcement';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function AnnouncementScreen() {
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(
    null
  );
  const [state, setState] = useState<'loading' | 'error' | 'idle'>('loading');

  const load = async () => {
    setState('loading');
    try {
      const data = await getAnnouncements();
      data.sort((a, b) => b.sent.toMillis() - a.sent.toMillis());
      setAnnouncements(data);
      setState('idle');
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load announcements.',
        text2: err.message,
      });
      setState('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (state === 'loading' && announcements === null) {
    return (
      <DrawerScreen>
        <LoadingIndicator />
      </DrawerScreen>
    );
  }

  if (state === 'error' && announcements === null) {
    return (
      <DrawerScreen>
        <Text style={styles.errorText}>
          Couldn’t load announcements. Pull down to retry.
        </Text>
        <FlatList
          data={[]}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={load} />
          }
        />
      </DrawerScreen>
    );
  }

  return (
    <DrawerScreen banner={<AnnouncementFrame />}>
      <FlatList
        data={announcements!}
        keyExtractor={(item) => `announcement-${item.id}`}
        renderItem={({ item }) => <AnnouncementItem data={item} />}
        contentContainerStyle={styles.content}
        refreshing={state === 'loading'}
        onRefresh={load}
        showsVerticalScrollIndicator={false}
      />
      <View style={{ height: 60 }} />
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
  errorText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
});
