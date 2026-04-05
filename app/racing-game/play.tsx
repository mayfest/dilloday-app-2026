import World from '../../racing-game-src/World';
import { useLocalSearchParams } from 'expo-router';

/**
 * Actual game. `nonce` remounts World after each run (e.g. from game-over "Play again"
 * after going through the lobby, or when starting fresh).
 */
export default function RacingGamePlayScreen() {
  const { nonce } = useLocalSearchParams<{ nonce?: string }>();
  const remountKey = nonce ?? 'initial';

  return <World key={remountKey} />;
}
