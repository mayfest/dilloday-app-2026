import React from 'react';

import { View } from 'react-native';

const RoadLine = ({
  x,
  color = '#fff',
  lineWidth = 6,
  dashLength = 26,
  gapLength = 22,
  canvasHeight = 1200,
  offset = 0,
  radius,
}) => {
  const cycle = dashLength + gapLength;
  const count = Math.ceil(canvasHeight / cycle) + 2;
  const normalizedOffset = ((offset % cycle) + cycle) % cycle;
  const borderRadius = radius ?? lineWidth / 2;

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: -cycle + normalizedOffset,
        width: lineWidth,
        height: canvasHeight + cycle * 2,
      }}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <View
          key={idx}
          style={{
            position: 'absolute',
            top: idx * cycle,
            width: lineWidth,
            height: dashLength,
            borderRadius,
            backgroundColor: color,
          }}
        />
      ))}
    </View>
  );
};

export default RoadLine;
