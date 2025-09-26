'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoodEntry, MoodType, MOOD_TYPES } from '@/lib/types/mood';

interface MoodCalendarProps {
  moodEntries: MoodEntry[];
  onDateSelect?: (date: Date, entries: MoodEntry[]) => void;
  className?: string;
}

export default function MoodCalendar({ moodEntries, onDateSelect, className = '' }: MoodCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarData, setCalendarData] = useState<Map<string, MoodEntry[]>>(new Map());

  useEffect(() => {
    // Group mood entries by date
    const groupedEntries = new Map<string, MoodEntry[]>();
    
    moodEntries.forEach(entry => {
      const dateKey = entry.createdAt.toISOString().split('T')[0];
      if (!groupedEntries.has(dateKey)) {
        groupedEntries.set(dateKey, []);
      }
      groupedEntries.get(dateKey)!.push(entry);
    });
    
    setCalendarData(groupedEntries);
  }, [moodEntries]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getMoodForDate = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    const entries = calendarData.get(dateKey) || [];
    
    if (entries.length === 0) return null;
    
    // Get the most recent entry for the day
    const latestEntry = entries.reduce((latest, current) => 
      current.createdAt > latest.createdAt ? current : latest
    );
    
    return latestEntry;
  };

  const getMoodColor = (mood: MoodType) => {
    const moodConfig = MOOD_TYPES[mood];
    if (!moodConfig) return 'bg-gray-200';
    
    // Extract color from the mood config
    const colorClass = moodConfig.color.split(' ')[0];
    return colorClass.replace('hover:', '').replace('bg-', 'bg-');
  };

  const getMoodEmoji = (mood: MoodType) => {
    return MOOD_TYPES[mood]?.emoji || '😐';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dateKey = date.toISOString().split('T')[0];
    const entries = calendarData.get(dateKey) || [];
    onDateSelect?.(date, entries);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div 
      className={`card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <span className="text-2xl mr-2">📅</span>
          Mood Calendar
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ←
          </button>
          <h3 className="text-lg font-medium text-gray-700">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="p-2"></div>;
          }

          const moodEntry = getMoodForDate(date);
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <motion.button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              className={`p-2 rounded-lg text-sm transition-all duration-200 ${
                isSelected
                  ? 'ring-2 ring-ai-purple bg-purple-50'
                  : isToday
                  ? 'bg-ai-purple text-white'
                  : moodEntry
                  ? 'hover:bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col items-center">
                <span className={`${isToday && !isSelected ? 'text-white' : 'text-gray-700'}`}>
                  {date.getDate()}
                </span>
                {moodEntry && (
                  <span className="text-lg">
                    {getMoodEmoji(moodEntry.moodType)}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <motion.div 
          className="mt-4 p-4 bg-gray-50 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          {(() => {
            const dateKey = selectedDate.toISOString().split('T')[0];
            const entries = calendarData.get(dateKey) || [];
            
            if (entries.length === 0) {
              return (
                <p className="text-gray-500 text-sm">No mood entries for this date.</p>
              );
            }

            return (
              <div className="space-y-3">
                {entries.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                    <span className="text-2xl">{getMoodEmoji(entry.moodType)}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-800">
                          {MOOD_TYPES[entry.moodType]?.label}
                        </span>
                        <span className="text-sm text-gray-500">
                          {entry.createdAt.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        <span className="text-xs text-gray-400">
                          {entry.source === 'manual' ? '✋' : '🤖'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-gradient-to-r from-ai-purple to-ai-green rounded-full"
                            style={{ width: `${entry.intensity}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{entry.intensity}/100</span>
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">"{entry.notes}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Legend</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(MOOD_TYPES).map(([key, mood]) => (
            <div key={key} className="flex items-center space-x-1 text-xs">
              <span>{mood.emoji}</span>
              <span className="text-gray-600">{mood.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
