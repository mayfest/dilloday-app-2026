import React from 'react';

import { Colors } from '@/constants/Colors';
import { FontAwesome6 } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
  onSearch: (query: string) => void;
  value: string;
}

export default function SearchBar({ onSearch, value }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <FontAwesome6
        name='magnifying-glass'
        size={16}
        color='#666'
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder='Search FAQs...'
        placeholderTextColor='#6e6e6e'
        value={value}
        onChangeText={onSearch}
        returnKeyType='search'
        clearButtonMode='while-editing'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 2,
    borderColor: Colors.light.background,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#000',
  },
});
