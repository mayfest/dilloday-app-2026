import GlobalNavivationWrapper from '@/components/navigation/navigation-bar';
import {
  consumeRacingTry,
  getRacingTriesRemaining
} from '@/lib/racing-tries';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HOW_TO_PLAY = `• Tilt your phone (or use device motion) to steer your car left and right.
• Avoid hitting other cars — any collision ends the run.
• Cars you successfully pass add to your score.
• The road speeds up as your score grows — stay sharp!`;

const PRIZES = `Prizes for top racers will be announced here. Check back closer to Dillo Day, or ask an organizer for this year’s rules.

(You can edit this text in app/racing-game/index.tsx.)`;

/** Bottom clearance for the floating tab bar (see global-tab-bar: ~60px tall + ~20 from bottom) */
const LOBBY_TAB_BAR_CLEARANCE = 88;

function InfoDropdown({
  title,
  body,
  open,
  onToggle,
}: {
  title: string;
  body: string;
  open: boolean;
  onToggle: () => void;
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
      {open ? <Text style={styles.dropdownBody}>{body}</Text> : null}
    </View>
  );
}

export default function RacingGameLobbyScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [remaining, setRemaining] = useState<number | null>(null);
  const [starting, setStarting] = useState(false);
  const [howToOpen, setHowToOpen] = useState(false);
  const [prizesOpen, setPrizesOpen] = useState(false);

  const refreshTries = useCallback(async () => {
    const n = await getRacingTriesRemaining();
    setRemaining(n);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setStarting(false);
      void (async () => {
        const n = await getRacingTriesRemaining();
        if (!cancelled) {
          setRemaining(n);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const onStart = async () => {
    if (starting || remaining === null || remaining <= 0) {
      return;
    }
    setStarting(true);
    try {
      const ok = await consumeRacingTry();
      if (!ok) {
        await refreshTries();
        setStarting(false);
        return;
      }
      await refreshTries();
      router.push({
        pathname: '/racing-game/play',
        params: { nonce: String(Date.now()) },
      });
    } catch {
      setStarting(false);
    }
  };

  const triesLabel =
    remaining === null
      ? 'Loading tries…'
      : remaining === 0
        ? `You have 0 tries left`
        : `You have ${remaining} tr${remaining === 1 ? 'y' : 'ies'} left`;

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
        >
        <Text style={styles.tagline}>Mayfest presents...</Text>
        <Text style={styles.title}>Dillo Speedway</Text>

        <View style={styles.triesCard}>
          <Text style={styles.triesLabel}>{triesLabel}</Text>
        </View>

        <InfoDropdown
          title="How to play"
          body={HOW_TO_PLAY}
          open={howToOpen}
          onToggle={() => setHowToOpen((v) => !v)}
        />
        <InfoDropdown
          title="Prizes"
          body={PRIZES}
          open={prizesOpen}
          onToggle={() => setPrizesOpen((v) => !v)}
        />
      </ScrollView>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.primary,
            (remaining === 0 || remaining === null) && styles.buttonDisabled,
            pressed && styles.pressed,
          ]}
          onPress={onStart}
          disabled={
            remaining === 0 || remaining === null || starting
          }
        >
          <Text style={styles.primaryText}>
            {starting ? 'Starting…' : 'Start'}
          </Text>
        </Pressable>
        {/* <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.secondary,
            pressed && styles.pressed,
          ]}
          onPress={() => goToTabHome(navigation.dispatch, { preferBack: true })}
        >
          <Text style={styles.secondaryText}>Back to home</Text>
        </Pressable> */}
      </View>
      </View>
    </GlobalNavivationWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#2a2a2e',
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
  triesCard: {
    marginTop: 28,
    padding: 18,
    borderRadius: 14,
    backgroundColor: '#3d3d42',
  },
  triesLabel: {
    fontSize: 16,
    lineHeight: 24,
    color: '#e8e8ec',
    textAlign: 'center',
  },
  dropdown: {
    marginTop: 16,
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#3d3d42',
    overflow: 'hidden',
  },
  dropdownHeader: {
    // paddingLeft: 10,
    alignSelf: 'stretch',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  dropdownHeaderRow: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
  },
  dropdownHeaderPressed: {
    opacity: 0.85,
  },
  dropdownChevron: {
    color: '#FFFFFF', //0a7ea4',
    fontSize: 16,
    lineHeight: 22,
    width: 24,
    marginRight: 10,
    textAlign: 'center',
  },
  dropdownTitle: {
    flex: 1,
    flexShrink: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  dropdownBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
    fontSize: 15,
    lineHeight: 22,
    color: '#c8c8cc',
  },
  actions: {
    gap: 12,
    paddingTop: 8,
  },
  button: {
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
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
  },
  pressed: {
    opacity: 0.88,
  },
  primaryText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
});
