'use client'

import Navigation from '@/components/Navigation'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { MoodEntry, MoodAnalytics, ChatInsight, MoodTrendData, MOOD_TYPES } from '@/lib/types/mood'
import { createSupabaseClient } from '@/lib/supabase/client'
import { MoodDataProcessor, ChatAnalyzer } from '@/lib/utils/moodAnalysis'
import MoodRecommendations from '@/components/MoodRecommendations'

export default function Dashboard() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [moodAnalytics, setMoodAnalytics] = useState<MoodAnalytics | null>(null);
  const [moodTrends, setMoodTrends] = useState<MoodTrendData[]>([]);
  const [chatInsights, setChatInsights] = useState<ChatInsight | null>(null);
  const [journeySummary, setJourneySummary] = useState<{before: string, after: string}>({before: '', after: ''});
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [moodDistribution, setMoodDistribution] = useState<any[]>([]);
  const [weeklyPattern, setWeeklyPattern] = useState<any[]>([]);

  const supabase = createSupabaseClient();

  // Load user and data
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    loadUser();
  }, [supabase.auth]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Check for localStorage data first
        const savedEntries = localStorage.getItem('moodEntries');
        if (savedEntries) {
          const entries = JSON.parse(savedEntries).map((entry: any) => ({
            ...entry,
            createdAt: new Date(entry.timestamp),
            moodType: entry.mood,
            source: 'manual'
          }));
          setMoodEntries(entries);
          processMoodData(entries);
        } else {
          // Generate demo data if no localStorage data exists
          generateDemoData();
        }

        // Load chat insights
        await loadChatInsights();
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Fallback to demo data on error
        generateDemoData();
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const generateDemoData = () => {
    // Generate demo mood entries for the last 30 days
    const demoEntries: MoodEntry[] = [];
    const moodTypes: MoodType[] = ['happy', 'calm', 'neutral', 'anxious', 'sad', 'stressed', 'grateful'];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate 1-3 entries per day
      const entriesPerDay = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < entriesPerDay; j++) {
        const moodType = moodTypes[Math.floor(Math.random() * moodTypes.length)];
        const intensity = Math.floor(Math.random() * 40) + 30; // 30-70 range
        
        demoEntries.push({
          id: `demo-${i}-${j}`,
          userId: 'demo-user',
          moodType,
          intensity,
          notes: `Demo entry for ${moodType}`,
          source: 'manual' as MoodSource,
          createdAt: new Date(date.getTime() + j * 3600000), // Spread throughout the day
          updatedAt: new Date(date.getTime() + j * 3600000)
        });
      }
    }
    
    setMoodEntries(demoEntries);
    processMoodData(demoEntries);
  };

  const loadChatInsights = async () => {
    try {
      // This would be implemented with a chat insights API
      // For now, we'll create mock data
      const mockChatInsights: ChatInsight = {
        recentSessions: [],
        averageSessionLength: 15,
        mostDiscussedTopics: ['anxiety', 'work', 'relationships'],
        moodCorrelation: {
          beforeSession: 45,
          afterSession: 65,
          improvement: 20
        },
        sessionEffectiveness: 75
      };
      setChatInsights(mockChatInsights);
    } catch (error) {
      console.error('Error loading chat insights:', error);
    }
  };

  const generateWeeklyPattern = (entries: MoodEntry[]) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeklyData = days.map(day => ({
      day,
      averageMood: 0,
      entryCount: 0
    }));

    entries.forEach(entry => {
      const dayOfWeek = entry.createdAt.getDay();
      weeklyData[dayOfWeek].averageMood += entry.intensity;
      weeklyData[dayOfWeek].entryCount += 1;
    });

    return weeklyData.map(day => ({
      ...day,
      averageMood: day.entryCount > 0 ? Math.round(day.averageMood / day.entryCount) : 0
    }));
  };

  const processMoodData = (entries: MoodEntry[]) => {
    if (entries.length === 0) return;

    // Sort entries by timestamp
    const sortedEntries = [...entries].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    // Calculate analytics
    const totalEntries = entries.length;
    const averageMood = entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length;
    const improvement = MoodDataProcessor.calculateImprovement(entries);
    const streak = MoodDataProcessor.calculateStreak(entries);
    const dominantMood = MoodDataProcessor.getMostFrequentMood(entries);
    
    // Calculate mood distribution
    const moodDistribution = entries.reduce((acc, entry) => {
      acc[entry.moodType] = (acc[entry.moodType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Set analytics
    setMoodAnalytics({
      totalEntries,
      averageMood,
      moodImprovement: improvement,
      currentStreak: streak,
      dominantMood,
      moodDistribution
    });

    // Create mood distribution chart data
    const distribution = Object.entries(moodDistribution).map(([mood, count]) => ({
      mood: MOOD_TYPES[mood as keyof typeof MOOD_TYPES]?.label || mood,
      count: count as number,
      emoji: MOOD_TYPES[mood as keyof typeof MOOD_TYPES]?.emoji || '😐'
    }));
    setMoodDistribution(distribution);

    // Calculate mood over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEntries = sortedEntries.filter(entry => entry.createdAt >= thirtyDaysAgo);
    
    // Group by day and calculate average mood
    const dailyMoods = recentEntries.reduce((acc, entry) => {
      const date = entry.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { entries: [], totalRating: 0, count: 0 };
      }
      acc[date].entries.push(entry);
      acc[date].totalRating += entry.intensity;
      acc[date].count += 1;
      return acc;
    }, {} as any);

    const timeSeriesData = Object.entries(dailyMoods).map(([date, data]: [string, any]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      averageRating: Math.round(data.totalRating / data.count),
      entries: data.entries.length,
      dominantMood: getMostFrequentMood(data.entries),
      manualEntries: data.entries.filter((entry: any) => entry.source === 'manual').length,
      aiDetectedEntries: data.entries.filter((entry: any) => entry.source !== 'manual').length
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setMoodTrends(timeSeriesData);

    // Generate weekly pattern
    const weeklyData = generateWeeklyPattern(entries);
    setWeeklyPattern(weeklyData);

    // Generate journey summary
    generateJourneySummary(sortedEntries, improvement);
  };

  const getMostFrequentMood = (entries: MoodEntry[]) => {
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.moodType] = (acc[entry.moodType] || 0) + 1;
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
    
    const firstWeekAvg = firstWeek.reduce((sum, entry) => sum + entry.intensity, 0) / firstWeek.length;
    const lastWeekAvg = lastWeek.reduce((sum, entry) => sum + entry.intensity, 0) / lastWeek.length;
    
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
      setMoodTrends([]);
      setMoodDistribution([]);
      setWeeklyPattern([]);
      setMoodAnalytics(null);
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

        {/* Loading State */}
        {isLoading && (
          <motion.div 
            className="card text-center py-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Loading Your Dashboard</h2>
            <p className="text-gray-600">Analyzing your mood data and chat insights...</p>
          </motion.div>
        )}

        {/* No Data State */}
        {!isLoading && moodEntries.length === 0 && (
          <motion.div 
            className="card text-center py-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Mood Data Yet</h2>
            <p className="text-gray-600 mb-8">Start tracking your mood to see your progress here!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/mood-tracking"
              className="btn-primary inline-block"
            >
              Start Tracking Your Mood
            </Link>
              <Link 
                href="/"
                className="btn-secondary inline-block"
              >
                Chat with AI Therapist
              </Link>
            </div>
          </motion.div>
        )}

        {/* Dashboard Content */}
        {!isLoading && moodEntries.length > 0 && (
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
                <div className="text-3xl font-bold text-ai-purple mb-2">{moodAnalytics?.totalEntries || 0}</div>
                <div className="text-gray-600">Total Entries</div>
              </motion.div>
              <motion.div 
                className="card text-center"
                variants={staggerItem}
              >
                <div className="text-3xl font-bold text-ai-green mb-2">{Math.round(moodAnalytics?.averageMood || 0)}</div>
                <div className="text-gray-600">Average Mood</div>
              </motion.div>
              <motion.div 
                className="card text-center"
                variants={staggerItem}
              >
                <div className={`text-3xl font-bold mb-2 ${(moodAnalytics?.moodImprovement || 0) >= 0 ? 'text-ai-green' : 'text-ai-red'}`}>
                  {(moodAnalytics?.moodImprovement || 0) >= 0 ? '+' : ''}{Math.round(moodAnalytics?.moodImprovement || 0)}
                </div>
                <div className="text-gray-600">Mood Improvement</div>
              </motion.div>
              <motion.div 
                className="card text-center"
                variants={staggerItem}
              >
                <div className="text-3xl font-bold text-ai-orange mb-2">{moodAnalytics?.currentStreak || 0}</div>
                <div className="text-gray-600">Day Streak</div>
              </motion.div>
            </motion.div>

            {/* Chat Insights Panel */}
            {chatInsights && (
              <motion.div 
                className="card mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400"
                variants={staggerItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="text-2xl mr-2">🤖</span>
                  AI Chat Insights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{chatInsights.sessionEffectiveness}%</div>
                    <div className="text-gray-600">Session Effectiveness</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">{chatInsights.averageSessionLength} min</div>
                    <div className="text-gray-600">Avg Session Length</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">+{chatInsights.moodCorrelation.improvement}</div>
                    <div className="text-gray-600">Mood Improvement Post-Chat</div>
                  </div>
                </div>
                {chatInsights.mostDiscussedTopics.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Most Discussed Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {chatInsights.mostDiscussedTopics.map((topic, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Mood Distribution */}
              {moodDistribution.length > 0 && (
                <motion.div 
                  className="card"
                  variants={staggerItem}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Mood Distribution</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={moodDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ mood, emoji, percent }: any) => `${emoji} ${mood} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {moodDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {/* Weekly Pattern */}
              {weeklyPattern.length > 0 && (
                <motion.div 
                  className="card"
                  variants={staggerItem}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Weekly Mood Pattern</h2>
                  <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyPattern} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="day" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E5E7EB', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }} 
                          formatter={(value) => [value, 'Average Mood']}
                      />
                      <Bar 
                          dataKey="averageMood" 
                          fill="#8B5CF6" 
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
            </div>

            {/* Mood Over Time Chart */}
            {moodTrends.length > 0 && (
              <motion.div 
                className="card mb-8"
                variants={staggerItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Mood Trends Over Time</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={moodTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                      <Area 
                        type="monotone" 
                        dataKey="averageRating" 
                        stroke="#8B5CF6" 
                        fill="url(#colorGradient)"
                        strokeWidth={3}
                        animationDuration={1500}
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
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

              {/* Mood Recommendations */}
              <motion.div 
                variants={staggerItem}
              >
                <MoodRecommendations 
                  currentMood={moodAnalytics?.dominantMood as any}
                  recentMoods={moodEntries.slice(-5).map(entry => entry.moodType)}
                />
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
