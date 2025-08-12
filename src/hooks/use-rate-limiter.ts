'use client';

import { useState, useCallback, useRef } from 'react';

type UseRateLimiterOptions = {
  maxCalls: number;
  timeWindow: number; // in milliseconds
};

export function useRateLimiter({ maxCalls, timeWindow }: UseRateLimiterOptions) {
  const [isLimited, setIsLimited] = useState(false);
  const callTimestamps = useRef<number[]>([]);

  const checkAndRecordCall = useCallback(() => {
    const now = Date.now();

    // Filter out timestamps that are outside the time window
    callTimestamps.current = callTimestamps.current.filter(
      (timestamp) => now - timestamp < timeWindow
    );

    if (callTimestamps.current.length >= maxCalls) {
      setIsLimited(true);
      return false; // Rate limit exceeded
    }

    callTimestamps.current.push(now);
    setIsLimited(false);
    return true; // Allowed
  }, [maxCalls, timeWindow]);

  const execute = (fn: () => void) => {
    if (checkAndRecordCall()) {
      fn();
    } else {
        // Optionally, you could have a callback here to show a toast or message
    }
  };

  return { isLimited, execute, check: checkAndRecordCall };
}
