import * as React from 'react';

import { Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function SparkleRed() {
  const { width } = Dimensions.get('window');
  const SPARKLE_SIZE = Math.round(width * 0.3);
  const SPARKLE_HEIGHT = Math.round(SPARKLE_SIZE * 1.5);
  const SPARKLE_WIDTH = Math.round(SPARKLE_SIZE * 0.5);

  return (
    <Svg
      width={SPARKLE_WIDTH}
      height={SPARKLE_HEIGHT}
      viewBox='0 0 301 441'
      fill='none'
    >
      <Path
        d='M150.5 0.930176C155.54 59.6302 160.57 118.33 165.61 177.03C180.32 166.65 195.02 156.27 209.73 145.89C199.35 164.06 188.97 182.22 178.59 200.39C219.12 207.09 259.66 213.8 300.19 220.5C260.09 226.77 219.99 233.04 179.88 239.32C190.69 257.05 201.51 274.79 212.32 292.52C196.32 281.71 180.31 270.89 164.31 260.08C159.71 320.08 155.1 380.08 150.5 440.08C145.16 380.08 139.81 320.08 134.47 260.08C121.06 271.33 107.65 282.57 94.2401 293.82C101.59 274.79 108.95 255.76 116.3 236.73C77.8001 231.32 39.3101 225.92 0.810059 220.51L114.62 198.71C105.66 181.54 96.7001 164.37 87.7501 147.19C103.75 157.14 119.76 167.09 135.76 177.03C140.67 118.33 145.58 59.6302 150.5 0.930176Z'
        fill='#D72027'
      />
    </Svg>
  );
}
