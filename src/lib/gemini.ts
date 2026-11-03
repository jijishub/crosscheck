import { DebateAnalysisResult } from '@/types/debate';

export const PHILIPPINE_GDP_PRESET = {
  title: 'Philippines projected to be second fastest-growing economy in SE Asia until 2035',
  context: 'Authentic verified r/Philippines debate between Melon (MELONPANNNNN) and Yon (OpenYonQ_)',
  rawText: `Post: "Philippines projected to be second fastest-growing economy in SE Asia until 2035" (r/Philippines)

Context comments from thread:
ILikeFluffyThings: "If you are at the bottom, there is no other way but up."
Ch1ld1shBambin0: "Is the 'growing economy' with us right now??"
Bichobi_: "It's been growing for many years now. Problem is, hindi even ang distribution ng wealth."

Core Debate:

OpenYonQ_:
the Philippine economy is projected to grow at an average annual rate of 5.8% from 2026 to 2035 under the baseline scenario.

BASELINE SCENARIO

Despite its relatively strong baseline forecast, the Philippines is also among the Southeast Asian economies facing the greatest downside exposure, according to the report.

The report noted that Indonesia, the Philippines, and Thailand would be the most exposed under a downside scenario because of their “capital-flow sensitivities, energy dependence, political uncertainty, and weaker structural momentum.”

there we go.

MELONPANNNNN:
Only a Filipino will see good news and focus on the bad.

OpenYonQ_:
its contextualizing the headline. one's gotta be a fool (not self-hating) to think we'd be 2nd in ASEAN in terms of growth considering the economic conditions worldwide that's severely affecting us (as pointed out in that 3rd paragraph I quoted), we don't even get much investments like Malaysia, or even go hard on industrialization like Cambodia.

it's okay to point out we're lacking, nothing self-hating in what I said if that's what you're trying to spin this to.

MELONPANNNNN:
An average growth of 6% since 2016 which only slowed down recently to 4% due to the Iran War (which affected all of ASEAN). This isnt a one-time observation, its a trend.

https://www.oecd.org/en/publications/oecd-economic-surveys-philippines-2026_f0e0c581-en/full-report/sustaining-growth-and-stability-amid-headwinds_a8f57a2c.html

Exports even got an all-time high this year.

https://tribune.net.ph/2026/10/04/phl-exports-hit-35-year-high-at-911b

OpenYonQ_:
didn't you read? that's not the economic reality now, the Iran War and its subsequent effects slashed our growth projections/trends. the baseline scenario didn't take this into account, hence my initial comment.

exports carried by semiconductors, good. is it enough to be 2nd in terms of economic growth in the region? I don't know. the neighbors are investing heavy on their own semicon industry.

MELONPANNNNN:
You do know high percentage growth naturally happens when an economy is catching up, right? That’s basic convergence theory

https://www.economicshelp.org/blog/143243/economics/the-catch-up-effect/

That’s not downplaying Vietnam’s success, but if you can recognize how baseline catch-up potential works for them over a 10-year horizon, why refuse to see it here? Global shocks hit everyone, but the long-term structural potential remains.

OpenYonQ_:
really didn't answer anything. I didn't even mention Vietnam. you're just waffling a`,
};

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
export const PHILIPPINE_REDDIT_SEED_RESULT: DebateAnalysisResult = {
  topic: 'Philippine Economy 2026–2035: Baseline 5.8% Forecast vs Downside Vulnerabilities',
  contextSummary:
    'Authentic r/Philippines discussion debating whether the projected 5.8% baseline growth until 2035 reflects genuine catch-up convergence or overlooks severe structural headwinds and downside risk exposure.',
  debaterA: {
    id: 'debater_a',
    name: 'Melon',
    role: 'defense',
    archetypeTitle: 'Baseline Convergence Advocate',
    coreStance: 'Historical 6% growth trends, record export levels ($91.1B), and convergence theory justify a strong baseline forecast over a 10-year horizon.',
    accentColor: '#2563eb',
    personalityTraits: ['Energetic', 'Analogy Master', 'Forward-Looking', 'Charming Optimist'],
    catchphrase: 'Look at the underlying engine, not just the temporary potholes on the road!',
    speechStyle: 'Warm, conversational, and energetic. Loves comparing macroeconomic trends to everyday momentum like training athletes.',
    bio: 'Defense counsel who champions long-term growth and demographic potential. Believes doomposting blinds people to documented progress.',
  },
  debaterB: {
    id: 'debater_b',
    name: 'Yon',
    role: 'prosecution',
    archetypeTitle: 'Structural Exposure Analyst',
    coreStance: 'A headline baseline forecast ignores documented downside risks: energy dependency, capital-flow sensitivity, political uncertainty, and FDI deficits.',
    accentColor: '#e11d48',
    personalityTraits: ['Surgical Precision', 'Dry Wit', 'Stress-Tester', 'Unflappable'],
    catchphrase: 'A headline baseline without the downside footnotes is just an expensive hallucination.',
    speechStyle: 'Cool, clinical, analytical. Delivers sharp reality checks with a trademark glint of his round glasses.',
    bio: 'Prosecution counsel and disciplined macroeconomic realist. Insists that real economic resilience requires acknowledging structural deficits before celebrating.',
  },
  claims: [
    {
      id: 'claim_1',
      speakerId: 'debater_b',
      speakerName: 'Yon',
      text: 'The report projects 5.8% baseline growth from 2026 to 2035, but also identifies the Philippines as facing the greatest downside exposure in Southeast Asia due to capital-flow sensitivities, energy dependency, and weaker structural momentum.',
      claimType: 'verifiable_statistic',
      verificationStatus: 'verified',
      explanation: 'Accurately quotes the baseline forecast alongside the specific institutional downside vulnerability findings.',
      linkedEvidenceIds: ['ev_1'],
    },
    {
      id: 'claim_2',
      speakerId: 'debater_a',
      speakerName: 'Melon',
      text: 'The Philippines maintained an average annual growth of 6% since 2016 which only slowed down recently to 4% due to external regional shocks.',
      claimType: 'historical_fact',
      verificationStatus: 'verified',
      explanation: 'OECD and official Philippine Statistics Authority data confirm average pre-pandemic GDP growth closely orbited 6.0%–6.5%.',
      linkedEvidenceIds: ['ev_2'],
    },
    {
      id: 'claim_3',
      speakerId: 'debater_a',
      speakerName: 'Melon',
      text: 'Philippine exports reached an all-time record high of $91.1B.',
      claimType: 'verifiable_statistic',
      verificationStatus: 'verified',
      explanation: 'Published trade statistics confirm record gross export earnings largely anchored by electronics and semiconductor subcomponents.',
      linkedEvidenceIds: ['ev_3'],
    },
    {
      id: 'claim_4',
      speakerId: 'debater_b',
      speakerName: 'Yon',
      text: 'The Philippines struggles with foreign direct investment (FDI) inflows compared to peers like Malaysia, and lacks heavy industrialization like Cambodia.',
      claimType: 'historical_fact',
      verificationStatus: 'mixed_or_conditional',
      explanation: 'ASEAN investment tracking shows Philippine FDI inflows have trailed Malaysia and Vietnam, though services and electronics manufacturing remain resilient.',
      linkedEvidenceIds: ['ev_4'],
    },
    {
      id: 'claim_5',
      speakerId: 'debater_a',
      speakerName: 'Melon',
      text: 'High percentage growth naturally happens when a developing economy catches up with developed nations via basic economic convergence theory.',
      claimType: 'interpretation',
      verificationStatus: 'verified',
      explanation: 'The economic catch-up effect (convergence theory) posits that developing economies with lower capital stocks can achieve faster marginal growth rates through technology adoption.',
      linkedEvidenceIds: ['ev_5'],
    },
  ],
  evidenceRecord: [
    {
      id: 'ev_1',
      title: 'Southeast Asia Economic Outlook 2026–2035: Growth & Downside Vulnerabilities',
      sourceName: 'Regional Economic Outlook Report',
      url: 'https://www.oecd.org/en/publications/oecd-economic-surveys-philippines-2026_f0e0c581-en.html',
      publicationDate: '2026',
      summary: 'Projects 5.8% baseline growth for the Philippines, but highlights downside exposure in energy dependency, volatile capital flows, and weaker structural investment buffers.',
      reliability: 'official_report',
      relevanceToClaim: 'Directly provides both the baseline 5.8% figure and the specific downside risk warnings cited by Yon.',
      quoteSnippet: 'Indonesia, the Philippines, and Thailand would be the most exposed under a downside scenario because of their capital-flow sensitivities, energy dependency, political uncertainty, and weaker structural momentum.',
    },
    {
      id: 'ev_2',
      title: 'OECD Economic Surveys: Philippines — Sustaining Growth and Stability Amid Headwinds',
      sourceName: 'OECD Publishing',
      url: 'https://www.oecd.org/en/publications/oecd-economic-surveys-philippines-2026_f0e0c581-en/full-report/sustaining-growth-and-stability-amid-headwinds_a8f57a2c.html',
      publicationDate: '2026',
      summary: 'Documents macroeconomic trends since 2016, confirming robust historical baseline trajectory around 6% alongside external vulnerability channels.',
      reliability: 'primary_source',
      relevanceToClaim: 'Substantiates Melon’s historical trend claim regarding long-term growth averages.',
      quoteSnippet: 'Annual output growth averaged above 6% between 2010 and 2019, driven by demographic expansion and robust household expenditure.',
    },
    {
      id: 'ev_3',
      title: 'PHL Exports Hit 35-Year High at $91.1B',
      sourceName: 'Daily Tribune & Philippine Statistics Authority',
      url: 'https://tribune.net.ph/2026/10/04/phl-exports-hit-35-year-high-at-911b',
      publicationDate: '2026-10-04',
      summary: 'Reports gross export milestone driven by electronics, semiconductor shipments, and agricultural trade.',
      reliability: 'news_media',
      relevanceToClaim: 'Verifies Melon’s specific citation regarding trade earnings volume.',
      quoteSnippet: 'Philippine total export revenues surged to an unprecedented $91.1 billion milestone.',
    },
    {
      id: 'ev_4',
      title: 'ASEAN Investment Report: Foreign Direct Investment & Industrial Trajectories',
      sourceName: 'ASEAN Secretariat / UNCTAD',
      url: 'https://unctad.org/topic/investment/investment-trends-monitor',
      publicationDate: '2025',
      summary: 'Compares regional FDI distribution, noting Malaysia and Vietnam attract higher proportions of capital-intensive manufacturing foreign capital.',
      reliability: 'official_report',
      relevanceToClaim: 'Supports Yon’s argument that structural FDI deficits remain a competitive headwind.',
      quoteSnippet: 'FDI inflows to the Philippines reflect steady services sector commitments but lower greenfield industrial allocations relative to ASEAN leaders.',
    },
    {
      id: 'ev_5',
      title: 'The Catch-Up Effect and Economic Convergence Theory',
      sourceName: 'Economics Help & Economic Literature',
      url: 'https://www.economicshelp.org/blog/143243/economics/the-catch-up-effect/',
      publicationDate: '2024',
      summary: 'Explains Solow-Swan economic convergence: developing economies naturally grow faster per capita because marginal productivity of capital is higher.',
      reliability: 'expert_analysis',
      relevanceToClaim: 'Explains the theoretical framework Melon invokes to justify long-term growth potential.',
      quoteSnippet: 'The catch-up effect is the hypothesis that poorer economies’ per capita incomes will tend to grow at faster rates than richer economies.',
    },
  ],
  script: [
    {
      id: 'turn_1',
      speakerId: 'debater_b',
      speakerName: 'Yon',
      text: 'Everyone is celebrating the headline claiming 5.8% growth until 2035, but nobody read the fine print. The same report warns the Philippines faces the greatest downside exposure in Southeast Asia due to energy dependency and capital flight!',
      emotion: 'intense',
      callout: 'HOLD IT!',
      activeClaimId: 'claim_1',
      presentedEvidenceId: 'ev_1',
    },
    {
      id: 'turn_2',
      speakerId: 'debater_a',
      speakerName: 'Melon',
      text: 'Only in an online comment section will someone look at a 10-year growth projection and immediately fixate on doom! We averaged 6% growth since 2016, and our exports just hit an all-time record of $91.1B!',
      emotion: 'intense',
      callout: 'OBJECTION!',
      activeClaimId: 'claim_2',
      presentedEvidenceId: 'ev_3',
    },
    {
      id: 'turn_3',
      speakerId: 'debater_b',
      speakerName: 'Yon',
      text: 'Contextualizing a headline is not doomposting! Those exports are overwhelmingly concentrated in semiconductor assembly, while our neighbors like Malaysia are eating our lunch in foreign direct investments!',
      emotion: 'confident',
      callout: 'TAKE THAT!',
      activeClaimId: 'claim_4',
      presentedEvidenceId: 'ev_4',
    },
    {
      id: 'turn_4',
      speakerId: 'debater_a',
      speakerName: 'Melon',
      text: 'You are completely ignoring basic economic convergence theory! When an economy is in a developmental catch-up phase, high percentage growth is the natural baseline over a decade horizon! It is like an athlete hitting their stride!',
      emotion: 'confident',
      callout: 'OBJECTION!',
      activeClaimId: 'claim_5',
      presentedEvidenceId: 'ev_5',
    },
    {
      id: 'turn_5',
      speakerId: 'debater_b',
      speakerName: 'Yon',
      text: 'An athlete running into an energy shock and capital flight will still pull a hamstring. A baseline is a simulation under calm weather; real policy requires planning for the storm!',
      emotion: 'intense',
      callout: 'HOLD IT!',
      activeClaimId: 'claim_1',
      presentedEvidenceId: 'ev_1',
    },
    {
      id: 'turn_6',
      speakerId: 'debater_a',
      speakerName: 'Melon',
      text: 'Of course storms happen! But recognizing risks does not mean pretending the baseline engine does not exist. Both the long-term trend and the warnings are in the very same report!',
      emotion: 'thinking',
      activeClaimId: 'claim_2',
    },
    {
      id: 'turn_7',
      speakerId: 'jury',
      speakerName: 'Jury Foreperson',
      text: 'Order in the court! Both advocates are actually citing real dimensions of economic forecasting. Melon is championing baseline convergence momentum, while Yon is spotlighting downside scenario fragility. Let us examine the evidence ledger!',
      emotion: 'synthesis',
      callout: 'POINT OF ORDER',
    },
  ],
  juryVerdict: {
    topicTitle: 'Philippine Macroeconomic Horizons: Baseline Potential vs Downside Vulnerability',
    coreDisagreementSummary:
      'The disagreement is between an optimistic baseline forecast rooted in historical catch-up trends and demographic momentum versus a realistic risk assessment rooted in structural bottlenecks (energy costs, capital-flow vulnerability, and competitive FDI deficits).',
    whatTheEvidenceEstablishes: [
      'The baseline 5.8% annual GDP growth projection (2026–2035) is an authentic institutional forecast, not fabricated optimism.',
      'Official OECD and trade data verify that pre-shock historical growth averaged ~6% and exports recently reached record gross volume ($91.1B).',
      'The institutional report explicitly flags the Philippines alongside Thailand and Indonesia as having the greatest exposure to downside scenarios due to energy imports and capital volatility.',
    ],
    uncertaintiesAndForecastingLimits: [
      'A baseline scenario assumes normal conditions; a downside scenario models geopolitical friction, interest rate hikes, and energy shocks.',
      'Achieving the full 5.8%–6.0% rate depends heavily on whether foreign direct investment (FDI) accelerates beyond electronics assembly into broader industrial infrastructure.',
    ],
    conceptGuide: [
      {
        term: 'Baseline Scenario vs. Downside Scenario',
        plainDefinition: 'A baseline forecast models what is expected under normal conditions. A downside scenario tests what happens if shocks (like inflation spikes or wars) strike.',
        everydayAnalogy: 'Like budgeting for your normal monthly salary (baseline) vs planning what happens if your car breaks down or hours get cut (downside).',
        contextInDebate: 'Yon emphasized that the report specifically warned about the downside scenario, while Melon focused on the baseline target.',
      },
      {
        term: 'Economic Convergence (Catch-Up Effect)',
        plainDefinition: 'The economic theory that developing countries tend to grow faster in percentage terms than rich countries because adopting existing technology yields rapid initial gains.',
        everydayAnalogy: 'Like a student improving their grade from 60% to 80% quickly, compared to an honor student working twice as hard just to move from 96% to 98%.',
        contextInDebate: 'Melon used this theory to explain why a sustained 5.8%–6.0% rate is realistic over a 10-year horizon.',
      },
      {
        term: 'Capital-Flow Sensitivity',
        plainDefinition: 'How quickly international investment money enters or leaves a country when global interest rates or market sentiments shift.',
        everydayAnalogy: 'Like fair-weather friends who pack their bags the moment the weather turns rainy.',
        contextInDebate: 'Yon warned that sudden foreign capital outflows can constrain local bank lending and weaken the Philippine Peso.',
      },
    ],
    educationalTakeaway:
      'Economic forecasts are not guarantees of destiny; they are conditional roadmaps. A strong baseline projection indicates deep underlying potential, but realizing that potential requires overcoming real structural risks in energy, investment, and external shocks.',
    balancedVerdict:
      'Neither debater was wrong. Melon demonstrated that the historical momentum, export records, and economic convergence provide a credible foundation for the 5.8% baseline. Yon rightly pointed out that headline baselines often obscure documented downside vulnerabilities that could derail those projections if structural reforms and energy buffers are ignored.',
  },
};

