'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { GameMode } from '@/lib/types';

interface QuizContextValue {
  player: string;
  setPlayer: (name: string) => void;
  mode: GameMode;
  setMode: (mode: GameMode) => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [player, setPlayerState] = useState('');
  const [mode, setModeState] = useState<GameMode>('solo');

  useEffect(() => {
    const savedPlayer = sessionStorage.getItem('qh_player');
    const savedMode   = sessionStorage.getItem('qh_mode') as GameMode | null;
    if (savedPlayer) setPlayerState(savedPlayer);
    if (savedMode)   setModeState(savedMode);
  }, []);

  function setPlayer(name: string) {
    setPlayerState(name);
    sessionStorage.setItem('qh_player', name);
  }

  function setMode(m: GameMode) {
    setModeState(m);
    sessionStorage.setItem('qh_mode', m);
  }

  return (
    <QuizContext.Provider value={{ player, setPlayer, mode, setMode }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within <QuizProvider>');
  return ctx;
}
