import { theme } from '@/lib/theme';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NavigationPanel() {
  const router = useRouter();

  const onPress = (
    key: '/announcements' | '/schedule' | '/map' | '/information'
  ) => {
    router.navigate({
      pathname: key,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onPress('/announcements')}
      >
        <FontAwesome6 name='bullhorn' size={16} color={theme.tabBarColor} />
        <Text style={styles.text}>Announcements</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => onPress('/schedule')}
      >
        <FontAwesome6 name='calendar' size={16} color={theme.tabBarColor} />
        <Text style={styles.text}>Schedule</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.button} onPress={() => onPress('/map')}>
        <FontAwesome6 name='map' size={16} color={theme.tabBarColor} />
        <Text style={styles.text}>Map</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => onPress('/information')}
      >
        <FontAwesome6 name='circle-info' size={16} color={theme.tabBarColor} />
        <Text style={styles.text}>Information</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.tabBarBackground,
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginVertical: 8,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  text: {
    color: theme.tabBarColor,
    fontFamily: theme.bodyRegular,
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: theme.tabBarColor,
  },
});
