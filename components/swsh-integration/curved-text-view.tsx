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
        marginBottom: -176,
        zIndex: 5,
      }}
    >
      <CurvedText
        text={text}
        fontSize={size * 0.10417}
        radius={size / 2 - size * 0.01}
        textColor='#991B1B'
        position='top'
      />
    </View>
  );
}

