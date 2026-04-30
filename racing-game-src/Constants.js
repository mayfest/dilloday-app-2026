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

/** Shrink physics rectangles relative to sprite bounds. Sprites render at
 *  CAR_WIDTH × CAR_HEIGHT; Matter bodies use HITBOX_WIDTH × HITBOX_HEIGHT
 *  so transparent PNG padding + `resizeMode="contain"` letterboxing doesn't
 *  create phantom collisions. Tune this to match actual car art. */
export const RACING_HITBOX_SCALE = 0.6;
export const HITBOX_WIDTH = Math.round(CAR_WIDTH * RACING_HITBOX_SCALE);
export const HITBOX_HEIGHT = Math.round(CAR_HEIGHT * RACING_HITBOX_SCALE);

/** Toggle to draw a translucent red rectangle over each car at hitbox size,
 *  for visually tuning RACING_HITBOX_SCALE. Keep false for production. */
export const RACING_DEBUG_DRAW_HITBOX = false;

/** Matter bodies use position = center; this is horizontal center of the road */
export const MID_POINT = width / 2;

/** How many passed cars (score) before the game speeds up one tier */
export const RACING_CARS_PER_SPEED_TIER = 5;

/** Single source of truth for world-scroll speed. Road scroll and falling-car
 *  gravity both derive from this so the visual frame of reference stays
 *  consistent (player stationary, world moving past). px/sec. */
export const RACING_WORLD_SPEED_BASE = 60;
export const RACING_WORLD_SPEED_PER_TIER = 22;
export const RACING_WORLD_SPEED_MAX = 300;

export function worldSpeedPxPerSec(tier) {
  const v =
    RACING_WORLD_SPEED_BASE + tier * RACING_WORLD_SPEED_PER_TIER;
  return Math.min(v, RACING_WORLD_SPEED_MAX);
}

/** Matter gravity.y at tier 0 — opposing cars fall faster as this increases.
 *  Scaled by the same curve as world speed so the two stay coupled. */
export const RACING_GRAVITY_BASE = 0.5;
export const RACING_MAX_GRAVITY = 1.75;

export function gravityForTier(tier) {
  const ratio = worldSpeedPxPerSec(tier) / RACING_WORLD_SPEED_BASE;
  return Math.min(RACING_GRAVITY_BASE * ratio, RACING_MAX_GRAVITY);
}

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

/** Player tilt controls */
/** Pixels/sec of lateral speed per 1g of tilt past the deadzone */
export const RACING_TILT_SENSITIVITY = 900;
/** Ignore tilt below this magnitude (in g) — kills drift when phone is flat-ish */
export const RACING_TILT_DEADZONE = 0.04;
/** Cap on lateral speed (px/s) regardless of tilt */
export const RACING_PLAYER_MAX_SPEED = 700;

/** Matter.js collision categories (must not overlap bits) */
export const MATTER_CAT_FLOOR = 0x0001;
export const MATTER_CAT_PLAYER = 0x0002;
export const MATTER_CAT_OPPOSING = 0x0004;
export const MATTER_CAT_BLUE_HAZARD = 0x0008;
