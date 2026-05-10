import { useCallback, useEffect, useRef, useState } from 'react';

import AnnouncementItem from '@/components/announcements/announcement-item';
import {
  sofachromeTitleContainer,
  sofachromeTitleTextStyle,
} from '@/constants/sofachrome-screen-title';
import DrawerScreen from '@/components/drawer-screen';
import LoadingIndicator from '@/components/loading-indicator';
import { Announcement, getAnnouncements } from '@/lib/announcement';
import { useFocusEffect } from 'expo-router';
import {
  FlatList,
  RefreshControl,
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
  const listRef = useRef<FlatList<Announcement>>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    load();
  }, []);

  useFocusEffect(
    useCallback(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: false });

      return () => {
        setResetKey((key) => key + 1);
      };
    }, [])
  );

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
          renderItem={() => null}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={load} />
          }
        />
      </DrawerScreen>
    );
  }

  return (
    <DrawerScreen>
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>ANNOUNCEMENTS</Text>
      </View>
      <FlatList
        ref={listRef}
        data={announcements!}
        keyExtractor={(item) => `${resetKey}-announcement-${item.id}`}
        renderItem={({ item, index }) => (
          <AnnouncementItem data={item} index={index} />
        )}
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
  titleContainer: {
    alignSelf: 'stretch',
    ...sofachromeTitleContainer(),
    marginTop: 34,
    marginBottom: 16,
    width: '100%',
  },
  content: {
    paddingHorizontal: 5,
    marginTop: 10,
    paddingBottom: 20,
  },
  pageTitle: {
    ...sofachromeTitleTextStyle(20, { letterSpacing: 1 }),
  },
  errorText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
});
