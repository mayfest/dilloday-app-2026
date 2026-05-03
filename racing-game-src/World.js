import React, { Component } from 'react';

import { router } from 'expo-router';
import { Accelerometer } from 'expo-sensors';
import sampleSize from 'lodash.samplesize';
import Matter from 'matter-js';
import randomInt from 'random-int';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';

import {
  CAR_HEIGHT,
  CAR_WIDTH,
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  HITBOX_HEIGHT,
  HITBOX_WIDTH,
  MATTER_CAT_BLUE_HAZARD,
  MATTER_CAT_FLOOR,
  MATTER_CAT_OPPOSING,
  MATTER_CAT_PLAYER,
  RACING_BLUE_CAR_BASE_SPEED,
  RACING_BLUE_CAR_BASE_SPIN,
  RACING_BLUE_CAR_MAX_SPEED,
  RACING_BLUE_CAR_MAX_SPIN,
  RACING_BLUE_CAR_MIN_TIER,
  RACING_BLUE_CAR_SPEED_PER_TIER,
  RACING_BLUE_CAR_SPIN_PER_TIER,
  RACING_CARS_PER_SPEED_TIER,
  RACING_PLAYER_MAX_SPEED,
  RACING_TILT_DEADZONE,
  RACING_TILT_SENSITIVITY,
  gravityForTier,
  worldSpeedPxPerSec,
} from './Constants';
import { OPPOSING_CAR_IMAGES } from './Images';
import { car, floor, road } from './Objects';
import Box from './components/Box';
import Car from './components/Car';
import Road from './components/Road';
import getRandomDecimal from './helpers/getRandomDecimal';

/**
 * Custom entity renderer: same idea as react-native-game-engine DefaultRenderer,
 * but avoids rendering `<undefined />` when `renderer` is an object without a
 * valid `type` (React then throws e.g. "Cannot read property 'displayName' of undefined").
 */
function racingEntitiesRenderer(entities, screen, layout) {
  if (!entities || !screen || !layout) return null;

  return Object.keys(entities)
    .filter((key) => {
      const r = entities[key]?.renderer;
      if (r == null) return false;
      if (typeof r === 'function') return true;
      if (typeof r === 'object' && r.type != null) return true;
      return false;
    })
    .map((key) => {
      const entity = entities[key];
      const R = entity.renderer;

      if (typeof R === 'function') {
        return <R key={key} screen={screen} layout={layout} {...entity} />;
      }

      const Type = R.type;
      return <Type key={key} screen={screen} layout={layout} {...entity} />;
    });
}

function getSpeedTier(score) {
  return Math.floor(score / RACING_CARS_PER_SPEED_TIER);
}

function getBlueCarSpeedForTier(tier) {
  const v = RACING_BLUE_CAR_BASE_SPEED + tier * RACING_BLUE_CAR_SPEED_PER_TIER;
  return Math.min(v, RACING_BLUE_CAR_MAX_SPEED);
}

function getBlueCarSpinForTier(tier) {
  const w = RACING_BLUE_CAR_BASE_SPIN + tier * RACING_BLUE_CAR_SPIN_PER_TIER;
  return Math.min(w, RACING_BLUE_CAR_MAX_SPIN);
}

export default class World extends Component {
  state = {
    isGameSetup: true,
    isGamePaused: false,
    gamePhase: 'pre', // 'pre' | 'playing' | 'confirmexit' | 'gameover'
    score: 0,
  };

