'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoodType, MoodRecommendation, MOOD_TYPES } from '@/lib/types/mood';

interface MoodRecommendationsProps {
  currentMood?: MoodType;
  recentMoods?: MoodType[];
  className?: string;
}

const RECOMMENDATIONS: Record<MoodType, MoodRecommendation[]> = {
  angry: [
    {
      type: 'breathing',
      title: '4-7-8 Breathing',
      description: 'Inhale for 4, hold for 7, exhale for 8. Repeat 4 times.',
      duration: '2-3 minutes',
      difficulty: 'easy',
      basedOnMood: 'angry'
    },
    {
      type: 'exercise',
      title: 'Physical Release',
      description: 'Go for a brisk walk or do some jumping jacks to release tension.',
      duration: '10-15 minutes',
      difficulty: 'medium',
      basedOnMood: 'angry'
    },
    {
      type: 'mindfulness',
      title: 'Progressive Muscle Relaxation',
      description: 'Tense and release each muscle group from head to toe.',
      duration: '10 minutes',
      difficulty: 'medium',
      basedOnMood: 'angry'
    }
  ],
  anxious: [
    {
      type: 'breathing',
      title: 'Box Breathing',
      description: 'Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat.',
      duration: '5 minutes',
      difficulty: 'easy',
      basedOnMood: 'anxious'
    },
    {
      type: 'mindfulness',
      title: '5-4-3-2-1 Grounding',
      description: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.',
      duration: '3-5 minutes',
      difficulty: 'easy',
      basedOnMood: 'anxious'
    },
    {
      type: 'journaling',
      title: 'Worry Journal',
      description: 'Write down your worries and challenge them with evidence.',
      duration: '10-15 minutes',
      difficulty: 'medium',
      basedOnMood: 'anxious'
    }
  ],
  sad: [
    {
      type: 'social',
      title: 'Reach Out',
      description: 'Call a friend or family member for support.',
      duration: '15-30 minutes',
      difficulty: 'medium',
      basedOnMood: 'sad'
    },
    {
      type: 'exercise',
      title: 'Gentle Movement',
      description: 'Take a walk in nature or do gentle yoga.',
      duration: '20-30 minutes',
      difficulty: 'easy',
      basedOnMood: 'sad'
    },
    {
      type: 'mindfulness',
      title: 'Self-Compassion Practice',
      description: 'Write yourself a kind letter or practice loving-kindness meditation.',
      duration: '10-15 minutes',
      difficulty: 'medium',
      basedOnMood: 'sad'
    }
  ],
  neutral: [
    {
      type: 'mindfulness',
      title: 'Mindful Awareness',
      description: 'Take a moment to notice your surroundings and how you feel.',
      duration: '5 minutes',
      difficulty: 'easy',
      basedOnMood: 'neutral'
    },
    {
      type: 'journaling',
      title: 'Gratitude Practice',
      description: 'Write down three things you\'re grateful for today.',
      duration: '5-10 minutes',
      difficulty: 'easy',
      basedOnMood: 'neutral'
    },
    {
      type: 'exercise',
      title: 'Energy Boost',
      description: 'Do some light stretching or take a short walk.',
      duration: '10 minutes',
      difficulty: 'easy',
      basedOnMood: 'neutral'
    }
  ],
  happy: [
    {
      type: 'social',
      title: 'Share Your Joy',
      description: 'Share your positive feelings with someone you care about.',
      duration: '10-20 minutes',
      difficulty: 'easy',
      basedOnMood: 'happy'
    },
    {
      type: 'journaling',
      title: 'Celebration Journal',
      description: 'Write about what made you happy and how you can maintain it.',
      duration: '10 minutes',
      difficulty: 'easy',
      basedOnMood: 'happy'
    },
    {
      type: 'exercise',
      title: 'Dance or Move',
      description: 'Put on your favorite music and dance or move freely.',
      duration: '15-20 minutes',
      difficulty: 'easy',
      basedOnMood: 'happy'
    }
  ],
  calm: [
    {
      type: 'mindfulness',
      title: 'Deep Breathing',
      description: 'Continue your calm state with slow, deep breaths.',
      duration: '5-10 minutes',
      difficulty: 'easy',
      basedOnMood: 'calm'
    },
    {
      type: 'journaling',
      title: 'Reflection',
      description: 'Reflect on what helped you achieve this calm state.',
      duration: '10 minutes',
      difficulty: 'easy',
      basedOnMood: 'calm'
    },
    {
      type: 'mindfulness',
      title: 'Body Scan',
      description: 'Slowly scan your body from head to toe, noticing any sensations.',
      duration: '10-15 minutes',
      difficulty: 'medium',
      basedOnMood: 'calm'
    }
  ],
  stressed: [
    {
      type: 'breathing',
      title: 'Emergency Breathing',
      description: 'Breathe in for 4, hold for 4, out for 6. Focus only on your breath.',
      duration: '3-5 minutes',
      difficulty: 'easy',
      basedOnMood: 'stressed'
    },
    {
      type: 'mindfulness',
      title: 'Priority Focus',
      description: 'List your top 3 priorities and focus on one at a time.',
      duration: '10 minutes',
      difficulty: 'medium',
      basedOnMood: 'stressed'
    },
    {
      type: 'exercise',
      title: 'Stress Release',
      description: 'Do some vigorous exercise or physical activity to release stress.',
      duration: '15-30 minutes',
      difficulty: 'medium',
      basedOnMood: 'stressed'
    }
  ],
  grateful: [
    {
      type: 'journaling',
      title: 'Gratitude Expansion',
      description: 'Write about why you\'re grateful and how it affects your life.',
      duration: '10-15 minutes',
      difficulty: 'easy',
      basedOnMood: 'grateful'
    },
    {
      type: 'social',
      title: 'Express Gratitude',
      description: 'Tell someone why you\'re grateful for them.',
      duration: '5-10 minutes',
      difficulty: 'easy',
      basedOnMood: 'grateful'
    },
    {
      type: 'mindfulness',
      title: 'Gratitude Meditation',
      description: 'Sit quietly and focus on feelings of gratitude throughout your body.',
      duration: '10-15 minutes',
      difficulty: 'medium',
      basedOnMood: 'grateful'
    }
  ]
};

