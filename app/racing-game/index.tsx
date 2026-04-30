import GlobalNavivationWrapper from '@/components/navigation/navigation-bar';
import {
  getTopLeaderboard,
  type RacingLeaderboardEntry,
} from '@/lib/racing-leaderboard';
import {
  RACING_REAL_TRIES,
  canPlayScored,
  getProfile,
  isLockedOut,
  setName,
  type RacingPlayerProfile,
} from '@/lib/racing-player-profile';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
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

const PRIZES = `Prizes for top racers will be announced here. Check back closer to Dillo Day, or ask an organizer for this year's rules.`;

const LOBBY_TAB_BAR_CLEARANCE = 88;

function Dropdown({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.dropdown}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [
          styles.dropdownHeader,
          pressed && styles.dropdownHeaderPressed,
        ]}
      >
        <View style={styles.dropdownHeaderRow}>
          <Text style={styles.dropdownChevron}>{open ? '▼' : '▶'}</Text>
          <Text style={styles.dropdownTitle}>{title}</Text>
        </View>
      </Pressable>
      {open ? children : null}
    </View>
  );
}

export default function RacingGameLobbyScreen() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<RacingPlayerProfile | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [starting, setStarting] = useState(false);
  const [howToOpen, setHowToOpen] = useState(false);
  const [prizesOpen, setPrizesOpen] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const [boardRows, setBoardRows] = useState<RacingLeaderboardEntry[] | null>(
    null
  );

  const loadBoard = useCallback(async () => {
    const rows = await getTopLeaderboard(10);
    setBoardRows(rows);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setStarting(false);
      void (async () => {
        const p = await getProfile();
        if (!cancelled) {
          setProfile(p);
          if (p.displayName) setNameInput(p.displayName);
        }
        const rows = await getTopLeaderboard(10);
        if (!cancelled) setBoardRows(rows);
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const onToggleBoard = () => {
    setBoardOpen((v) => {
      const next = !v;
      if (next) void loadBoard();
      return next;
    });
  };

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
            placeholder="Your name"
            placeholderTextColor="#888"
            style={styles.input}
            autoCapitalize="words"
            maxLength={24}
            returnKeyType="done"
            onSubmitEditing={onSaveName}
          />
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.primary,
              (!nameInput.trim() || savingName) && styles.buttonDisabled,
              pressed && styles.pressed,
            ]}
            onPress={onSaveName}
            disabled={!nameInput.trim() || savingName}
          >
            <Text style={styles.primaryText}>
              {savingName ? 'Saving…' : 'Save and continue'}
            </Text>
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
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.primary,
              starting && styles.buttonDisabled,
              pressed && styles.pressed,
            ]}
            onPress={onStartPractice}
            disabled={starting}
          >
            <Text style={styles.primaryText}>
              {starting ? 'Starting…' : 'Start practice'}
            </Text>
          </Pressable>
        </View>
      );
    }

    if (canPlayScored(profile)) {
      const next = profile.realTriesUsed + 1;
      return (
        <View>
          <Text style={styles.statusTitle}>
            Attempt {next} of {RACING_REAL_TRIES}
          </Text>
          <Text style={styles.statusBody}>
            Your top score across your {RACING_REAL_TRIES} real attempts goes
            on the leaderboard.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.primary,
              starting && styles.buttonDisabled,
              pressed && styles.pressed,
            ]}
            onPress={onStartScored}
            disabled={starting}
          >
            <Text style={styles.primaryText}>
              {starting ? 'Starting…' : `Start attempt ${next}`}
            </Text>
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
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.primary,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              router.push({
                pathname: '/racing-game/game-over',
                params: { mode: 'view-only' },
              })
            }
          >
            <Text style={styles.primaryText}>View leaderboard</Text>
          </Pressable>
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
            paddingTop: Math.max(insets.top, 16),
            paddingBottom:
              Math.max(insets.bottom, 16) + LOBBY_TAB_BAR_CLEARANCE,
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.tagline}>Mayfest presents...</Text>
          <Text style={styles.title}>Dillo Speedway</Text>

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

          <Dropdown
            title="How to play"
            open={howToOpen}
            onToggle={() => setHowToOpen((v) => !v)}
          >
            <Text style={styles.dropdownBody}>{HOW_TO_PLAY}</Text>
          </Dropdown>
          <Dropdown
            title="Prizes"
            open={prizesOpen}
            onToggle={() => setPrizesOpen((v) => !v)}
          >
            <Text style={styles.dropdownBody}>{PRIZES}</Text>
          </Dropdown>
          <Dropdown
            title="Leaderboard"
            open={boardOpen}
            onToggle={onToggleBoard}
          >
            <View style={styles.boardWrap}>
              {boardRows === null ? (
                <ActivityIndicator color="#fff" style={styles.boardLoader} />
              ) : boardRows.length === 0 ? (
                <Text style={styles.boardEmpty}>
                  No scores yet. Be the first!
                </Text>
              ) : (
                boardRows.map((row, idx) => {
                  const isYou =
                    profile && row.userId === profile.userId;
                  return (
                    <View
                      key={row.userId}
                      style={[styles.boardRow, idx === 0 && styles.boardRowFirst]}
                    >
                      <Text style={styles.boardRank}>{idx + 1}.</Text>
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
            </View>
          </Dropdown>
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
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
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
    overflow: 'hidden',
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
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  statusBody: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#d0d0d4',
    textAlign: 'center',
  },
  input: {
    marginTop: 14,
    backgroundColor: '#2a2a2e',
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontSize: 16,
  },

  dropdown: {
    marginTop: 16,
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#3d3d42',
    overflow: 'hidden',
  },
  dropdownHeader: {
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  dropdownHeaderRow: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownHeaderPressed: {
    opacity: 0.85,
  },
  dropdownChevron: {
    color: '#FFFFFF',
    fontSize: 16,
    width: 24,
    marginRight: 10,
    textAlign: 'center',
  },
  dropdownTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  dropdownBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    fontSize: 15,
    lineHeight: 22,
    color: '#c8c8cc',
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
    paddingHorizontal: 4,
    paddingVertical: 12,
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  boardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 4,
    backgroundColor: '#2a2a2e',
  },
  boardRowFirst: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  boardRank: {
    width: 28,
    fontSize: 14,
    fontWeight: '600',
    color: '#a8a8ad',
  },
  boardName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  boardNameYou: {
    color: '#0a7ea4',
  },
  boardScore: {
    fontSize: 16,
    fontWeight: '700',
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
});