  constructor(props) {
    super(props);

    this._gameOverDone = false;
    this.opposing_cars = [];
    this.blueCarY = DEVICE_HEIGHT * 0.4;
    this.blueCarDir = 1;
    this.blueCarSpinDir = 1;
    this._blueCarWasActive = false;
    this.tiltX = 0;
    this.playerX = DEVICE_WIDTH / 2;

    const { engine, world } = this.addObjectsToWorld(car);
    this.entities = this.getEntities(engine, world, car, road);

    this.physics = (entities, { time: { delta } }) => {
      if (this.state.gamePhase === 'confirmexit') {
        return entities;
      }
      let engine = entities['physics'].engine;
      const tier = getSpeedTier(this.state.score);
      engine.world.gravity.y = gravityForTier(tier);
      Matter.Engine.update(engine, delta);
      return entities;
    };

    this.playerMotion = (entities, { time }) => {
      if (this.state.isGamePaused || this.state.gamePhase !== 'playing') {
        return entities;
      }

      const dt = Math.min(time.delta / 1000, 0.064);
      const raw = this.tiltX;
      const mag = Math.abs(raw);
      let speed = 0;
      if (mag > RACING_TILT_DEADZONE) {
        const signed = Math.sign(raw) * (mag - RACING_TILT_DEADZONE);
        speed = signed * RACING_TILT_SENSITIVITY;
        if (speed > RACING_PLAYER_MAX_SPEED) speed = RACING_PLAYER_MAX_SPEED;
        if (speed < -RACING_PLAYER_MAX_SPEED) speed = -RACING_PLAYER_MAX_SPEED;
      }

      const halfCar = CAR_WIDTH / 2;
      const minX = halfCar;
      const maxX = DEVICE_WIDTH - halfCar;
      let nextX = this.playerX + speed * dt;
      if (nextX < minX) nextX = minX;
      if (nextX > maxX) nextX = maxX;
      this.playerX = nextX;

      Matter.Body.setPosition(car, { x: nextX, y: DEVICE_HEIGHT - 200 });
      return entities;
    };

    this.roadTranslation = (entities, { time }) => {
      if (this.state.isGamePaused) {
        return entities;
      }
      // Time-based scroll: speed is px/sec, so multiply by delta. Position is
      // kept fractional in Matter and floored at draw time in Road.js — that
      // way a hitchy frame absorbs into the next without losing or doubling
      // pixels.
      const tier = getSpeedTier(this.state.score);
      const speed = worldSpeedPxPerSec(tier);
      const dt = Math.min(time.delta / 1000, 0.064);
      // Dash cycle in Road.js is 44 (dashLength 30 + gapLength 14). Wrap by
      // a multiple of 44 so the `% 44` offset stays continuous.
      const WRAP = 44 * 10;
      let nextY = (road.position.y + speed * dt) % WRAP;
      if (nextY < 0) nextY += WRAP;
      Matter.Body.setPosition(road, {
        x: road.position.x,
        y: nextY,
      });
      return entities;
    };

    this.blueCarMotion = (entities, { time }) => {
      if (this.state.isGamePaused) {
        return entities;
      }

      const tier = getSpeedTier(this.state.score);
      const blueActive = tier >= RACING_BLUE_CAR_MIN_TIER;

      if (!blueActive) {
        Matter.Body.setPosition(this.blueCar, { x: -500, y: -500 });
        Matter.Body.setAngle(this.blueCar, 0);
        this._blueCarWasActive = false;
        return entities;
      }

      const dt = Math.min(time.delta / 1000, 0.064);
      const speed = getBlueCarSpeedForTier(tier);
      const spin = getBlueCarSpinForTier(tier);
      const margin = CAR_WIDTH + 16;

      if (!this._blueCarWasActive) {
        this.blueCarDir = Math.random() < 0.5 ? 1 : -1;
        this.blueCarSpinDir = Math.random() < 0.5 ? 1 : -1;
        Matter.Body.setPosition(this.blueCar, {
          x: this.blueCarDir > 0 ? -margin : DEVICE_WIDTH + margin,
          y: this.blueCarY,
        });
        Matter.Body.setAngle(this.blueCar, 0);
        this._blueCarWasActive = true;
        return entities;
      }

      let x = this.blueCar.position.x + this.blueCarDir * speed * dt;
      const y = this.blueCarY;
      let ang = this.blueCar.angle + this.blueCarSpinDir * spin * dt;

      if (this.blueCarDir > 0 && x > DEVICE_WIDTH + margin) {
        x = -margin;
        this.blueCarDir = Math.random() < 0.5 ? 1 : -1;
        this.blueCarSpinDir = Math.random() < 0.5 ? 1 : -1;
      } else if (this.blueCarDir < 0 && x < -margin) {
        x = DEVICE_WIDTH + margin;
        this.blueCarDir = Math.random() < 0.5 ? 1 : -1;
        this.blueCarSpinDir = Math.random() < 0.5 ? 1 : -1;
      }

      Matter.Body.setPosition(this.blueCar, { x, y });
      Matter.Body.setAngle(this.blueCar, ang);

      if (Matter.Query.collides(this.blueCar, [car]).length > 0) {
        this.gameOver('You hit the crossing car!');
      }

      return entities;
    };

    this.setupCollisionHandler(engine);
  }

