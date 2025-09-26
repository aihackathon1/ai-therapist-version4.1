import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MoodAnalytics } from '@/lib/types/mood';
import { MoodDataProcessor } from '@/lib/utils/moodAnalysis';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Get mood analytics using the database function
    const { data: analyticsData, error: analyticsError } = await supabase
      .rpc('get_mood_analytics', { 
        user_uuid: user.id, 
        days_back: days 
      });

    if (analyticsError) {
      console.error('Error fetching analytics:', analyticsError);
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }

    const analytics = analyticsData?.[0];
    if (!analytics) {
      return NextResponse.json({ 
        success: true, 
        data: {
          totalEntries: 0,
          averageMood: 0,
          moodImprovement: 0,
          currentStreak: 0,
          dominantMood: 'neutral',
          moodDistribution: {}
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        totalEntries: parseInt(analytics.total_entries) || 0,
        averageMood: parseFloat(analytics.average_mood) || 0,
        moodImprovement: parseFloat(analytics.mood_improvement) || 0,
        currentStreak: analytics.current_streak || 0,
        dominantMood: analytics.dominant_mood || 'neutral',
        moodDistribution: analytics.mood_distribution || {}
      }
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
