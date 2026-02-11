import { Stack } from 'expo-router';

export default function ScheduleLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name='index'
        options={{
          animation: 'slide_from_right',
        }}
      />

      <Stack.Screen
        name='artist'
        options={{
          presentation: 'modal', // ← make it a modal
          animation: 'slide_from_right', // ← slide up from bottom
        }}
      />
    </Stack>
  );
}
