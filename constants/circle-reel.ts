import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
export const REEL_SIZE = width * 0.8;
export const CENTER = REEL_SIZE / 2;
export const IMAGE_WIDTH = REEL_SIZE * 0.15625;
export const IMAGE_HEIGHT = REEL_SIZE * 0.20833;
export const RADIUS = CENTER - REEL_SIZE * 0.1375;
