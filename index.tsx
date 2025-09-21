import React, { useState, useMemo, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { format, getDay } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './index.css';


// =================================================================================
// TYPE DEFINITIONS
// =================================================================================
enum DayType {
  Weekday = 'Weekday',
  Friday = 'Friday',
  Weekend = 'Weekend'
}

interface Habit {
  id: string;
  name: string;
  weight: number;
  icon: string;
}

type HabitConfigurations = {
  [key in DayType]: Habit[];
};

interface Entry {
  date: string; // YYYY-MM-DD
  scores: { [habitId: string]: number };
  journal: {
    good: string;
    improve: string;
    notes: string;
  };
  totalScore: number;
}

type Entries = {
  [date: string]: Entry;
};


// =================================================================================
// ICONS & CONSTANTS
// =================================================================================
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
const SettingsIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-1.226.554-.22 1.196-.22 1.75 0 .548.219 1.02.684 1.11 1.226l.094.542c.063.375.313.686.663.85.35.165.75.221 1.145.142l.495-.12a2.25 2.25 0 012.006.508c.558.558.825 1.372.464 2.115l-.305.61a2.25 2.25 0 00.313 2.416c.42.455.585 1.08.313 1.637l-.305.61c-.36 1.118.423 2.399 1.583 2.399h.498c.608 0 1.156.33 1.465.848.31.518.31 1.156 0 1.674-.31.518-.857.848-1.465.848h-.498c-1.16 0-1.943 1.28-1.582 2.399l.305.61c.272.556.107 1.182-.313 1.637a2.25 2.25 0 00-.313 2.416l.305.61c.36.743.094 1.557-.464 2.115a2.25 2.25 0 01-2.006.508l-.495-.12a2.25 2.25 0 00-1.145.142c-.35.164-.6.475-.663.85l-.094.542c-.09.542-.56 1.007-1.11 1.226-.554-.22-1.196-.22-1.75 0-.548-.219-1.02-.684-1.11-1.226l-.094-.542a2.25 2.25 0 00-.663-.85c-.395-.185-.795-.129-1.145.142l-.495.12a2.25 2.25 0 01-2.006-.508c-.558-.558-.825-1.372-.464-2.115l.305-.61a2.25 2.25 0 00-.313-2.416c-.42-.455-.585-1.08-.313-1.637l.305.61c.36-1.118-.423-2.399-1.582-2.399H6.387c-.608 0-1.156-.33-1.465-.848-.31-.518-.31-1.156 0-1.674.31-.518.857.848 1.465.848h.498c1.16 0 1.943-1.28 1.583-2.399l-.305-.61a2.25 2.25 0 00-.313-2.416c-.272-.556-.107-1.182.313-1.637l.305-.61c.36-.743.094-1.557-.464-2.115a2.25 2.25 0 01-2.006-.508l-.495.12a2.25 2.25 0 00-1.145-.142c-.35-.164-.6-.475-.663-.85l-.094-.542c-.09-.542-.56-1.007-1.11-1.226-.554-.22-1.196-.22-1.75 0-.548-.219-1.02-.684-1.11-1.226L9.594 3.94z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const ChartBarIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);


const ICONS: { [key: string]: React.ComponentType<{ className?: string }> } = {
    sleep: BedIcon,
    build: UsersIcon,
    eat: PlateIcon,
    work: BriefcaseIcon,
    meditate: BrainIcon,
    workout: DumbbellIcon,
    learn: BookOpenIcon
};

