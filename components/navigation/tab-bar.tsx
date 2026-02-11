import TabBarButton from '@/components/navigation/tab-bar-button';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { View } from 'react-native';

interface TabBarProps extends BottomTabBarProps {
  icons: { [key: string]: string };
}

export default function TabBar({ state, navigation, icons }: TabBarProps) {
  return (
    <View className='absolute w-[90%] h-16 left-[5%] bottom-8 rounded-full overflow-hidden bg-background'>
      <BlurView intensity={10} className='flex-1'>
        <View className='flex-1 flex-row items-center justify-around'>
          {state.routes.map((route, i) => (
            <TabBarButton
              focused={state.index === i}
              key={route.key}
              icon={icons[route.name]}
              navigation={navigation}
              route={route}
              home={route.name === 'index'}
            />
          ))}
        </View>
      </BlurView>
    </View>
  );
}
