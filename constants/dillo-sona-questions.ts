import AppleCoin from '@/assets/dillo-sonas/question-icons/apple-coin.svg';
import BalloonAnimalIcon from '@/assets/dillo-sonas/question-icons/balloon-animal-coin.svg';
import CarnivalAnimalIcon from '@/assets/dillo-sonas/question-icons/carnival-animal-coin.svg';
import CarouselCoin from '@/assets/dillo-sonas/question-icons/carousel-coin.svg';
import CinnamonIcon from '@/assets/dillo-sonas/question-icons/cinnamon-icon-coin.svg';
import DuckCoin from '@/assets/dillo-sonas/question-icons/duck-coin.svg';
import DunkCoin from '@/assets/dillo-sonas/question-icons/dunk-coin.svg';
import FerrisWheel from '@/assets/dillo-sonas/question-icons/ferris-wheel-coin.svg';
import FireworksCoin from '@/assets/dillo-sonas/question-icons/fireworks-coin.svg';
import FishCoin from '@/assets/dillo-sonas/question-icons/fish.svg';
import HauntedHouse from '@/assets/dillo-sonas/question-icons/haunted-house-coin.svg';
import PeperroniCoin from '@/assets/dillo-sonas/question-icons/peperroni-coin.svg';
import PopcornCoin from '@/assets/dillo-sonas/question-icons/popcorn-coin.svg';
import PretzelCoin from '@/assets/dillo-sonas/question-icons/pretzel-coin.svg';
import RollerCoasterCoin from '@/assets/dillo-sonas/question-icons/roller-coaster-coin.svg';
import SaltCoin from '@/assets/dillo-sonas/question-icons/salt-coin.svg';
import SnowconeCoin from '@/assets/dillo-sonas/question-icons/snow-cone.svg';
import StarCoin from '@/assets/dillo-sonas/question-icons/star-coin.svg';
import StuffedAnimalCoin from '@/assets/dillo-sonas/question-icons/stuffed-animal-coin.svg';
import TarotCoin from '@/assets/dillo-sonas/question-icons/tarot-coin.svg';
import type { SvgProps } from 'react-native-svg';

export type CardKey = 'moon' | 'sun' | 'chariot' | 'lovers' | 'fool' | 'tower';

export interface OptionConfig {
  key: string;
  label: string;
  tally: CardKey;
  Icon: React.ComponentType<SvgProps>;
  next: string;
}

export interface QuestionConfig {
  id: string;
  prompt: string;
  options: OptionConfig[];
}

/**
 * Full question flow (no more “sick”):
 *  g1 → snack
 *  snack → toppings | animal
 *  toppings → g2
 *  animal → g2
 *  g2 → prize | dessert
 *  prize → dessert
 *  dessert → final
 *  final → final-final
 *  final-final → result
 */
