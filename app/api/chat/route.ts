import { NextRequest, NextResponse } from 'next/server';

// Ensure this route runs on Node.js runtime (required for OpenAI SDK v5)
export const runtime = 'nodejs';
import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY');
      const fallback = {
        choices: [{
          message: {
            content: "I’m here to support you. I’m having trouble connecting right now. Could we try a soothing 4-6 breath together while we reconnect?"
          }
        }]
      };
      return NextResponse.json(fallback);
    }
    
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages must be an array' }, { status: 400 });
    }

    // Prepend therapeutic system prompt to ensure empathy, safety, and practical guidance
    const systemMessage = {
      role: 'system',
      content:
        "You are an empathetic AI therapist. Always respond with warmth, validation, and non-judgmental support. Use a calm, encouraging tone. Ask gentle open-ended questions to help the user express themselves (e.g., 'How are you feeling right now?' or 'What has been weighing on your mind?'). Offer simple, practical coping strategies like 4-6 breathing, 5-4-3-2-1 grounding, brief journaling prompts, or mindfulness tips in short, easy steps. Do not provide medical diagnoses. If the user expresses severe distress or self-harm thoughts, encourage them to reach out to a trusted person or local crisis line immediately. Adapt your style to their emotional state: be softer and validating if upset; be practical if they want steps. Keep responses concise and skimmable.",
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
          content: "I’m here with you. It seems I’m having trouble responding right now, but your feelings matter. Would you like a quick 4-6 breathing exercise or the 5-4-3-2-1 grounding method while we try again?"
        }
      }]
    };
    return NextResponse.json(genericFallback);
  }
}