const TYPE_ICONS = {
  breathing: '🫁',
  exercise: '🏃',
  mindfulness: '🧘',
  journaling: '📝',
  social: '👥',
  professional: '👨‍⚕️'
};

const TYPE_COLORS = {
  breathing: 'bg-blue-100 text-blue-800',
  exercise: 'bg-green-100 text-green-800',
  mindfulness: 'bg-purple-100 text-purple-800',
  journaling: 'bg-yellow-100 text-yellow-800',
  social: 'bg-pink-100 text-pink-800',
  professional: 'bg-red-100 text-red-800'
};

export default function MoodRecommendations({ currentMood, recentMoods, className = '' }: MoodRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<MoodRecommendation[]>([]);
  const [completedRecommendations, setCompletedRecommendations] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (currentMood) {
      setRecommendations(RECOMMENDATIONS[currentMood] || []);
    } else if (recentMoods && recentMoods.length > 0) {
      // Get recommendations based on most frequent recent mood
      const moodCounts = recentMoods.reduce((acc, mood) => {
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mostFrequentMood = Object.entries(moodCounts).reduce((a, b) => 
        moodCounts[a[0]] > moodCounts[b[0]] ? a : b
      )[0] as MoodType;
      
      setRecommendations(RECOMMENDATIONS[mostFrequentMood] || []);
    }
  }, [currentMood, recentMoods]);

  const handleCompleteRecommendation = (recommendation: MoodRecommendation) => {
    setCompletedRecommendations(prev => new Set(Array.from(prev).concat(recommendation.title)));
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className={`card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <span className="text-2xl mr-2">💡</span>
        Personalized Recommendations
      </h2>
      
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <motion.div
            key={recommendation.title}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              completedRecommendations.has(recommendation.title)
                ? 'bg-green-50 border-green-200 opacity-75'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{TYPE_ICONS[recommendation.type]}</span>
                  <h3 className="text-lg font-medium text-gray-800">{recommendation.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[recommendation.type]}`}>
                    {recommendation.type}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{recommendation.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>⏱️ {recommendation.duration}</span>
                  <span>📊 {recommendation.difficulty}</span>
                </div>
              </div>
              {!completedRecommendations.has(recommendation.title) && (
                <button
                  onClick={() => handleCompleteRecommendation(recommendation)}
                  className="ml-4 px-4 py-2 bg-ai-purple text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Complete
                </button>
              )}
              {completedRecommendations.has(recommendation.title) && (
                <div className="ml-4 flex items-center text-green-600">
                  <span className="text-lg mr-2">✓</span>
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {completedRecommendations.size > 0 && (
        <motion.div 
          className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-green-800 text-sm font-medium">
            Great job! You've completed {completedRecommendations.size} recommendation{completedRecommendations.size > 1 ? 's' : ''}. 
            Keep up the great work! 🎉
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
