import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen
        name='more'
        options={{
          title: 'More',
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
