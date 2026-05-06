import React, { useCallback, useEffect, useState } from 'react';

import AccordionItem from '@/components/faq/accordion-item';
import GlobalNavivationWrapper from '@/components/navigation/navigation-bar';
import {
  type RacingLeaderboardEntry,
  subscribeTopLeaderboard,
} from '@/lib/racing-leaderboard';
import {
  RACING_DEV_UNLIMITED_TRIES,
  RACING_REAL_TRIES,
  type RacingPlayerProfile,
  canPlayScored,
  getProfile,
  isLockedOut,
  setName,
} from '@/lib/racing-player-profile';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HOW_TO_PLAY = `• Tilt your phone (or use device motion) to steer your car left and right.
• Avoid hitting other cars — any collision ends the run.
• Cars you successfully pass add to your score.
• The road speeds up as your score grows — stay sharp!`;

// const PRIZES = `Prizes for top racers will be announced here. Check back closer to Dillo Day, or ask an organizer for this year's rules.`;

const LOBBY_TAB_BAR_CLEARANCE = 116;

export default function RacingGameLobbyScreen() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<RacingPlayerProfile | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [starting, setStarting] = useState(false);
  const [boardRows, setBoardRows] = useState<RacingLeaderboardEntry[] | null>(
    null
  );
  const [resetKey, setResetKey] = useState(0);

  // Profile is per-device; refresh on focus.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setStarting(false);
      void (async () => {
        const p = await getProfile();
        if (!cancelled) {
          setProfile(p);
          if (p?.displayName) setNameInput(p.displayName);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        setResetKey((k) => k + 1);
      };
    }, [])
  );

  // Live leaderboard from Firestore — every device sees the same canonical
  // top-10. Subscribe once on mount; the listener pushes updates whenever
  // any user's score changes.
  useEffect(() => {
    const unsub = subscribeTopLeaderboard(10, (rows) => setBoardRows(rows));
    return unsub;
  }, []);

  const onSaveName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed || savingName) return;
    setSavingName(true);
    try {
      const next = await setName(trimmed);
      setProfile(next);
    } finally {
      setSavingName(false);
    }
  };

  const onStartPractice = () => {
    if (starting) return;
    setStarting(true);
    router.push({
      pathname: '/racing-game/play',
      params: { nonce: String(Date.now()), mode: 'practice' },
    });
  };

  const onStartScored = () => {
    if (starting) return;
    setStarting(true);
    router.push({
      pathname: '/racing-game/play',
      params: { nonce: String(Date.now()), mode: 'scored' },
    });
  };

  const renderState = () => {
    if (!profile) {
      return <Text style={styles.statusBody}>Loading…</Text>;
    }

    if (!profile.displayName) {
      return (
        <View>
          <Text style={styles.statusTitle}>Enter your name</Text>
          <Text style={styles.statusBody}>
            Your name appears on the leaderboard.
          </Text>
          <TextInput
            value={nameInput}
            onChangeText={setNameInput}
            placeholder='Your name'
            placeholderTextColor='#888'
            style={styles.input}
            autoCapitalize='words'
            maxLength={24}
            returnKeyType='done'
            onSubmitEditing={onSaveName}
          />
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.attemptButton,
              (!nameInput.trim() || savingName) && styles.buttonDisabled,
              pressed && styles.pressed,
            ]}
            onPress={onSaveName}
            disabled={!nameInput.trim() || savingName}
          >
            <View
              style={[
                styles.attemptButtonLabelWrap,
                styles.attemptRibbonCompactWrap,
              ]}
            >
              <Text
                style={[
                  styles.attemptButtonLabel,
                  styles.attemptRibbonCompactText,
                ]}
              >
                {savingName ? 'Saving…' : 'Continue'}
              </Text>
            </View>
          </Pressable>
        </View>
      );
    }

    if (!profile.practiceUsed) {
      return (
        <View>
          <Text style={styles.statusTitle}>First, a practice run</Text>
          <Text style={styles.statusBody}>
            This is your one and only practice. After this you'll have{' '}
            {RACING_REAL_TRIES} real attempts — only those count for the
            leaderboard.
          </Text>
          <View
            pointerEvents='none'
            style={styles.gapPracticeIntroToStartButton}
          />
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.attemptButton,
              starting && styles.buttonDisabled,
              pressed && styles.pressed,
            ]}
            onPress={onStartPractice}
            disabled={starting}
          >
            <View
              style={[
                styles.attemptButtonLabelWrap,
                styles.attemptRibbonCompactWrap,
              ]}
            >
              <Text
                style={[
                  styles.attemptButtonLabel,
                  styles.attemptRibbonCompactText,
                ]}
              >
                {starting ? 'Starting…' : 'Start practice'}
              </Text>
            </View>
          </Pressable>
        </View>
      );
    }

    if (canPlayScored(profile)) {
      const next = Math.min(profile.realTriesUsed + 1, RACING_REAL_TRIES);
      return (
        <View>
          <Text style={styles.statusTitle}>
            {RACING_DEV_UNLIMITED_TRIES
              ? 'Attempt (dev unlimited)'
              : `Attempt ${next} of ${RACING_REAL_TRIES}`}
          </Text>
          <Text style={styles.statusBody}>
            {RACING_DEV_UNLIMITED_TRIES
              ? 'Dev mode: tries are not consumed and you cannot be locked out.'
              : `Your top score across your ${RACING_REAL_TRIES} real attempts goes on the leaderboard.`}
          </Text>
          <View style={styles.attemptSpacer} />
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.attemptButton,
              starting && styles.buttonDisabled,
              pressed && styles.pressed,
            ]}
            onPress={onStartScored}
            disabled={starting}
          >
            <View style={styles.attemptButtonLabelWrap}>
              <Text style={styles.attemptButtonLabel}>
                {starting ? 'Starting…' : 'Start'}
              </Text>
            </View>
          </Pressable>
        </View>
      );
    }

    if (isLockedOut(profile)) {
      return (
        <View>
          <Text style={styles.statusTitle}>All attempts used</Text>
          <Text style={styles.statusBody}>
            You've used all {RACING_REAL_TRIES} attempts. Check the leaderboard
            to see how you placed.
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <GlobalNavivationWrapper>
      <View
        style={[
          styles.screen,
          {
            paddingTop: Math.max(insets.top, 48),
            paddingBottom:
              Math.max(insets.bottom, 16) + LOBBY_TAB_BAR_CLEARANCE,
          },
        ]}
      >
        <ScrollView
          removeClippedSubviews={false}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          {/* <Text style={styles.tagline}>Mayfest presents...</Text> */}
          <Text style={styles.title}>Speedway Dillo</Text>

          <View style={styles.statusBorderOuter}>
            <View style={styles.curbRow}>
              {Array.from({ length: 24 }).map((_, i) => (
                <View
                  key={`top-${i}`}
                  style={[
                    styles.curbBlock,
                    { backgroundColor: i % 2 === 0 ? '#D62828' : '#F4F4F4' },
                  ]}
                />
              ))}
            </View>

            <View style={styles.statusInner}>{renderState()}</View>

            <View style={styles.curbRow}>
              {Array.from({ length: 24 }).map((_, i) => (
                <View
                  key={`bot-${i}`}
                  style={[
                    styles.curbBlock,
                    { backgroundColor: i % 2 === 0 ? '#D62828' : '#F4F4F4' },
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.howToWrap}>
            <AccordionItem
              key={`how-to-${resetKey}`}
              title='How to play'
              content={[HOW_TO_PLAY]}
            />
          </View>
          {/* <AccordionItem
            key={`prizes-${resetKey}`}
            title='Prizes'
            content={[PRIZES]}
          /> */}
          <AccordionItem
            key={`leaderboard-${resetKey}`}
            title='Leaderboard'
            content={[
              <View key='leaderboard-content' style={styles.boardWrap}>
                {boardRows === null ? (
                  <ActivityIndicator color='#fff' style={styles.boardLoader} />
                ) : boardRows.length === 0 ? (
                  <Text style={styles.boardEmpty}>
                    No scores yet. Be the first!
                  </Text>
                ) : (
                  boardRows.map((row, idx) => {
                    const isYou = profile && row.userId === profile.userId;
                    return (
                      <View
                        key={row.userId}
                        style={[
                          styles.boardRow,
                          idx === 0 && styles.boardRowFirst,
                        ]}
                      >
                        <Text style={styles.boardRank}>#{idx + 1}</Text>
                        <Text
                          style={[
                            styles.boardName,
                            isYou && styles.boardNameYou,
                          ]}
                          numberOfLines={1}
                        >
                          {row.name}
                          {isYou ? ' (you)' : ''}
                        </Text>
                        <Text style={styles.boardScore}>{row.topScore}</Text>
                      </View>
                    );
                  })
                )}
              </View>,
            ]}
          />
        </ScrollView>
      </View>
    </GlobalNavivationWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 24,
  },
  scroll: {
    paddingBottom: 24,
  },
  title: {
    color: '#FFEB3B',
    fontFamily: 'SofachromeIt',
    fontSize: 30,
    letterSpacing: 1,
    paddingRight: 8,
    textAlign: 'center',
  },
  tagline: {
    marginTop: 8,
    fontSize: 16,
    color: '#a8a8ad',
    textAlign: 'center',
  },

  statusBorderOuter: {
    marginTop: 28,
    borderRadius: 6,
    overflow: 'visible',
    backgroundColor: '#000',
  },
  curbRow: {
    flexDirection: 'row',
    height: 4,
  },
  curbBlock: {
    flex: 1,
  },
  statusInner: {
    backgroundColor: '#3d3d42',
    padding: 18,
  },
  howToWrap: {
    marginTop: 12,
  },
  statusTitle: {
    fontSize: 20,
    fontFamily: 'FuturaBold',
    color: '#fff',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  statusBody: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Futura',
    color: '#d0d0d4',
    textAlign: 'center',
  },
  attemptSpacer: {
    height: 20,
  },
  input: {
    marginTop: 14,
    marginBottom: 15,
    backgroundColor: '#2a2a2e',
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontFamily: 'FuturaBold',
    fontSize: 16,
    textAlign: 'left',
  },

  boardWrap: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4,
  },
  boardLoader: {
    marginVertical: 16,
  },
  boardEmpty: {
    fontFamily: 'FuturaBold',
    paddingHorizontal: 4,
    paddingVertical: 12,
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
  },
  boardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 10,
    marginBottom: 6,
    backgroundColor: '#3d3d42',
  },
  boardRowFirst: {
    borderWidth: 1,
    borderColor: '#FFEB3B',
  },
  boardRank: {
    minWidth: 40,
    marginRight: 4,
    fontFamily: 'FuturaBold',
    fontSize: 16,
    color: '#a8a8ad',
  },
  boardName: {
    flex: 1,
    fontFamily: 'FuturaBold',
    fontSize: 16,
    color: '#fff',
  },
  boardNameYou: {
    color: '#FFEB3B',
  },
  boardScore: {
    fontFamily: 'FuturaBold',
    fontSize: 18,
    color: '#fff',
  },

  button: {
    marginTop: 14,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#0a7ea4',
  },
  attemptButton: {
    backgroundColor: 'transparent',
    alignSelf: 'center',
    marginTop: 0,
    paddingHorizontal: 22,
    paddingVertical: 6,
    overflow: 'visible',
  },
  gapPracticeIntroToStartButton: {
    height: 19,
  },
  buttonDisabled: {
    backgroundColor: '#555',
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.88,
  },
  primaryText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  attemptButtonLabelWrap: {
    alignSelf: 'center',
    backgroundColor: '#FFEB3B',
    transform: [{ skewX: '-10deg' }],
    overflow: 'visible',
  },
  attemptRibbonCompactWrap: {
    maxWidth: 288,
  },
  attemptButtonLabel: {
    color: '#001F54',
    fontSize: 17,
    fontWeight: '700',
    fontStyle: 'italic',
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingVertical: 6,
    paddingHorizontal: 20,
    transform: [{ skewX: '10deg' }],
  },
  attemptRibbonCompactText: {
    fontSize: 15,
    paddingVertical: 5,
  },
});
