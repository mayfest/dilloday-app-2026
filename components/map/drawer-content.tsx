import React from 'react';

import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

type LocationType =
  | 'main'
  | 'fmo'
  | 'burrow'
  | 'food'
  | 'medical'
  | 'restroom'
  | 'restroomAccessible'
  | 'programming-event'
  | 'sponsor'
  | 'exit'
  | 'exitEndOfDay'
  | 'exitSouth'
  | 'water'
  | 'food-truck'
  | 'info'
  | 'first-aid'
  | 'lost-and-found'
  | 'lost-child'
  | 'artistMerch'
  | 'entrance'
  | 'beerGarden'
  | 'lunasPub'
  | 'restArea';

interface DrawerContentProps {
  type: LocationType;
}

// Detailed two-sentence descriptions and optional navigation targets
const LOCATION_INFO: Record<
  LocationType,
  {
    title: string;
    description: string;
    details: string;
    linkLabel?: string;
    linkTarget?: string;
  }
> = {
  entrance: {
    title: 'Entrance',
    description:
      'The main entrance to Dillo Day is through the Arts Circle. Please make sure that you have your wristband on before entering the event. Please also look at our bag policy before entering the event.',
    details: '',
    linkLabel: 'View bag policy',
    linkTarget: '/faq',
  },
  main: {
    title: 'Main Stage',
    description:
      'The Main Stage is the heart of Dillo Day, featuring live performances from top artists and bands. Enjoy a day filled with music, dancing, and unforgettable moments.',
    details:
      'With a diverse lineup of genres, there’s something for everyone. Check the schedule for performance times and artist details.',
    linkLabel: 'View Main Stage lineup',
    linkTarget: '/lineup',
  },
  fmo: {
    title: 'For Members Only Stage',
    description:
      'Featuring and showcasing rising Black talent at Dillo Day. Come and support the next generation of artists and performers',
    details:
      'The For Members Only Stage is located in the middle of the Dillo Day Carnival grounds. Please make sure to check out the schedule for the lineup of performers.',
    linkLabel: 'See FMO stage lineup',
    linkTarget: '/lineup',
  },
  burrow: {
    title: 'The Burrow',
    description:
      "The Burrow is one of Dillo Day's stages—catch live sets and programming throughout the day.",
    details:
      'Check the schedule for set times and who’s playing The Burrow.',
    linkLabel: 'View lineup',
    linkTarget: '/lineup',
  },
  food: {
    title: 'Food Trucks',
    description:
      'Need to refuel? Meetup with friends? The food truck area is the perfect place to grab a bite. With a variety of food trucks and vendors, there’s something for everyone.',
    details: '',
    linkLabel: 'Explore food truck menu',
    linkTarget: '/food-trucks',
  },
  restroom: {
    title: 'Restrooms',
    description:
      'Clean portable restrooms located for your convenience throughout the venue. Regularly serviced to ensure a comfortable experience.',
    details: '',
  },
  restroomAccessible: {
    title: 'Restrooms',
    description:
      'This restroom location includes accessible stalls and meets ADA guidelines. Clean, accessible portable restrooms—regularly serviced for your comfort.',
    details: '',
  },
  medical: {
    title: 'Medical Tent',
    description:
      'Staffed by certified professionals ready to assist with first aid and minor emergencies. Equipped with essential medical supplies for your safety.',
    details: '',
    linkLabel: 'Need immediate help?',
    linkTarget: '/(tabs)/information',
  },
  'programming-event': {
    title: 'Programming Area',
    description:
      'Come to the programming area to experience face painting, screen printing, and more! This area is perfect for those looking to get creative and have fun.',
    details: '',
  },
  sponsor: {
    title: 'Sponsors and Vendors',
    description:
      'Connect with our sponsors and vendors—partners showcasing products, services, giveaways, and more. These areas also include shade from the LOOK App, seating, shopping with Crossroads thrifting and Animal Records, and space to recharge.',
    details:
      'Both pins on the map mark Sponsors and Vendors locations—visit each to explore activations and partner booths.',
  },
  exit: {
    title: 'North Exit',
    description:
      'Designated north exit path ensuring smooth departure from the event grounds. Follow the clearly marked route for the quickest way out.',
    details:
      'Remember that re-entry is allowed until doors close at 10 PM. Please keep your wristband on for re-entry.',
  },
  exitEndOfDay: {
    title: 'End of Day Exit',
    description:
      'Use this exit when leaving after the event ends. Follow staff directions and posted signage for a safe exit from the grounds.',
    details:
      'Keep your wristband until you have fully exited. Plan ahead for crowds at closing.',
  },
  exitSouth: {
    title: 'South Exit',
    description:
      'Designated south exit from the event grounds. Follow posted signage and staff directions for a smooth departure.',
    details:
      'Re-entry rules and wristband policies still apply—keep your wristband on if you plan to return before doors close.',
  },
  water: {
    title: 'Water Stations',
    description:
      'Stay hydrated! Refill your water bottles at our conveniently located water stations. Free and accessible to all attendees.',
    details:
      'Bring your own reusable bottle to help us reduce waste and keep the environment clean.',
  },
  artistMerch: {
    title: 'Artist Merch',
    description:
      'Support your favorite artists by purchasing exclusive merchandise. From t-shirts to vinyl records, find unique items to take home.',
    details:
      'Merchandise is available for purchase at the designated booth on the map. Merchandise will be available until supplies last.',
  },
  beerGarden: {
    title: 'Beer Garden',
    description:
      'Relax and enjoy a cold drink in our designated beer garden area. A variety of alcholic beverages will be available to you. Please make sure that you have a Beer Garden ticket before entering the area. The Beer Garden is only open to those 21+.',
    details: 'Must be 21+ to enter. Please drink responsibly and have fun!',
  },
  lunasPub: {
    title: "Drinking Space (Luna's Pub)",
    description:
      "A designated 21+ drinking area—grab a drink and hang out at Luna's Pub. Follow any posted rules or wristband requirements for alcohol service at this location.",
    details: 'Must be 21+ to enter. Please drink responsibly.',
  },
  restArea: {
    title: 'Sponsors and Vendors',
    description:
      'Connect with our sponsors and vendors—partners showcasing products, services, giveaways, and more. These areas also include shade from the LOOK App, seating, shopping with Crossroads thrifting and Animal Records, and space to recharge.',
    details:
      'Both pins on the map mark Sponsors and Vendors locations—visit each to explore activations and partner booths.',
  },
};

export default function DrawerContent({ type }: DrawerContentProps) {
  const router = useRouter();
  const info = LOCATION_INFO[type] || {
    title: '',
    description: '',
    details: '',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{info.title}</Text>
      <Text style={styles.description}>{info.description}</Text>
      <Text style={styles.details}>{info.details}</Text>
      {info.linkLabel && info.linkTarget && (
        <Text style={styles.link} onPress={() => router.push(info.linkTarget!)}>
          {info.linkLabel}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontFamily: 'FuturaBold',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    lineHeight: 22,
  },
  details: {
    fontSize: 14,
    color: '#d3d3d3',
    lineHeight: 20,
    marginBottom: 12,
  },
  link: {
    fontSize: 14,
    color: Colors.light.primary,
    textDecorationLine: 'underline',
  },
});
