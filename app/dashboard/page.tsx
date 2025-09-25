'use client'

import Navigation from '@/components/Navigation'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface MoodEntry {
  id: string;
  mood: string;
  rating: number;
  timestamp: Date;
  notes?: string;
}

export default function Dashboard() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [moodComparison, setMoodComparison] = useState<any[]>([]);
  const [moodOverTime, setMoodOverTime] = useState<any[]>([]);
  const [journeySummary, setJourneySummary] = useState<{before: string, after: string}>({before: '', after: ''});
  const [stats, setStats] = useState({
    totalEntries: 0,
    averageMood: 0,
    moodImprovement: 0,
    streak: 0
  });

  // Load mood entries from localStorage
  useEffect(() => {
    const loadMoodEntries = () => {
      const savedEntries = localStorage.getItem('moodEntries');
      if (savedEntries) {
        const entries = JSON.parse(savedEntries).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        setMoodEntries(entries);
        processMoodData(entries);
      }
    };

    loadMoodEntries();
    
    // Listen for storage changes (in case user logs mood in another tab)
    window.addEventListener('storage', loadMoodEntries);
    return () => window.removeEventListener('storage', loadMoodEntries);
  }, []);

  const processMoodData = (entries: MoodEntry[]) => {
    if (entries.length === 0) return;

    // Sort entries by timestamp
    const sortedEntries = [...entries].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Calculate mood comparison (first vs last entries for each mood type)
    const moodTypes = ['angry', 'anxious', 'sad', 'neutral', 'happy', 'calm', 'stressed', 'grateful'];
    const comparisonData = moodTypes.map(moodType => {
      const moodEntries = sortedEntries.filter(entry => entry.mood === moodType);
      if (moodEntries.length === 0) {
        return { mood: moodType, before: 0, after: 0 };
      }
      
      const firstEntry = moodEntries[0];
      const lastEntry = moodEntries[moodEntries.length - 1];
      
      return {
        mood: moodType.charAt(0).toUpperCase() + moodType.slice(1),
        before: firstEntry.rating,
        after: lastEntry.rating
      };
    }).filter(item => item.before > 0 || item.after > 0);

    setMoodComparison(comparisonData);

    // Calculate mood over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEntries = sortedEntries.filter(entry => entry.timestamp >= thirtyDaysAgo);
    
    // Group by day and calculate average mood
    const dailyMoods = recentEntries.reduce((acc, entry) => {
      const date = entry.timestamp.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { entries: [], totalRating: 0, count: 0 };
      }
      acc[date].entries.push(entry);
      acc[date].totalRating += entry.rating;
      acc[date].count += 1;
      return acc;
    }, {} as any);

    const timeSeriesData = Object.entries(dailyMoods).map(([date, data]: [string, any]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      averageRating: Math.round(data.totalRating / data.count),
      entries: data.entries.length,
      dominantMood: getMostFrequentMood(data.entries)
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setMoodOverTime(timeSeriesData);

    // Calculate stats
    const totalEntries = entries.length;
    const averageMood = Math.round(entries.reduce((sum, entry) => sum + entry.rating, 0) / totalEntries);
    
    // Calculate mood improvement (compare first week vs last week)
    const firstWeek = sortedEntries.slice(0, Math.min(7, sortedEntries.length));
    const lastWeek = sortedEntries.slice(-Math.min(7, sortedEntries.length));
    
    const firstWeekAvg = firstWeek.length > 0 ? 
      Math.round(firstWeek.reduce((sum, entry) => sum + entry.rating, 0) / firstWeek.length) : 0;
    const lastWeekAvg = lastWeek.length > 0 ? 
      Math.round(lastWeek.reduce((sum, entry) => sum + entry.rating, 0) / lastWeek.length) : 0;
    
    const moodImprovement = lastWeekAvg - firstWeekAvg;

    // Calculate streak (consecutive days with entries)
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      
      const hasEntry = entries.some(entry => {
        const entryDate = new Date(entry.timestamp);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === checkDate.getTime();
      });
      
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }

    setStats({
      totalEntries,
      averageMood,
      moodImprovement,
      streak
    });

    // Generate journey summary
    generateJourneySummary(sortedEntries, moodImprovement);
  };

  const getMostFrequentMood = (entries: MoodEntry[]) => {
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as any);
    
    return Object.entries(moodCounts).reduce((a, b) => moodCounts[a[0]] > moodCounts[b[0]] ? a : b)[0];
  };

  const generateJourneySummary = (entries: MoodEntry[], improvement: number) => {
    if (entries.length < 2) {
      setJourneySummary({
        before: "You're just getting started on your mood tracking journey.",
        after: "Keep logging your moods to see your progress!"
      });
      return;
    }

    const firstWeek = entries.slice(0, Math.min(7, entries.length));
    const lastWeek = entries.slice(-Math.min(7, entries.length));
    
    const firstWeekAvg = firstWeek.reduce((sum, entry) => sum + entry.rating, 0) / firstWeek.length;
    const lastWeekAvg = lastWeek.reduce((sum, entry) => sum + entry.rating, 0) / lastWeek.length;
    
    const dominantMoodFirst = getMostFrequentMood(firstWeek);
    const dominantMoodLast = getMostFrequentMood(lastWeek);
    
    let beforeText = "";
    let afterText = "";
    
    if (firstWeekAvg < 30) {
      beforeText = "I often felt overwhelmed and struggled with low moods.";
    } else if (firstWeekAvg < 50) {
      beforeText = "I experienced frequent mood fluctuations and felt uncertain.";
    } else if (firstWeekAvg < 70) {
      beforeText = "I had mixed emotions and felt somewhat balanced.";
    } else {
      beforeText = "I generally felt positive but wanted to track my patterns.";
    }
    
    if (improvement > 20) {
      afterText = "I've made significant progress and feel much more positive and in control.";
    } else if (improvement > 10) {
      afterText = "I'm seeing positive changes and feel more optimistic about my emotional well-being.";
    } else if (improvement > 0) {
      afterText = "I'm noticing gradual improvements in my mood and emotional awareness.";
    } else if (improvement > -10) {
      afterText = "I'm maintaining my emotional balance and staying consistent with tracking.";
    } else {
      afterText = "I'm learning more about my emotional patterns and working on strategies for improvement.";
    }
    
    setJourneySummary({ before: beforeText, after: afterText });
  };

  const resetData = () => {
    if (confirm('Are you sure you want to reset all your mood data? This action cannot be undone.')) {
      localStorage.removeItem('moodEntries');
      setMoodEntries([]);
      setMoodComparison([]);
      setMoodOverTime([]);
      setStats({ totalEntries: 0, averageMood: 0, moodImprovement: 0, streak: 0 });
      setJourneySummary({ before: '', after: '' });
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-soft">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          {...fadeInUp}
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Your Progress Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your mood journey and see how you're improving over time.
          </p>
        </motion.div>

        {/* No Data State */}
        {moodEntries.length === 0 && (
          <motion.div 
            className="card text-center py-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Mood Data Yet</h2>
            <p className="text-gray-600 mb-8">Start tracking your mood to see your progress here!</p>
            <Link 
              href="/mood-tracking"
              className="btn-primary inline-block"
            >
              Start Tracking Your Mood
            </Link>
          </motion.div>
        )}

        {/* Dashboard Content */}
        {moodEntries.length > 0 && (
          <>
            {/* Stats Overview */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="card text-center"
                variants={staggerItem}
              >
                <div className="text-3xl font-bold text-ai-purple mb-2">{stats.totalEntries}</div>
                <div className="text-gray-600">Total Entries</div>
              </motion.div>
              <motion.div 
                className="card text-center"
                variants={staggerItem}
              >
                <div className="text-3xl font-bold text-ai-green mb-2">{stats.averageMood}</div>
                <div className="text-gray-600">Average Mood</div>
              </motion.div>
              <motion.div 
                className="card text-center"
                variants={staggerItem}
              >
                <div className={`text-3xl font-bold mb-2 ${stats.moodImprovement >= 0 ? 'text-ai-green' : 'text-ai-red'}`}>
                  {stats.moodImprovement >= 0 ? '+' : ''}{stats.moodImprovement}
                </div>
                <div className="text-gray-600">Mood Improvement</div>
              </motion.div>
              <motion.div 
                className="card text-center"
                variants={staggerItem}
              >
                <div className="text-3xl font-bold text-ai-orange mb-2">{stats.streak}</div>
                <div className="text-gray-600">Day Streak</div>
              </motion.div>
            </motion.div>

            {/* Mood Improvement Chart */}
            {moodComparison.length > 0 && (
              <motion.div 
                className="card mb-8"
                variants={staggerItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Mood Improvement</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={moodComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="mood" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E5E7EB', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }} 
                        formatter={(value, name) => [value, name === 'before' ? 'First Entry' : 'Latest Entry']}
                      />
                      <Bar 
                        dataKey="before" 
                        fill="#EF4444" 
                        name="First Entry" 
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                      />
                      <Bar 
                        dataKey="after" 
                        fill="#10B981" 
                        name="Latest Entry" 
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Mood Over Time Chart */}
              {moodOverTime.length > 0 && (
                <motion.div 
                  className="card"
                  variants={staggerItem}
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Mood Over Time</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={moodOverTime} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }} 
                          formatter={(value, name) => [value, 'Mood Rating']}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="averageRating" 
                          stroke="#8B5CF6" 
                          strokeWidth={3}
                          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2 }}
                          animationDuration={1500}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {/* Journey Summary */}
              <motion.div 
                className="space-y-4"
                variants={staggerItem}
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Journey</h2>
                
                {journeySummary.before && (
                  <motion.div 
                    className="card bg-red-50 border-l-4 border-red-400"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 text-sm font-medium">B</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Before Tracking</h3>
                        <p className="text-red-700 mt-1">{journeySummary.before}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {journeySummary.after && (
                  <motion.div 
                    className="card bg-green-50 border-l-4 border-green-400"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm font-medium">A</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">After Tracking</h3>
                        <p className="text-green-700 mt-1">{journeySummary.after}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link 
                href="/mood-tracking"
                className="btn-primary"
              >
                Log New Mood
              </Link>
              <button
                onClick={resetData}
                className="btn-secondary"
              >
                Reset Data
              </button>
            </motion.div>
          </>
        )}

        {/* Call-to-Action Section */}
        <motion.div 
          className="card bg-gradient-to-r from-ai-purple to-ai-green text-white text-center py-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.8, 
            type: "spring", 
            stiffness: 100, 
            damping: 15 
          }}
        >
          <h2 className="text-3xl font-bold mb-4">Keep building your mental well-being</h2>
          <p className="text-xl mb-8 opacity-90">Continue your journey with AI Therapist</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link 
              href="/" 
              className="inline-block bg-white text-ai-purple px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Chat with AI Therapist
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
