import type React from 'react';

export enum DayType {
  Weekday = 'Weekday',
  Friday = 'Friday',
  Weekend = 'Weekend'
}

export interface Habit {
  id: string;
  name: string;
  weight: number;
  icon: string; // Changed from ComponentType to string
}

export type HabitConfigurations = {
  [key in DayType]: Habit[];
};

export interface Entry {
  date: string; // YYYY-MM-DD
  scores: { [habitId: string]: number };
  journal: {
    good: string;
    improve: string;
    notes: string;
  };
  totalScore: number;
}

export type Entries = {
  [date: string]: Entry;
};