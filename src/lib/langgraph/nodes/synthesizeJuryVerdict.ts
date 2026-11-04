import { CourtroomState, CourtroomUpdate, StepLogEntry } from '../state';
import { callLLMStructured } from '../llm-client';
import { JurySynthesis, DebateAnalysisResult } from '@/types/debate';

interface JurySynthesisOutput {
  juryVerdict: JurySynthesis;
}

const JURY_SYSTEM_PROMPT = `You are Node 4 (Jury Foreperson, Economic Jurist & Educational Synthesizer) in the CrossCheck! LangGraph courtroom pipeline.
Your mission is to impartially synthesize the debate, evaluate evidence with intellectual honesty, translate difficult jargon into plain English using relatable analogies ("Jargon Buster"), and distinguish fact from fallacy.

RIGOROUS JURY MANDATE:
1. Explain the core disagreement without ideological bias or strawmanning.
2. DO NOT default to a lazy "both debaters were equally right" conclusion:
   - Identify which specific arguments survived factual scrutiny.
   - Explicitly list in "unsupportedOrMisleadingClaims" any claims that suffered numerical inflation, unit confusion (e.g. monthly vs annual), or misattribution.
3. Provide at least 2-3 key concepts in "conceptGuide" with:
   - "term"
   - "plainDefinition" (accessible to a high schooler)
   - "everydayAnalogy" (e.g. household budget, marathon stamina, baking)
   - "contextInDebate" (why the debaters fought over it)
4. Detail "whatTheEvidenceEstablishes" (facts backed by primary data).
5. Detail "uncertaintiesAndForecastingLimits" (what forecasts cannot guarantee).
6. Provide "practicalCitizenTakeaways": explain what the debate actually means for ordinary citizens / readers and what indicators they should monitor.
7. End with a balanced, qualified synthesis clarifying the real-world outcome.

Respond STRICTLY with a valid JSON object matching:
{
  "juryVerdict": {
    "topicTitle": string,
    "coreDisagreementSummary": string,
    "whatTheEvidenceEstablishes": [string, string],
    "unsupportedOrMisleadingClaims": [string, string],
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
    "balancedVerdict": string,
    "practicalCitizenTakeaways": [string, string]
  }
}`;

export async function synthesizeJuryVerdictNode(
  state: CourtroomState
): Promise<CourtroomUpdate> {
  const stepStart = new Date().toISOString();
  if (state.error) {
    return {};
  }

  try {
    const claimsText = (state.claims || [])
      .map(
        (c) =>
          `- ${c.speakerName}: "${c.text}" [${c.claimType}] => ${c.verificationStatus}${
            c.numericalVerification ? ` (Claimed: ${c.numericalVerification.claimedValue} vs Verified: ${c.numericalVerification.verifiedValue} - ${c.numericalVerification.unitOrScope})` : ''
          }`
      )
      .join('\n');

    const userPrompt = `Topic: ${state.topic}
Context: ${state.contextSummary}

Debater A (Defense): ${state.debaterA?.name} - ${state.debaterA?.coreStance}
Debater B (Prosecution): ${state.debaterB?.name} - ${state.debaterB?.coreStance}

Claims & Verification Audit:
${claimsText}

Generate the final rigorous jury synthesis, Jargon Buster analogies, and citizen takeaways:`;

    const output = await callLLMStructured<JurySynthesisOutput>(
      JURY_SYSTEM_PROMPT,
      userPrompt,
      {
        apiKey: state.apiKey,
        gatewayUrl: state.gatewayUrl,
        model: state.model,
        temperature: state.temperature ?? 0.2,
      }
    );

    // Consolidate the full DebateAnalysisResult
    const finalResult: DebateAnalysisResult = {
      research: {
        mode: 'grounded',
        summary: `Synthesized via CrossCheck! LangGraph pipeline across ${state.claims?.length || 0} claims and ${state.evidenceRecord?.length || 0} evidence sources.`,
        searchedAt: new Date().toISOString(),
      },
      topic: state.topic || 'Debate Breakdown',
      contextSummary: state.contextSummary || '',
      preTrialBriefing: state.preTrialBriefing,
      debaterA: state.debaterA!,
      debaterB: state.debaterB!,
      claims: state.claims || [],
      evidenceRecord: state.evidenceRecord || [],
      script: state.script || [],
      juryVerdict: output.juryVerdict,
    };

    const log: StepLogEntry = {
      step: 'synthesizeJuryVerdict',
      status: 'completed',
      timestamp: stepStart,
      message: `Jury verdict synthesized with rigorous claim auditing and ${output.juryVerdict.conceptGuide?.length || 0} Jargon Buster analogies.`,
      details: {
        conceptsExplained: output.juryVerdict.conceptGuide?.map((c) => c.term),
      },
    };

    return {
      juryVerdict: output.juryVerdict,
      finalResult,
      stepLogs: [log],
    };
  } catch (err) {
    const log: StepLogEntry = {
      step: 'synthesizeJuryVerdict',
      status: 'failed',
      timestamp: stepStart,
      message: `Failed to synthesize jury verdict: ${(err as Error).message}`,
    };
    return {
      error: (err as Error).message,
      stepLogs: [log],
    };
  }
}
