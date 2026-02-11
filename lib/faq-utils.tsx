import React from 'react';

import { StyleSheet, Text } from 'react-native';

export const highlightMatches = (text: string, query: string) => {
  if (!query.trim()) {
    return text;
  }

  const regex = new RegExp(`(${query.trim()})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const matches = part.toLowerCase() === query.toLowerCase();
        return matches ? (
          <Text key={i} style={styles.highlightedText}>
            {part}
          </Text>
        ) : (
          part
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  highlightedText: {
    backgroundColor: 'rgba(255, 230, 0, 0.3)',
    fontWeight: '500',
  },
});
