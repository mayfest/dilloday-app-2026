import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children?: React.ReactNode;
}

export default function TabScreen({ children }: ScreenProps) {
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <SafeAreaView className='flex-1 bg-background'>
      <View className={`flex-1 pb-[${tabBarHeight + 32}px]`}>{children}</View>
    </SafeAreaView>
  );
}
