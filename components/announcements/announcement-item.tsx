import { Colors } from '@/constants/Colors';
import { Announcement } from '@/lib/announcement';
import { StyleSheet, Text, View } from 'react-native';

interface AnnouncementProps {
  data: Announcement;
}

export default function AnnouncementItem({ data }: AnnouncementProps) {
  return (
    <View style={[styles.container, styles[`backgroundLevel${data.level}`]]}>
      <Text style={[styles.title, styles[`textLevel${data.level}`]]}>
        {data.title}
      </Text>
      <Text style={[styles.message, styles[`textLevel${data.level}`]]}>
        {data.message}
      </Text>
      <Text style={[styles.time, styles[`textLevel${data.level}`]]}>
        {data.sent.toDate().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 16,
    marginHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    padding: 16,
  },
  backgroundLevel0: {
    backgroundColor: '#faefde',
  },
  backgroundLevel1: {
    backgroundColor: '#365cb5',
  },
  backgroundLevel2: {
    backgroundColor: Colors.light.alert,
  },
  backgroundLevel3: {
    backgroundColor: Colors.light.alert,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  message: {
    fontSize: 12,
    fontWeight: '400',
  },
  time: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'right',
    opacity: 0.5,
  },
  textLevel0: {
    color: Colors.light.background,
  },
  textLevel1: {
    color: '#faefde',
  },
  textLevel2: {
    color: '#ffffff',
  },
  textLevel3: {
    color: '#ffffff',
  },
});
