import BalloonLogo from '@/assets/images/balloonlogopink.svg';
import { FontAwesome6 } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

interface TabBarButtonProps {
  focused: boolean;
  icon: string;
  navigation: any;
  route: any;
  home?: boolean;
}

export default function TabBarButton({
  focused,
  icon,
  navigation,
  route,
  home,
}: TabBarButtonProps) {
  const isMoreButton = route.name === 'more';

  const onPress = () => {
    if (isMoreButton) {
      const parentNavigation = navigation.getParent();
      if (parentNavigation) {
        parentNavigation.dispatch(DrawerActions.openDrawer());
      }
    } else {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!focused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  return (
    <TouchableOpacity
      className={`p-2 rounded-full w-[50px] max-w-[50px] h-[50px] flex-1 items-center justify-center ${
        focused ? 'bg-accent' : 'bg-transparent'
      }`}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {home ? (
        <BalloonLogo width={34} height={34} />
      ) : (
        <FontAwesome6
          name={icon}
          size={20}
          color={focused ? '#173885' : '#F6F2A3'}
        />
      )}
    </TouchableOpacity>
  );
}
