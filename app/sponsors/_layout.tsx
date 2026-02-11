import { Stack } from 'expo-router';

export default function SponsorsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom',
        animationTypeForReplace: 'push',
      }}
    >
      <Stack.Screen name='index' options={{ title: 'Dillo Sponsors' }} />

      <Stack.Screen
        name='claim-promo'
        options={{
          title: 'Claim Promo Sponsorship',
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />

      <Stack.Screen
        name='sponsor-details'
        options={{
          title: 'Sponsor Details',
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}
