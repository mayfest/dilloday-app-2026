import { ImageSourcePropType } from 'react-native';

export interface SmartDilloImage {
  source: ImageSourcePropType;
  alt: string;
}

export const smartDilloImages: SmartDilloImage[] = [
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-cover.png'),
    alt: 'Smart Dillo 2025 Cover',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-popcorn.png'),
    alt: 'Eat Early, Eat Often',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-hydratation.png'),
    alt: 'Stay Hydrated',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-safety.png'),
    alt: 'Stick to Your Limits with Alcohol',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-substances.png'),
    alt: 'Other Substances',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-amnesty.png'),
    alt: 'Call, Stay, Cooperate for Amnesty',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-consent.png'),
    alt: 'Consent',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-sex.png'),
    alt: 'Safer Sex',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-safety.png'),
    alt: 'Stay Off the Rocks and Roofs',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-urination.png'),
    alt: 'Public Urination',
  },
  {
    source: require('@/assets/images/smart-dillo/smart-dillo-respect.png'),
    alt: 'Respect the Neighborhood',
  },
];
