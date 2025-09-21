import React from 'react';
import type { HabitConfigurations } from './types';
import { DayType } from './types';

const BedIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);

const UsersIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.513-.513.47-1.374.04-1.886a11.942 11.942 0 01-2.583-6.585 3 3 0 01.36-1.352c.24-.622.585-1.183 1.03-1.663.445-.48 1.003-.896 1.613-1.175a6.042 6.042 0 012.235-.672 6.042 6.042 0 012.235.672c.61.279 1.168.695 1.613 1.175.445.48.79.94.98 1.572a3 3 0 01.36 1.352 11.942 11.942 0 01-2.583 6.585c-.43.512-.473 1.373.04 1.886m-7.5-2.962a3.752 3.752 0 00-3.693 3.693c0 1.21.636 2.302 1.693 2.922" />
  </svg>
);

const PlateIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75v16.5M2.25 12h19.5M6.375 6.375l11.25 11.25M6.375 17.625l11.25-11.25" />
  </svg>
);

const BriefcaseIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.07a2.25 2.25 0 01-2.25 2.25H5.92a2.25 2.25 0 01-2.25-2.25v-4.07a2.25 2.25 0 01.92-1.758l3.097-2.065a2.25 2.25 0 012.18-.014l1.39.927a2.25 2.25 0 002.34 0l1.39-.927a2.25 2.25 0 012.18.014l3.097 2.065a2.25 2.25 0 01.92 1.758z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75h.008v.008h-.008v-.008z" />
  </svg>
);

const BrainIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.502L16.5 21.75l-.398-1.248a3.375 3.375 0 00-2.456-2.456L12.75 18l1.248-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.248a3.375 3.375 0 002.456 2.456l1.248.398-1.248.398a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

const DumbbellIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.828 3.072c.983.337 1.95.83 2.848 1.458.898.628 1.705 1.41 2.42 2.302M17.172 20.928c-.983-.337-1.95-.83-2.848-1.458-.898-.628-1.705-1.41-2.42-2.302" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.332 9.467c-.247-.367-.478-.748-.692-1.141L3.072 2.055a1.125 1.125 0 00-1.591 1.591l6.271 6.271c.393.393.85.73 1.337.994M12.668 14.533c.247.367.478.748.692 1.141l6.271 6.271a1.125 1.125 0 001.591-1.591l-6.271-6.271c-.393-.393-.85-.73-1.337-.994" />
  </svg>
);

const BookOpenIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);


export const ICONS: { [key: string]: React.ComponentType<{ className?: string }> } = {
    sleep: BedIcon,
    build: UsersIcon,
    eat: PlateIcon,
    work: BriefcaseIcon,
    meditate: BrainIcon,
    workout: DumbbellIcon,
    learn: BookOpenIcon
};

export const INITIAL_HABIT_CONFIGS: HabitConfigurations = {
  [DayType.Weekday]: [
    { id: 'sleep', name: 'Sleep', weight: 25, icon: 'sleep' },
    { id: 'build', name: 'Build & Nurture', weight: 15, icon: 'build' },
    { id: 'eat', name: 'Eat', weight: 10, icon: 'eat' },
    { id: 'work', name: 'Work', weight: 15, icon: 'work' },
    { id: 'meditate', name: 'Meditate', weight: 20, icon: 'meditate' },
    { id: 'workout', name: 'Workout', weight: 10, icon: 'workout' },
    { id: 'learn', name: 'Learn', weight: 5, icon: 'learn' },
  ],
  [DayType.Friday]: [
    { id: 'sleep', name: 'Sleep', weight: 25, icon: 'sleep' },
    { id: 'build', name: 'Build & Nurture', weight: 20, icon: 'build' },
    { id: 'eat', name: 'Eat', weight: 5, icon: 'eat' },
    { id: 'work', name: 'Work', weight: 15, icon: 'work' },
    { id: 'meditate', name: 'Meditate', weight: 20, icon: 'meditate' },
    { id: 'workout', name: 'Workout', weight: 10, icon: 'workout' },
    { id: 'learn', name: 'Learn', weight: 5, icon: 'learn' },
  ],
  [DayType.Weekend]: [
    { id: 'sleep', name: 'Sleep', weight: 20, icon: 'sleep' },
    { id: 'build', name: 'Build & Nurture', weight: 20, icon: 'build' },
    { id: 'eat', name: 'Eat', weight: 5, icon: 'eat' },
    { id: 'work', name: 'Work', weight: 5, icon: 'work' },
    { id: 'meditate', name: 'Meditate', weight: 20, icon: 'meditate' },
    { id: 'workout', name: 'Workout', weight: 15, icon: 'workout' },
    { id: 'learn', name: 'Learn', weight: 15, icon: 'learn' },
  ],
};