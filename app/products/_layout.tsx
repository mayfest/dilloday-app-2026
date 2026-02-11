import { Stack } from 'expo-router';

export default function ProductsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationTypeForReplace: 'push',
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          title: 'Dillo Store',
        }}
      />
      <Stack.Screen
        name='[id]'
        options={{
          title: 'Product Details',
        }}
      />
      <Stack.Screen
        name='cart'
        options={{
          title: 'Shopping Cart',
        }}
      />
    </Stack>
  );
}
