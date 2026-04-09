import React, { Component } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';
import Matter from 'matter-js';
import { GameEngine } from 'react-native-game-engine';

import { Accelerometer } from 'expo-sensors';

import { recordLeaderboardScore } from '../lib/racing-leaderboard';

import sampleSize from 'lodash.samplesize';
import randomInt from 'random-int';

import Box from './components/Box';
import Car from './components/Car';
import Road from './components/Road';

import getRandomDecimal from './helpers/getRandomDecimal';

import {
  CAR_HEIGHT,
  CAR_WIDTH,
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
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
  RACING_GRAVITY_BASE,
  RACING_GRAVITY_PER_TIER,
  RACING_MAX_GRAVITY,
  RACING_MAX_ROAD_SCROLL,
  RACING_ROAD_SCROLL_BASE,
  RACING_ROAD_SCROLL_PER_TIER,
} from './Constants';

import { OPPOSING_CAR_IMAGES } from './Images';

import { car, floor, road } from './Objects';

function getSpeedTier(score) {
  return Math.floor(score / RACING_CARS_PER_SPEED_TIER);
}

function getRoadScrollForTier(tier) {
  const v =
    RACING_ROAD_SCROLL_BASE + tier * RACING_ROAD_SCROLL_PER_TIER;
  return Math.min(v, RACING_MAX_ROAD_SCROLL);
}

function getGravityForTier(tier) {
  const g = RACING_GRAVITY_BASE + tier * RACING_GRAVITY_PER_TIER;
  return Math.min(g, RACING_MAX_GRAVITY);
}

function getBlueCarSpeedForTier(tier) {
  const v =
    RACING_BLUE_CAR_BASE_SPEED + tier * RACING_BLUE_CAR_SPEED_PER_TIER;
  return Math.min(v, RACING_BLUE_CAR_MAX_SPEED);
}

function getBlueCarSpinForTier(tier) {
  const w =
    RACING_BLUE_CAR_BASE_SPIN + tier * RACING_BLUE_CAR_SPIN_PER_TIER;
  return Math.min(w, RACING_BLUE_CAR_MAX_SPIN);
}

