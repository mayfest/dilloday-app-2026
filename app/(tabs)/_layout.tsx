import TabBar from '@/components/navigation/tab-bar';
import { Tabs } from 'expo-router';

const icons = {
  announcements: 'bullhorn',
  schedule: 'calendar',
  index: 'house-chimney',
  map: 'map',
  information: 'circle-info',
  explore: 'compass',
  settings: 'gear',
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} icons={icons} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='announcements'
        options={{
          title: 'Announcements',
        }}
      />
      <Tabs.Screen
        name='schedule'
        options={{
          title: 'Schedule',
        }}
      />
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name='map'
        options={{
          title: 'Map',
        }}
      />
      <Tabs.Screen
        name='information'
        options={{
          title: 'Information',
        }}
      />
    </Tabs>
  );
}
