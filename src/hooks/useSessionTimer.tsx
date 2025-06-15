
import { useState, useEffect } from 'react';

interface UseSessionTimerProps {
  timeLimit: number; // in milliseconds
  onTimeExpired: () => void;
}

export const useSessionTimer = ({ timeLimit, onTimeExpired }: UseSessionTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1000) {
            onTimeExpired();
            setIsActive(false);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, onTimeExpired]);

  const startTimer = () => {
    setIsActive(true);
  };

  const resetTimer = () => {
    setTimeRemaining(timeLimit);
    setIsActive(false);
  };

  const formatTime = () => {
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    timeRemaining,
    isActive,
    startTimer,
    resetTimer,
    formatTime,
  };
};
