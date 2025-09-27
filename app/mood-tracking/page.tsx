'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { MoodEntry, MoodType, MOOD_TYPES, MoodSource } from '@/lib/types/mood';
import { createSupabaseClient } from '@/lib/supabase/client';
import { MoodAnalyzer } from '@/lib/utils/moodAnalysis';
import MoodCalendar from '@/components/MoodCalendar';

export default function MoodTracking() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [rating, setRating] = useState<number>(50);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([]);
  const [aiDetectedMood, setAiDetectedMood] = useState<{
    mood: MoodType;
    confidence: number;
    source: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAiDetection, setShowAiDetection] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [allEntries, setAllEntries] = useState<MoodEntry[]>([]);

  const supabase = createSupabaseClient();

  // Load user and recent entries
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    loadUser();
  }, [supabase.auth]);

  useEffect(() => {
    const loadRecentEntries = async () => {
      if (user) {
        try {
          const response = await fetch('/api/mood?limit=5');
          const data = await response.json();
          if (data.success) {
            const entries = data.data.map((entry: any) => ({
              ...entry,
              createdAt: new Date(entry.created_at),
              moodType: entry.mood_type,
              source: entry.source
            }));
            setRecentEntries(entries.slice(-5).reverse());
            setAllEntries(entries);
          }
        } catch (error) {
          console.error('Error loading recent entries:', error);
        }
      } else {
        // Fallback to localStorage for non-authenticated users
        const savedEntries = localStorage.getItem('moodEntries');
        if (savedEntries) {
          const entries = JSON.parse(savedEntries).map((entry: any) => ({
            ...entry,
            createdAt: new Date(entry.timestamp),
            moodType: entry.mood,
            source: 'manual'
          }));
          setRecentEntries(entries.slice(-5).reverse());
          setAllEntries(entries);
        }
      }
    };

    loadRecentEntries();
  }, [user]);

  // Check for AI-detected mood from recent chat
  useEffect(() => {
    const checkAiDetectedMood = async () => {
      if (user) {
        try {
          const response = await fetch('/api/mood?limit=1&source=chat_analysis');
          const data = await response.json();
          if (data.success && data.data.length > 0) {
            const latestAiMood = data.data[0];
            const timeDiff = Date.now() - new Date(latestAiMood.created_at).getTime();
            // Show AI detection if it's from the last 30 minutes
            if (timeDiff < 30 * 60 * 1000) {
              setAiDetectedMood({
                mood: latestAiMood.mood_type,
                confidence: latestAiMood.confidence_score,
                source: 'Recent chat session'
              });
              setShowAiDetection(true);
            }
          }
        } catch (error) {
          console.error('Error checking AI detected mood:', error);
        }
      }
    };

    checkAiDetectedMood();
  }, [user]);

  const handleMoodSelect = (moodValue: MoodType) => {
    setSelectedMood(moodValue);
    setIsSubmitted(false);
    setShowAiDetection(false);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleAiMoodAccept = () => {
    if (aiDetectedMood) {
      setSelectedMood(aiDetectedMood.mood);
      setRating(Math.round(aiDetectedMood.confidence * 100));
      setShowAiDetection(false);
    }
  };

  const handleAiMoodReject = () => {
    setShowAiDetection(false);
    setAiDetectedMood(null);
  };

  const handleSubmit = async () => {
    if (selectedMood) {
      setIsLoading(true);
      
      try {
        const newEntry = {
          moodType: selectedMood,
          intensity: rating,
          notes: notes.trim() || undefined,
          source: 'manual' as MoodSource
        };

        if (user) {
          // Save to database
          const response = await fetch('/api/mood', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEntry),
          });

          const data = await response.json();
          if (data.success) {
            const entry = {
              ...data.data,
              createdAt: new Date(data.data.created_at),
              moodType: data.data.mood_type,
              source: data.data.source
            };
            setRecentEntries(prev => [entry, ...prev.slice(0, 4)]);
          } else {
            throw new Error(data.error);
          }
        } else {
          // Fallback to localStorage for non-authenticated users
          const entry: MoodEntry = {
            id: Date.now().toString(),
            userId: 'local_user', // For local storage mode
            moodType: selectedMood,
            intensity: rating,
            createdAt: new Date(),
            updatedAt: new Date(),
            notes: notes.trim() || undefined,
            source: 'manual' as MoodSource
          };

          const existingEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
          const updatedEntries = [...existingEntries, {
            ...entry,
            mood: entry.moodType,
            rating: entry.intensity,
            timestamp: entry.createdAt
          }];
          localStorage.setItem('moodEntries', JSON.stringify(updatedEntries));

          setRecentEntries(prev => [entry, ...prev.slice(0, 4)]);
        }
        
        setIsSubmitted(true);
        
        // Reset form after a delay
        setTimeout(() => {
          setSelectedMood(null);
          setRating(50);
          setNotes('');
          setIsSubmitted(false);
          setAiDetectedMood(null);
        }, 2000);
      } catch (error) {
        console.error('Error saving mood entry:', error);
        alert('Failed to save mood entry. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getMoodColor = (mood: MoodType) => {
    return MOOD_TYPES[mood]?.color.split(' ')[0] || 'bg-gray-100';
  };

  const getMoodEmoji = (mood: MoodType) => {
    return MOOD_TYPES[mood]?.emoji || '😐';
  };

  const getMoodLabel = (mood: MoodType) => {
    return MOOD_TYPES[mood]?.label || 'Unknown';
  };

  const getSourceIcon = (source: MoodSource) => {
    switch (source) {
      case 'ai_detected':
      case 'chat_analysis':
        return '🤖';
      case 'manual':
        return '✋';
      default:
        return '✋';
    }
  };

  const getSourceLabel = (source: MoodSource) => {
    switch (source) {
      case 'ai_detected':
        return 'AI Detected';
      case 'chat_analysis':
        return 'From Chat';
      case 'manual':
        return 'Manual Entry';
      default:
        return 'Manual Entry';
    }
  };

  const generateDemoData = () => {
    const demoEntries = [];
    const moodTypes: MoodType[] = ['happy', 'calm', 'neutral', 'anxious', 'sad', 'stressed', 'grateful'];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const entriesPerDay = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < entriesPerDay; j++) {
        const moodType = moodTypes[Math.floor(Math.random() * moodTypes.length)];
        const intensity = Math.floor(Math.random() * 40) + 30;
        
        const entry: MoodEntry = {
          id: `demo-${i}-${j}`,
          userId: 'demo-user',
          moodType,
          intensity,
          notes: `Demo entry for ${moodType}`,
          source: 'manual' as MoodSource,
          createdAt: new Date(date.getTime() + j * 3600000),
          updatedAt: new Date(date.getTime() + j * 3600000)
        };
        
        demoEntries.push(entry);
      }
    }
    
    // Save to localStorage
    const localStorageEntries = demoEntries.map(entry => ({
      ...entry,
      mood: entry.moodType,
      rating: entry.intensity,
      timestamp: entry.createdAt
    }));
    localStorage.setItem('moodEntries', JSON.stringify(localStorageEntries));
    
    // Update state
    setAllEntries(demoEntries);
    setRecentEntries(demoEntries.slice(-5).reverse());
    
    alert('Demo data generated! You can now view your progress dashboard.');
  };

  const exportMoodData = () => {
    const csvContent = [
      ['Date', 'Time', 'Mood', 'Intensity', 'Source', 'Notes'],
      ...allEntries.map(entry => [
        entry.createdAt.toLocaleDateString(),
        entry.createdAt.toLocaleTimeString(),
        getMoodLabel(entry.moodType),
        entry.intensity.toString(),
        getSourceLabel(entry.source),
        entry.notes || ''
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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

        {/* AI Detected Mood Alert */}
        {showAiDetection && aiDetectedMood && (
          <motion.div 
            className="card mb-8 bg-blue-50 border-l-4 border-blue-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">🤖</span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-blue-800">AI Detected Mood</h3>
                <p className="text-blue-700 mt-1">
                  Based on your recent chat session, I detected you might be feeling <strong>{getMoodLabel(aiDetectedMood.mood)}</strong> 
                  ({Math.round(aiDetectedMood.confidence * 100)}% confidence). Would you like to use this as your mood entry?
                </p>
                <div className="mt-3 flex space-x-3">
                  <button
                    onClick={handleAiMoodAccept}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Yes, use this mood
                  </button>
                  <button
                    onClick={handleAiMoodReject}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    No, I'll choose manually
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

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
              {Object.entries(MOOD_TYPES).map(([key, mood]) => (
                <motion.button
                  key={key}
                  onClick={() => handleMoodSelect(key as MoodType)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    selectedMood === key
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
                disabled={isSubmitted || isLoading}
                className="bg-gradient-to-r from-ai-purple to-ai-green text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Saving...' : isSubmitted ? '✓ Mood Logged!' : 'Log My Mood'}
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
                  className={`p-4 rounded-xl border-l-4 ${getMoodColor(entry.moodType)} border-current`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getMoodEmoji(entry.moodType)}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-800">{getMoodLabel(entry.moodType)}</h3>
                          <span className="text-xs text-gray-500 flex items-center">
                            {getSourceIcon(entry.source)} {getSourceLabel(entry.source)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {entry.createdAt.toLocaleDateString('en-US')} at {entry.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-800">{entry.intensity}/100</div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-gradient-to-r from-ai-purple to-ai-green rounded-full"
                          style={{ width: `${entry.intensity}%` }}
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

        {/* Calendar View Toggle */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="btn-secondary mr-4"
          >
            {showCalendar ? 'Hide Calendar' : 'Show Calendar View'}
          </button>
          {allEntries.length > 0 && (
            <button
              onClick={exportMoodData}
              className="btn-secondary mr-4"
            >
              Export Data
            </button>
          )}
          {allEntries.length === 0 && (
            <button
              onClick={generateDemoData}
              className="btn-primary"
            >
              Generate Demo Data
            </button>
          )}
        </motion.div>

        {/* Calendar View */}
        {showCalendar && allEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <MoodCalendar 
              moodEntries={allEntries}
              onDateSelect={(date, entries) => {
                console.log('Selected date:', date, 'Entries:', entries);
              }}
            />
          </motion.div>
        )}

        {/* Call-to-Action */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="btn-primary inline-block"
            >
              View Your Progress Dashboard
            </Link>
            <Link 
              href="/"
              className="btn-secondary inline-block"
            >
              Chat with AI Therapist
            </Link>
          </div>
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
