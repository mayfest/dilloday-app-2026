import ArtistItem from '@/components/artist/artist-item';
import FMOStageBanner from '@/components/schedule/fmo-stage-banner';
import MainStageBanner from '@/components/schedule/main-stage-banner';
import { useConfig } from '@/lib/config';
import { FontAwesome6 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

export default function ScheduleScrollView() {
  const { config, reload } = useConfig();
  const [state, setState] = useState('idle');
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);

  const load = () => {
    setState('loading');
    reload()
      .then(() => setState('idle'))
      .catch(() => setState('error'));
  };

  const renderStageBanner = (stage) => {
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

  // Render stage selection buttons
  const renderStageSelectors = () => {
    if (!config || !config.schedule) return null;

    const stages = Object.values(config.schedule || {}).sort(
      (a, b) => (a.position || 99) - (b.position || 100)
    );

    return (
      <View style={styles.stageSelectorsContainer}>
        {stages.map((stage, index) => (
          <TouchableOpacity
            key={`stage-${index}`}
            style={[
              styles.stageSelector,
              selectedStageIndex === index && {
                backgroundColor: stage.primary || '#ddd',
                borderColor: stage.secondary || '#bbb'
              }
            ]}
            onPress={() => setSelectedStageIndex(index)}
          >
            <Text style={[
              styles.stageSelectorText,
              selectedStageIndex === index && { color: stage.textPrimary || '#fff' }
            ]}>
              {stage.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (!config || !config.schedule) {
    return (
      <View style={styles.container}>
        {state === 'loading' && (
          <Text style={styles.text}>Loading schedule...</Text>
        )}
        {state === 'error' && (
          <Text style={styles.text}>
            No internet connection. Pull down to refresh.
          </Text>
        )}
      </View>
    );
  }

  const stages = Object.values(config.schedule || {}).sort(
    (a, b) => (a.position || 99) - (b.position || 100)
  );

  const selectedStage = stages[selectedStageIndex];

  return (
    <View style={styles.container}>
      {renderStageSelectors()}

      <View style={styles.contentContainer}>
        {renderStageBanner(selectedStage)}

        <FlatList
          data={selectedStage.artists}
          keyExtractor={(item, index) => `artist-${index}`}
          renderItem={({ item }) => (
            <ArtistItem artistId={item} stage={selectedStage} />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={state === 'loading'}
              onRefresh={() => load()}
            />
          }
          ListEmptyComponent={
            <Text style={styles.placeholder}>Nothing to show</Text>
          }
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
  },
  stageSelectorsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginVertical: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  stageSelector: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  stageSelectorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bannerContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  stageTitle: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    gap: 20,
    borderRadius: 16,
    paddingVertical: 8,
    marginVertical: 10,
    marginHorizontal: 32,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  stageTitleStar: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  stageTitleText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  placeholder: {
    fontSize: 20,
    textAlign: 'center',
    color: '#0b2b37',
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
