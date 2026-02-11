import { ReactNode } from 'react';

import SocialPanelBadge from '@/components/home/dillosona-icon';
import { useConfig } from '@/lib/config';
import { socialNavigate } from '@/lib/social';
import { theme } from '@/lib/theme';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SocialPanel() {
  const router = useRouter();
  const { config, user, userState } = useConfig();

  const open = config?.social.status === 'open';

  let badge: ReactNode = null;

  if (config?.social.status === 'matched') {
    if (user) {
      if (userState?.match) {
        badge = (
          <SocialPanelBadge
            colors={{
              background: theme.socialPanelBadge3,
              text: theme.socialPanelBadgeTextLight,
            }}
          >
            matched
          </SocialPanelBadge>
        );
      } else {
        badge = (
          <SocialPanelBadge
            colors={{
              background: theme.socialPanelBadge4,
              text: theme.socialPanelBadgeTextLight,
            }}
          >
            closed
          </SocialPanelBadge>
        );
      }
    } else {
      badge = (
        <SocialPanelBadge
          colors={{
            background: theme.socialPanelBadge3,
            text: theme.socialPanelBadgeTextLight,
          }}
        >
          matches ready
        </SocialPanelBadge>
      );
    }
  } else {
    if (user) {
      if (userState?.ready) {
        badge = (
          <SocialPanelBadge
            colors={{
              background: theme.socialPanelBadge3,
              text: theme.socialPanelBadgeTextLight,
            }}
          >
            complete
          </SocialPanelBadge>
        );
      } else {
        badge = (
          <SocialPanelBadge
            colors={{
              background: theme.socialPanelBadge2,
              text: theme.socialPanelBadgeTextDark,
            }}
          >
            incomplete
          </SocialPanelBadge>
        );
      }
    } else {
      badge = (
        <SocialPanelBadge
          colors={{
            background: theme.socialPanelBadge1,
            text: theme.socialPanelBadgeTextLight,
          }}
        >
          get started
        </SocialPanelBadge>
      );
    }

    if (!open) {
      if (!user || !userState?.ready) {
        badge = (
          <SocialPanelBadge
            colors={{
              background: theme.socialPanelBadge4,
              text: theme.socialPanelBadgeTextLight,
            }}
          >
            closed
          </SocialPanelBadge>
        );
      }
    }
  }

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => {
        const redirect = socialNavigate({ config, user, userState }, router);
        if (!redirect) {
          router.navigate('/social');
        }
      }}
    >
      <View style={styles.textContent}>
        <Text style={styles.secondaryText}>Find your</Text>
        <Text style={styles.primaryText}>CABIN MATE</Text>
      </View>
      <View style={styles.badgeContainer}>{badge}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.socialPanelBackground,
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginVertical: 8,
    flex: 1,
  },
  textContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 8,
  },
  primaryText: {
    fontSize: 28,
    fontFamily: theme.headingBold,
    color: theme.socialPanelText,
  },
  secondaryText: {
    fontSize: 20,
    fontFamily: theme.headingRegular,
    color: theme.socialPanelText,
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
});
