export const FOOD_TRUCKS: {
  id: string;
  name: string;
  logo: any;
  url?: string;
  menu: { item: string; price: string }[];
}[] = [
  {
    id: '5411',
    name: '5411 Empanadas',
    logo: require('@/assets/images/food-truck-logos/5411.png'),
    menu: [
      { item: 'Chicagoland Beef Hot Dog', price: '$7.50' },
      { item: 'Italian Beef Sandwich', price: '$8.00' },
    ],
  },
  {
    id: 'cheesies',
    name: 'Cheesies',
    logo: require('@/assets/images/food-truck-logos/cheesies.png'),
    menu: [
      { item: 'Grilled Cheese', price: '$5.00' },
      { item: 'Cheese Fries', price: '$4.50' },
    ],
  },
  {
    id: 'chilis',
    name: 'Chilis',
    logo: require('@/assets/images/food-truck-logos/chilis.png'),
    menu: [
      { item: 'Chili Bowl', price: '$6.25' },
      { item: 'Cornbread Muffin', price: '$2.50' },
    ],
  },
  {
    id: 'cwIceCream',
    name: 'CW Ice Cream',
    logo: require('@/assets/images/food-truck-logos/cw-ice-cream.jpg'),
    menu: [
      { item: 'Vanilla Cone', price: '$3.00' },
      { item: 'Chocolate Sundae', price: '$4.50' },
    ],
  },
  {
    id: 'dAndD',
    name: 'D&Ds',
    logo: require('@/assets/images/food-truck-logos/d-and-d.png'),
    menu: [
      { item: 'Taco Trio', price: '$9.00' },
      { item: 'Nacho Plate', price: '$7.00' },
    ],
  },
  {
    id: 'haroldsChicken',
    name: 'Harold’s Chicken',
    logo: require('@/assets/images/food-truck-logos/harolds-chicken.png'),
    menu: [
      { item: 'Fried Chicken Sandwich', price: '$7.75' },
      { item: 'Waffle Fries', price: '$3.25' },
    ],
  },
  {
    id: 'soulAndSmoke',
    name: 'Soul and Smoke',
    logo: require('@/assets/images/food-truck-logos/soul-and-smoke.png'),
    menu: [
      { item: 'BBQ Ribs', price: '$12.00' },
      { item: 'Coleslaw', price: '$3.00' },
    ],
  },
];
