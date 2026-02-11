import { useMemo } from 'react';

import StackScreen from '@/components/stack-screen';
import { Colors } from '@/constants/Colors';
import { ArtistParams } from '@/lib/artist';
import { useConfig } from '@/lib/config';
import { FontAwesome6 } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ArtistScreen() {
  const { config } = useConfig();
  const params = useLocalSearchParams<ArtistParams>();
  const stage = params.stage;

  const artist = useMemo(() => {
    if (!config || !params.artist) {
      return null;
    }

    return config.artists[params.artist] || null;
  }, []);

  return (
    <StackScreen>
      {config !== null && artist !== null ? (
        <ScrollView>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: artist.image }} />
          </View>
          <View style={styles.content}>
            <Text style={styles.name}>{artist.name}</Text>
            <Text style={styles.time}>
              {stage} at {artist.time}
            </Text>
            <Text style={styles.description}>{artist.description}</Text>
            <View style={styles.buttonContainer}>
              {artist.spotify && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(artist.spotify!)}
                >
                  <FontAwesome6
                    name='spotify'
                    size={64}
                    color={Colors.light.action}
                  />
                </TouchableOpacity>
              )}
              {artist.apple && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(artist.apple!)}
                >
                  <FontAwesome6
                    name='apple'
                    size={64}
                    color={Colors.light.action}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      ) : null}
    </StackScreen>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: 400,
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Rye_400Regular',
    textTransform: 'uppercase',
    color: Colors.light.text,
  },
  time: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Rye_400Regular',
    textAlign: 'center',
    textTransform: 'uppercase',
    color: Colors.light.action,
  },
  description: {
    fontSize: 20,
    padding: 16,
    fontFamily: 'Cabin_400Regular',
    fontWeight: '400',
    textAlign: 'left',
    color: Colors.light.text,
    marginVertical: 24,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
});
