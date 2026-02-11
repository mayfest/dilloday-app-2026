// import ScheduleBackground from '@/components/schedule/schedule-background';
import DrawerScreen from '@/components/drawer-screen';
import ScheduleCarousel from '@/components/schedule/schedule-carousel';

export default function ScheduleScreen() {
  return (
    <DrawerScreen>
      {/* <ScheduleBackground /> */}
      <ScheduleCarousel />
    </DrawerScreen>
  );
}
