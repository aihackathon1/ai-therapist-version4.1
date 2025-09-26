import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MoodAnalyzer } from '@/lib/utils/moodAnalysis';

// Ensure this route runs on Node.js runtime (required for OpenAI SDK v5)
export const runtime = 'nodejs';
import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export async function POST(request: NextRequest) {
  try {
    const { messages, sessionId } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY');
      const fallback = {
        choices: [{
          message: {
            content: "I'm here to support you. I'm having trouble connecting right now. Could we try a soothing 4-6 breath together while we reconnect?"
          }
        }]
      };
      return NextResponse.json(fallback);
    }
    
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages must be an array' }, { status: 400 });
    }

    // Get user from session for mood tracking
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Analyze the latest user message for mood detection
    const userMessages = messages.filter((msg: any) => msg.role === 'user');
    const latestUserMessage = userMessages[userMessages.length - 1];
    
    let moodAnalysis = null;
    if (latestUserMessage && user) {
      try {
        const sentimentAnalysis = MoodAnalyzer.analyzeSentiment(latestUserMessage.content);
        const moodSuggestion = MoodAnalyzer.suggestMoodFromSentiment(sentimentAnalysis);
        
        // Store mood analysis in database if confidence is high enough
        if (moodSuggestion.confidence > 0.6) {
          await supabase.from('mood_entries').insert({
            user_id: user.id,
            mood_type: moodSuggestion.mood,
            intensity: Math.round(sentimentAnalysis.emotions[0]?.intensity || 50),
            source: 'chat_analysis',
            confidence_score: moodSuggestion.confidence,
            chat_session_id: sessionId
          });
        }
        
        moodAnalysis = {
          sentiment: sentimentAnalysis,
          suggestedMood: moodSuggestion.mood,
          confidence: moodSuggestion.confidence
        };
      } catch (error) {
        console.error('Mood analysis error:', error);
      }
    }

    // Enhanced system prompt that considers mood analysis
    let systemPrompt = "You are an empathetic AI therapist. Always respond with warmth, validation, and non-judgmental support. Use a calm, encouraging tone. Ask gentle open-ended questions to help the user express themselves (e.g., 'How are you feeling right now?' or 'What has been weighing on your mind?'). Offer simple, practical coping strategies like 4-6 breathing, 5-4-3-2-1 grounding, brief journaling prompts, or mindfulness tips in short, easy steps. Do not provide medical diagnoses. If the user expresses severe distress or self-harm thoughts, encourage them to reach out to a trusted person or local crisis line immediately. Adapt your style to their emotional state: be softer and validating if upset; be practical if they want steps. Keep responses concise and skimmable.";

    // Add mood-aware context to system prompt
    if (moodAnalysis && moodAnalysis.confidence > 0.6) {
      const mood = moodAnalysis.suggestedMood;
      const sentiment = moodAnalysis.sentiment.sentiment;
      
      if (sentiment === 'negative' || ['sad', 'anxious', 'stressed', 'angry'].includes(mood)) {
        systemPrompt += `\n\nIMPORTANT: The user appears to be experiencing ${mood} feelings based on their recent message. Be extra gentle, validating, and offer immediate coping strategies. Focus on emotional support and practical steps they can take right now.`;
      } else if (sentiment === 'positive' || ['happy', 'calm', 'grateful'].includes(mood)) {
        systemPrompt += `\n\nIMPORTANT: The user appears to be in a positive mood (${mood}). Acknowledge their positive feelings, help them build on this momentum, and offer strategies to maintain this positive state.`;
      }
    }

    const systemMessage = {
      role: 'system',
      content: systemPrompt,
    } as const;

    const finalMessages = [systemMessage as any, ...messages];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: finalMessages,
      temperature: 0.6,
      max_tokens: 300,
      presence_penalty: 0,
      frequency_penalty: 0.3,
    });

    // Store the chat session and messages if user is authenticated
    if (user && sessionId) {
      try {
        // Update or create chat session
        const { data: session } = await supabase
          .from('chat_sessions')
          .select('id, message_count')
          .eq('id', sessionId)
          .single();

        if (session) {
          // Update existing session
          await supabase
            .from('chat_sessions')
            .update({ 
              message_count: session.message_count + 1,
              average_sentiment: moodAnalysis?.sentiment.confidence || null,
              dominant_emotion: moodAnalysis?.suggestedMood || null
            })
            .eq('id', sessionId);
        } else {
          // Create new session
          await supabase
            .from('chat_sessions')
            .insert({
              id: sessionId,
              user_id: user.id,
              message_count: 1,
              average_sentiment: moodAnalysis?.sentiment.confidence || null,
              dominant_emotion: moodAnalysis?.suggestedMood || null
            });
        }

        // Store the latest messages
        const latestMessages = messages.slice(-2); // Last user message and assistant response
        for (const message of latestMessages) {
          await supabase
            .from('chat_messages')
            .insert({
              session_id: sessionId,
              user_id: user.id,
              role: message.role,
              content: message.content,
              sentiment_score: message.role === 'user' ? moodAnalysis?.sentiment.confidence : null,
              emotion_detected: message.role === 'user' ? moodAnalysis?.suggestedMood : null,
              confidence_score: message.role === 'user' ? moodAnalysis?.confidence : null
            });
        }
      } catch (error) {
        console.error('Error storing chat data:', error);
      }
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    // Handle quota exceeded error with fallback response
    if (error.status === 429 && error.code === 'insufficient_quota') {
      const fallbackResponse = {
        choices: [{
          message: {
            content: "I'm here to listen and support you. While I'm experiencing some technical limitations right now, I want you to know that your feelings are valid and important. Would you like to try some breathing exercises or mindfulness techniques while we work through this together?"
          }
        }]
      };
      return NextResponse.json(fallbackResponse);
    }
    // For any other error, return a compassionate fallback so UI still shows a reply
    const genericFallback = {
      choices: [{
        message: {
          content: "I'm here with you. It seems I'm having trouble responding right now, but your feelings matter. Would you like a quick 4-6 breathing exercise or the 5-4-3-2-1 grounding method while we try again?"
        }
      }]
    };
    return NextResponse.json(genericFallback);
  }
}
