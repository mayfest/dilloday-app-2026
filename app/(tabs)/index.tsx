import { Image, ScrollView, Text, View } from 'react-native';
// @ts-ignore  
import { Colors } from '../../constants/Colors.ts';
import '../../global.css';

interface ColorBoxProps {
  color: string;
  // padding: number;
  size: number;
  message?: string;
  imageSrc?: string;
  split?: boolean;
}

function colorBox({ color, size, message, imageSrc, split }: ColorBoxProps) {
  return (
    <View
      style={{
        backgroundColor: color,
        width: 350,
        height: size,
        borderRadius: 10,
        marginVertical: 10,
        overflow: 'hidden',
        padding: !imageSrc && !split ? 20 : 0, // Remove padding for image or split mode
        flexDirection: split ? 'row' : 'column', // Split into two columns if `split` is true
      }}
    >
      {split && imageSrc ? (
        // Two-column layout: Image on the left, text on the right
        <>
          <Image
            source={{ uri: imageSrc }}
            style={{
              width: '50%', // Left side (50%)
              height: '100%',
            }}
            resizeMode="cover"
          />
          <View
            style={{
              width: '50%', // Right side (50%)
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
            }}
          >
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                fontFamily: 'SpaceMono-Regular',
                fontSize: 20,
              }}
            >
              {message}
            </Text>
          </View>
        </>
      ) : imageSrc ? (
        // Full image mode
        <Image
          source={{ uri: imageSrc }}
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode="cover"
        />
      ) : (
        // Normal text box
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              fontFamily: 'SpaceMono-Regular',
              fontSize: 24,
            }}
          >
            {message}
          </Text>
        </View>
      )}
    </View>
  );
}


export default function HomeScreen() {
  return (
    <ScrollView style={{flex: 1, backgroundColor: Colors.light.background}}>
    <View style={{alignItems: 'center', padding: 80 }}>
      {/* <Text style={{ color: '#000', marginBottom: 16 }}>Screen Content</Text> */}      
      {colorBox({ color: Colors.light.cardAlt, size: 70, message: "DILLO 52" })}
      {/* {<img src="assets/images/adaptive-icon.png" alt="logo" />} */}
      {colorBox({ color: 'pink', size: 300, imageSrc: "https://ja-roy.com/wp-content/uploads/armadillo-on-white.jpg"})}
      {colorBox({ color: Colors.light.cardAlt, 
        size: 200, 
        message: "Artist Up Next\n 3:30pm - 4:30pm" ,
        imageSrc: "https://i.scdn.co/image/ab67616d0000b273fd8d7a8d96871e791cb1f626",
        split: true,
        })}
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingBottom: 40}}>
          <View
            style = {{backgroundColor: '#FFFB94', width: 100, height: 100, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginHorizontal:10,}}
            >
              <Text 
              style = {{color: '#1F3C88', fontSize: 16, textAlign: 'center', fontFamily: 'SpaceMono-Regular',}}
              >
                Playlists
              </Text>
            </View>
            <View
            style = {{backgroundColor: '#FFFB94', width: 100, height: 100, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginHorizontal:10,}}
            >
              <Text 
              style = {{color: '#1F3C88', fontSize: 16, textAlign: 'center', fontFamily: 'SpaceMono-Regular',}}
              >
                Get Merch
              </Text>
            </View>
            <View
            style = {{backgroundColor: '#FFFB94', width: 100, height: 100, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginHorizontal:10,}}
            >
              <Text 
              style = {{color: '#1F3C88', fontSize: 16, textAlign: 'center', fontFamily: 'SpaceMono-Regular',}}
              >
                Interactive Part 
              </Text>
            </View>
        </View>
    </View>
    </ScrollView>
  );
}