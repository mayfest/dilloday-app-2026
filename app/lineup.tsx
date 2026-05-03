import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import GlobalNavivationWrapper from '@/components/navigation/navigation-bar';
import FestivalLineupTimeline, {
  type FestivalSlot,
  type FestivalStage,
} from '@/components/schedule/festival-lineup-timeline';
import { Colors } from '@/constants/Colors';
import { useConfig } from '@/lib/config';
import { StatusBar } from 'expo-status-bar';
import {
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_CLEARANCE = 88;
const TIMELINE_START_HOUR = 14;
const TIMELINE_HOUR_SPAN = 9;

const MOCK_STAGES: FestivalStage[] = [
  {
    key: 'mock-a',
    name: 'MAIN STAGE',
    slots: [
      {
        id: 'm1',
        name: 'Opening act',
        startMinutes: 14 * 60 + 45,
        durationMinutes: 45,
      },
      {
        id: 'm2',
        name: 'Headliner set',
        startMinutes: 17 * 60,
        durationMinutes: 60,
      },
      {
        id: 'm3',
        name: 'Late night',
        startMinutes: 19 * 60 + 30,
        durationMinutes: 55,
      },
    ],
  },
  {
    key: 'mock-b',
    name: 'FMO STAGE',
    slots: [
      {
        id: 'm4',
        name: 'Campus band',
        startMinutes: 15 * 60,
        durationMinutes: 40,
      },
      {
        id: 'm5',
        name: 'DJ set',
        startMinutes: 18 * 60 + 15,
        durationMinutes: 90,
      },
    ],
  },
  {
    key: 'mock-c',
    name: 'THE BURROW',
    slots: [
      {
        id: 'm6',
        name: 'Acoustic hour',
        startMinutes: 14 * 60 + 30,
        durationMinutes: 60,
      },
      {
        id: 'm7',
        name: 'Student showcase',
        startMinutes: 16 * 60 + 45,
        durationMinutes: 50,
      },
    ],
  },
];

export default function LineupScreen() {
  const insets = useSafeAreaInsets();
  const { config } = useConfig();
  const [selectedArtist, setSelectedArtist] = useState<{
    slot: FestivalSlot;
    stage: string;
  } | null>(null);

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(0)).current;

  const closeArtistModal = useCallback(() => {
    const h = Dimensions.get('window').height;
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: h,
        duration: 260,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => setSelectedArtist(null));
  }, [backdropOpacity, sheetTranslateY]);

  useEffect(() => {
    if (!selectedArtist) return;

    const h = Dimensions.get('window').height;
    backdropOpacity.setValue(0);
    sheetTranslateY.setValue(h);

    Animated.parallel([
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      closeArtistModal();
      return true;
    });

    return () => sub.remove();
  }, [selectedArtist, backdropOpacity, sheetTranslateY, closeArtistModal]);

  const stages = useMemo(() => MOCK_STAGES, []);

  const onPressArtist = useCallback((slot: FestivalSlot, stageName: string) => {
    setSelectedArtist({ slot, stage: stageName });
  }, []);

  // Helper to get artist info from config
  const artistData = selectedArtist
    ? config?.artists?.[selectedArtist.slot.id]
    : null;

  return (
    <GlobalNavivationWrapper>
      <View
        style={[
          styles.root,
          {
            paddingTop: insets.top,
            paddingBottom: Math.max(insets.bottom, 8) + TAB_BAR_CLEARANCE,
          },
        ]}
      >
        <StatusBar style='light' />

        <View style={styles.topBar}>
          <Text style={styles.lineupTitle}>LINEUP</Text>
        </View>

        <ScrollView
          style={styles.timelineScroll}
          showsVerticalScrollIndicator={false}
        >
          <FestivalLineupTimeline
            stages={stages}
            startHour={TIMELINE_START_HOUR}
            hourSpan={TIMELINE_HOUR_SPAN}
            onPressArtist={onPressArtist}
          />
        </ScrollView>

        <Modal
          visible={!!selectedArtist}
          animationType='none'
          transparent
          onRequestClose={closeArtistModal}
        >
          <View style={styles.modalContainer}>
            <Animated.View
              pointerEvents='box-none'
              style={[styles.backdropWrap, { opacity: backdropOpacity }]}
            >
              <Pressable
                style={StyleSheet.absoluteFill}
                accessibilityRole='button'
                accessibilityLabel='Close artist details'
                onPress={closeArtistModal}
              >
                <View style={styles.backdrop} />
              </Pressable>
            </Animated.View>

            <Animated.View
              style={[
                styles.popupSheetWrap,
                { transform: [{ translateY: sheetTranslateY }] },
              ]}
            >
              <View
                style={[
                  styles.popupSheet,
                  { paddingBottom: insets.bottom + 20 },
                ]}
              >
                <View style={styles.dragHandle} />

                <ScrollView showsVerticalScrollIndicator={false}>
                  {selectedArtist && (
                    <View style={styles.contentContainer}>
                      <Image
                        source={{
                          uri:
                            artistData?.image ||
                            'https://via.placeholder.com/400',
                        }}
                        style={styles.artistHeroImage}
                        resizeMode='cover'
                      />

                      <View style={styles.plateCard}>
                        <View style={styles.plateHeader}>
                          <View style={styles.locBadge}>
                            <Text style={styles.locText}>L.A., CA</Text>
                          </View>
                          <Text style={styles.plateStageText}>
                            {selectedArtist.stage}
                          </Text>
                          <View style={styles.timeBadge}>
                            <Text style={styles.timeText}>8PM</Text>
                          </View>
                        </View>

                        <View style={styles.plateBody}>
                          <Text style={styles.plateArtistName}>
                            {selectedArtist.slot.name
                              .split(' ')
                              .join('\n')
                              .toUpperCase()}
                          </Text>
                        </View>

                        <View style={styles.plateFooter}>
                          <Text style={styles.footerSubtext}>
                            NIGHTTIME HEADLINER
                          </Text>
                        </View>
                      </View>

                      {/* 3. Bio Text */}
                      <Text style={styles.bioText}>
                        {artistData?.bio ||
                          'No biography available for this artist.'}
                      </Text>

                      <Pressable
                        style={styles.closeBtn}
                        onPress={closeArtistModal}
                      >
                        <Text style={styles.closeBtnText}>CLOSE</Text>
                      </Pressable>
                    </View>
                  )}
                </ScrollView>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </View>
    </GlobalNavivationWrapper>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  topBar: { paddingVertical: 12, alignItems: 'center' },
  lineupTitle: {
    color: '#FFEB3B',
    fontFamily: 'Sofachrome',
    fontSize: 29,
    fontStyle: 'italic',
  },
  timelineScroll: { flex: 1 },

  modalContainer: { flex: 1, justifyContent: 'flex-end' },
  backdropWrap: StyleSheet.absoluteFillObject,
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  popupSheetWrap: {
    zIndex: 1,
    width: '100%',
    height: '60%',
  },

  popupSheet: {
    flex: 1,
    backgroundColor: Colors.light.tint,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
  },
  contentContainer: { alignItems: 'center' },

  artistHeroImage: {
    width: '100%',
    height: 100,
    borderRadius: 20,
  },

  // License Plate Card
  plateCard: {
    backgroundColor: '#FFFBE6',
    width: '95%',
    borderRadius: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  plateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  locBadge: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  locText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  timeBadge: {
    backgroundColor: '#FFB300',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  timeText: { color: 'black', fontSize: 10, fontWeight: 'bold' },
  plateStageText: { color: '#D32F2F', fontWeight: '900', fontSize: 14 },

  plateBody: { paddingVertical: 10 },
  plateArtistName: {
    fontFamily: 'Sofachrome',
    fontSize: 26,
    color: '#1A365D',
    textAlign: 'center',
    lineHeight: 32,
  },
  plateFooter: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    width: '100%',
    paddingTop: 5,
    alignItems: 'center',
  },

  footerSubtext: {
    fontSize: 10,
    color: '#2D5A27',
    fontWeight: 'bold',
  },

  bioText: {
    marginTop: 30,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Futura',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  closeBtn: {
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  closeBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