export const questions: Record<string, QuestionConfig> = {
  g1: {
    id: 'g1',
    prompt:
      'Your day at Carnival Dillo has just begun! What will be your first ride?',
    options: [
      {
        key: 'roller',
        label: 'Roller Coaster',
        tally: 'moon',
        Icon: RollerCoasterCoin,
        next: 'snack',
      },
      {
        key: 'carousel',
        label: 'Carousel',
        tally: 'sun',
        Icon: CarouselCoin,
        next: 'snack',
      },
    ],
  },

  snack: {
    id: 'snack',
    prompt: "You're getting hungry, what will you grab as a snack?",
    options: [
      {
        key: 'pretzel',
        label: 'Pretzel',
        tally: 'lovers',
        Icon: PretzelCoin,
        next: 'toppings',
      },
      {
        key: 'popcorn',
        label: 'Popcorn',
        tally: 'chariot',
        Icon: PopcornCoin,
        next: 'animal',
      },
    ],
  },

  toppings: {
    id: 'toppings',
    prompt: "There's a toppings station for your pretzels, what do you get?",
    options: [
      {
        key: 'salt',
        label: 'More Salt',
        tally: 'moon', // Moon slot
        Icon: SaltCoin,
        next: 'g2',
      },
      {
        key: 'pepperoni',
        label: 'Pepperoni',
        tally: 'fool', // Fool slot
        Icon: PeperroniCoin,
        next: 'g2',
      },
      {
        key: 'cinnamon',
        label: 'Cinnamon',
        tally: 'tower', // Tower slot
        Icon: CinnamonIcon,
        next: 'g2',
      },
    ],
  },

  animal: {
    id: 'animal',
    prompt:
      'Carnivals are full of interesting creatures. Who would you rather be your sidekick today?',
    options: [
      {
        key: 'balloonAnimal',
        label: 'Balloon Animal',
        tally: 'lovers', // Lovers slot
        Icon: BalloonAnimalIcon,
        next: 'g2',
      },
      {
        key: 'circusDog',
        label: 'Circus Animal',
        tally: 'fool', // Fool second slot
        Icon: CarnivalAnimalIcon,
        next: 'g2',
      },
      {
        key: 'sunbird',
        label: 'Fish',
        tally: 'sun',
        Icon: FishCoin,
        next: 'g2',
      },
    ],
  },

  g2: {
    id: 'g2',
    prompt:
      "After finishing your snack, you're ready to get back into the action. What game do you visit next?",
    options: [
      {
        key: 'dunk',
        label: 'Dunk Tank',
        tally: 'chariot', // Chariot slot
        Icon: DunkCoin,
        next: 'prize',
      },
      {
        key: 'tarot',
        label: 'Tarot Readings',
        tally: 'tower', // Tower second slot
        Icon: TarotCoin,
        next: 'dessert',
      },
    ],
  },

  prize: {
    id: 'prize',
    prompt: "You won the dunk tank game! What's your prize?",
    options: [
      {
        key: 'plushie',
        label: 'A Plushie',
        tally: 'lovers', // Lovers second slot
        Icon: StuffedAnimalCoin,
        next: 'dessert',
      },
      {
        key: 'rubberDuck',
        label: 'A Rubber Duck',
        tally: 'sun', // Sun second slot
        Icon: DuckCoin,
        next: 'dessert',
      },
      {
        key: 'goldfish',
        label: 'A Goldfish',
        tally: 'moon', // Moon second slot
        Icon: FishCoin,
        next: 'dessert',
      },
    ],
  },

  dessert: {
    id: 'dessert',
    prompt: 'Who needs dinner when you can have dessert! What do you pick?',
    options: [
      {
        key: 'apple',
        label: 'Candy Apple',
        tally: 'tower', // Tower third slot
        Icon: AppleCoin,
        next: 'final',
      },
      {
        key: 'snowcone',
        label: 'Snow Cone',
        tally: 'fool', // Fool third slot
        Icon: SnowconeCoin,
        next: 'final',
      },
    ],
  },

  final: {
    id: 'final',
    prompt:
      'You can see the sun starting to set in the distance. What activity do you pick to wrap up your day?',
    options: [
      {
        key: 'ferrisWheel',
        label: 'Ferris Wheel',
        tally: 'sun', // Sun third slot
        Icon: FerrisWheel,
        next: 'final-final',
      },
      {
        key: 'hauntedHouse',
        label: 'Haunted House',
        tally: 'chariot', // Chariot second slot
        Icon: HauntedHouse,
        next: 'final-final',
      },
    ],
  },

  'final-final': {
    id: 'final-final',
    prompt:
      "The stars are finally out. What's the last thing you do before you head home?",
    options: [
      {
        key: 'stargaze',
        label: 'Stargaze',
        tally: 'moon', // Moon third slot
        Icon: StarCoin,
        next: 'result',
      },
      {
        key: 'fireworks',
        label: 'Watch Fireworks',
        tally: 'lovers', // Lovers third slot
        Icon: FireworksCoin,
        next: 'result',
      },
    ],
  },
};
