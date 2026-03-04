import * as React from 'react';

import Flags from '@/assets/images/flags.svg';
import Svg, { ClipPath, Defs, G, Path, Text } from 'react-native-svg';

interface PageBannerProps {
  text: string;
}

export default function PageBanner({ text }: PageBannerProps) {
  const getFontSize = (str: string) => {
    const maxLength = 9;
    const baseSize = 28;
    const minSize = 16;

    if (str.length <= maxLength) return baseSize;

    const scaledSize = (maxLength / str.length) * baseSize;

    return Math.max(scaledSize, minSize);
  };

  const dynamicFontSize = getFontSize(text);

  return (
    <Svg width='393' height='110' viewBox='0 0 393 110' fill='none'>
      <G x='98'>
        <Flags />
      </G>

      <G clipPath='url(#clip0_banner)'>
        <Path
          d='M25 70C25 58.9543 33.9543 50 45 50H368V90C368 101.046 359.046 110 348 110H25V70Z'
          fill='#FFCD46'
        />
        <Text
          x='196'
          y={dynamicFontSize < 20 ? '88' : '90'}
          textAnchor='middle'
          fontFamily='SofachromeIt'
          fontSize={dynamicFontSize}
          fontWeight='900'
          fill='#150c0c'
        >
          {text}
        </Text>
      </G>

      <Path
        d='M45 52H366V90C366 99.9411 357.941 108 348 108H27V70C27 60.0589 35.0589 52 45 52Z'
        stroke='#140C0C'
        strokeWidth='4'
      />

      <Defs>
        <ClipPath id='clip0_banner'>
          <Path
            d='M25 70C25 58.9543 33.9543 50 45 50H368V90C368 101.046 359.046 110 348 110H25V70Z'
            fill='white'
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
