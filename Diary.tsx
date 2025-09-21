
import React, { useCallback } from 'react';
import type { Entry } from '../types';

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

export default Diary;