import React from 'react';

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
        color='#fff'
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder='SEARCH FAQS...'
        placeholderTextColor='#fff'
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
    backgroundColor: '#000',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 12,
    height: 48,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#fff',
    fontFamily: 'FuturaBold',
    textTransform: 'none',
  },
});
