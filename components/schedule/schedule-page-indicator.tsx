import { StyleSheet, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#fef3e5',
  },
  item: {
    width: 48,
    height: 8,
    backgroundColor: '#172b59',
    borderRadius: 8,
    marginHorizontal: 4,
  },
});

interface PageIndicatorProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

export default function PageIndicator({
  page,
  total,
  onChange,
}: PageIndicatorProps) {
  const items = [];
  for (let i = 0; i < total; i++) {
    items.push(
      <View
        style={[styles.item, { opacity: i === page ? 1 : 0.25 }]}
        key={`pi-${i}`}
      />
    );
  }
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onChange(page + 1 >= total ? 0 : page + 1)}
    >
      {items}
    </TouchableOpacity>
  );
}
