import { Dimensions, Image, ScrollView, StyleSheet, Text, View, Linking, Pressable } from 'react-native';
import Ticket from '../../assets/images/blueticket.svg';
import Structure from '../../assets/images/bowling.svg';
import Horse from '../../assets/images/horsescarousel.svg';
import PopCorn from '../../assets/images/popcorn.svg';
import Ferris from '../../assets/images/ferriswheel.svg';
import { Colors } from '../../constants/Colors';


import React from 'react';

interface SplitBoxProps {
  color: string;
  // padding: number;
  size: number;
  title?: string;
  time?: string;
  location?: string;
  imageSrc?: string;
}
const { width, height } = Dimensions.get('window'); // Get screen dimensions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ticket: {
    position: 'absolute',
    width: 100, // Adjust the size of the tickets to fit more on screen
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8, // Slight transparency to make them blend in better
  },
});

const ticketPositions = [
  { x: width * 0.4, y: height * 0.45, angle: -20 },
  { x: width * 0.3, y: height * 0.4, angle: -120 },
  { x: width * 0.8, y: height * 0.7, angle: -10 },
  { x: width * 0.7, y: height * 0.95, angle: -90 },
  { x: width * 0.3, y: height * 0.8, angle: -90 },
  { x: width * 0.8, y: height * 0.26, angle: 40 },
  { x: width * 0.00009, y: height * 0.18, angle: -120 },
  { x: width * 0.0001, y: height * 0.6, angle: -130 },
  { x: width * 0.09, y: height * 0.3, angle: 150 },
];



function SplitBox({ color, size, title, time, location, imageSrc }: SplitBoxProps) {
  return (
    <View
      style={{
        backgroundColor: color,
        width: 350,
        height: size,
        borderRadius: 6,
        marginVertical: 10,
        overflow: 'hidden',
        flexDirection: 'row', 
      }}
    >
      {
        <>
          <Image
            source={{ uri: imageSrc }}
            style={{
              width: '40%',
              height: '100%',
            }}
            resizeMode='cover'
          />
          <View
            style={{
              width: '60%', // start from left side of box
              justifyContent: 'center',
              alignItems: 'flex-start',
              padding: 15,
            }}
          >
            {/* FOR THE TITLE */}
            <Text
              style={{
                color: Colors.light.text,
                textAlign: 'left',
                // fontFamily: 'SpaceMono-Bold',
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              {title}
            </Text>
              {/* FOR THE LOCATION AND TIME */}
            <Text
              style={{
                color: Colors.light.text,
                textAlign: 'left',
                // fontFamily: 'SpaceMono-Regular',
                fontSize: 14,
              }}
            >
              {time + '\n'}
              {location}
            </Text>
          </View>
        </>
      }
    </View>
  );
}

interface colorButtonProps {
  color: string;
  size: number;
  title: string;
  icon?: string;
}

function colorButton({ color, size, title, icon }: colorButtonProps) {
  return (
    <View style={{ 
      backgroundColor: color, 
      borderRadius: 6, 
      padding: 10, 
      alignItems: 'center', 
      width: 150,
      height: size }}>
      <Text style={{ color: '#ffff', fontSize: 16 }}>{title}</Text>
    </View>
  );
}

export default function HomeScreen() {

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: Colors.light.background, padding: 60 }}
      contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} // Apply alignItems here
    >
      
      {/* DILLO DAY TITLE*/}
      <Horse width={150} height={90}/>


      {ticketPositions.map((position, index) => (
        <View
          key={index}
          style={[
            styles.ticket,
            {
              left: position.x - 50, // Adjust X position to center the ticket
              top: position.y - 50,  // Adjust Y position to center the ticket
              transform: [{ rotate: `${position.angle}deg` }],
            },
          ]}
        >
          <Ticket width={100} height={100} />
        </View>
      ))}


      <Text style={{ 
        // position: 'absolute',
        color: '#ffff', 
        marginTop: -10,
        marginBottom: 10,
        // fontFamily: 'SpaceMono-Bold',
        // left: -80,
        textAlign: 'center',
        fontSize: 30
        }}>CARNIVAL DILLO</Text>
        
      {/* CURRENT ARTIST INFORMATION
          CURRENT MAIN STAGE AND CURRENT SECOND STAGE
      */}
      {SplitBox({ color: Colors.light.cardAlt, 
        size: 115, 
        title:'Mozart',
        time: '2:00pm',
        location: 'Main Stage',
        imageSrc: 'https://i.redd.it/13udxbn8ewec1.jpeg',
        })}
      {SplitBox({ color: Colors.light.actionText, 
        size: 115, 
        title: 'TCHAIKOVSKY',
        time: '3:00pm',
        location: 'Second Stage',
        imageSrc: 'https://i.scdn.co/image/9a7c31f43e22a95f6d3c57baf4f87a3a9d2b93e0',
        })}


  <View style={{ flexDirection: "row", marginBottom: 10 , marginTop: 32}}>
    {/* First row: Two squares side by side */}
    <View
      style={{
        backgroundColor: Colors.light.actionText,
        width: 130,
        height: 120,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 15,
        position: "relative",
      }}
    >
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/9959/9959072.png",
        }}
        style={{
          width: 50,
          height: 50,
          tintColor: "#D61919",
          marginTop: 12,
        }}
      />
      <Text
        style={{
          color: Colors.light.cardText,
          fontSize: 15,
          textAlign: "center",
        }}
      >
        Playlists
      </Text>
    </View>

    <Pressable
      style={{
        backgroundColor: Colors.light.actionText,
        width: 130,
        height: 120,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 15,
      }}
      onPress={() => {
        Linking.openURL('https://store.dilloday.com/en-usd');
      }}
    >
      <PopCorn width={60} height={60} />
      <Text
        style={{
          color: Colors.light.cardText,
          fontSize: 16,
          textAlign: "center",
        }}
      >
        Get Merch
      </Text>
    </Pressable>
  </View>

  <View style={{ flexDirection: "row" }}>
    {/* Second row: Two squares side by side */}
    <View
      style={{
        backgroundColor: Colors.light.actionText,
        width: 130,
        height: 120,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 15,
         marginTop: 12,
      }}
    >
    <Ferris width={50} height={50} />
      <Text
        style={{
          color: Colors.light.cardText,
          fontSize: 17,
          textAlign: "center",
        }}
      >
        Extra
      </Text>
    </View>

    <View
      style={{
        backgroundColor: Colors.light.actionText,
        width: 130,
        height: 120,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 15,
        marginTop: 12,
      }}
    >
      <Structure width={60} height={60} />
      <Text
        style={{
          color: Colors.light.cardText,
          fontSize: 13,
          textAlign: "center",
        }}
      >
        Interactive Part
      </Text>
    </View>
  </View>


 </ScrollView>

  );
}