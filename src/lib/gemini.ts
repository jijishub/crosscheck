import { DebateAnalysisResult } from '@/types/debate';

const SYSTEM_PROMPT = `You are the Supreme Court Debate Analyst & Impartial Jury Research Clerk for CrossCheck!, an Ace Attorney-inspired educational debate platform.
Your mission is NOT to declare an arbitrary dramatic winner, but to educate users who may be unfamiliar with the topic through entertaining, character-driven courtroom drama.

CHARACTER PERSONALITY MANDATE:
- Debater A (Defense, usually 'Melon'):
  - Personality: Energetic, charmingly optimistic, passionate champion of forward-looking potential.
  - Speech style: Uses relatable everyday metaphors (e.g. cooking, running a marathon, gardening, vehicle engines) so beginners immediately get the point.
  - Never cynical or malicious; always defends the glass-half-full baseline with enthusiastic theatricality.
- Debater B (Prosecution, usually 'Yon'):
  - Personality: Cool, composed, razor-sharp analytical realist. Allergic to blind hype and unexamined buzzwords.
  - Speech style: Clinical precision mixed with dry wit. Taps pen on desk, pushes up glasses with an anime glint, and insists on stress-testing downside footnotes.
- The Jury Foreperson:
  - Warm, dignified, teacher-like academic judge who synthesizes both sides, explains jargon with simple analogies, and refuses to pick a shallow binary winner.

You must:
1. Deconstruct the user's submitted debate fairly and accurately. Identify Debater A and Debater B, their stances, their distinct personalities, and their underlying arguments.
2. Formulate checkable claims and investigate them using authoritative real-world facts, statistics, historical dates, and verifiable evidence sources.
3. Categorize every claim strictly:
   - 'verifiable_statistic'
   - 'historical_fact'
   - 'forecast_prediction'
   - 'value_judgment'
   - 'interpretation'
4. Distinguish verified facts from predictive forecasts or opinions. Provide real primary/official source links or reputable institutional URLs (e.g. World Bank, PSA, BSP, IMF, official agencies), exact dates, and summary findings.
5. Create an entertaining, visual novel courtroom dialogue script (6-10 turns) where Debater A and Debater B exchange points with distinctive character voices. Use theatrical moments like 'OBJECTION!', 'HOLD IT!', or 'TAKE THAT!' when claims conflict or evidence is produced.
6. Have the neutral Jury Foreperson explain key concepts using plain English and relatable analogies ('Jargon Buster') so a complete beginner can understand the debate.
7. Deliver a qualified, balanced synthesis clarifying what is known, what remains uncertain or conditional, and the key lesson for readers.

You MUST respond strictly with a valid JSON object matching this TypeScript structure:
{
  "topic": string,
  "contextSummary": string,
  "debaterA": {
    "id": "debater_a",
    "name": string,
    "role": "defense",
    "archetypeTitle": string,
    "coreStance": string,
    "accentColor": "#2563eb",
    "personalityTraits": [string, string, string],
    "catchphrase": string,
    "speechStyle": string,
    "bio": string
  },
  "debaterB": {
    "id": "debater_b",
    "name": string,
    "role": "prosecution",
    "archetypeTitle": string,
    "coreStance": string,
    "accentColor": "#e11d48",
    "personalityTraits": [string, string, string],
    "catchphrase": string,
    "speechStyle": string,
    "bio": string
  },
  "claims": [
    {
      "id": "claim_1",
      "speakerId": "debater_a" | "debater_b",
      "speakerName": string,
      "text": string,
      "claimType": "verifiable_statistic" | "historical_fact" | "forecast_prediction" | "value_judgment" | "interpretation",
      "verificationStatus": "verified" | "contradicted" | "unverified" | "mixed_or_conditional" | "opinion_not_testable",
      "explanation": string,
      "linkedEvidenceIds": ["ev_1"]
    }
  ],
  "evidenceRecord": [
    {
      "id": "ev_1",
      "title": string,
      "sourceName": string,
      "url": string,
      "publicationDate": string,
      "summary": string,
      "reliability": "primary_source" | "official_report" | "news_media" | "expert_analysis",
      "relevanceToClaim": string,
      "quoteSnippet": string
    }
  ],
  "script": [
    {
      "id": "turn_1",
      "speakerId": "debater_a" | "debater_b" | "jury",
      "speakerName": string,
      "text": string,
      "emotion": "neutral" | "confident" | "thinking" | "intense" | "surprised" | "synthesis",
      "callout": "OBJECTION!" | "HOLD IT!" | "TAKE THAT!" | "POINT OF ORDER" | null,
      "activeClaimId": "claim_1",
      "presentedEvidenceId": "ev_1"
    }
  ],
  "juryVerdict": {
    "topicTitle": string,
    "coreDisagreementSummary": string,
    "whatTheEvidenceEstablishes": [string, string],
    "uncertaintiesAndForecastingLimits": [string, string],
    "conceptGuide": [
      {
        "term": string,
        "plainDefinition": string,
        "everydayAnalogy": string,
        "contextInDebate": string
      }
    ],
    "educationalTakeaway": string,
    "balancedVerdict": string
  }
}
}

Do not wrap in markdown or backticks if possible, or wrap cleanly in \`\`\`json ... \`\`\`. Output valid parseable JSON only.`;