export default class World extends Component {
  state = {
    x: DEVICE_WIDTH / 2,
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

    const {engine, world} = this.addObjectsToWorld(car);
    this.entities = this.getEntities(engine, world, car, road);

    this.physics = (entities, {time: {delta}}) => {
      if (this.state.gamePhase === 'confirmexit') {
        return entities;
      }
      let engine = entities['physics'].engine;
      const tier = getSpeedTier(this.state.score);
      engine.world.gravity.y = getGravityForTier(tier);
      Matter.Engine.update(engine, delta);
      return entities;
    };

    this.roadTranslation = (entities, {time}) => {
      if (!this.state.isGamePaused) {
        const tier = getSpeedTier(this.state.score);
        const roadStep = getRoadScrollForTier(tier);
        Matter.Body.setPosition(road, {
          x: road.position.x,
          y: road.position.y + roadStep,
        });

        if (road.position.y >= DEVICE_HEIGHT / 5) {
          Matter.Body.setPosition(road, {
            x: road.position.x,
            y: 0,
          });
        }
      }
      return entities;
    };

    this.blueCarMotion = (entities, {time}) => {
      if (this.state.isGamePaused) {
        return entities;
      }

      const tier = getSpeedTier(this.state.score);
      const blueActive = tier >= RACING_BLUE_CAR_MIN_TIER;

      if (!blueActive) {
        Matter.Body.setPosition(this.blueCar, {x: -500, y: -500});
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
      let ang =
        this.blueCar.angle + this.blueCarSpinDir * spin * dt;

      if (this.blueCarDir > 0 && x > DEVICE_WIDTH + margin) {
        x = -margin;
        this.blueCarDir = Math.random() < 0.5 ? 1 : -1;
        this.blueCarSpinDir = Math.random() < 0.5 ? 1 : -1;
      } else if (this.blueCarDir < 0 && x < -margin) {
        x = DEVICE_WIDTH + margin;
        this.blueCarDir = Math.random() < 0.5 ? 1 : -1;
        this.blueCarSpinDir = Math.random() < 0.5 ? 1 : -1;
      }

      Matter.Body.setPosition(this.blueCar, {x, y});
      Matter.Body.setAngle(this.blueCar, ang);

      if (Matter.Bounds.overlaps(car.bounds, this.blueCar.bounds)) {
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

    Matter.Body.setPosition(car, {
      x: DEVICE_WIDTH / 2,
      y: DEVICE_HEIGHT - 200,
    });

    try {
      Accelerometer.setUpdateInterval(15);
      this.accelerometer = Accelerometer.addListener(({x}) => {
        if (this.state.gamePhase === 'playing') {
          const newX = this.state.x + x;

          Matter.Body.setPosition(car, {
            x: newX,
            y: DEVICE_HEIGHT - 200,
          });

          this.setState({x: newX}, () => {
            if (this.state.x < 0 || this.state.x > DEVICE_WIDTH) {
              Matter.Body.setPosition(car, {
                x: MID_POINT,
                y: DEVICE_HEIGHT - 200,
              });
              this.setState({x: MID_POINT});
              this.gameOver();
            }
          });
        }
      });
    } catch (e) {
      // Sensors not available (e.g. simulator)
    }
  }

  componentWillUnmount() {
    if (this.accelerometer) {
      this.accelerometer.remove();
    }
  }

  addObjectsToWorld = car => {
    const engine = Matter.Engine.create({enableSleeping: false});
    const world = engine.world;

    let objects = [road, car, floor];

    for (let x = 0; x <= 4; x++) {
      const opposing_car = Matter.Bodies.rectangle(
        randomInt(
          Math.ceil(CAR_WIDTH / 2) + 8,
          Math.floor(DEVICE_WIDTH - CAR_WIDTH / 2) - 8
        ),
        0,
        CAR_WIDTH,
        CAR_HEIGHT,
        {
          frictionAir: getRandomDecimal(0.05, 0.25),
          label: 'opposing_car',
          collisionFilter: {
            category: MATTER_CAT_OPPOSING,
            mask:
              MATTER_CAT_FLOOR |
              MATTER_CAT_PLAYER |
              MATTER_CAT_OPPOSING,
          },
        },
      );

      this.opposing_cars.push(opposing_car);
    }

    objects = objects.concat(this.opposing_cars);

    this.blueCar = Matter.Bodies.rectangle(
      -500,
      -500,
      CAR_WIDTH,
      CAR_HEIGHT,
      {
        isStatic: true,
        isSensor: true,
        label: 'blue_hazard',
        collisionFilter: {
          category: MATTER_CAT_BLUE_HAZARD,
          mask: MATTER_CAT_PLAYER,
        },
      },
    );
    objects.push(this.blueCar);

    Matter.World.add(world, objects);

    return {engine, world};
  };

  setupCollisionHandler = engine => {
    Matter.Events.on(engine, 'collisionStart', event => {
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
            y: 0,
          });

          this.setState(state => ({
            score: state.score + 1,
          }));
        }

        const playerHit =
          (a === 'car' && b === 'opposing_car') ||
          (a === 'opposing_car' && b === 'car');
        if (playerHit) {
          this.gameOver('You bumped to another car!');
          return;
        }

      }
    });
  };

  gameOver = async msg => {
    if (this._gameOverDone) {
      return;
    }
    this._gameOverDone = true;

    this.opposing_cars.forEach(item => {
      Matter.Body.set(item, {
        isStatic: true,
      });
    });
    Matter.Body.set(this.blueCar, {isStatic: true});

    const finalScore = this.state.score;

    this.setState({
      isGamePaused: true,
    });

    try {
      await recordLeaderboardScore(finalScore);
    } catch (e) {
      console.warn('Racing leaderboard save failed', e);
    }

    router.replace({
      pathname: '/racing-game/game-over',
      params: {
        score: String(finalScore),
        reason: msg,
        endedAt: String(Date.now()),
      },
    });
  };

  getEntities = (engine, world, car, road) => {
    const entities = {
      physics: {engine, world},

      theRoad: {
        body: road,
        size: [20, 100],
        renderer: Road,
      },

      playerCar: {
        body: car,
        size: [CAR_WIDTH, CAR_HEIGHT],
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
    const {isGameSetup, score} = this.state;
    const tier = getSpeedTier(score);

    if (isGameSetup) {
      return (
        <GameEngine
          style={styles.container}
          systems={[
            this.physics,
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
          </View>
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
  preTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  preSubtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#555',
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#aaa',
    fontSize: 18,
  },
  // In-game HUD
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
});
