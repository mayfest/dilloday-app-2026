import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const DEVICE_HEIGHT = height;
export const DEVICE_WIDTH = width;

// Model units (aspect only); physics uses same pixel size as on-screen sprites
const CAR_MODEL_W = 10;
const CAR_MODEL_H = 13;
const BASE = Math.max(width, height, 1);
const CAR_SCALE =
  (BASE * 0.15) / Math.max(CAR_MODEL_W, CAR_MODEL_H, 1);

export const CAR_WIDTH = Math.round(CAR_MODEL_W * CAR_SCALE);
export const CAR_HEIGHT = Math.round(CAR_MODEL_H * CAR_SCALE);

/** Matter bodies use position = center; this is horizontal center of the road */
export const MID_POINT = width / 2;

/** How many passed cars (score) before the game speeds up one tier */
export const RACING_CARS_PER_SPEED_TIER = 5;

/** Road scroll: pixels per frame at tier 0 — raise for a faster baseline */
export const RACING_ROAD_SCROLL_BASE = 1;

/** Added to road scroll for each tier after score crosses each multiple of RACING_CARS_PER_SPEED_TIER */
export const RACING_ROAD_SCROLL_PER_TIER = 0.35;

/** Matter gravity.y at tier 0 — opposing cars fall faster as this increases */
export const RACING_GRAVITY_BASE = 0.5;

/** Added to gravity for each speed tier */
export const RACING_GRAVITY_PER_TIER = 0.12;

/** Optional caps so difficulty doesn’t explode */
export const RACING_MAX_ROAD_SCROLL = 5;
export const RACING_MAX_GRAVITY = 1.75;

/** First speed tier (0-based) where the crossing blue hazard appears */
export const RACING_BLUE_CAR_MIN_TIER = 2;

/** Crossing blue car: horizontal speed (px/s) — base is slow; ramps with tier */
export const RACING_BLUE_CAR_BASE_SPEED = 70;
export const RACING_BLUE_CAR_SPEED_PER_TIER = 28;
export const RACING_BLUE_CAR_MAX_SPEED = 320;

/** Spin rate (rad/s) — slow at first, faster at higher tiers */
export const RACING_BLUE_CAR_BASE_SPIN = 0.9;
export const RACING_BLUE_CAR_SPIN_PER_TIER = 0.4;
export const RACING_BLUE_CAR_MAX_SPIN = 3.25;

/** Matter.js collision categories (must not overlap bits) */
export const MATTER_CAT_FLOOR = 0x0001;
export const MATTER_CAT_PLAYER = 0x0002;
export const MATTER_CAT_OPPOSING = 0x0004;
export const MATTER_CAT_BLUE_HAZARD = 0x0008;
