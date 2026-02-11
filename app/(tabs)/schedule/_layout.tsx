import { Stack } from 'expo-router';

export default function InformationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationTypeForReplace: 'push',
      }}
    >
      <Stack.Screen name='index' />
      <Stack.Screen
        name='artist'
        // options={{
        //   presentation: 'modal',
        //   animation: 'slide_from_right',
        // }}
      />
    </Stack>
  );
}
