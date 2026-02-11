// constants/food-trucks.ts

export interface FoodTruckMeta {
  id: string;
  name: string;
  logo: any; // local require(...) to your asset
  url?: string; // optional external link
  type?: string; // if you have categories, otherwise omit
}

export const FOOD_TRUCKS: FoodTruckMeta[] = [
  {
    id: '5411',
    name: '5411 Empanadas',
    logo: require('@/assets/images/food-truck-logos/5411.png'),
    url: 'https://5411empanadas.com',
  },
  {
    id: 'cheesies',
    name: 'Cheesies',
    logo: require('@/assets/images/food-truck-logos/cheesies.png'),
    url: 'https://cheesies.io',
  },
  {
    id: 'chilis',
    name: 'Chili Town',
    logo: require('@/assets/images/food-truck-logos/chilis.png'),
  },
  {
    id: 'cwIceCream',
    name: 'CW Ice Cream',
    logo: require('@/assets/images/food-truck-logos/cw-ice-cream.jpg'),
  },
  {
    id: 'dAndD',
    name: 'D&Ds',
    logo: require('@/assets/images/food-truck-logos/d-and-d.png'),
  },
  {
    id: 'haroldsChicken',
    name: 'Harold’s Chicken',
    logo: require('@/assets/images/food-truck-logos/harolds-chicken.png'),
  },
  {
    id: 'soulAndSmoke',
    name: 'Soul & Smoke',
    logo: require('@/assets/images/food-truck-logos/soul-and-smoke.png'),
  },
];
