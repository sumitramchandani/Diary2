import React, { useState, useMemo } from 'react';
import type { Habit, HabitConfigurations } from '../types';
import { DayType } from '../types';
import { ICONS } from '../constants';

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
    // ROBUSTNESS FIX: Ensure we don't crash if editedConfigs[selectedDayType] is undefined.
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
  
  // Use a safe fallback for the habits list to prevent crash during render.
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

export default HabitEditorModal;