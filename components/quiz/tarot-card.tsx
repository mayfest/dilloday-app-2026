
// VISION: tarot card on the front (visual with svg) and description on the back

// import ReactNative from 'react-native';
import TarotSun from '@/components/quiz/card-sun';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text } from 'react-native';
import RawCardFlip from 'react-native-card-flip';
const CardFlip: any = RawCardFlip;

// IMPORT THIS!
// https://www.npmjs.com/package/react-native-card-flip


interface TarotCardProps {
  svg: React.FC<React.SVGProps<SVGSVGElement>>,
  // image: any
  // alt: string,
  desc: string,

}

class TarotCard extends React.Component<TarotCardProps> {
  card: CardFlip | null = null;

  flipCard = () => {
    this.card?.flip();
  };

  render() {
    const { svg, desc } = this.props;
    const windowWidth = Dimensions.get('window').width;
    const scale = windowWidth / 250;
    const scaledHeight = 193 * scale;
    const scaledWidth = 113 * scale;

    const dynamicStyle = {
      width: scaledWidth,
      height: scaledHeight,
    };

    return (
      <CardFlip
        style={[{ width: scaledWidth, height: scaledHeight }, styles.cardContainer]}
        ref={(ref) => (this.card = ref)}
      >
        <Pressable 
          // activeOpacity={1}
          style={[{ width: scaledWidth, height: scaledHeight }, styles.card]} 
          onPress={this.flipCard}>
            {/* <Text>Front</Text> */}
          <TarotSun scaledWidth={scaledWidth} scaledHeight={scaledHeight}/>
        </Pressable>

        <Pressable 
          // activeOpacity={1}
          style={[{ width: scaledWidth, height: scaledHeight }, styles.card]} 
          onPress={this.flipCard}>
          <Text>{desc}</Text>
        </Pressable>
      </CardFlip>
      
    );
  }
}


export default TarotCard;

/*

export default function TarotCard ({image, desc, alt}: TarotCardProps) {
  return (
    // <Text>TEST</Text>
    <CardFlip style={styles.cardContainer} ref={(card) => this.card = card} >
      <TouchableOpacity style={styles.card} onPress={() => this.card.flip()} ><Text>AB</Text></TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => this.card.flip()} ><Text>CD</Text></TouchableOpacity>
    </CardFlip>

  );
}

*/

const styles = StyleSheet.create({
  cardContainer: {
    // width: 200,
    // height: 300,
  },
  card: {
    // width: 200,
    // height: 300,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.3,
    // shadowRadius: 2,
    elevation: 5,
  },
});