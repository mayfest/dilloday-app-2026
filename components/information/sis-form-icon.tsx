import * as React from 'react';

import Svg, { Rect, Text } from 'react-native-svg';

interface FormButtonIconProps {
  width?: number;
  height?: number;
  style?: object;
}

export default function FormButtonIcon({
  width = 100,
  height = 100,
  style,
}: FormButtonIconProps) {
  return (
    <Svg width={width} height={height} viewBox='0 0 100 100' style={style}>
      {/* simple gray box with “Form” label , placeholder until we have cate's design*/}
      <Rect
        x='5'
        y='5'
        width='90'
        height='90'
        rx='10'
        fill='#ccc'
        stroke='#888'
        strokeWidth='2'
      />
      <Text
        x='50'
        y='55'
        fontSize='20'
        fontWeight='bold'
        fill='#444'
        textAnchor='middle'
      >
        Form
      </Text>
    </Svg>
  );
}
