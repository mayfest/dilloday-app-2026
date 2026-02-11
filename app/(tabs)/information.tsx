import TabScreen from '@/components/tab-screen';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// ! DELETE THIS LATER
import TarotCard from '@/components/quiz/tarot-card';


export default function TabTwoScreen() {
  return (
    <TabScreen>
      <TarotCard img="/Users/caterose/Desktop/CODING/Clubs/DILLO CODE/dilloday-app/assets/images/THE SUN.svg" src="TEST" desc="DESC"/>
      <View className='flex-1 items-center justify-center bg-white'>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style='auto' />
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
