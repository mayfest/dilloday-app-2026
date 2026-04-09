import GlobalNavivationWrapper from '@/components/navigation/navigation-bar';
import { getRacingTriesRemaining } from '@/lib/racing-tries';
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
    if (starting || remaining === null) {
      return;
    }
    setStarting(true);
    try {
      // TESTING MODE: temporarily bypass try consumption.
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
      : 'Unlimited tries (testing mode)';

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

          {/* RACING BORDER CARD */}
          <View style={styles.triesBorderOuter}>
            {/* TOP CURB */}
            <View style={styles.curbRow}>
              {Array.from({ length: 24 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.curbBlock,
                    { backgroundColor: i % 2 === 0 ? '#D62828' : '#F4F4F4' },
                  ]}
                />
              ))}
            </View>

            {/* CONTENT */}
            <View style={styles.triesInner}>
              <Text style={styles.triesLabel}>{triesLabel}</Text>
            </View>

            {/* BOTTOM CURB */}
            <View style={styles.curbRow}>
              {Array.from({ length: 24 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.curbBlock,
                    { backgroundColor: i % 2 === 0 ? '#D62828' : '#F4F4F4' },
                  ]}
                />
              ))}
            </View>
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
              remaining === null && styles.buttonDisabled,
              pressed && styles.pressed,
            ]}
            onPress={onStart}
            disabled={remaining === null || starting}
          >
            <Text style={styles.primaryText}>
              {starting ? 'Starting…' : 'Start'}
            </Text>
          </Pressable>
        </View>
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

  // 🚗 RACING BORDER
  triesBorderOuter: {
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
  triesInner: {
    backgroundColor: '#3d3d42',
    padding: 18,
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
  pressed: {
    opacity: 0.88,
  },
  primaryText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});