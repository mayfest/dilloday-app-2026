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
      <Stack.Screen
        name='index'
        options={{
          title: 'Dillo Sponsors',
        }}
      />
      <Stack.Screen
        name='claim-promo'
        options={{
          title: 'Claim Promo Sponsorship',
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
