
import React from 'react';
import { format } from 'date-fns';

interface HeaderProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  onOpenEditor: () => void;
  onOpenReporting: () => void;
}

const SettingsIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-1.226.554-.22 1.196-.22 1.75 0 .548.219 1.02.684 1.11 1.226l.094.542c.063.375.313.686.663.85.35.165.75.221 1.145.142l.495-.12a2.25 2.25 0 012.006.508c.558.558.825 1.372.464 2.115l-.305.61a2.25 2.25 0 00.313 2.416c.42.455.585 1.08.313 1.637l-.305.61c-.36 1.118.423 2.399 1.583 2.399h.498c.608 0 1.156.33 1.465.848.31.518.31 1.156 0 1.674-.31.518-.857.848-1.465.848h-.498c-1.16 0-1.943 1.28-1.582 2.399l.305.61c.272.556.107 1.182-.313 1.637a2.25 2.25 0 00-.313 2.416l.305.61c.36.743.094 1.557-.464 2.115a2.25 2.25 0 01-2.006.508l-.495-.12a2.25 2.25 0 00-1.145.142c-.35.164-.6.475-.663.85l-.094.542c-.09.542-.56 1.007-1.11 1.226-.554-.22-1.196-.22-1.75 0-.548-.219-1.02-.684-1.11-1.226l-.094-.542a2.25 2.25 0 00-.663-.85c-.395-.185-.795-.129-1.145.142l-.495.12a2.25 2.25 0 01-2.006-.508c-.558-.558-.825-1.372-.464-2.115l.305-.61a2.25 2.25 0 00-.313-2.416c-.42-.455-.585-1.08-.313-1.637l.305.61c.36-1.118-.423-2.399-1.582-2.399H6.387c-.608 0-1.156-.33-1.465-.848-.31-.518-.31-1.156 0-1.674.31-.518.857-.848 1.465.848h.498c1.16 0 1.943-1.28 1.583-2.399l-.305-.61a2.25 2.25 0 00-.313-2.416c-.272-.556-.107-1.182.313-1.637l.305-.61c.36-.743.094-1.557-.464-2.115a2.25 2.25 0 01-2.006-.508l-.495.12a2.25 2.25 0 00-1.145-.142c-.35-.164-.6-.475-.663-.85l-.094-.542c-.09-.542-.56-1.007-1.11-1.226-.554-.22-1.196-.22-1.75 0-.548-.219-1.02-.684-1.11-1.226L9.594 3.94z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const ChartBarIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);


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

export default Header;