  componentDidMount() {
    this.setState({
      gamePhase: 'playing',
      isGameSetup: true,
      isGamePaused: false,
    });

    this.playerX = DEVICE_WIDTH / 2;
    Matter.Body.setPosition(car, {
      x: this.playerX,
      y: DEVICE_HEIGHT - 200,
    });

    try {
      Accelerometer.setUpdateInterval(15);
      this.accelerometer = Accelerometer.addListener(({ x }) => {
        this.tiltX = x;
      });
    } catch (_e) {
      // Sensors not available (e.g. simulator)
    }
  }

  componentWillUnmount() {
    if (this.accelerometer) {
      this.accelerometer.remove();
    }
  }

  addObjectsToWorld = (car) => {
    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;

    let objects = [road, car, floor];

    for (let x = 0; x <= 4; x++) {
      const opposing_car = Matter.Bodies.rectangle(
        randomInt(
          Math.ceil(CAR_WIDTH / 2) + 8,
          Math.floor(DEVICE_WIDTH - CAR_WIDTH / 2) - 8
        ),
        -randomInt(0, Math.floor(DEVICE_HEIGHT * 1.5)),
        HITBOX_WIDTH,
        HITBOX_HEIGHT,
        {
          frictionAir: getRandomDecimal(0.05, 0.25),
          label: 'opposing_car',
          collisionFilter: {
            category: MATTER_CAT_OPPOSING,
            mask: MATTER_CAT_FLOOR | MATTER_CAT_PLAYER | MATTER_CAT_OPPOSING,
          },
        }
      );

      this.opposing_cars.push(opposing_car);
    }

    objects = objects.concat(this.opposing_cars);

    this.blueCar = Matter.Bodies.rectangle(
      -500,
      -500,
      HITBOX_WIDTH,
      HITBOX_HEIGHT,
      {
        isStatic: true,
        isSensor: true,
        label: 'blue_hazard',
        collisionFilter: {
          category: MATTER_CAT_BLUE_HAZARD,
          mask: MATTER_CAT_PLAYER,
        },
      }
    );
    objects.push(this.blueCar);

    Matter.World.add(world, objects);

    return { engine, world };
  };

  setupCollisionHandler = (engine) => {
    Matter.Events.on(engine, 'collisionStart', (event) => {
      if (this.state.isGamePaused) {
        return;
      }

      for (const pair of event.pairs) {
        const { bodyA, bodyB } = pair;
        const a = bodyA.label;
        const b = bodyB.label;

        const floorOpp =
          (a === 'floor' && b === 'opposing_car') ||
          (a === 'opposing_car' && b === 'floor');
        if (floorOpp) {
          const opp = a === 'opposing_car' ? bodyA : bodyB;
          Matter.Body.setPosition(opp, {
            x: randomInt(20, DEVICE_WIDTH - 20),
            y: -randomInt(
              Math.floor(DEVICE_HEIGHT * 0.2),
              Math.floor(DEVICE_HEIGHT * 1.2)
            ),
          });
          Matter.Body.setVelocity(opp, { x: 0, y: 0 });
          Matter.Body.set(opp, { frictionAir: getRandomDecimal(0.05, 0.25) });

          this.setState((state) => ({
            score: state.score + 1,
          }));
        }

        const playerHit =
          (a === 'car' && b === 'opposing_car') ||
          (a === 'opposing_car' && b === 'car');
        if (playerHit) {
          this.gameOver('YOU BUMPED ANOTHER CAR!');
          return;
        }
      }
    });
  };

