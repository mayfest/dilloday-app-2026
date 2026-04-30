import Matter from 'matter-js';
import {
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
  HITBOX_WIDTH,
  HITBOX_HEIGHT,
  MATTER_CAT_FLOOR,
  MATTER_CAT_PLAYER,
  MATTER_CAT_OPPOSING,
  MATTER_CAT_BLUE_HAZARD,
} from './Constants';

export const car = Matter.Bodies.rectangle(
  0,
  DEVICE_HEIGHT - 30,
  HITBOX_WIDTH,
  HITBOX_HEIGHT,
  {
    isStatic: true,
    label: 'car',
    collisionFilter: {
      category: MATTER_CAT_PLAYER,
      mask:
        MATTER_CAT_FLOOR |
        MATTER_CAT_OPPOSING |
        MATTER_CAT_BLUE_HAZARD,
    },
  },
);

export const floor = Matter.Bodies.rectangle(
  DEVICE_WIDTH / 2,
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  10,
  {
    isStatic: true,
    isSensor: true,
    label: 'floor',
    collisionFilter: {
      category: MATTER_CAT_FLOOR,
      mask: MATTER_CAT_OPPOSING,
    },
  },
);

export const road = Matter.Bodies.rectangle(DEVICE_WIDTH / 2, 100, 20, 100, {
  isStatic: true,
  isSensor: false,
  label: 'road',
  collisionFilter: {
    category: MATTER_CAT_FLOOR,
    mask: MATTER_CAT_OPPOSING,
  },
});
