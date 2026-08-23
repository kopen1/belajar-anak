import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage<T extends object>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? { ...initialValue, ...JSON.parse(saved) } : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);
  return [value, setValue, reset] as const;
}
