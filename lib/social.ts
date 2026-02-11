import { createURL, parse } from 'expo-linking';
import { Router } from 'expo-router';
import {
  WebBrowserRedirectResult,
  openAuthSessionAsync,
} from 'expo-web-browser';
import { User } from 'firebase/auth';

import { auth } from './app';
import { NORTHWESTERN_EMAIL_REGEX } from './auth';
import { Config } from './config';
import { UserState } from './user';

export interface SocialConfig {
  status: 'open' | 'closed' | 'matched';
}

export type SocialPlatform = 'spotify' | 'apple-music';

export async function connect(platform: SocialPlatform) {
  if (!auth.currentUser) {
    throw new Error('not authenticated');
  }
  const userToken = await auth.currentUser.getIdToken();
  const callbackUrl = createURL('/social/complete');
  const result = await openAuthSessionAsync(
    `https://app.dilloday.com/${platform}/connect?redirect_uri=${encodeURIComponent(callbackUrl)}&token=${encodeURIComponent(userToken)}`,
    callbackUrl
  );
  if (result.type !== 'success') {
    throw new Error('operation canceled');
  }
  const { url } = result as WebBrowserRedirectResult;
  const { queryParams } = parse(url);
  if (queryParams?.error) {
    throw new Error(queryParams.error as string);
  }
}

interface SocialNavigateConfig {
  config: Config | null;
  user: User | null;
  userState: UserState | null;
}

export function socialNavigate(
  { config, user, userState }: SocialNavigateConfig,
  router: Router
) {
  if (config?.social.status === 'matched') {
    if (user && userState?.ready) {
      router.navigate('/social/match');
      return true;
    } else {
      return false;
    }
  }
  const open = config?.social.status === 'open';
  if (user && isValidAuthEmail(user.email!)) {
    if (userState) {
      if (userState.ready) {
        router.navigate('/social/complete');
        return true;
      } else {
        if (open) {
          router.navigate('/social/connect');
          return true;
        }
      }
    } else {
      if (open) {
        router.navigate('/social/register');
        return true;
      }
    }
  }
  return false;
}

export function isValidAuthEmail(email: string) {
  return (
    NORTHWESTERN_EMAIL_REGEX.test(email) || email === 'dilloapp2024@gmail.com'
  );
}
