import { useState, useEffect } from 'react';
import type { HabitConfigurations, DayType } from '../types';

export function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      const parsed = item ? JSON.parse(item) : initialValue;

      // Self-healing for habitConfigs to prevent crashes from old/malformed data.
      if (key === 'habitConfigs') {
        const loadedConfigs = parsed as HabitConfigurations;
        // Ensure all day types exist by merging with the initial default config.
        // This adds missing day types (like 'Friday') without overwriting existing ones.
        const sanitized = { ...initialValue, ...loadedConfigs };

        // Additionally, check each day's habit array for the old data format (icon as component)
        // and reset only that specific day if it's malformed.
        Object.keys(sanitized).forEach(key => {
          const day = key as DayType;
          const habits = sanitized[day];
          if (Array.isArray(habits) && habits.length > 0 && typeof habits[0]?.icon !== 'string') {
            console.warn(`Old habit config format for ${day} detected. Resetting this day to default.`);
            sanitized[day] = (initialValue as HabitConfigurations)[day];
          }
        });
        return sanitized as T;
      }
      
      return parsed;

    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const valueToStore = JSON.stringify(storedValue);
        window.localStorage.setItem(key, valueToStore);
      } catch (error) {
        console.error(error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}