import React from 'react';
import { Image } from 'react-native';

import { CAR_HEIGHT, CAR_WIDTH } from '../Constants';

function Car({ body, image }) {
  const { position, angle = 0 } = body;
  const width = CAR_WIDTH;
  const height = CAR_HEIGHT;

  const x = position.x - width / 2;
  const y = position.y - height / 2;
  const deg = (angle * 180) / Math.PI;

  return (
    <Image
      source={image}
      resizeMode="contain"
      style={{
        width,
        height,
        position: 'absolute',
        left: x,
        top: y,
        transform: [{ rotate: `${deg}deg` }],
      }}
    />
  );
}

export default Car;
