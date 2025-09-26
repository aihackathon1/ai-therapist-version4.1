// Mood tracking and analytics types

export interface MoodEntry {
  id: string;
  userId: string;
  moodType: MoodType;
  intensity: number; // 1-100
  notes?: string;
  source: MoodSource;
  confidenceScore?: number; // 0-1 for AI-detected moods
  chatSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MoodType = 
  | 'angry' 
  | 'anxious' 
  | 'sad' 
  | 'neutral' 
  | 'happy' 
  | 'calm' 
  | 'stressed' 
  | 'grateful';

export type MoodSource = 'manual' | 'ai_detected' | 'chat_analysis';

export interface ChatSession {
  id: string;
  userId: string;
  sessionName?: string;
  startedAt: Date;
  endedAt?: Date;
  messageCount: number;
  averageSentiment?: number; // -1 to 1
  dominantEmotion?: string;
  sessionOutcome?: SessionOutcome;
  createdAt: Date;
}

export type SessionOutcome = 'improved' | 'neutral' | 'declined' | 'ongoing';

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  sentimentScore?: number; // -1 to 1
  emotionDetected?: string;
  confidenceScore?: number; // 0-1
  createdAt: Date;
}

export interface MoodInsight {
  id: string;
  userId: string;
  insightType: InsightType;
  title: string;
  description: string;
  data?: any;
  isActive: boolean;
  createdAt: Date;
}

export type InsightType = 'pattern' | 'trigger' | 'recommendation' | 'achievement';

export interface MoodAnalytics {
  totalEntries: number;
  averageMood: number;
  moodImprovement: number;
  currentStreak: number;
  dominantMood: string;
  moodDistribution: Record<string, number>;
}

export interface MoodTrendData {
  date: string;
  averageRating: number;
  entries: number;
  dominantMood: string;
  manualEntries: number;
  aiDetectedEntries: number;
}

export interface ChatInsight {
  recentSessions: ChatSession[];
  averageSessionLength: number;
  mostDiscussedTopics: string[];
  moodCorrelation: {
    beforeSession: number;
    afterSession: number;
    improvement: number;
  };
  sessionEffectiveness: number; // 0-100
}

export interface UserPreferences {
  id: string;
  userId: string;
  moodRemindersEnabled: boolean;
  reminderTime: string; // HH:MM format
  aiMoodDetectionEnabled: boolean;
  weeklyInsightsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MoodRecommendation {
  type: 'breathing' | 'journaling' | 'mindfulness' | 'exercise' | 'social' | 'professional';
  title: string;
  description: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  basedOnMood: MoodType;
  basedOnPattern?: string;
}

// Mood type configurations
export const MOOD_TYPES: Record<MoodType, {
  emoji: string;
  label: string;
  color: string;
  description: string;
  intensityRange: [number, number];
}> = {
  angry: {
    emoji: '😡',
    label: 'Angry',
    color: 'bg-red-100 hover:bg-red-200 border-red-300',
    description: 'Feeling frustrated or irritated',
    intensityRange: [60, 100]
  },
  anxious: {
    emoji: '😰',
    label: 'Anxious',
    color: 'bg-orange-100 hover:bg-orange-200 border-orange-300',
    description: 'Feeling worried or nervous',
    intensityRange: [40, 90]
  },
  sad: {
    emoji: '😔',
    label: 'Sad',
    color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300',
    description: 'Feeling down or melancholy',
    intensityRange: [30, 80]
  },
  neutral: {
    emoji: '😐',
    label: 'Neutral',
    color: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
    description: 'Feeling balanced or indifferent',
    intensityRange: [40, 60]
  },
  happy: {
    emoji: '😊',
    label: 'Happy',
    color: 'bg-green-100 hover:bg-green-200 border-green-300',
    description: 'Feeling joyful or content',
    intensityRange: [60, 100]
  },
  calm: {
    emoji: '😌',
    label: 'Calm',
    color: 'bg-purple-100 hover:bg-purple-200 border-purple-300',
    description: 'Feeling peaceful or relaxed',
    intensityRange: [50, 90]
  },
  stressed: {
    emoji: '😤',
    label: 'Stressed',
    color: 'bg-pink-100 hover:bg-pink-200 border-pink-300',
    description: 'Feeling overwhelmed or pressured',
    intensityRange: [50, 100]
  },
  grateful: {
    emoji: '🤗',
    label: 'Grateful',
    color: 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300',
    description: 'Feeling thankful or appreciative',
    intensityRange: [60, 100]
  }
};

// Sentiment analysis types
export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: EmotionDetection[];
}

export interface EmotionDetection {
  emotion: string;
  confidence: number;
  intensity: number;
}

// API response types
export interface MoodTrackingResponse {
  success: boolean;
  data?: MoodEntry;
  error?: string;
}

export interface AnalyticsResponse {
  success: boolean;
  data?: MoodAnalytics;
  error?: string;
}

export interface ChatAnalysisResponse {
  success: boolean;
  data?: {
    sentiment: SentimentAnalysis;
    suggestedMood?: MoodType;
    confidence?: number;
  };
  error?: string;
}