const INITIAL_HABIT_CONFIGS: HabitConfigurations = {
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


// =================================================================================
// UTILITY FUNCTIONS
// =================================================================================
const getDayTypeUtil = (date: Date): DayType => {
  const dayOfWeek = getDay(date); // Sunday is 0, Monday is 1, ...
  if (dayOfWeek === 5) {
    return DayType.Friday;
  }
  if (dayOfWeek === 6 || dayOfWeek === 0) {
    return DayType.Weekend;
  }
  return DayType.Weekday;
};

const calculateTotalScore = (scores: { [habitId: string]: number }, habits: Habit[]): number => {
  if (!habits || habits.length === 0) return 0;

  const totalScore = habits.reduce((acc, habit) => {
    const score = scores[habit.id] || 0;
    const weightedScore = (score / 10) * habit.weight;
    return acc + weightedScore;
  }, 0);
  
  return parseFloat(totalScore.toFixed(2));
};

const getInitialEntry = (dateKey: string, habits: Habit[]): Entry => {
  const initialScores = habits.reduce((acc, habit) => {
    acc[habit.id] = 5; // Default score
    return acc;
  }, {} as { [key: string]: number });
  
  const initialTotalScore = calculateTotalScore(initialScores, habits);

  return {
    date: dateKey,
    scores: initialScores,
    journal: {
      good: '',
      improve: '',
      notes: '',
    },
    totalScore: initialTotalScore,
  };
};

const sanitizeEntry = (entry: Partial<Entry> | undefined, dateKey: string, habits: Habit[]): Entry => {
  const defaultEntry = getInitialEntry(dateKey, habits);
  
  if (!entry) {
    return defaultEntry;
  }

  const sanitizedEntry: Entry = {
    date: entry.date || dateKey,
    scores: { ...defaultEntry.scores, ...(entry.scores || {}) },
    journal: { ...defaultEntry.journal, ...(entry.journal || {}) },
    totalScore: 0, 
  };
  
  sanitizedEntry.totalScore = calculateTotalScore(sanitizedEntry.scores, habits);

  return sanitizedEntry;
};


// =================================================================================
// CUSTOM HOOKS
// =================================================================================
function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      const parsed = item ? JSON.parse(item) : initialValue;

      if (key === 'habitConfigs') {
        const loadedConfigs = parsed as HabitConfigurations;
        const sanitized = { ...initialValue, ...loadedConfigs };

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


// =================================================================================
// COMPONENT DEFINITIONS
// =================================================================================

// --- Header Component ---
interface HeaderProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  onOpenEditor: () => void;
  onOpenReporting: () => void;
}
const Header: React.FC<HeaderProps> = ({ selectedDate, setSelectedDate, onOpenEditor, onOpenReporting }) => {
  return (
    <header className="bg-navy shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
          SR's Daily Habit Tracker
        </h1>
        <div className="flex items-center space-x-2 md:space-x-4">
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(`${e.target.value}T00:00:00`))}
            className="bg-slate-200 text-navy rounded-lg p-2 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            aria-label="Select Date"
          />
          <button onClick={onOpenReporting} className="p-2 rounded-full text-white hover:bg-white/20 transition duration-200" aria-label="Open Reporting">
            <ChartBarIcon className="h-6 w-6"/>
          </button>
          <button onClick={onOpenEditor} className="p-2 rounded-full text-white hover:bg-white/20 transition duration-200" aria-label="Open Habit Editor">
            <SettingsIcon className="h-6 w-6"/>
          </button>
        </div>
      </div>
    </header>
  );
};


