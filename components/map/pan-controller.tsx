import React from 'react';

import { Animated, PanResponder, View } from 'react-native';

class PanController extends React.Component<any, any> {
  _responder: any = null;
  _listener: any = null;
  _direction: any = null;
  _animating: boolean = false;
  _verticalAnimating: boolean = false;
  _initialTouch: { x: number; y: number } | null = null;
  _horizontalAnimating: boolean = false;
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
        if (!this._initialTouch || this._verticalAnimating) return false;

        const { dx, dy } = gestureState;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        const { panX } = this.props;

        const currentX = panX?._value || 0;
        const snapSpacing = this.props.snapSpacingX;
        const nearestSnap = Math.round(currentX / snapSpacing) * snapSpacing;
        const isNearSnap = Math.abs(currentX - nearestSnap) < 2;

        if (this._direction === 'x') {
          return absX > absY;
        }
        if (this._direction === 'y') {
          return isNearSnap && absY > absX;
        }

        if (absX > absY * 0.5) {
          this._direction = 'x';
          this._isMoving = true;
          return true;
        }

        if (absY > absX && isNearSnap) {
          this._direction = 'y';
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
          this._verticalAnimating = false;
        }

        if (this.props.onPanResponderGrant) {
          this.props.onPanResponderGrant(...args);
        }

        const { panX, panY, xMode, yMode } = this.props;

        this._lastValue = {
          x: panX?._value || 0,
          y: panY?._value || 0,
        };

        this.handleResponderGrant(panX, xMode);
        this.handleResponderGrant(panY, yMode);
      },

      onPanResponderMove: (_, { dx, dy }) => {
        const {
          panX,
          panY,
          xBounds,
          yBounds,
          overshootX,
          overshootY,
          horizontal,
          vertical,
        } = this.props;

        // Only allow movement in the locked direction
        if (this._direction === 'x' && horizontal && !this._verticalAnimating) {
          const [xMin, xMax] = xBounds;
          this.handleResponderMove(panX, dx, xMin, xMax, overshootX);
        }

        if (this._direction === 'y' && vertical) {
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
          xMode,
          yMode,
          snapSpacingX,
          snapSpacingY,
        } = this.props;

        const dir = this._direction;
        const velocityMultiplier = 1200;

        if (dir === 'x' && horizontal && !this._verticalAnimating) {
          this._horizontalAnimating = true;
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
            snapSpacingX,
            'x'
          );
        }

        if (dir === 'y' && vertical) {
          this._verticalAnimating = true;
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
            snapSpacingY,
            'y'
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
    snapSpacing: any,
    direction: 'x' | 'y'
  ) {
    anim.flattenOffset();
    let value = anim._value;
    let targetValue = value;

    if (direction === 'x') {
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
      }
    } else if (direction === 'y') {
      const threshold = (max + min) / 2;
      const isOpening = velocity < 0;

      if (Math.abs(velocity) > 500) {
        targetValue = isOpening ? min : max;
      } else {
        targetValue = value > threshold ? max : min;
      }
    }

    targetValue = Math.max(min, Math.min(max, targetValue));
    // const adjustedVelocity = Math.sign(velocity) * Math.min(Math.abs(velocity), 1000);

    this._animating = true;
    Animated.timing(anim, {
      toValue: targetValue,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      this._animating = false;
      if (direction === 'x') {
        this._horizontalAnimating = false;
      } else if (direction === 'y') {
        this._verticalAnimating = false;
      }
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

    if (this._animating) {
      if (panX) panX.stopAnimation();
      if (panY) panY.stopAnimation();
      this._animating = false;
      this._verticalAnimating = false;
    }

    this._direction = null;
    this._initialTouch = null;
    this._isMoving = false;
    this._lastValue = { x: 0, y: 0 };

    if (this._listener) {
      if (panX) panX.removeListener(this._listener);
      if (panY) panY.removeListener(this._listener);
    }
  }
}

export default PanController;
