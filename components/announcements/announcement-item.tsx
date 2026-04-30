import { useState } from 'react';

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

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <TouchableOpacity
          style={styles.textHeader}
          onPress={toggleOpen}
          activeOpacity={0.8}
        >
          <Text style={styles.headerTitle}>{data.title}</Text>
          <Ionicons
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            color='#fff'
          />
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={styles.timeText}>
            {data.sent.toDate().toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </Text>

          {isOpen && <Text style={styles.message}>{data.message}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginVertical: -2,
    marginHorizontal: 0,
    width: '100%',
  },
  contentContainer: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  textHeader: {
    minHeight: 45,
    backgroundColor: '#1472B9',
    borderTopRightRadius: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 14,
  },
  headerTitle: {
    fontSize: 20,
    color: '#FFF',
    fontFamily: 'FuturaBold',
    textTransform: 'uppercase',
    flex: 1,
    paddingVertical: 10,
    paddingRight: 8,
  },
  textContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 30,
    flex: 1,
  },
  timeText: {
    fontSize: 10,
    opacity: 0.6,
    fontFamily: 'Futura',
    textTransform: 'uppercase',
    marginBottom: 0,
  },
  message: {
    fontSize: 19,
    fontFamily: 'Futura',
    fontWeight: '400',
    lineHeight: 24,
    textAlign: 'left',
    color: '#000',
    marginTop: 10,
  },
});
