import { useEffect, useRef, useState } from 'react';

export interface ChessTimerState {
  whiteTime: number;
  blackTime: number;
  isRunning: boolean;
  activePlayer: 'white' | 'black' | null;
}

export interface ChessTimerHook extends ChessTimerState {
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: (minutes: number) => void;
  tapTimer: (player: 'white' | 'black') => void;
}

export const useChessTimer = (initialMinutes: number = 5): ChessTimerHook => {
  const initialTimeMs = initialMinutes * 60 * 1000;
  const [whiteTime, setWhiteTime] = useState(initialTimeMs);
  const [blackTime, setBlackTime] = useState(initialTimeMs);
  const [isRunning, setIsRunning] = useState(false);
  const [activePlayer, setActivePlayer] = useState<'white' | 'black' | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning || !activePlayer) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      if (activePlayer === 'white') {
        setWhiteTime((prev) => Math.max(0, prev - 100));
      } else {
        setBlackTime((prev) => Math.max(0, prev - 100));
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, activePlayer]);

  const start = () => {
    setIsRunning(true);
    setActivePlayer('white');
  };

  const pause = () => {
    setIsRunning(false);
  };

  const resume = () => {
    if (activePlayer) {
      setIsRunning(true);
    }
  };

  const reset = (minutes: number) => {
    setIsRunning(false);
    setActivePlayer(null);
    const timeMs = minutes * 60 * 1000;
    setWhiteTime(timeMs);
    setBlackTime(timeMs);
  };

  const tapTimer = (player: 'white' | 'black') => {
    if (!isRunning) {
      start();
      return;
    }

    if (activePlayer === player) {
      return;
    }

    setActivePlayer(player);
  };

  return {
    whiteTime,
    blackTime,
    isRunning,
    activePlayer,
    start,
    pause,
    resume,
    reset,
    tapTimer,
  };
};
