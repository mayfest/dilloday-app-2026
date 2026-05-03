import React from 'react';

import { Image, View } from 'react-native';

import {
  CAR_HEIGHT,
  CAR_WIDTH,
  HITBOX_HEIGHT,
  HITBOX_WIDTH,
  RACING_DEBUG_DRAW_HITBOX,
} from '../Constants';

function Car({ body, image }) {
  const { position, angle = 0 } = body;
  const width = CAR_WIDTH;
  const height = CAR_HEIGHT;

  const x = position.x - width / 2;
  const y = position.y - height / 2;
  const deg = (angle * 180) / Math.PI;

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        transform: [{ rotate: `${deg}deg` }],
      }}
    >
      <Image
        source={image}
        resizeMode='contain'
        style={{
          width,
          height,
        }}
      />
      {RACING_DEBUG_DRAW_HITBOX ? (
        <View
          style={{
            position: 'absolute',
            left: (width - HITBOX_WIDTH) / 2,
            top: (height - HITBOX_HEIGHT) / 2,
            width: HITBOX_WIDTH,
            height: HITBOX_HEIGHT,
            backgroundColor: 'rgba(255,0,0,0.35)',
            borderColor: 'rgba(255,0,0,0.9)',
            borderWidth: 1,
          }}
        />
      ) : null}
    </View>
  );
}

export default Car;
