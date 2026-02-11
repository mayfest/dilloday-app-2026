
// VISION: tarot card on the front (visual with svg) and description on the back

// import ReactNative from 'react-native';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

// IMPORT THIS!
// https://www.npmjs.com/package/react-native-card-flip

interface TarotCardProps {
  image: any
  alt: string
  desc: string

}

export default function TarotCard ({image, desc, alt}: TarotCardProps) {
  return (
    <Text>TEST</Text>
    // <CardFlip style={styles.cardContainer} ref={(card) => this.card = card} >
    //   <TouchableOpacity style={styles.card} onPress={() => this.card.flip()} ><Text>AB</Text></TouchableOpacity>
    //   <TouchableOpacity style={styles.card} onPress={() => this.card.flip()} ><Text>CD</Text></TouchableOpacity>
    // </CardFlip>

  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 200,
    height: 300,
  },
  card: {
    width: 200,
    height: 300,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
});