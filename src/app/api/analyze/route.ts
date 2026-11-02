import { NextRequest, NextResponse } from 'next/server';
import { analyzeDebateWithAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { debateText, topicHint, apiKey } = body;

    if (!debateText || typeof debateText !== 'string' || debateText.trim().length < 15) {
      return NextResponse.json(
        { error: 'Please provide at least 15 characters of debate or discussion text.' },
        { status: 400 }
      );
    }

    const result = await analyzeDebateWithAI(debateText, topicHint, apiKey?.trim());
    return NextResponse.json(result);
  } catch (error) {
    console.error('API /api/analyze error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred while analyzing debate';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
