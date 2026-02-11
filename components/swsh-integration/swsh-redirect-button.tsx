import { Linking, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface SwshRedirectButtonProps {
  text: string;
  url: string;
}

export function SwshRedirectButton({ text, url }: SwshRedirectButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => Linking.openURL(url)}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    backgroundColor: '#FCD34D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
});
