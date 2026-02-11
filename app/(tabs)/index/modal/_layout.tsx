import React from 'react';

import { DilloSonaProvider } from '@/contexts/dillo-sona-context';
import { Slot } from 'expo-router';

export default function ModalLayout() {
  return (
    <DilloSonaProvider>
      <Slot />
    </DilloSonaProvider>
  );
}
