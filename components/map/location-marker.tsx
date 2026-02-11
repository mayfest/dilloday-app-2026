import React from 'react';

import { Colors } from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type IconType =
  | 'truck'
  | 'store'
  | 'restroom'
  | 'door-open'
  | 'record-vinyl'
  | 'tent'
  | 'briefcase-medical'
  | 'water'
  | 'door-closed'
  | 'magnifying-glass-location'
  | 'ticket-simple'
  | 'person-booth'
  | 'id-card'
  | 'users'
  | 'exit'
  | 'food';
interface Props {
  icon: IconType;
  label?: string;
  selected?: boolean;
}

const ICON_SIZE = 20;
export default function IconMarker({ icon, label, selected = false }: Props) {
  return (
    <View style={[styles.container, selected && styles.selected]}>
      <FontAwesome5 name={icon} size={ICON_SIZE} solid color={'#fff'} />
      {label != null && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 6,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
  },
  selected: {
    backgroundColor: Colors.light.action,
    color: '#fff',
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    textAlign: 'center',
    color: '#fff',
  },
});
