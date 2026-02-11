import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { SvgXml } from 'react-native-svg';
import BalloonLogo from '@/assets/images/balloonlogopink.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#ffffff] items-center" style={{ paddingTop: insets.top }}>

      {/* Red Circle with Cards and Balloons */}
      <View className="mt-10 w-[480px] h-[480px] rounded-full bg-red-800 items-center justify-center relative">
        {/* Inner Circle */}
        <View className="w-[216px] h-[216px] rounded-full bg-red-900 items-center justify-center z-10">
          <View className="w-[200px] h-[200px] rounded-full bg-white items-center justify-center">
            <BalloonLogo width={168} height={168} />
          </View>
        </View>
      </View>

      {/* Upload Button */}
      <TouchableOpacity
        className="mt-10 bg-yellow-300 px-6 py-3 rounded-xl"
        onPress={() => Linking.openURL('https://www.joinswsh.com/album/pg5rftklzxfb')}
      >
        <Text className="text-black font-bold">
          Add your Dillo Day pics to Swsh!
        </Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </View>
  );
}
