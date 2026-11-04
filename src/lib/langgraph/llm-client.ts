/**
 * Unified LLM Client for LangGraph Courtroom Nodes
 * Supports OpenAI-compatible AI Gateway (e.g. api.jizellecasia.site with luna, gpt-4o-mini, chatgpt-web)
 * and direct Google Gemini API fallback.
 */

export interface LLMCallConfig {
  apiKey?: string;
  gatewayUrl?: string;
  model?: string;
  temperature?: number;
}

export async function callLLMStructured<T>(
  systemPrompt: string,
  userPrompt: string,
  config: LLMCallConfig = {}
): Promise<T> {
  const gatewayUrl =
    config.gatewayUrl ||
    process.env.AI_GATEWAY_URL ||
    'https://api.jizellecasia.site/v1/chat/completions';
  const gatewayKey = config.apiKey || process.env.AI_GATEWAY_KEY;
  const model = config.model || process.env.AI_MODEL || 'luna';
  const temperature = config.temperature ?? 0.2;

  // Check if direct Gemini is explicitly targeted
  const isDirectGemini =
    (config.apiKey && config.apiKey.startsWith('AIza')) ||
    (!gatewayKey && process.env.GEMINI_API_KEY);

  if (isDirectGemini) {
    return callGeminiDirect<T>(
      systemPrompt,
      userPrompt,
      config.apiKey || process.env.GEMINI_API_KEY!,
      temperature
    );
  }

  if (!gatewayKey) {
    throw new Error(
      'AI Gateway key is required. Please set AI_GATEWAY_KEY or configure it in AI Settings.'
    );
  }

  // OpenAI-compatible format
  const res = await fetch(gatewayUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${gatewayKey}`,
    },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature,
    }),
  });

  const rawText = await res.text();
  let data: { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } };
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(
      `AI Gateway returned a non-JSON response (${res.status}). Output: ${rawText.slice(0, 250)}`
    );
  }

  if (!res.ok) {
    const msg = data.error?.message || `AI Gateway HTTP ${res.status}`;
    throw new Error(`AI Gateway Error: ${msg}`);
  }

  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error('AI Gateway returned an empty message content.');
  }

  return cleanAndParseJSON<T>(rawContent);
}

// Fallback direct Gemini caller
async function callGeminiDirect<T>(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  temperature: number
): Promise<T> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        },
      ],
      tools: [{ googleSearch: {} }],
      generationConfig: {
        temperature,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawContent) {
    throw new Error('Gemini API returned an empty response.');
  }

  return cleanAndParseJSON<T>(rawContent);
}

function cleanAndParseJSON<T>(raw: string): T {
  let cleaned = raw.trim();

  // Strip markdown code fences
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.error('Failed to parse LLM structured response:', cleaned);
    throw new Error(`Failed to parse LLM JSON: ${(err as Error).message}`);
  }
}
