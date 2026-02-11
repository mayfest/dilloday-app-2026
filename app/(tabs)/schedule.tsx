// import ScheduleBackground from '@/components/schedule/schedule-background';
import ScheduleCarousel from '@/components/schedule/schedule-carousel';
import TabScreen from '@/components/tab-screen';

export default function ScheduleScreen() {
  return (
    <TabScreen>
      {/* <ScheduleBackground /> */}
      <ScheduleCarousel />
    </TabScreen>
  );
}
