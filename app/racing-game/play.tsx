import World from '../../racing-game-src/World';
import { useLocalSearchParams } from 'expo-router';

export type RacingMode = 'practice' | 'scored';

export default function RacingGamePlayScreen() {
  const { nonce, mode } = useLocalSearchParams<{
    nonce?: string;
    mode?: string;
  }>();
  const remountKey = nonce ?? 'initial';
  const racingMode: RacingMode = mode === 'practice' ? 'practice' : 'scored';

  return <World key={remountKey} mode={racingMode} />;
}
