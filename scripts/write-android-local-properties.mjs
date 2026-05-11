#!/usr/bin/env node
/**
 * Writes android/local.properties with sdk.dir so Gradle finds the SDK
 * when ANDROID_HOME is unset. Re-run after `expo prebuild --clean`.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const androidDir = path.join(process.cwd(), 'android');
const out = path.join(androidDir, 'local.properties');

const fromEnv = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
const candidates = [
  fromEnv,
  path.join(os.homedir(), 'Library', 'Android', 'sdk'),
  path.join(os.homedir(), 'Android', 'Sdk'),
].filter(Boolean);

const sdkDir = candidates.find((p) => {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
});

if (!sdkDir) {
  console.error(
    'Could not find Android SDK. Install Android Studio (SDK) or set ANDROID_HOME, then re-run.'
  );
  process.exit(1);
}

if (!fs.existsSync(androidDir)) {
  console.error('No android/ folder. Run npx expo prebuild first.');
  process.exit(1);
}

const content = `sdk.dir=${sdkDir.replace(/\\/g, '/')}\n`;
fs.writeFileSync(out, content, 'utf8');
console.log(`Wrote ${out}\nsdk.dir=${sdkDir}`);
