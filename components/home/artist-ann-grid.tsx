import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

type RectangleProps = {
  color?: string;
  when?: string;
  artist?: string;
  time?: string;
  /** Whole bar opacity; use `1` for full or `0.5` for 50%. */
  rectangleOpacity?: number;
};

export function Rectangle({
  color = '#FF2A2A',
  when = 'NOW',
  artist = 'TEST',
  time = '9p',
  rectangleOpacity = 1,
}: RectangleProps) {
  return (
    <View style={[styles.container, { opacity: rectangleOpacity }]}>
      <View style={[styles.leftColorRect, { backgroundColor: color }]}>
        <Text style={styles.when}>{when}</Text>
      </View>
      <View style={styles.rightAnnouncementRect}>
        {artist ? (
          <Text style={styles.artistName}>{artist.toUpperCase()}</Text>
        ) : null}
        {time ? <Text style={styles.timeText}>{time}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  leftColorRect: {
    width: 80,
    minHeight: 50,
    alignSelf: 'stretch',
    // backgroundColor: '#FF2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  when: {
    color: '#fff',
    fontFamily: 'FuturaBold',
    fontSize: 18,
  },
  rightAnnouncementRect: {
    flex: 1,
    minHeight: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  artistName: {
    color: '#150c0c',
    fontFamily: 'FuturaBold',
    fontSize: 20,
    letterSpacing: 0.5,
  },
  timeText: {
    fontFamily: 'Futura',
    fontStyle: 'italic',
    fontSize: 18,
  },
});
