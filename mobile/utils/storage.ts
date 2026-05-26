import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

export function useStorage<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        }
      } catch (e) {
        console.warn(`Failed to load ${key}:`, e);
      }
      setLoaded(true);
    })();
  }, [key]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const nextValue = value instanceof Function ? value(prev) : value;
      AsyncStorage.setItem(key, JSON.stringify(nextValue)).catch(e =>
        console.warn(`Failed to save ${key}:`, e)
      );
      return nextValue;
    });
  }, [key]);

  return [storedValue, setValue, loaded];
}
