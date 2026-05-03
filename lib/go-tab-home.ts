import { CommonActions } from '@react-navigation/native';
import type { NavigationAction } from '@react-navigation/native';
import { router } from 'expo-router';

/**
 * Open the main home screen (drawer → tabs → home stack → index).
 * Uses nested navigation so the drawer + tab + stack state stay consistent.
 */
export function goToTabHome(
  dispatch: (action: NavigationAction) => void,
  options: { preferBack?: boolean } = {}
) {
  if (options.preferBack && router.canGoBack()) {
    router.back();
    return;
  }
  dispatch(
    CommonActions.navigate({
      name: '(tabs)',
      params: {
        screen: 'index',
        params: {
          screen: 'index',
        },
      },
    })
  );
}