export async function analyzeDebateWithAI(
  debateText: string,
  topicHint?: string,
  apiKeyOverride?: string
): Promise<DebateAnalysisResult> {
  const gatewayUrl =
    process.env.AI_GATEWAY_URL || 'https://api.jizellecasia.site/v1/chat/completions';
  const gatewayKey = apiKeyOverride || process.env.AI_GATEWAY_KEY;
  const model = process.env.AI_MODEL || 'luna';

  // If user provided a Gemini key or gateway key isn't configured but Gemini is:
  const isGeminiKey = (apiKeyOverride && apiKeyOverride.startsWith('AIza')) || (!gatewayKey && process.env.GEMINI_API_KEY);

  if (isGeminiKey) {
    return analyzeWithGeminiDirect(debateText, topicHint, apiKeyOverride || process.env.GEMINI_API_KEY!);
  }

  if (!gatewayKey) {
    throw new Error(
      'AI Gateway key is required. Please set AI_GATEWAY_KEY in .env.local or enter your key in the Courtroom docket setup.'
    );
  }

  // Use the OpenAI-compatible AI Gateway (e.g. luna @ api.jizellecasia.site)
  const userPrompt = `Topic Hint: ${topicHint || 'Determine from the text'}

Debate / Discussion to analyze:
${debateText}`;

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
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
    }),
  });

  const rawText = await res.text();
  let data: { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } };
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(
      `AI Gateway returned a non-JSON response (${res.status}). Gateway output: ${rawText.slice(0, 250)}`
    );
  }

  if (!res.ok) {
    const msg = data.error?.message || `AI Gateway HTTP ${res.status}`;
    throw new Error(`AI Gateway Error: ${msg}`);
  }

  const rawContent = data.choices?.[0]?.message?.content;

  if (!rawContent) {
    throw new Error('AI Gateway returned an empty message content. Please try again.');
  }

  return cleanAndParseJSON(rawContent);
}

// Fallback method for direct Gemini if needed
async function analyzeWithGeminiDirect(
  debateText: string,
  topicHint?: string,
  apiKey?: string
): Promise<DebateAnalysisResult> {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('Gemini API Key is missing.');
  }

  const userPrompt = `Topic Hint: ${topicHint || 'Determine from the text'}

Debate / Discussion to analyze:
${debateText}`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
    key
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
          parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }],
        },
      ],
      tools: [{ googleSearch: {} }],
      generationConfig: {
        temperature: 0.2,
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

  const result = cleanAndParseJSON(rawContent);

  // Enrich with grounding chunks if present
  const groundingChunks = data.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (Array.isArray(groundingChunks) && groundingChunks.length > 0 && Array.isArray(result.evidenceRecord)) {
    groundingChunks.forEach((chunk, index) => {
      if (chunk.web?.uri && result.evidenceRecord[index]) {
        if (!result.evidenceRecord[index].url || result.evidenceRecord[index].url.startsWith('#')) {
          result.evidenceRecord[index].url = chunk.web.uri;
          if (chunk.web.title) {
            result.evidenceRecord[index].sourceName = chunk.web.title;
          }
        }
      }
    });
  }

  return result;
}

// Backward-compatible alias
export const analyzeDebateWithGemini = analyzeDebateWithAI;

function cleanAndParseJSON(raw: string): DebateAnalysisResult {
  let cleaned = raw.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  // Find first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned) as DebateAnalysisResult;
  } catch (err) {
    console.error('Failed to parse AI structured response:', cleaned);
    throw new Error(`Failed to parse AI structured response: ${(err as Error).message}`);
  }
}
