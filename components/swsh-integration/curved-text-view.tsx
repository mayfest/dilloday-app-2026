import CurvedText from '@/components/swsh-integration/curved-text';
import { View } from 'react-native';

interface CurvedHeaderProps {
  text: string;
  size: number;
}

export function CurvedHeader({ text, size }: CurvedHeaderProps) {
  return (
    <View
      style={{
        width: size,
        alignItems: 'center',
        marginBottom: size * -0.5,
        zIndex: 5,
      }}
    >
      <CurvedText
        text={text}
        fontSize={size * 0.1}
        radius={size / 2 - size * 0.01}
        textColor='#991B1B'
        position='top'
      />
    </View>
  );
}
