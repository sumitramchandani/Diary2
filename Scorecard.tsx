import React, { useCallback } from 'react';
import { DayType, type Entry, type Habit } from '../types';
import { ICONS } from '../constants';

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

export default Scorecard;