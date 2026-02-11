// VISION: Y/N button for quiz questions

import React from 'react';
import { Button } from 'react-native';

interface ButtonProps{
  text: string;
  height: string;
  width: string;
  color: string;
  onClick(): () => void;
}

export default function QuizButton({text, height, width, color}:ButtonProps) {
  return(
    <Button style={styles.button}>
      {text}
    </Button>
  );
}


const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 300,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
});
