

import { Colors } from '@/constants/Colors';
import { FontAwesome6 } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export default function ScheduleBackground() {
  return (
    <>
      {/* {stars} */}

      {/* SMALL YELLOW STAR - TOP LEFT */}
      <FontAwesome6
        name='star'
        solid
        style={[
          styles.star,
          {
            fontSize: 250,
            left: -120,
            top: 40,
            transform: [{ rotate: '-30deg' }],
            color: Colors.light.cardAlt,
          },
        ]}
      />

      {/* BIG GREEN STAR - BOTTOM LEFT */}
      <FontAwesome6
        name='star'
        solid
        style={[
          styles.star,
          {
            fontSize: 150,
            left: -20,
            bottom: -60,
            transform: [{ rotate: '40deg' }],
            color: Colors.light.cardAlt,
          },
        ]}
      />

      {/* BIG BLUE STAR - TOP RIGHT */}
      <FontAwesome6
        name='star'
        solid
        style={[
          styles.star,
          {
            fontSize: 150,
            right: -50,
            top: 300,
            color: Colors.light.cardAlt,
            transform: [{ rotate: '-60deg' }],
          },
        ]}
      />

      {/* SMALL YELLOW STAR - TOP RIGHT */}
      <FontAwesome6
        name='star'
        solid
        style={[
          styles.star,
          {
            fontSize: 100,
            right: -24,
            top: 320,
            transform: [{ rotate: '-60deg' }],
            color: Colors.light.cardAlt,
          },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
  },
});
