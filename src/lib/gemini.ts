import { DebateAnalysisResult } from '@/types/debate';

export const PHILIPPINE_GDP_PRESET = {
  title: 'Philippine GDP Growth Forecast: Historical Drivers vs Slowdown Risks',
  context: 'Reddit r/Philippines macroeconomic disagreement over headline GDP growth targets',
  rawText: `User Melon:
Look at the historical pattern from 2010 to 2019. The Philippines consistently maintained 6.0% to 6.5% annual GDP growth driven by demographic dividend, strong private consumption (household spending), and steady remittances from Overseas Filipino Workers (OFWs) exceeding $35B annually. Even with inflation shocks, consumer resilience remains our structural buffer. The government's 6.0%-7.0% target for 2024-2025 is an achievable baseline, not pure optimism.

User OpenYon:
Historical patterns don't protect us from present structural headwinds. In 2023, growth slowed to 5.6%, falling short of the state's 6.0%-7.5% target. High borrowing costs from the BSP keeping policy rates at 6.50% are squeezing commercial loans and private investment. Furthermore, our debt-to-GDP ratio has climbed above 60% post-pandemic, drastically narrowing fiscal space for infrastructure spending. Remittances can't carry everything if consumer purchasing power is being eroded by persistent food and utility inflation. Calling 6.5%+ an easy baseline ignores these slowdown risks.`,
};

export const AI_CODING_PRESET = {
  title: 'AI Coding Assistants: Velocity Multiplier vs Architecture Quality Debt',
  context: 'Hacker News / Tech Twitter debate on LLM code generation in engineering teams',
  rawText: `SeniorDev_Alex:
AI coding tools are the greatest developer productivity leap since IDE auto-complete. GitHub Copilot research shows developers complete tasks up to 55% faster and report higher job satisfaction. Boilerplate, unit tests, and API glue code that used to take days now take minutes. It frees engineers to think about high-level system architecture rather than syntax minutiae.

StaffArchitect_Sam:
Speed of producing lines of code is the wrong metric. GitClear's analysis of over 150 million lines of code found a significant increase in code churn (code replaced within two weeks) and a decline in code refactoring and reuse since AI tools surged. Junior developers are shipping hallucinations and security vulnerabilities because they don't understand the generated abstractions. Faster typing just means faster accumulation of technical debt unless rigorous review standards are strictly enforced.`,
};

const SYSTEM_PROMPT = `You are the Supreme Court Debate Analyst & Impartial Jury Research Clerk for an Ace Attorney-inspired educational platform.
Your mission is NOT to declare an arbitrary dramatic winner, but to educate users who may be unfamiliar with the topic.
You must:
1. Deconstruct the user's submitted debate fairly and accurately. Identify Debater A and Debater B, their stances, and their underlying arguments.
2. Formulate checkable claims and investigate them using authoritative real-world facts, statistics, historical dates, and verifiable evidence sources.
3. Categorize every claim strictly:
   - 'verifiable_statistic'
   - 'historical_fact'
   - 'forecast_prediction'
   - 'value_judgment'
   - 'interpretation'
4. Distinguish verified facts from predictive forecasts or opinions. Provide real primary/official source links or reputable institutional URLs (e.g. World Bank, PSA, BSP, IMF, official agencies), exact dates, and summary findings.
5. Create an entertaining, visual novel courtroom dialogue script (6-10 turns) where Debater A and Debater B exchange points. Use theatrical moments like 'OBJECTION!', 'HOLD IT!', or 'TAKE THAT!' when claims conflict or evidence is produced.
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
    "accentColor": "#2563eb"
  },
  "debaterB": {
    "id": "debater_b",
    "name": string,
    "role": "prosecution",
    "archetypeTitle": string,
    "coreStance": string,
    "accentColor": "#e11d48"
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

  if (!res.ok) {
    const errorText = await res.text();
    let parsedError = errorText;
    try {
      const jsonErr = JSON.parse(errorText);
      parsedError = jsonErr.error?.message || jsonErr.message || errorText;
    } catch {
      // keep parsedError
    }
    throw new Error(`AI Gateway Error (${res.status}): ${parsedError}`);
  }

  const data = await res.json();
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
