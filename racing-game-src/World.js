import React, { Component } from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Matter from 'matter-js';
import { GameEngine } from 'react-native-game-engine';

import { Accelerometer } from 'expo-sensors';

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
  MID_POINT,
} from './Constants';

import { OPPOSING_CAR_IMAGES } from './Images';

import { car, floor, road } from './Objects';

export default class World extends Component {
  state = {
    x: DEVICE_WIDTH / 2,
    gamePhase: 'pre', // 'pre' | 'playing' | 'confirmexit' | 'gameover'
    score: 0,
  };

  constructor(props) {
    super(props);

    this.opposing_cars = [];

    const {engine, world} = this.addObjectsToWorld(car);
    this.entities = this.getEntities(engine, world, car, road);

    this.physics = (entities, {time: {delta}}) => {
      if (this.state.gamePhase === 'confirmexit') {
        return entities;
      }
      let engine = entities['physics'].engine;

      engine.world.gravity.y = 0.5;
      Matter.Engine.update(engine, delta);
      return entities;
    };

    this.roadTranslation = (entities, {time}) => {
      if (this.state.gamePhase === 'playing' || this.state.gamePhase === 'pre') {
        Matter.Body.setPosition(road, {
          x: road.position.x,
          y: road.position.y + 1,
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

    this.setupCollisionHandler(engine);
  }

  componentDidMount() {
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

    for (let i = 0; i <= 4; i++) {
      const opposing_car = Matter.Bodies.rectangle(
        randomInt(1, DEVICE_WIDTH - 10),
        -randomInt(50, 500),
        CAR_WIDTH,
        CAR_HEIGHT,
        {
          frictionAir: getRandomDecimal(0.05, 0.25),
          label: 'opposing_car',
        },
      );

      this.opposing_cars.push(opposing_car);
    }

    objects = objects.concat(this.opposing_cars);

    Matter.World.add(world, objects);

    return {engine, world};
  };

  setupCollisionHandler = engine => {
    Matter.Events.on(engine, 'collisionStart', event => {
      const pairs = event.pairs;

      for (let i = 0; i < pairs.length; i++) {
        const objA = pairs[i].bodyA.label;
        const objB = pairs[i].bodyB.label;

        if (objA === 'floor' && objB === 'opposing_car') {
          Matter.Body.setPosition(pairs[i].bodyB, {
            x: randomInt(20, DEVICE_WIDTH - 20),
            y: 0,
          });
          if (this.state.gamePhase === 'playing') {
            this.setState(state => ({score: state.score + 1}));
          }
        }

        if (objA === 'car' && objB === 'opposing_car') {
          if (this.state.gamePhase === 'playing') {
            this.gameOver();
          }
        }
      }
    });
  };

  startGame = () => {
    Matter.Body.setPosition(car, {
      x: DEVICE_WIDTH / 2,
      y: DEVICE_HEIGHT - 200,
    });

    this.opposing_cars.forEach(item => {
      Matter.Body.set(item, {isStatic: false});
      Matter.Body.setPosition(item, {
        x: randomInt(20, DEVICE_WIDTH - 20),
        y: -randomInt(50, 400),
      });
      Matter.Body.setVelocity(item, {x: 0, y: 0});
    });

    this.setState({gamePhase: 'playing', score: 0, x: DEVICE_WIDTH / 2});
  };

  gameOver = () => {
    this.opposing_cars.forEach(item => {
      Matter.Body.set(item, {isStatic: true});
    });

    this.setState({gamePhase: 'gameover'});
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
        image: require('../assets/racing-game/red-car.png'),
        renderer: Car,
      },

      gameFloor: {
        body: floor,
        size: [DEVICE_WIDTH, 10],
        color: '#414448',
        renderer: Box,
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
    const {gamePhase, score} = this.state;
    const {onExit} = this.props;

    return (
      <GameEngine
        style={styles.container}
        systems={[this.physics, this.roadTranslation]}
        entities={this.entities}>
        {(gamePhase === 'playing' || gamePhase === 'confirmexit') && (
          <>
            <View style={styles.infoWrapper}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>Score: {score}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.exitGameButton}
              onPress={() => this.setState({gamePhase: 'confirmexit'})}>
              <Text style={styles.exitGameButtonText}>✕</Text>
            </TouchableOpacity>
          </>
        )}

        {gamePhase === 'confirmexit' && (
          <View style={styles.overlay}>
            <Text style={styles.gameOverTitle}>Quit Game?</Text>
            <Text style={styles.preSubtitle}>Your progress will be lost.</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => this.setState({gamePhase: 'playing'})}>
              <Text style={styles.primaryButtonText}>Keep Playing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryButton, {marginTop: 12}]}
              onPress={onExit}>
              <Text style={styles.secondaryButtonText}>Exit</Text>
            </TouchableOpacity>
          </View>
        )}

        {gamePhase === 'pre' && (
          <View style={styles.overlay}>
            <Text style={styles.preTitle}>Racing Game</Text>
            <Text style={styles.preSubtitle}>
              Tilt your phone to steer.{'\n'}Avoid the other cars!
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={this.startGame}>
              <Text style={styles.primaryButtonText}>Play Game</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={onExit}>
              <Text style={styles.secondaryButtonText}>Exit</Text>
            </TouchableOpacity>
          </View>
        )}

        {gamePhase === 'gameover' && (
          <View style={styles.overlay}>
            <Text style={styles.gameOverTitle}>Game Over</Text>
            <Text style={styles.gameOverScore}>Score: {score}</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={this.startGame}>
              <Text style={styles.primaryButtonText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryButton, {marginTop: 12}]}
              onPress={onExit}>
              <Text style={styles.secondaryButtonText}>Exit</Text>
            </TouchableOpacity>
          </View>
        )}
      </GameEngine>
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
  exitGameButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitGameButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Game Over overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  gameOverTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  gameOverScore: {
    fontSize: 24,
    color: '#aaa',
    marginBottom: 48,
  },
});
