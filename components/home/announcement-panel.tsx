import { Colors } from '@/constants/Colors';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AnnouncementPanelProps {
  value: string;
}

export default function AnnouncementPanel({ value }: AnnouncementPanelProps) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => {
        router.navigate({
          pathname: '/announcements',
        });
      }}
    >
      <View style={styles.contentContainer}>
        <FontAwesome6
          name='bullhorn'
          solid
          size={24}
          color={Colors.light.cardAlt || '#faefde'}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{value}</Text>
          <Text style={styles.note}>Tap to view more</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginVertical: 8,
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  note: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: Colors.light.card,
    opacity: 0.5,
    textAlign: 'right',
  },
});
