import { NextRequest, NextResponse } from 'next/server';
import { runCourtroomDebatePipeline } from '@/lib/langgraph/graph';
import { analyzeDebateWithAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { debateText, topicHint, apiKey, gatewayUrl, model, temperature } = body;

    if (!debateText || typeof debateText !== 'string' || debateText.trim().length < 15) {
      return NextResponse.json(
        { error: 'Please provide at least 15 characters of debate or discussion text.' },
        { status: 400 }
      );
    }

    try {
      // Execute the LangGraph 4-node pipeline
      const pipelineOutput = await runCourtroomDebatePipeline({
        debateText,
        topicHint,
        apiKey: apiKey?.trim(),
        gatewayUrl,
        model,
        temperature,
      });

      return NextResponse.json({
        ...pipelineOutput.result,
        stepLogs: pipelineOutput.stepLogs,
      });
    } catch (langGraphError) {
      console.warn('LangGraph pipeline encountered an issue, running unified fallback:', langGraphError);
      // Resilient fallback to direct single-turn analysis if needed
      const fallbackResult = await analyzeDebateWithAI(debateText, topicHint, apiKey?.trim());
      return NextResponse.json(fallbackResult);
    }
  } catch (error) {
    console.error('API /api/analyze error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred while analyzing debate';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
