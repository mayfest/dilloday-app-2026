import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, Dimensions, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function TabTwoScreen() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const albumId = 'ef521a1a-b425-4fe6-bf93-0368a147944f';
  const apiKey = 'priv_69eb8499b5e59110_62e197201354e25770834b6af0a024811c5459f661c55b3a0801dff3ede69174';

  const numColumns = 3;
  const screenWidth = Dimensions.get('window').width;
  const imageSize = screenWidth / numColumns - 16; // Adjust spacing

  const fetchPreviewPhotos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://public-api.joinswsh.com/album/getPreviewPhotos?albumId=${albumId}`, {
        headers: {
          'x-api-key': apiKey,
        },
      });

      const result = await response.json();

      if (response.ok && Array.isArray(result.data)) {
        setPhotos(result.data);
      } else {
        console.error('Error:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }

    // check tokens
    const res = await fetch("https://public-api.joinswsh.com/ping", {
      headers: {
          "x-api-key": "priv_69eb8499b5e59110_62e197201354e25770834b6af0a024811c5459f661c55b3a0801dff3ede69174",
      },
    });
    const numRemaining = Number(res.headers.get("x-rate-limit-remaining"));
    const numConsumed = Number(res.headers.get("x-rate-limit-consumed"));
    const periodEnd = Number(res.headers.get("x-rate-limit-period-end"));
    console.log("numRemaining", numRemaining);
    console.log("numConsumed", numConsumed);

  };

  useEffect(() => {
    fetchPreviewPhotos();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.photoContainer}>
      <Image source={{ uri: item.stableUrl }} style={[styles.photo, { width: imageSize, height: imageSize }]} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Album Preview</Text>

      <View style={styles.buttonContainer}>
        <Button title="Refresh Photos" onPress={fetchPreviewPhotos} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={photos}
          renderItem={renderItem}
          keyExtractor={(item) => item.photoId}
          numColumns={numColumns}
          contentContainerStyle={styles.grid}
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  buttonContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  grid: {
    justifyContent: 'center',
  },
  photoContainer: {
    margin: 3,
    overflow: 'hidden',
    borderRadius: 8,
  },
  photo: {
    borderRadius: 8,
    resizeMode: 'cover',
  },
});
