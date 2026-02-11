import React from 'react';

import { Animated, PanResponder, View } from 'react-native';

class PanController extends React.Component<any, any> {
  _responder: any = null;
  _listener: any = null;
  _direction: any = null;
  _animating: boolean = false;
  _initialTouch: { x: number; y: number } | null = null;
  _lastValue: { x: number; y: number } = { x: 0, y: 0 };
  _isMoving: boolean = false;
  deceleration: number;

  constructor(props: any) {
    super(props);

    this.deceleration = 0.997;
    if (props.momentumDecayConfig?.deceleration) {
      this.deceleration = props.momentumDecayConfig.deceleration;
    }

    this._responder = PanResponder.create({
      onStartShouldSetPanResponder: (e) => {
        this._initialTouch = {
          x: e.nativeEvent.pageX,
          y: e.nativeEvent.pageY,
        };
        this._isMoving = false;

        return this.props.onStartShouldSetPanResponder
          ? this.props.onStartShouldSetPanResponder(e)
          : false;
      },

      onMoveShouldSetPanResponder: (e, gestureState) => {
        if (!this._initialTouch) return false;

        const { dx, dy } = gestureState;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        // Easier horizontal movement
        const horizontalThreshold = 1;
        const verticalThreshold = 5;

        // For horizontal movement (card switching)
        if (absX > horizontalThreshold && absX > absY * 0.5) {
          this._isMoving = true;
          return true;
        }

        // For vertical movement (drawer opening/closing)
        if (absY > verticalThreshold && absY > absX) {
          this._isMoving = true;
          return this.props.onMoveShouldSetPanResponder
            ? this.props.onMoveShouldSetPanResponder(e, gestureState)
            : true;
        }

        return false;
      },

      onPanResponderGrant: (...args) => {
        if (this._animating) {
          const { panX, panY } = this.props;
          panX?.stopAnimation();
          panY?.stopAnimation();
          this._animating = false;
        }

        if (this.props.onPanResponderGrant) {
          this.props.onPanResponderGrant(...args);
        }

        const { panX, panY, horizontal, vertical, xMode, yMode } = this.props;

        this._lastValue = {
          x: panX?._value || 0,
          y: panY?._value || 0,
        };

        this.handleResponderGrant(panX, xMode);
        this.handleResponderGrant(panY, yMode);

        this._direction =
          horizontal && !vertical ? 'x' : vertical && !horizontal ? 'y' : null;
      },

      onPanResponderMove: (_, { dx, dy, x0, y0 }) => {
        if (!this._isMoving) {
          const absX = Math.abs(dx);
          const absY = Math.abs(dy);
          if (absX > 1 || absY > 1) {
            this._isMoving = true;
          }
        }

        const {
          panX,
          panY,
          xBounds,
          yBounds,
          overshootX,
          overshootY,
          horizontal,
          vertical,
          lockDirection,
          directionLockDistance,
        } = this.props;

        if (!this._direction && (horizontal || vertical)) {
          const absX = Math.abs(dx);
          const absY = Math.abs(dy);

          if (
            absX > directionLockDistance * 0.5 ||
            absY > directionLockDistance * 0.5
          ) {
            this._direction = absX * 1.2 > absY ? 'x' : 'y';
            if (this.props.onDirectionChange) {
              this.props.onDirectionChange(this._direction, { dx, dy, x0, y0 });
            }
          }
        }

        const dir = this._direction;

        if (horizontal && (!lockDirection || dir === 'x')) {
          const [xMin, xMax] = xBounds;
          this.handleResponderMove(panX, dx, xMin, xMax, overshootX);
        }

        if (vertical && (!lockDirection || dir === 'y')) {
          const [yMin, yMax] = yBounds;
          this.handleResponderMove(panY, dy, yMin, yMax, overshootY);
        }
      },

      onPanResponderRelease: (_, { dx, dy, vx, vy }) => {
        this._initialTouch = null;
        this._isMoving = false;
        const {
          panX,
          panY,
          xBounds,
          yBounds,
          overshootX,
          overshootY,
          horizontal,
          vertical,
          lockDirection,
          xMode,
          yMode,
          snapSpacingX,
          snapSpacingY,
        } = this.props;

        const dir = this._direction;

        const velocityMultiplier = this._isMoving ? 1200 : 800;

        if (horizontal && (!lockDirection || dir === 'x')) {
          const [xMin, xMax] = xBounds;
          const adjustedVx =
            Math.sign(vx) * Math.min(Math.abs(vx * velocityMultiplier), 2000);
          this.handleResponderRelease(
            panX,
            xMin,
            xMax,
            adjustedVx,
            overshootX,
            xMode,
            snapSpacingX
          );
        }

        if (vertical && (!lockDirection || dir === 'y')) {
          const [yMin, yMax] = yBounds;
          const adjustedVy =
            Math.sign(vy) * Math.min(Math.abs(vy * velocityMultiplier), 2000);
          this.handleResponderRelease(
            panY,
            yMin,
            yMax,
            adjustedVy,
            overshootY,
            yMode,
            snapSpacingY
          );
        }

        this._direction = null;
      },
    });
  }

