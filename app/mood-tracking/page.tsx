'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';

interface MoodEntry {
  id: string;
  mood: string;
  rating: number;
  timestamp: Date;
  notes?: string;
}

const moodTypes = [
  { 
    emoji: '😡', 
    label: 'Angry', 
    value: 'angry', 
    color: 'bg-red-100 hover:bg-red-200 border-red-300',
    description: 'Feeling frustrated or irritated'
  },
  { 
    emoji: '😰', 
    label: 'Anxious', 
    value: 'anxious', 
    color: 'bg-orange-100 hover:bg-orange-200 border-orange-300',
    description: 'Feeling worried or nervous'
  },
  { 
    emoji: '😔', 
    label: 'Sad', 
    value: 'sad', 
    color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300',
    description: 'Feeling down or melancholy'
  },
  { 
    emoji: '😐', 
    label: 'Neutral', 
    value: 'neutral', 
    color: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
    description: 'Feeling balanced or indifferent'
  },
  { 
    emoji: '😊', 
    label: 'Happy', 
    value: 'happy', 
    color: 'bg-green-100 hover:bg-green-200 border-green-300',
    description: 'Feeling joyful or content'
  },
  { 
    emoji: '😌', 
    label: 'Calm', 
    value: 'calm', 
    color: 'bg-purple-100 hover:bg-purple-200 border-purple-300',
    description: 'Feeling peaceful or relaxed'
  },
  { 
    emoji: '😤', 
    label: 'Stressed', 
    value: 'stressed', 
    color: 'bg-pink-100 hover:bg-pink-200 border-pink-300',
    description: 'Feeling overwhelmed or pressured'
  },
  { 
    emoji: '🤗', 
    label: 'Grateful', 
    value: 'grateful', 
    color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300',
    description: 'Feeling thankful or appreciative'
  }
];

export default function MoodTracking() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(50);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([]);

  // Load recent entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      const entries = JSON.parse(savedEntries).map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
      setRecentEntries(entries.slice(-5).reverse()); // Show last 5 entries
    }
  }, []);

  const handleMoodSelect = (moodValue: string) => {
    setSelectedMood(moodValue);
    setIsSubmitted(false);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = () => {
    if (selectedMood) {
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        mood: selectedMood,
        rating: rating,
        timestamp: new Date(),
        notes: notes.trim() || undefined
      };

      // Save to localStorage
      const existingEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
      const updatedEntries = [...existingEntries, newEntry];
      localStorage.setItem('moodEntries', JSON.stringify(updatedEntries));

      // Update recent entries display
      setRecentEntries(prev => [newEntry, ...prev.slice(0, 4)]);
      
      setIsSubmitted(true);
      
      // Reset form after a delay
      setTimeout(() => {
        setSelectedMood(null);
        setRating(50);
        setNotes('');
        setIsSubmitted(false);
      }, 2000);
    }
  };

  const getMoodColor = (mood: string) => {
    const moodType = moodTypes.find(m => m.value === mood);
    return moodType ? moodType.color.split(' ')[0] : 'bg-gray-100';
  };

  const getMoodEmoji = (mood: string) => {
    const moodType = moodTypes.find(m => m.value === mood);
    return moodType ? moodType.emoji : '😐';
  };

  const getMoodLabel = (mood: string) => {
    const moodType = moodTypes.find(m => m.value === mood);
    return moodType ? moodType.label : 'Unknown';
  };

  return (
    <main className="min-h-screen bg-gradient-soft">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Track Your Mood
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Log your emotions and see your progress over time. Every entry helps you understand yourself better.
          </p>
        </motion.div>

        {/* Mood Input Form */}
        <motion.div 
          className="card mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            How are you feeling right now?
          </h2>
          
          {/* Mood Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Select your mood:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {moodTypes.map((mood) => (
                <motion.button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    selectedMood === mood.value
                      ? `${mood.color} border-current shadow-lg scale-105`
                      : `${mood.color} border-gray-200 hover:shadow-md`
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-3xl mb-2">{mood.emoji}</div>
                  <div className="text-sm font-medium text-gray-700">{mood.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{mood.description}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Rating Slider */}
          {selectedMood && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Rate the intensity (1-100): {rating}
              </h3>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={rating}
                  onChange={(e) => handleRatingChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Very Low (1)</span>
                  <span>Very High (100)</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notes Section */}
          {selectedMood && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Optional notes (what's contributing to this mood?):
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share what's on your mind..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ai-purple focus:border-transparent resize-none"
                rows={3}
              />
            </motion.div>
          )}

          {/* Submit Button */}
          {selectedMood && (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <button
                onClick={handleSubmit}
                disabled={isSubmitted}
                className="bg-gradient-to-r from-ai-purple to-ai-green text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitted ? '✓ Mood Logged!' : 'Log My Mood'}
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Recent Entries */}
        {recentEntries.length > 0 && (
          <motion.div 
            className="card mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Entries</h2>
            <div className="space-y-4">
              {recentEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  className={`p-4 rounded-xl border-l-4 ${getMoodColor(entry.mood)} border-current`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                      <div>
                        <h3 className="font-medium text-gray-800">{getMoodLabel(entry.mood)}</h3>
                        <p className="text-sm text-gray-600">
                          {entry.timestamp.toLocaleDateString()} at {entry.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-800">{entry.rating}/100</div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-gradient-to-r from-ai-purple to-ai-green rounded-full"
                          style={{ width: `${entry.rating}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  {entry.notes && (
                    <p className="mt-2 text-gray-700 text-sm italic">"{entry.notes}"</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Call-to-Action */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link 
            href="/dashboard"
            className="btn-primary inline-block"
          >
            View Your Progress Dashboard
          </Link>
        </motion.div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B5CF6, #10B981);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B5CF6, #10B981);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </main>
  );
}
