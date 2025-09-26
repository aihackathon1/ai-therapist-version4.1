import { NextRequest, NextResponse } from 'next/server';
import { MoodAnalyzer } from '@/lib/utils/moodAnalysis';
import { ChatAnalysisResponse } from '@/lib/types/mood';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ 
        success: false, 
        error: 'Message is required' 
      }, { status: 400 });
    }

    // Analyze sentiment and emotions
    const sentimentAnalysis = MoodAnalyzer.analyzeSentiment(message);
    const moodSuggestion = MoodAnalyzer.suggestMoodFromSentiment(sentimentAnalysis);

    const response: ChatAnalysisResponse = {
      success: true,
      data: {
        sentiment: sentimentAnalysis,
        suggestedMood: moodSuggestion.mood,
        confidence: moodSuggestion.confidence
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat analysis error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to analyze chat message' 
    }, { status: 500 });
  }
}
