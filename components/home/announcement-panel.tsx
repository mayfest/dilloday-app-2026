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
        <View style={styles.textHeader}>
          <Text style={styles.header}>
            ANNOUNCEMENTS <Text style={styles.headerCarrot}>›</Text>
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{value}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginTop: 0,
    marginBottom: 0,
    width: '100%',
  },
  contentContainer: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    padding: 10,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 30,
    flex: 1,
  },
  text: {
    fontSize: 19,
    color: '#000',
    paddingLeft: 10,
    fontFamily: 'Futura',
    marginBottom: 12,
  },
  textHeader: {
    height: 45,
    backgroundColor: '#1472B9',
    borderTopRightRadius: 30,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  header: {
    fontSize: 20,
    color: '#FFF',
    fontFamily: 'FuturaBold',
  },
  headerCarrot: {
    fontSize: 22,
    color: '#FFF',
    fontFamily: 'FuturaBold',
  },
});
