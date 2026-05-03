import React from 'react';
import { View } from 'react-native';

import { DEVICE_HEIGHT, DEVICE_WIDTH } from '../Constants';
import RoadLine from './RoadLine';

const EDGE_MARGIN = 10;
const CURB_WIDTH = 10;
const CURB_BASE_WIDTH = 14;

const INTERIOR_LINE_WIDTH = 4;
const PATTERN_CANVAS_HEIGHT = DEVICE_HEIGHT * 1.6;

const Road = ({body}) => {
  // Keep sub-pixel precision so dashed lines move smoothly frame-to-frame.
  const y = body.position.y % 44;

  const leftCurbX = EDGE_MARGIN;
  const rightCurbX = DEVICE_WIDTH - EDGE_MARGIN - CURB_WIDTH;

  const innerLeft = EDGE_MARGIN + CURB_BASE_WIDTH + 12;
  const innerRight = DEVICE_WIDTH - EDGE_MARGIN - CURB_BASE_WIDTH - 12;
  const interiorStep = (innerRight - innerLeft) / 4;

  const interiorXs = [
    innerLeft + interiorStep,
    innerLeft + interiorStep * 2,
    innerLeft + interiorStep * 3,
  ];

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        top: -PATTERN_CANVAS_HEIGHT * 0.25,
        width: DEVICE_WIDTH,
        height: PATTERN_CANVAS_HEIGHT,
      }}
    >
      {/* dark base strips behind the curbs */}
      <View
        style={{
          position: 'absolute',
          left: leftCurbX - 2,
          top: 0,
          width: CURB_BASE_WIDTH,
          height: PATTERN_CANVAS_HEIGHT,
          backgroundColor: '#1A1A1A',
          borderRadius: 8,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: rightCurbX - 2,
          top: 0,
          width: CURB_BASE_WIDTH,
          height: PATTERN_CANVAS_HEIGHT,
          backgroundColor: '#1A1A1A',
          borderRadius: 8,
        }}
      />

      {/* Left curb */}
      <RoadLine
        x={leftCurbX}
        color='#D90429'
        lineWidth={CURB_WIDTH}
        dashLength={30}
        gapLength={14}
        canvasHeight={PATTERN_CANVAS_HEIGHT}
        offset={y}
        radius={1}
      />
      <RoadLine
        x={leftCurbX}
        color='#F4F4F4'
        lineWidth={CURB_WIDTH}
        dashLength={30}
        gapLength={14}
        canvasHeight={PATTERN_CANVAS_HEIGHT}
        offset={y + 22}
        radius={1}
      />

      {/* Right curb */}
      <RoadLine
        x={rightCurbX}
        color='#D90429'
        lineWidth={CURB_WIDTH}
        dashLength={30}
        gapLength={14}
        canvasHeight={PATTERN_CANVAS_HEIGHT}
        offset={y}
        radius={1}
      />
      <RoadLine
        x={rightCurbX}
        color='#F4F4F4'
        lineWidth={CURB_WIDTH}
        dashLength={30}
        gapLength={14}
        canvasHeight={PATTERN_CANVAS_HEIGHT}
        offset={y + 22}
        radius={1}
      />

      {/* Interior lane markers */}
      {interiorXs.map(x => (
        <RoadLine
          key={`lane-${x}`}
          x={x}
          color='rgba(255,255,255,0.8)'
          lineWidth={INTERIOR_LINE_WIDTH}
          dashLength={20}
          gapLength={34}
          canvasHeight={PATTERN_CANVAS_HEIGHT}
          offset={y}
          radius={INTERIOR_LINE_WIDTH / 2}
        />
      ))}
    </View>
  );
};

export default Road;