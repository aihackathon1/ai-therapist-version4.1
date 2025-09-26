import { MoodEntry, MoodType, SentimentAnalysis, EmotionDetection, MoodTrendData, ChatInsight } from '@/lib/types/mood';

// Sentiment analysis utility functions
export class MoodAnalyzer {
  // Analyze text sentiment and suggest mood
  static analyzeSentiment(text: string): SentimentAnalysis {
    const positiveWords = [
      'happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'fantastic', 'good', 'better', 'best',
      'love', 'like', 'enjoy', 'pleased', 'satisfied', 'content', 'peaceful', 'calm', 'relaxed', 'grateful',
      'thankful', 'blessed', 'lucky', 'fortunate', 'optimistic', 'hopeful', 'confident', 'proud', 'accomplished'
    ];
    
    const negativeWords = [
      'sad', 'angry', 'mad', 'frustrated', 'upset', 'disappointed', 'worried', 'anxious', 'stressed', 'overwhelmed',
      'tired', 'exhausted', 'depressed', 'lonely', 'hurt', 'pain', 'suffering', 'struggle', 'difficult', 'hard',
      'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'fear', 'scared', 'nervous', 'panic'
    ];

    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;

    words.forEach(word => {
      if (positiveWords.includes(word)) positiveScore++;
      if (negativeWords.includes(word)) negativeScore++;
    });

    const totalWords = words.length;
    const positiveRatio = positiveScore / totalWords;
    const negativeRatio = negativeScore / totalWords;

    let sentiment: 'positive' | 'negative' | 'neutral';
    let confidence: number;

    if (positiveRatio > negativeRatio && positiveRatio > 0.1) {
      sentiment = 'positive';
      confidence = Math.min(positiveRatio * 2, 1);
    } else if (negativeRatio > positiveRatio && negativeRatio > 0.1) {
      sentiment = 'negative';
      confidence = Math.min(negativeRatio * 2, 1);
    } else {
      sentiment = 'neutral';
      confidence = 0.5;
    }

    // Detect specific emotions
    const emotions: EmotionDetection[] = this.detectEmotions(text);

    return {
      sentiment,
      confidence,
      emotions
    };
  }

  // Detect specific emotions from text
  static detectEmotions(text: string): EmotionDetection[] {
    const emotionPatterns = {
      angry: ['angry', 'mad', 'furious', 'rage', 'irritated', 'frustrated', 'annoyed'],
      anxious: ['anxious', 'worried', 'nervous', 'panic', 'fear', 'scared', 'uneasy'],
      sad: ['sad', 'depressed', 'down', 'blue', 'melancholy', 'gloomy', 'sorrowful'],
      happy: ['happy', 'joy', 'excited', 'cheerful', 'delighted', 'thrilled', 'ecstatic'],
      calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'composed', 'centered'],
      stressed: ['stressed', 'overwhelmed', 'pressured', 'strained', 'tense', 'burdened'],
      grateful: ['grateful', 'thankful', 'appreciative', 'blessed', 'fortunate', 'lucky']
    };

    const emotions: EmotionDetection[] = [];
    const textLower = text.toLowerCase();

    Object.entries(emotionPatterns).forEach(([emotion, keywords]) => {
      let matches = 0;
      keywords.forEach(keyword => {
        if (textLower.includes(keyword)) matches++;
      });

      if (matches > 0) {
        emotions.push({
          emotion,
          confidence: Math.min(matches / keywords.length, 1),
          intensity: Math.min(matches * 20, 100)
        });
      }
    });

    return emotions.sort((a, b) => b.confidence - a.confidence);
  }

  // Suggest mood type based on sentiment analysis
  static suggestMoodFromSentiment(analysis: SentimentAnalysis): { mood: MoodType; confidence: number } {
    if (analysis.emotions.length === 0) {
      return {
        mood: analysis.sentiment === 'positive' ? 'happy' : analysis.sentiment === 'negative' ? 'sad' : 'neutral',
        confidence: analysis.confidence * 0.7
      };
    }

    const topEmotion = analysis.emotions[0];
    const moodMap: Record<string, MoodType> = {
      angry: 'angry',
      anxious: 'anxious',
      sad: 'sad',
      happy: 'happy',
      calm: 'calm',
      stressed: 'stressed',
      grateful: 'grateful'
    };

    return {
      mood: moodMap[topEmotion.emotion] || 'neutral',
      confidence: topEmotion.confidence
    };
  }
}