// --- Scorecard Component ---
interface ScorecardProps {
  entry: Entry;
  habits: Habit[];
  onEntryChange: (updatedEntry: Partial<Entry>) => void;
  dayType: DayType;
}
const Scorecard: React.FC<ScorecardProps> = ({ entry, habits, onEntryChange, dayType }) => {
  const totalScore = entry.totalScore;
  const handleScoreChange = useCallback((habitId: string, newScore: number) => {
    const updatedScores = {
      ...entry.scores,
      [habitId]: newScore,
    };
    onEntryChange({ scores: updatedScores });
  }, [entry.scores, onEntryChange]);

  const getDayTypeColor = (day: DayType) => {
    switch(day) {
        case DayType.Friday: return 'text-blue-500';
        case DayType.Weekend: return 'text-green-500';
        default: return 'text-navy';
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 h-fit">
      <div className="flex justify-between items-center border-b-2 border-light-gray pb-4">
        <h2 className="text-2xl font-bold text-navy">Daily Scorecard</h2>
        <div className="text-right">
            <span className={`text-lg font-semibold ${getDayTypeColor(dayType)}`}>{dayType}</span>
            <p className="text-4xl font-extrabold text-red tracking-tight">{totalScore}<span className="text-2xl text-slate-400">/100</span></p>
        </div>
      </div>
      <div className="space-y-6">
        {habits.map((habit) => {
          const Icon = ICONS[habit.icon];
          const score = entry.scores[habit.id] ?? 5;
          return (
            <div key={habit.id}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-3">
                  {Icon && <Icon className="h-6 w-6 text-navy" />}
                  <span className="font-semibold text-lg">{habit.name}</span>
                  <span className="text-sm text-slate-500">({habit.weight}%)</span>
                </div>
                <span className="text-lg font-bold text-navy bg-light-gray px-3 py-1 rounded-md">{score}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={score}
                onChange={(e) => handleScoreChange(habit.id, parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};


// --- Diary Component ---
interface DiaryProps {
  entry: Entry;
  onEntryChange: (updatedEntry: Partial<Entry>) => void;
}
const Diary: React.FC<DiaryProps> = ({ entry, onEntryChange }) => {
  const handleJournalChange = useCallback((field: 'good' | 'improve' | 'notes', value: string) => {
    const updatedJournal = {
      ...entry.journal,
      [field]: value,
    };
    onEntryChange({ journal: updatedJournal });
  }, [entry.journal, onEntryChange]);
  
  const journalPrompts = [
    { id: 'good', label: 'What I felt good about?', value: entry.journal.good },
    { id: 'improve', label: 'What did I learn and can improve on?', value: entry.journal.improve },
    { id: 'notes', label: 'Other notes', value: entry.journal.notes },
  ] as const;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="border-b-2 border-light-gray pb-4">
        <h2 className="text-2xl font-bold text-navy">Daily Journal</h2>
      </div>
      <div className="space-y-6">
        {journalPrompts.map(prompt => (
          <div key={prompt.id}>
            <label htmlFor={prompt.id} className="block text-lg font-semibold text-navy mb-2">
              {prompt.label}
            </label>
            <textarea
              id={prompt.id}
              rows={5}
              className="w-full p-3 bg-white text-navy border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition duration-200"
              placeholder="Your thoughts..."
              value={prompt.value}
              onChange={(e) => handleJournalChange(prompt.id, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};


// --- HabitEditorModal Component ---
interface HabitEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfigs: HabitConfigurations;
  onSave: (updatedConfigs: HabitConfigurations) => void;
}
const HabitEditorModal: React.FC<HabitEditorModalProps> = ({ isOpen, onClose, currentConfigs, onSave }) => {
  const [editedConfigs, setEditedConfigs] = useState(currentConfigs);
  const [selectedDayType, setSelectedDayType] = useState<DayType>(DayType.Weekday);

  const handleHabitChange = (index: number, field: keyof Habit, value: any) => {
    const newHabits = [...editedConfigs[selectedDayType]];
    (newHabits[index] as any)[field] = value;

    if (field === 'weight') {
      newHabits[index].weight = Number(value);
    }
    
    setEditedConfigs(prev => ({ ...prev, [selectedDayType]: newHabits }));
  };

  const totalWeight = useMemo(() => {
    const habitsForDay = editedConfigs[selectedDayType] || [];
    return habitsForDay.reduce((sum, habit) => sum + habit.weight, 0);
  }, [editedConfigs, selectedDayType]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (totalWeight !== 100) {
      alert('Total weight must be exactly 100%.');
      return;
    }
    onSave(editedConfigs);
  };
  
  const dayTypes = [DayType.Weekday, DayType.Friday, DayType.Weekend];
  const habitsToDisplay = editedConfigs[selectedDayType] || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-navy">Habit Editor</h2>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Configuration for:</label>
            <div className="flex space-x-2 rounded-lg bg-light-gray p-1">
              {dayTypes.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDayType(day)}
                  className={`w-full py-2 px-4 rounded-md text-sm font-medium transition ${selectedDayType === day ? 'bg-navy text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {habitsToDisplay.map((habit, index) => {
              const Icon = ICONS[habit.icon];
              return (
                <div key={habit.id} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-1">
                    {Icon && <Icon className="h-6 w-6 text-navy" />}
                  </div>
                  <div className="col-span-7">
                    <input
                      type="text"
                      value={habit.name}
                      onChange={(e) => handleHabitChange(index, 'name', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-md"
                    />
                  </div>
                  <div className="col-span-4">
                     <div className="relative">
                       <input
                          type="number"
                          value={habit.weight}
                          onChange={(e) => handleHabitChange(index, 'weight', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-md pr-7"
                          min="0"
                          max="100"
                        />
                       <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">%</span>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-6 border-t mt-auto flex justify-between items-center bg-light-gray rounded-b-lg">
          <div className="font-bold text-lg">
            Total Weight: 
            <span className={totalWeight === 100 ? 'text-green-600' : 'text-red'}>
              {' '}{totalWeight}%
            </span>
          </div>
          <div className="flex space-x-4">
            <button onClick={onClose} className="py-2 px-6 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition">Cancel</button>
            <button onClick={handleSave} className="py-2 px-6 bg-navy text-white rounded-lg hover:opacity-90 transition disabled:opacity-50" disabled={totalWeight !== 100}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- ReportingModal Component ---
interface ReportingModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: Entries;
  habitConfigs: HabitConfigurations;
}
const ReportingModal: React.FC<ReportingModalProps> = ({ isOpen, onClose, entries, habitConfigs }) => {
  const analytics = useMemo(() => {
    const entryKeys = Object.keys(entries);
    if (entryKeys.length === 0) {
      return {
        overallAverage: 0,
        weekdayAverage: 0,
        weekendAverage: 0,
        byHabit: [],
      };
    }

    const sanitizedEntries = entryKeys.map(dateKey => {
        const entry = entries[dateKey];
        const date = new Date(`${dateKey}T00:00:00`); 
        const dayType = getDayTypeUtil(date);
        const habitsForDay = habitConfigs[dayType] || [];
        return sanitizeEntry(entry, dateKey, habitsForDay);
    });

    const groupedByDayType = sanitizedEntries.reduce((acc, entry) => {
      const dayType = getDayTypeUtil(new Date(`${entry.date}T00:00:00`));
      const key = (dayType === DayType.Weekday || dayType === DayType.Friday) ? 'weekday' : 'weekend';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(entry.totalScore);
      return acc;
    }, { weekday: [] as number[], weekend: [] as number[] });
    
    const weekdayScores = groupedByDayType.weekday;
    const weekendScores = groupedByDayType.weekend;

    const weekdayAverage = weekdayScores.length > 0 ? weekdayScores.reduce((a, b) => a + b, 0) / weekdayScores.length : 0;
    const weekendAverage = weekendScores.length > 0 ? weekendScores.reduce((a, b) => a + b, 0) / weekendScores.length : 0;

    const overallAverage = sanitizedEntries.reduce((sum, entry) => sum + entry.totalScore, 0) / sanitizedEntries.length;

    const habitScores: { [habitId: string]: { scores: number[], count: number } } = {};
    for (const entry of sanitizedEntries) {
        const dayType = getDayTypeUtil(new Date(`${entry.date}T00:00:00`));
        const habitsForDay = habitConfigs[dayType] || [];
        for (const habit of habitsForDay) {
            if (!habitScores[habit.id]) {
                habitScores[habit.id] = { scores: [], count: 0 };
            }
            if (entry.scores[habit.id] !== undefined) {
                habitScores[habit.id].scores.push(entry.scores[habit.id]);
                habitScores[habit.id].count++;
            }
        }
    }
    
    const allHabitsMap = new Map<string, { name: string }>();
    Object.values(habitConfigs).flat().forEach((habit: Habit) => {
        if (!allHabitsMap.has(habit.id)) {
            allHabitsMap.set(habit.id, { name: habit.name });
        }
    });
    
    const byHabit = Array.from(allHabitsMap.entries()).map(([id, { name }]) => {
        const data = habitScores[id];
        const average = data && data.count > 0 ? data.scores.reduce((a, b) => a + b, 0) / data.count : 0;
        return {
            name: name,
            'Average Score': parseFloat(average.toFixed(2)),
        };
    });

    return {
      overallAverage: parseFloat(overallAverage.toFixed(2)),
      weekdayAverage: parseFloat(weekdayAverage.toFixed(2)),
      weekendAverage: parseFloat(weekendAverage.toFixed(2)),
      byHabit,
    };
  }, [entries, habitConfigs]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-navy">Analytics Dashboard</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-light-gray p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-600">Overall Average</h3>
                    <p className="text-4xl font-bold text-navy">{analytics.overallAverage}</p>
                </div>
                <div className="bg-light-gray p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-600">Weekday Average</h3>
                    <p className="text-4xl font-bold text-navy">{analytics.weekdayAverage}</p>
                </div>
                <div className="bg-light-gray p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-600">Weekend Average</h3>
                    <p className="text-4xl font-bold text-red">{analytics.weekendAverage}</p>
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-inner">
                <h3 className="text-xl font-bold text-navy mb-4">Average Score by Habit</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.byHabit} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Average Score" fill="#1D3557" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};


// =================================================================================
// MAIN APP COMPONENT
// =================================================================================
function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habitConfigs, setHabitConfigs] = useLocalStorage<HabitConfigurations>('habitConfigs', INITIAL_HABIT_CONFIGS);
  const [entries, setEntries] = useLocalStorage<Entries>('journalEntries', {});

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isReportingOpen, setIsReportingOpen] = useState(false);

  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const dayType = getDayTypeUtil(selectedDate);
  
  const habitsForSelectedDay = useMemo(() => habitConfigs[dayType] || [], [habitConfigs, dayType]);

  const currentEntry = useMemo(() => {
    return sanitizeEntry(entries[selectedDateKey], selectedDateKey, habitsForSelectedDay);
  }, [entries, selectedDateKey, habitsForSelectedDay]);

  const handleEntryChange = useCallback((updatedEntry: Partial<Entry>) => {
    setEntries(prevEntries => {
      const entryToUpdate = sanitizeEntry(prevEntries[selectedDateKey], selectedDateKey, habitsForSelectedDay);
      
      const newEntryData = {
        ...entryToUpdate,
        ...updatedEntry,
      };

      if (updatedEntry.scores) {
        newEntryData.totalScore = calculateTotalScore(newEntryData.scores, habitsForSelectedDay);
      }
      
      return {
        ...prevEntries,
        [selectedDateKey]: newEntryData,
      };
    });
  }, [setEntries, selectedDateKey, habitsForSelectedDay]);

  const handleHabitConfigSave = (updatedConfigs: HabitConfigurations) => {
    setHabitConfigs(updatedConfigs);
    setIsEditorOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-light-gray text-navy font-sans antialiased">
      <Header
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onOpenEditor={() => setIsEditorOpen(true)}
        onOpenReporting={() => setIsReportingOpen(true)}
      />

      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Scorecard
            entry={currentEntry}
            habits={habitsForSelectedDay}
            onEntryChange={handleEntryChange}
            dayType={dayType}
          />
          <Diary
            entry={currentEntry}
            onEntryChange={handleEntryChange}
          />
        </div>
      </main>

      <HabitEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        currentConfigs={habitConfigs}
        onSave={handleHabitConfigSave}
      />
      
      <ReportingModal
        isOpen={isReportingOpen}
        onClose={() => setIsReportingOpen(false)}
        entries={entries}
        habitConfigs={habitConfigs}
      />
    </div>
  );
}


// =================================================================================
// RENDER APPLICATION
// =================================================================================
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