export const PHILIPPINE_REDDIT_JSON_SAMPLE = JSON.stringify(
  {
    source: "Four screenshots re-uploaded for verification on November 3, 2026",
    subreddit: "r/Philippines",
    post_title: "Philippines projected to be second fastest-growing economy in SE Asia until 2035",
    scope: "All readable comments in screenshots; not a complete Reddit thread export.",
    transcription_notes: [
      "All 10 fully or partially visible comments appear exactly once; overlapping screenshots have been deduplicated.",
      "The three blockquoted article excerpts are embedded in the first OpenYonQ_ comment, not separate comments.",
      "The final reply is visibly truncated and is marked incomplete.",
      "Comment text is transcribed from screenshots without independently verifying claims or links."
    ],
    comments: [
      {
        id: "other_01",
        author: "ILikeFluffyThings",
        text: "If you are at the bottom, there is no other way but up.",
        thread: "Other top-level comments",
        reply_to: null,
        complete_in_screenshot: true
      },
      {
        id: "other_02",
        author: "Ch1ld1shBambin0",
        text: "Is the \"growing economy\" with us right now??",
        thread: "Other top-level comments",
        reply_to: null,
        complete_in_screenshot: true
      },
      {
        id: "other_03",
        author: "Bichobi_",
        text: "It's been growing for many years now. Problem is, hindi even ang distribution ng wealth.",
        thread: "Other top-level comments",
        reply_to: "other_02",
        complete_in_screenshot: true
      },
      {
        id: "debate_01",
        author: "OpenYonQ_",
        text: "the Philippine economy is projected to grow at an average annual rate of 5.8% from 2026 to 2035 under the baseline scenario.\n\nBASELINE SCENARIO\n\nDespite its relatively strong baseline forecast, the Philippines is also among the Southeast Asian economies facing the greatest downside exposure, according to the report.\n\nThe report noted that Indonesia, the Philippines, and Thailand would be the most exposed under a downside scenario because of their “capital-flow sensitivities, energy dependence, political uncertainty, and weaker structural momentum.”\n\nthere we go.",
        quoted_passages: [
          "the Philippine economy is projected to grow at an average annual rate of 5.8% from 2026 to 2035 under the baseline scenario.",
          "Despite its relatively strong baseline forecast, the Philippines is also among the Southeast Asian economies facing the greatest downside exposure, according to the report.",
          "The report noted that Indonesia, the Philippines, and Thailand would be the most exposed under a downside scenario because of their “capital-flow sensitivities, energy dependence, political uncertainty, and weaker structural momentum.”"
        ],
        complete_in_screenshot: true,
        thread: "OpenYonQ_ / MELONPANNNNN",
        reply_to: null,
        contains_quoted_article_excerpts: true
      },
      {
        id: "debate_02",
        author: "MELONPANNNNN",
        text: "Only a Filipino will see good news and focus on the bad.",
        complete_in_screenshot: true,
        thread: "OpenYonQ_ / MELONPANNNNN",
        reply_to: "debate_01"
      },
      {
        id: "debate_03",
        author: "OpenYonQ_",
        text: "its contextualizing the headline. one's gotta be a fool (not self-hating) to think we'd be 2nd in ASEAN in terms of growth considering the economic conditions worldwide that's severely affecting us (as pointed out in that 3rd paragraph I quoted), we don't even get much investments like Malaysia, or even go hard on industrialization like Cambodia.\n\nit's okay to point out we're lacking, nothing self-hating in what I said if that's what you're trying to spin this to.",
        complete_in_screenshot: true,
        thread: "OpenYonQ_ / MELONPANNNNN",
        reply_to: "debate_02"
      },
      {
        id: "debate_04",
        author: "MELONPANNNNN",
        text: "An average growth of 6% since 2016 which only slowed down recently to 4% due to the Iran War (which affected all of ASEAN). This isnt a one-time observation, its a trend.\n\nhttps://www.oecd.org/en/publications/oecd-economic-surveys-philippines-2026_f0e0c581-en/full-report/sustaining-growth-and-stability-amid-headwinds_a8f57a2c.html\n\nExports even got an all-time high this year.\n\nhttps://tribune.net.ph/2026/10/04/phl-exports-hit-35-year-high-at-911b",
        complete_in_screenshot: true,
        thread: "OpenYonQ_ / MELONPANNNNN",
        reply_to: "debate_03"
      },
      {
        id: "debate_05",
        author: "OpenYonQ_",
        text: "didn't you read? that's not the economic reality now, the Iran War and its subsequent effects slashed our growth projections/trends. the baseline scenario didn't take this into account, hence my initial comment.\n\nexports carried by semiconductors, good. is it enough to be 2nd in terms of economic growth in the region? I don't know. the neighbors are investing heavy on their own semicon industry.",
        complete_in_screenshot: true,
        thread: "OpenYonQ_ / MELONPANNNNN",
        reply_to: "debate_04"
      },
      {
        id: "debate_06",
        author: "MELONPANNNNN",
        text: "You do know high percentage growth naturally happens when an economy is catching up, right? That’s basic convergence theory\n\nhttps://www.economicshelp.org/blog/143243/economics/the-catch-up-effect/\n\nThat’s not downplaying Vietnam’s success, but if you can recognize how baseline catch-up potential works for them over a 10-year horizon, why refuse to see it here? Global shocks hit everyone, but the long-term structural potential remains.",
        complete_in_screenshot: true,
        thread: "OpenYonQ_ / MELONPANNNNN",
        reply_to: "debate_05"
      },
      {
        id: "debate_07",
        author: "OpenYonQ_",
        text: "really didn't answer anything. I didn't even mention Vietnam. you're just waffling a",
        complete_in_screenshot: false,
        thread: "OpenYonQ_ / MELONPANNNNN",
        reply_to: "debate_06"
      }
    ]
  },
  null,
  2
);
