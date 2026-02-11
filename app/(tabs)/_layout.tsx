import TabBar from '@/components/navigation/tab-bar';
import { Tabs } from 'expo-router';

const icons = {
  announcements: 'bullhorn',
  schedule: 'calendar',
  index: 'house-chimney',
  map: 'map',
  information: 'circle-info',
  explore: 'compass',
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} icons={icons} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name='announcements' />
      <Tabs.Screen name='schedule' />
      <Tabs.Screen name='index' />
      <Tabs.Screen name='map' />
      <Tabs.Screen name='information' />
    </Tabs>
  );
}
