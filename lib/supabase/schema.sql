-- AI Therapist Database Schema
-- This file contains the SQL schema for the AI Therapist application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_name TEXT,
  timezone TEXT DEFAULT 'UTC'
);

-- Mood entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood_type TEXT NOT NULL CHECK (mood_type IN ('angry', 'anxious', 'sad', 'neutral', 'happy', 'calm', 'stressed', 'grateful')),
  intensity INTEGER NOT NULL CHECK (intensity >= 1 AND intensity <= 100),
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'ai_detected', 'chat_analysis')),
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  chat_session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_name TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  message_count INTEGER DEFAULT 0,
  average_sentiment DECIMAL(3,2),
  dominant_emotion TEXT,
  session_outcome TEXT CHECK (session_outcome IN ('improved', 'neutral', 'declined', 'ongoing')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  sentiment_score DECIMAL(3,2) CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
  emotion_detected TEXT,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mood patterns and insights table
CREATE TABLE IF NOT EXISTS mood_insights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('pattern', 'trigger', 'recommendation', 'achievement')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  data JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood_reminders_enabled BOOLEAN DEFAULT true,
  reminder_time TIME DEFAULT '20:00:00',
  ai_mood_detection_enabled BOOLEAN DEFAULT true,
  weekly_insights_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON mood_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_mood_entries_source ON mood_entries(source);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_started_at ON chat_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_insights_user_id ON mood_insights(user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mood_entries_updated_at BEFORE UPDATE ON mood_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate mood streak
CREATE OR REPLACE FUNCTION calculate_mood_streak(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    streak_count INTEGER := 0;
    current_date DATE := CURRENT_DATE;
    has_entry BOOLEAN;
BEGIN
    LOOP
        SELECT EXISTS(
            SELECT 1 FROM mood_entries 
            WHERE user_id = user_uuid 
            AND DATE(created_at) = current_date
        ) INTO has_entry;
        
        IF has_entry THEN
            streak_count := streak_count + 1;
            current_date := current_date - INTERVAL '1 day';
        ELSE
            EXIT;
        END IF;
        
        -- Prevent infinite loop
        IF streak_count > 365 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN streak_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get mood analytics
CREATE OR REPLACE FUNCTION get_mood_analytics(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
    total_entries BIGINT,
    average_mood DECIMAL,
    mood_improvement DECIMAL,
    current_streak INTEGER,
    dominant_mood TEXT,
    mood_distribution JSONB
) AS $$
BEGIN
    RETURN QUERY
    WITH mood_stats AS (
        SELECT 
            COUNT(*) as total_entries,
            AVG(intensity) as avg_intensity,
            MODE() WITHIN GROUP (ORDER BY mood_type) as dominant_mood_type
        FROM mood_entries 
        WHERE user_id = user_uuid 
        AND created_at >= NOW() - INTERVAL '1 day' * days_back
    ),
    mood_improvement AS (
        SELECT 
            COALESCE(
                (SELECT AVG(intensity) FROM mood_entries 
                 WHERE user_id = user_uuid 
                 AND created_at >= NOW() - INTERVAL '7 days') - 
                (SELECT AVG(intensity) FROM mood_entries 
                 WHERE user_id = user_uuid 
                 AND created_at >= NOW() - INTERVAL '14 days' 
                 AND created_at < NOW() - INTERVAL '7 days'), 0
            ) as improvement
    ),
    mood_dist AS (
        SELECT jsonb_object_agg(mood_type, mood_count) as distribution
        FROM (
            SELECT mood_type, COUNT(*) as mood_count
            FROM mood_entries 
            WHERE user_id = user_uuid 
            AND created_at >= NOW() - INTERVAL '1 day' * days_back
            GROUP BY mood_type
        ) subq
    )
    SELECT 
        ms.total_entries,
        ROUND(ms.avg_intensity, 2),
        ROUND(mi.improvement, 2),
        calculate_mood_streak(user_uuid),
        ms.dominant_mood_type,
        COALESCE(md.distribution, '{}'::jsonb)
    FROM mood_stats ms, mood_improvement mi, mood_dist md;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own mood entries" ON mood_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mood entries" ON mood_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mood entries" ON mood_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own mood entries" ON mood_entries FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own chat sessions" ON chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat sessions" ON chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own chat sessions" ON chat_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own chat messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own mood insights" ON mood_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mood insights" ON mood_insights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mood insights" ON mood_insights FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);
