import { theme } from '@/lib/theme';
import { StyleSheet, Text, View } from 'react-native';

interface SocialPanelBadgeProps {
  colors: {
    background: string;
    text: string;
  };
  children: string;
}

export default function SocialPanelBadge({
  colors,
  children,
}: SocialPanelBadgeProps) {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    fontFamily: theme.headingBold,
    textTransform: 'uppercase',
  },
});
