
import React, { useState, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_HABIT_CONFIGS } from './constants';
import { getDayType, calculateTotalScore, sanitizeEntry } from './utils';
import type { HabitConfigurations, Entries, DayType, Entry, Habit } from './types';
import Header from './components/Header';
import Scorecard from './components/Scorecard';
import Diary from './components/Diary';
import HabitEditorModal from './components/HabitEditorModal';
import ReportingModal from './components/ReportingModal';

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habitConfigs, setHabitConfigs] = useLocalStorage<HabitConfigurations>('habitConfigs', INITIAL_HABIT_CONFIGS);
  const [entries, setEntries] = useLocalStorage<Entries>('journalEntries', {});

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isReportingOpen, setIsReportingOpen] = useState(false);

  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const dayType = getDayType(selectedDate);
  
  // CRITICAL FIX: Ensure habitsForSelectedDay is always an array to prevent crashes.
  // If habitConfigs[dayType] is undefined, it will now fall back to an empty array.
  const habitsForSelectedDay = useMemo(() => habitConfigs[dayType] || [], [habitConfigs, dayType]);

  const currentEntry = useMemo(() => {
    // Sanitize the entry from localStorage to prevent crashes from malformed data.
    return sanitizeEntry(entries[selectedDateKey], selectedDateKey, habitsForSelectedDay);
  }, [entries, selectedDateKey, habitsForSelectedDay]);

  const handleEntryChange = useCallback((updatedEntry: Partial<Entry>) => {
    setEntries(prevEntries => {
      // Sanitize the existing entry before applying updates to ensure data integrity.
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
