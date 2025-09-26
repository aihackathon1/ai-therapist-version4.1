import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MoodEntry, MoodSource } from '@/lib/types/mood';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { moodType, intensity, notes, source = 'manual', confidenceScore, chatSessionId } = body;

    // Validate input
    if (!moodType || !intensity || intensity < 1 || intensity > 100) {
      return NextResponse.json({ error: 'Invalid mood data' }, { status: 400 });
    }

    // Create mood entry
    const { data: moodEntry, error } = await supabase
      .from('mood_entries')
      .insert({
        user_id: user.id,
        mood_type: moodType,
        intensity,
        notes,
        source,
        confidence_score: confidenceScore,
        chat_session_id: chatSessionId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating mood entry:', error);
      return NextResponse.json({ error: 'Failed to create mood entry' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: moodEntry });
  } catch (error) {
    console.error('Mood API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const days = parseInt(searchParams.get('days') || '30');

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get mood entries
    const { data: moodEntries, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching mood entries:', error);
      return NextResponse.json({ error: 'Failed to fetch mood entries' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: moodEntries });
  } catch (error) {
    console.error('Mood API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
