import React from 'react';

import MyDynamicSvg from '@/components/schedule/fmo-stage-ticket';
import MainStageTicket from '@/components/schedule/main-stage-ticket';
import { useConfig } from '@/lib/config';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function ArtistItem({ artistId, stage }: ArtistItemProps) {
  const router = useRouter();
  const { config } = useConfig();
  const artist = config?.artists[artistId];

  if (!artist) {
    return null;
  }

  const [time1, ...time2] = artist.time.split(' ');
  const isFMOStage = stage.name === 'FMO Stage';
  const isMainStage = stage.name === 'Main Stage';

  if (isFMOStage && artist.available) {
    return (
      <TouchableOpacity
        style={styles.svgContainer}
        disabled={!artist.available}
        onPress={() => {
          router.navigate({
            pathname: '/artist',
            params: {
              artist: artistId,
              stage: stage.name,
            },
          });
        }}
      >
        <MyDynamicSvg artistName={artist.name} time={artist.time} />
      </TouchableOpacity>
    );
  }

  if (isMainStage && artist.available) {
    return (
      <TouchableOpacity
        style={styles.svgContainer}
        disabled={!artist.available}
        onPress={() => {
          router.navigate({
            pathname: '/artist',
            params: {
              artist: artistId,
              stage: stage.name,
            },
          });
        }}
      >
        <MainStageTicket artistName={artist.name} time={artist.time} />
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: stage.secondary || '#000000' },
        !artist.available && styles.unavailable,
      ]}
      disabled={!artist.available}
      onPress={() => {
        router.navigate({
          pathname: '/artist',
          params: {
            artist: artistId,
            stage: stage.name,
          },
        });
      }}
    >
      <View style={styles.artistContainer}>
        <Text style={[styles.artistText, { color: stage.textSecondary }]}>
          {artist.available ? artist.name : 'Announcing Soon...'}
        </Text>
      </View>
      <View style={styles.divider} />
      <View
        style={[
          styles.timeContainer,
          { backgroundColor: stage.primary || '#000000' },
        ]}
      >
        {artist.available ? (
          <>
            <Text style={[styles.timeText1, { color: stage.textPrimary }]}>
              {time1}
            </Text>
            <Text style={[styles.timeText2, { color: stage.textPrimary }]}>
              {time2.join(' ')}
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.timeText1, { color: stage.textPrimary }]}>
              -
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    height: 100,
    marginVertical: 16,
    marginHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  svgContainer: {
    marginVertical: 8,
    marginHorizontal: 32,
  },
  artistContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  artistText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  divider: {
    backgroundColor: 'red',
    width: 3,
    height: '100%',
  },
  timeContainer: {
    width: 64,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  timeText1: {
    fontWeight: '700',
    fontSize: 20,
  },
  timeText2: {
    fontWeight: '400',
    fontSize: 16,
  },
  unavailable: {
    opacity: 0.7,
  },
});
