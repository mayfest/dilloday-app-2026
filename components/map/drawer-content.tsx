import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

const DrawerContent = ({ type }) => {
  const getLocationInfo = (type) => {
    switch (type) {
      case 'main':
        return {
          title: 'Main Stage',
          description:
            'The heart of Dillo Day featuring headliners and major acts',
          time: '12:00 PM - 10:00 PM',
          details: [
            'Live performances',
            'Professional sound system',
            'Light show',
          ],
        };
      case 'fmo':
        return {
          title: 'FMO Stage',
          description: 'Second stage featuring rising artists and local talent',
          time: '1:00 PM - 8:00 PM',
          details: ['Student performances', 'Local bands', 'DJ sets'],
        };
      case 'food':
        return {
          title: 'Food Court',
          description: 'Various food vendors and refreshments',
          time: '11:00 AM - 9:00 PM',
          details: ['Food trucks', 'Beverages', 'Seating area'],
        };
      default:
        return {
          title: '',
          description: '',
          time: '',
          details: [],
        };
    }
  };

  const locationInfo = getLocationInfo(type);

  return (
    <View style={styles.container}>
      <View style={styles.drawerHandle} />
      <Text style={styles.title}>{locationInfo.title}</Text>
      <Text style={styles.time}>{locationInfo.time}</Text>
      <Text style={styles.description}>{locationInfo.description}</Text>
      <View style={styles.detailsContainer}>
        {locationInfo.details.map((detail, index) => (
          <View key={index} style={styles.detailItem}>
            <Text style={styles.detailText}>• {detail}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  drawerHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#173885',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#173885',
    marginBottom: 8,
  },
  time: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 24,
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 8,
  },
});

export default DrawerContent;
