// components/schedule/ScheduleCarousel.tsx
import ScheduleCarouselItem from '@/components/schedule/schedule-carousel-item';
import PageIndicator from '@/components/schedule/schedule-page-indicator';
import { useConfig } from '@/lib/config';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ScheduleCarousel() {
  const { config, reload } = useConfig();
  const [page, setPage] = useState(0);
  const stages = React.useMemo(
    () =>
      Object.values(config?.schedule || {})
        .sort((a, b) => (a.position ?? 99) - (b.position ?? 99)),
    [config]
  );

  const reloadData = () => reload();

  if (!config) {
    return null; // or a loading state
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* render the current stage page */}
      <ScheduleCarouselItem
        stage={stages[page]}
        state="idle"         // or pull in your loading/error state
        refresh={reloadData}
      />

      {/* page dots to jump between stages */}
      <PageIndicator
        page={page}
        total={stages.length}
        onChange={(next) => setPage(next)}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 95,
  },
});
