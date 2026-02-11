import { randomUUID } from 'expo-crypto';
import { createURL, parse } from 'expo-linking';
import {
  WebBrowserRedirectResult,
  openAuthSessionAsync,
} from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

import { auth } from './app';

export const NORTHWESTERN_EMAIL_REGEX =
  /^[A-Za-z0-9._+-]+@([A-Za-z0-9._+-]+\.)?northwestern\.edu$/;

export async function login() {
  const callbackUrl = createURL('/social');
  const state = randomUUID();
  const result = await openAuthSessionAsync(
    `https://app.dilloday.com/auth?redirect_uri=${callbackUrl}&state=${state}`,
    callbackUrl
  );

  if (result.type !== 'success') {
    return;
  }

  const { url } = result as WebBrowserRedirectResult;
  const { queryParams } = parse(url);
  if (
    !queryParams ||
    queryParams.error ||
    !queryParams.access_token ||
    !queryParams.state ||
    queryParams.state !== state
  ) {
    throw new Error(
      (queryParams?.error as string | undefined) || 'something went wrong'
    );
  }

  const token = queryParams.access_token as string;
  const credential = GoogleAuthProvider.credential(null, token);
  await signInWithCredential(auth, credential);
}

export async function logout() {
  auth.signOut();
}
