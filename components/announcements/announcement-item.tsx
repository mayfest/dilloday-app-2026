import { useState } from 'react';

import { Colors } from '@/constants/Colors';
import { Announcement } from '@/lib/announcement';
import { Ionicons } from '@expo/vector-icons';
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface AnnouncementProps {
  data: Announcement;
  index: number;
}

export default function AnnouncementItem({ data, index }: AnnouncementProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  const textColor = styles[`textLevel${data.level}`];
  const isRed = index % 2 === 0;
  const backgroundColor = isRed ? '#D80000' : '#1472B9';
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleOpen}
        activeOpacity={0.7}
      >
        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, textColor]}>{data.title}</Text>
          <Text style={[styles.time, textColor]}>
            {data.sent.toDate().toLocaleDateString()}
          </Text>
        </View>

        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={textColor.color}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownContent}>
          <View style={styles.divider} />
          <Text style={[styles.message, textColor]}>{data.message}</Text>

          <Text style={[styles.fullTime, textColor]}>
            Sent:{' '}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  dropdownContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 12,
  },
  backgroundLevel0: { backgroundColor: '#faefde' },
  backgroundLevel1: { backgroundColor: Colors.light.action },
  backgroundLevel2: { backgroundColor: Colors.light.alert },
  backgroundLevel3: { backgroundColor: Colors.light.alert },
  title: {
    fontSize: 23,
    fontFamily: 'FuturaBold',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 10,
  },
  message: {
    fontSize: 19,
    fontFamily: 'Futura',
    lineHeight: 20,
    textAlign: 'center',
    padding: 10,
  },
  time: {
    fontSize: 11,
    opacity: 0.7,
    fontFamily: 'Futura',
    marginTop: 2,
  },
  fullTime: {
    fontSize: 10,
    marginTop: 12,
    textAlign: 'right',
    opacity: 0.6,
    fontFamily: 'Futura',
    textTransform: 'uppercase',
  },
  textLevel0: { color: Colors.light.background },
  textLevel1: { color: '#fff' },
  textLevel2: { color: '#fff' },
  textLevel3: { color: '#fff' },
});
