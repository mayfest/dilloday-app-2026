import React from 'react';

import { View } from 'react-native';
import Svg, {
  Defs,
  Path,
  Text as SvgText,
  TSpan,
  TextPath,
} from 'react-native-svg';

interface CurvedTextProps {
  text: string;
  fontSize?: number;
  radius?: number;
  textColor?: string;
  position?: 'top' | 'bottom';
  fontFamily?: string;
}

const CurvedText: React.FC<CurvedTextProps> = ({
  text,
  fontSize = 24,
  radius = 100,
  textColor = '#991B1B',
  position = 'top',
  fontFamily = 'Rye',
}) => {
  const pathId = `arc${Math.random().toString(36).substr(2, 9)}`;
  const width = radius * 2;
  const svgHeight = radius + fontSize * 1.5;
  const centerY = position === 'top' ? radius + fontSize : radius;

  const pathD =
    position === 'top'
      ? `M0,${centerY} A${radius},${radius} 0 0,1 ${width},${centerY}`
      : `M${width},${radius} A${radius},${radius} 0 0,0 0,${radius}`;

  return (
    <View>
      <Svg width={width} height={svgHeight}>
        <Defs>
          <Path id={pathId} d={pathD} fill='none' />
        </Defs>
        <SvgText
          fill={textColor}
          fontSize={fontSize}
          fontWeight='bold'
          textAnchor='middle'
          fontFamily={fontFamily}
        >
          <TextPath href={`#${pathId}`} startOffset='50%'>
            <TSpan>{text}</TSpan>
          </TextPath>
        </SvgText>
      </Svg>
    </View>
  );
};

export default CurvedText;
