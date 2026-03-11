import { useRouter } from 'expo-router';
import World from '../../racing-game-src/World';

export default function RacingGameScreen() {
  const router = useRouter();
  return <World onExit={() => router.back()} />;
}