// Mood data processing utilities
export class MoodDataProcessor {
  // Calculate mood trends over time
  static calculateTrends(entries: MoodEntry[], days: number = 30): MoodTrendData[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentEntries = entries.filter(entry => entry.createdAt >= cutoffDate);
    
    // Group by day
    const dailyGroups = recentEntries.reduce((acc, entry) => {
      const dateKey = entry.createdAt.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(entry);
      return acc;
    }, {} as Record<string, MoodEntry[]>);

    // Process each day
    return Object.entries(dailyGroups).map(([date, dayEntries]) => {
      const averageRating = dayEntries.reduce((sum, entry) => sum + entry.intensity, 0) / dayEntries.length;
      const dominantMood = this.getMostFrequentMood(dayEntries);
      const manualEntries = dayEntries.filter(entry => entry.source === 'manual').length;
      const aiDetectedEntries = dayEntries.filter(entry => entry.source !== 'manual').length;

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        averageRating: Math.round(averageRating),
        entries: dayEntries.length,
        dominantMood,
        manualEntries,
        aiDetectedEntries
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Get most frequent mood from entries
  static getMostFrequentMood(entries: MoodEntry[]): string {
    if (entries.length === 0) return 'neutral';

    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.moodType] = (acc[entry.moodType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(moodCounts).reduce((a, b) => 
      moodCounts[a[0]] > moodCounts[b[0]] ? a : b
    )[0];
  }

  // Calculate mood improvement over time
  static calculateImprovement(entries: MoodEntry[]): number {
    if (entries.length < 2) return 0;

    const sortedEntries = [...entries].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const firstWeek = sortedEntries.slice(0, Math.min(7, sortedEntries.length));
    const lastWeek = sortedEntries.slice(-Math.min(7, sortedEntries.length));

    const firstWeekAvg = firstWeek.reduce((sum, entry) => sum + entry.intensity, 0) / firstWeek.length;
    const lastWeekAvg = lastWeek.reduce((sum, entry) => sum + entry.intensity, 0) / lastWeek.length;

    return Math.round(lastWeekAvg - firstWeekAvg);
  }

  // Calculate mood streak
  static calculateStreak(entries: MoodEntry[]): number {
    if (entries.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      
      const hasEntry = entries.some(entry => {
        const entryDate = new Date(entry.createdAt);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === checkDate.getTime();
      });
      
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // Generate mood insights
  static generateInsights(entries: MoodEntry[]): string[] {
    const insights: string[] = [];
    
    if (entries.length === 0) return insights;

    const trends = this.calculateTrends(entries, 7);
    const improvement = this.calculateImprovement(entries);
    const streak = this.calculateStreak(entries);

    // Streak insights
    if (streak >= 7) {
      insights.push(`Great job! You've been tracking your mood for ${streak} days straight.`);
    } else if (streak >= 3) {
      insights.push(`You're building a good habit with ${streak} days of mood tracking.`);
    }

    // Improvement insights
    if (improvement > 10) {
      insights.push(`Your mood has improved significantly over the past week (+${improvement} points).`);
    } else if (improvement > 0) {
      insights.push(`You're seeing positive changes in your mood (+${improvement} points this week).`);
    }

    // Pattern insights
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.moodType] = (acc[entry.moodType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantMood = Object.entries(moodCounts).reduce((a, b) => 
      moodCounts[a[0]] > moodCounts[b[0]] ? a : b
    )[0];

    if (moodCounts[dominantMood[0]] > entries.length * 0.4) {
      insights.push(`You've been feeling ${dominantMood[0]} frequently. Consider what might be contributing to this.`);
    }

    return insights;
  }
}

// Chat analysis utilities
export class ChatAnalyzer {
  // Analyze chat session effectiveness
  static analyzeSessionEffectiveness(session: any, moodBefore?: number, moodAfter?: number): number {
    let effectiveness = 50; // Base score

    // Factor in session length (longer sessions might be more effective)
    if (session.messageCount > 10) effectiveness += 10;
    if (session.messageCount > 20) effectiveness += 10;

    // Factor in mood improvement
    if (moodBefore && moodAfter) {
      const improvement = moodAfter - moodBefore;
      if (improvement > 20) effectiveness += 20;
      else if (improvement > 10) effectiveness += 10;
      else if (improvement > 0) effectiveness += 5;
      else if (improvement < -10) effectiveness -= 10;
    }

    // Factor in sentiment
    if (session.averageSentiment) {
      if (session.averageSentiment > 0.3) effectiveness += 10;
      else if (session.averageSentiment < -0.3) effectiveness -= 10;
    }

    return Math.max(0, Math.min(100, effectiveness));
  }

  // Extract topics from chat messages
  static extractTopics(messages: any[]): string[] {
    const topicKeywords = {
      'work': ['work', 'job', 'career', 'office', 'boss', 'colleague', 'meeting', 'project'],
      'relationships': ['relationship', 'partner', 'friend', 'family', 'social', 'dating', 'marriage'],
      'health': ['health', 'sick', 'pain', 'doctor', 'medication', 'exercise', 'sleep'],
      'anxiety': ['anxiety', 'worry', 'stress', 'panic', 'nervous', 'fear', 'overwhelmed'],
      'depression': ['depression', 'sad', 'down', 'hopeless', 'empty', 'worthless', 'suicidal'],
      'self-care': ['self-care', 'relaxation', 'meditation', 'mindfulness', 'breathing', 'yoga'],
      'goals': ['goal', 'plan', 'future', 'dream', 'aspiration', 'ambition', 'success']
    };

    const topicCounts: Record<string, number> = {};
    const allText = messages.map(m => m.content).join(' ').toLowerCase();

    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      let count = 0;
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        const matches = allText.match(regex);
        if (matches) count += matches.length;
      });
      if (count > 0) topicCounts[topic] = count;
    });

    return Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);
  }
}
