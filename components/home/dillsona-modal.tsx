import React from 'react';

import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeModal() {
  const router = useRouter();
  return (
    <View style={styles.backdrop}>
      <View style={styles.sheet}>
        <Text style={styles.title}>Dillo Sona Ball</Text>
        {/* future content goes here */}
        <TouchableOpacity onPress={() => router.back()} style={styles.close}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: 200,
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  close: { marginTop: 10, alignSelf: 'flex-end' },
});
