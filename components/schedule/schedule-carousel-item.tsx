import React from 'react';

import ArtistItem from '@/components/artist/artist-item';
import FMOStageBanner from '@/components/schedule/fmo-stage-banner';
import MainStageBanner from '@/components/schedule/main-stage-banner';
import { useConfig } from '@/lib/config';
import { Stage } from '@/lib/schedule';
import { FontAwesome6 } from '@expo/vector-icons';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface CarouselItemProps {
  stage: Stage;
  state: 'loading' | 'error' | 'idle';
  refresh: () => void;
}

export default function ScheduleCarouselItem({
  stage,
  state,
  refresh,
}: CarouselItemProps) {
  const { config } = useConfig();

  const renderStageBanner = () => {
    if (stage.name?.toLowerCase().includes('main')) {
      return (
        <View style={styles.bannerContainer}>
          <MainStageBanner />
        </View>
      );
    } else if (stage.name?.toLowerCase().includes('fmo')) {
      return (
        <View style={styles.bannerContainer}>
          <FMOStageBanner />
        </View>
      );
    } else {
      return (
        <View style={[styles.stageTitle, { backgroundColor: stage.primary }]}>
          <FontAwesome6
            name={stage.icon}
            solid
            size={32}
            color={stage.textPrimary}
            style={[
              styles.stageTitleStar,
              { transform: [{ rotate: '20deg' }] },
            ]}
          />
          <Text style={[styles.stageTitleText, { color: stage.textPrimary }]}>
            {stage.name}
          </Text>
          <FontAwesome6
            name={stage.icon}
            solid
            size={32}
            color={stage.textPrimary}
            style={[
              styles.stageTitleStar,
              { transform: [{ rotate: '-20deg' }] },
            ]}
          />
        </View>
      );
    }
  };

  // Filter out unavailable artists
  const availableArtists = stage.artists.filter((artistId) => {
    const artist = config?.artists?.[artistId];
    return artist && artist.available;
  });

  return (
    <View style={styles.container}>
      {renderStageBanner()}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={state === 'loading'}
            onRefresh={() => {
              refresh();
            }}
          />
        }
      >
        {availableArtists.length > 0 ? (
          availableArtists.map((artist, i) => (
            <ArtistItem key={`artist-${i}`} artistId={artist} stage={stage} />
          ))
        ) : (
          <Text style={styles.placeholder}>Nothing to show</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  bannerContainer: {
    marginTop: 25,
    marginBottom: 10,
  },
  stageTitle: {
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
  },
  stageTitleStar: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  stageTitleText: {
    fontSize: 32,
    // fontFamily: theme.headingBold,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  artistBox: {
    borderRadius: 24,
    width: '100%',
    height: 100,
    marginVertical: 8,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.98,
  },
  artistName: {
    fontSize: 25,
    textAlign: 'right',
    width: '100%',
    textTransform: 'uppercase',
  },
  artistTime: {
    fontSize: 18,
    textAlign: 'left',
    width: '100%',
    color: '#f8e5b9',
  },
  placeholder: {
    fontSize: 20,
    textAlign: 'center',
    color: '#0b2b37',
    marginVertical: 20,
  },
});