  gameOver = async (msg) => {
    if (this._gameOverDone) {
      return;
    }
    this._gameOverDone = true;

    this.opposing_cars.forEach((item) => {
      Matter.Body.set(item, {
        isStatic: true,
      });
    });
    Matter.Body.set(this.blueCar, { isStatic: true });

    const finalScore = this.state.score;

    this.setState({
      isGamePaused: true,
    });

    router.replace({
      pathname: '/racing-game/game-over',
      params: {
        score: String(finalScore),
        reason: msg,
        endedAt: String(Date.now()),
        mode: this.props.mode === 'practice' ? 'practice' : 'scored',
      },
    });
  };

  getEntities = (engine, world, car, road) => {
    const entities = {
      physics: { engine, world },

      theRoad: {
        body: road,
        size: [20, 100],
        renderer: Road,
      },

      playerCar: {
        body: car,
        size: [CAR_WIDTH, CAR_HEIGHT],
        image: require('../assets/racing-game/red-car.png'),
        renderer: Car,
      },

      gameFloor: {
        body: floor,
        size: [DEVICE_WIDTH, 10],
        color: '#414448',
        renderer: Box,
      },

      blueHazard: {
        body: this.blueCar,
        size: [CAR_WIDTH, CAR_HEIGHT],
        image: require('../assets/racing-game/blue-car.png'),
        renderer: Car,
      },
    };

    const selected_car_images = sampleSize(OPPOSING_CAR_IMAGES, 5);

    for (let x = 0; x <= 4; x++) {
      Object.assign(entities, {
        ['opposing_car' + x]: {
          body: this.opposing_cars[x],
          size: [CAR_WIDTH, CAR_HEIGHT],
          image: selected_car_images[x],
          renderer: Car,
        },
      });
    }

    return entities;
  };

  render() {
    const { isGameSetup, score } = this.state;
    const tier = getSpeedTier(score);

    if (isGameSetup) {
      return (
        <GameEngine
          style={styles.container}
          renderer={racingEntitiesRenderer}
          systems={[
            this.physics,
            this.playerMotion,
            this.roadTranslation,
            this.blueCarMotion,
          ]}
          entities={this.entities}
        >
          <View style={styles.infoWrapper}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Score: {score}</Text>
              <Text style={styles.speedText}>
                Speed tier {tier + 1} · next at{' '}
                {(tier + 1) * RACING_CARS_PER_SPEED_TIER}
              </Text>
            </View>
            {this.props.mode === 'practice' ? (
              <View style={styles.practiceBadge}>
                <Text style={styles.practiceBadgeText}>PRACTICE</Text>
              </View>
            ) : null}
          </View>
          {__DEV__ && (
            <View style={styles.devControls} pointerEvents='box-none'>
              <Pressable
                style={[styles.devButton, styles.devButtonLeft]}
                onPressIn={() => {
                  this.tiltX = -0.15;
                }}
                onPressOut={() => {
                  this.tiltX = 0;
                }}
              >
                <Text style={styles.devButtonText}>◀</Text>
              </Pressable>
              <Pressable
                style={[styles.devButton, styles.devButtonRight]}
                onPressIn={() => {
                  this.tiltX = 0.15;
                }}
                onPressOut={() => {
                  this.tiltX = 0;
                }}
              >
                <Text style={styles.devButtonText}>▶</Text>
              </Pressable>
            </View>
          )}
        </GameEngine>
      );
    }

    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Something isn't right..</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  infoWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  scoreText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
  },
  speedText: {
    marginTop: 6,
    fontSize: 14,
    color: '#e0e0e0',
  },
  practiceBadge: {
    position: 'absolute',
    top: 50,
    left: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255,196,0,0.92)',
  },
  practiceBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#1a1a1a',
  },
  devControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  devButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  devButtonLeft: {},
  devButtonRight: {},
  devButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
});
