import React, { ReactNode, createContext, useContext, useState } from 'react';

export type CardKey = 'moon' | 'sun' | 'chariot' | 'lovers' | 'fool';

interface TallyContextValue {
  tally: Record<CardKey, number>;
  add: (card: CardKey, amount?: number) => void;
  skipLoading: boolean;
  setSkipLoading: (skip: boolean) => void;
}

const initialTally: Record<CardKey, number> = {
  moon: 0,
  sun: 0,
  chariot: 0,
  lovers: 0,
  fool: 0,
};

const DilloSonaContext = createContext<TallyContextValue | null>(null);

export function DilloSonaProvider({ children }: { children: ReactNode }) {
  const [tally, setTally] = useState<Record<CardKey, number>>(initialTally);
  const [skipLoading, setSkipLoading] = useState(false);

  function add(card: CardKey, amount = 1) {
    setTally((t) => ({ ...t, [card]: t[card] + amount }));
  }

  return (
    <DilloSonaContext.Provider
      value={{ tally, add, skipLoading, setSkipLoading }}
    >
      {children}
    </DilloSonaContext.Provider>
  );
}

export function useDilloSona() {
  const ctx = useContext(DilloSonaContext);
  if (!ctx) throw new Error('useDilloSona must be inside DilloSonaProvider');
  return ctx;
}
