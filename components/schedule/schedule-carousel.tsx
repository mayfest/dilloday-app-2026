import React, { useRef, useState } from 'react';

import ScheduleCarouselItem from '@/components/schedule/schedule-carousel-item';
import PageIndicator from '@/components/schedule/schedule-page-indicator';
import { useConfig } from '@/lib/config';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

// import LoadingIndicator from './LoadingIndicator';

const PAGE_WIDTH = Dimensions.get('window').width;

export default function ScheduleCarousel() {
  const { config, reload } = useConfig();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<'loading' | 'error' | 'idle'>('idle');
  const ref = useRef<ICarouselInstance>(null);
  const load = () => {
    setState('loading');
    reload()
      .then(() => setState('idle'))
      .catch(() => setState('error'));
  };

  return (
    <View style={styles.container}>
      {config && (
        <>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Carousel
              ref={ref}
              width={PAGE_WIDTH}
              data={Object.values(config.schedule || {}).sort(
                (a, b) => (a.position || 99) - (b.position || 100)
              )}
              loop={false}
              onSnapToItem={(index) => setCurrentIndex(index)}
              pagingEnabled
              overscrollEnabled={true}
              mode='parallax'
              modeConfig={{
                parallaxScrollingScale: 1,
                parallaxAdjacentItemScale: 0.8,
                parallaxScrollingOffset: 90,
              }}
              renderItem={({ item }) => (
                <ScheduleCarouselItem
                  stage={item}
                  state={state}
                  refresh={() => load()}
                />
              )}
            />
            <PageIndicator
              page={currentIndex}
              total={2}
              onChange={(page) => {
                setCurrentIndex(page);
                ref.current?.scrollTo({ index: page, animated: true });
              }}
            />
          </GestureHandlerRootView>
        </>
      )}
      {/* {state === 'loading' && !config && <LoadingIndicator />} */}
      {state === 'loading' && (
        <Text style={styles.text}>Loading schedule...</Text>
      )}
      {state === 'error' && (
        <Text style={styles.text}>
          No internet connection. Swipe down to refresh.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
