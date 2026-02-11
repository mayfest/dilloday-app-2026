import React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ArrowSignProps {
  text: string;
  onPress?: () => void;
  width?: number;
  height?: number;
  textColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  fontSize?: number;
}

export const ArrowSignSVG: React.FC<ArrowSignProps> = ({
  text,
  onPress,
  width = 300,
  height = 80,
  textColor = '#b33b3b',
  borderColor = '#b33b3b',
  backgroundColor = '#f0e6c3',
  fontSize = 24,
}) => {
  // Calculate dimensions for the arrow
  const arrowPointWidth = width * 0.1;
  const borderWidth = 10;

  // Calculate SVG path for outer arrow
  const outerArrowPath = `
    M 0,0
    L ${width * 0.9},0
    L ${width},${height / 2}
    L ${width * 0.9},${height}
    L 0,${height}
    Z
  `;

  // Calculate SVG path for inner arrow (smaller by borderWidth)
  const innerArrowPath = `
    M ${borderWidth},${borderWidth}
    L ${width * 0.9 - borderWidth},${borderWidth}
    L ${width - borderWidth * 1.5},${height / 2}
    L ${width * 0.9 - borderWidth},${height - borderWidth}
    L ${borderWidth},${height - borderWidth}
    Z
  `;

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      style={[styles.container, { width, height }]}
    >
      {/* Outer arrow (border) */}
      <Svg width={width} height={height} style={styles.svg}>
        <Path d={outerArrowPath} fill={borderColor} />
        <Path d={innerArrowPath} fill={backgroundColor} />
      </Svg>

      {/* Text overlay */}
      <View style={styles.textContainer}>
        <Text style={[styles.text, { color: textColor, fontSize }]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Example usage as a replacement for the SwshRedirectButton
export const CarouselArrowButton = ({
  text,
  url,
}: {
  text: string;
  url: string;
}) => {
  const handlePress = () => {
    // Import and use Linking from 'react-native' to open the URL
    // Linking.openURL(url);
    console.log(`Opening URL: ${url}`);
  };

  return (
    <ArrowSignSVG
      text={text}
      onPress={handlePress}
      width={250}
      height={40}
      textColor='#b33b3b'
      borderColor='#b33b3b'
      backgroundColor='#f0e6c3'
      fontSize={16}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 20,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'left',
    fontFamily: 'Poppins_600SemiBold',
  },
});
