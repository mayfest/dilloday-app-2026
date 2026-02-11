import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children?: React.ReactNode;
}

export default function TabScreen({ children }: ScreenProps) {
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <SafeAreaView style={[styles.screen, { paddingBottom: tabBarHeight + 32 }]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#faefde',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
    width: '100%',
    height: '100%',
  },
});