  handleResponderMove(
    anim: any,
    delta: any,
    min: any,
    max: any,
    overshoot: any
  ) {
    if (!this._isMoving) return;

    let val = anim._offset + delta;

    if (this._direction === 'y') {
      if (val > max) {
        val = max + (val - max) / 6;
      }
      if (val < min) {
        val = min + (val - min) / 6;
      }
    } else {
      if (val > max) {
        val = overshoot === 'spring' ? max + (val - max) / 3 : max;
      }
      if (val < min) {
        val = overshoot === 'spring' ? min + (val - min) / 3 : min;
      }
    }

    val = val - anim._offset;
    anim.setValue(val);
  }

  handleResponderRelease(
    anim: any,
    min: any,
    max: any,
    velocity: any,
    overshoot: any,
    mode: any,
    snapSpacing: any
  ) {
    anim.flattenOffset();
    let value = anim._value;
    let targetValue = value;

    if (mode === 'snap' && snapSpacing) {
      const velocityThreshold = Math.abs(velocity) > 1000 ? 100 : 200;
      const currentIndex = Math.round(value / snapSpacing);
      const maxIndex = Math.floor(max / snapSpacing);
      const minIndex = Math.ceil(min / snapSpacing);

      if (Math.abs(velocity) > velocityThreshold) {
        const direction = Math.sign(velocity);
        let nextIndex = currentIndex + direction;
        nextIndex = Math.max(minIndex, Math.min(maxIndex, nextIndex));
        targetValue = nextIndex * snapSpacing;
      } else {
        targetValue =
          Math.max(minIndex, Math.min(maxIndex, currentIndex)) * snapSpacing;
      }
    } else {
      const totalTravel = Math.abs(max - min);
      const velocityThreshold = 0.5;
      const positionThreshold = totalTravel / 2;

      if (Math.abs(velocity) > velocityThreshold) {
        targetValue = velocity > 0 ? max : min;
      } else {
        const distanceFromClosed = Math.abs(value - max);
        targetValue = distanceFromClosed < positionThreshold ? max : min;
      }
    }

    targetValue = Math.max(min, Math.min(max, targetValue));

    this._animating = true;
    Animated.spring(anim, {
      toValue: targetValue,
      velocity: velocity,
      tension: 65,
      friction: 12,
      useNativeDriver: false,
    }).start(() => {
      this._animating = false;
    });
  }

  handleResponderGrant(anim: any, mode: any) {
    switch (mode) {
      case 'spring-origin':
        anim.setValue(0);
        break;
      case 'snap':
      case 'decay':
        anim.setOffset(anim._value + anim._offset);
        anim.setValue(0);
        break;
    }
  }

  render() {
    return <View {...this.props} {...this._responder.panHandlers} />;
  }

  componentWillUnmount() {
    const { panX, panY } = this.props;
    if (panX) panX.stopAnimation();
    if (panY) panY.stopAnimation();

    if (this._listener) {
      if (panX) panX.removeListener(this._listener);
      if (panY) panY.removeListener(this._listener);
    }
  }
}

export default PanController;
