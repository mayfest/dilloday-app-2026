import React, { useEffect, useState } from 'react';

import DrawerScreen from '@/components/drawer-screen';
import LineupComingSoonModal from '@/components/schedule/lineup-coming-soon';
import ScheduleCarousel from '@/components/schedule/schedule-carousel';
import { useConfig } from '@/lib/config';
import { useFocusEffect } from '@react-navigation/native';

export default function ScheduleScreen() {
  const { config } = useConfig();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Check lineup availability each time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      checkLineupAvailability();

      // No cleanup needed for this effect
      return () => {};
    }, [config])
  );

  // Also check on initial load and config changes`
  useEffect(() => {
    checkLineupAvailability();
  }, [config]);

  // Function to check if the lineup is available
  const checkLineupAvailability = () => {
    if (config?.schedule) {
      const stages = Object.values(config.schedule);
      if (stages.length > 0) {
        // Check if all artists across all stages are unavailable
        const allUnavailable = stages.every((stage) => {
          if (stage.artists.length === 0) return true;
          return stage.artists.every((artistId) => {
            const artist = config.artists[artistId];
            return !artist || !artist.available;
          });
        });

        // Show modal if all artists are unavailable
        setModalVisible(allUnavailable);
      }
    }
  };

  const handlePageChange = (index) => {
    setCurrentIndex(index);
  };

  // Handle modal close (but we won't immediately set it to false anymore)
  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <DrawerScreen>
      <ScheduleCarousel
        onPageChange={handlePageChange}
        currentIndex={currentIndex}
      />
      <LineupComingSoonModal
        visible={modalVisible}
        onClose={handleModalClose}
      />
    </DrawerScreen>
  );
}
