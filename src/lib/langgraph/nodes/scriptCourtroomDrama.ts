import { CourtroomState, CourtroomUpdate, StepLogEntry } from '../state';
import { callLLMStructured } from '../llm-client';
import { DialogueTurn } from '@/types/debate';

interface ScriptDramaOutput {
  script: DialogueTurn[];
}

const SCRIPT_SYSTEM_PROMPT = `You are Node 3 (Courtroom Playwright, Traceability Director & Educational Dramatist) in the CrossCheck! LangGraph courtroom pipeline.
Your task is to write a thrilling, entertaining 6 to 10 turn visual novel courtroom debate script between Debater A and Debater B, while preserving authenticity and empowering Cinna as an educational bailiff.

CHARACTER & DIALOGUE MANDATES:
- Debater A (e.g. Melon):
  - Upbeat, passionate, uses relatable everyday metaphors (e.g. marathon stamina, cooking, sports training).
  - Employs confident or intense emotions when defending upside potential.
- Debater B (e.g. Yon):
  - Analytical, clinical, taps desk, pushes up glasses, stress-tests assumptions.
  - Catches numerical exaggerations or unexamined hype (e.g. spotting unit errors or missing downside footnotes).
- Cinna's Educational Teaching Responsibility:
  - For EVERY turn, generate a "cinnaTeachingNote":
    - "concept": Name the macroeconomic or logical concept appearing in the turn.
    - "explanation": Explain clearly in 1-2 sentences what the argument means or why it matters.
    - "fallacyOrAssumption": Highlight any unproven assumption or logical leap (or null if sound).
    - "educationalTip": Give the reader a memorable takeaway.
- Authentic Traceability:
  - For each turn, link the "originalCommentQuote" showing the exact text or snippet from the underlying raw discussion.
  - Set "isDramatized" to true when adapting for courtroom flair.
- Theatrical Callouts:
  - 'OBJECTION!' when a claim is challenged or contradicted.
  - 'HOLD IT!' when pressing on fine print, units, or pausing the debate.
  - 'TAKE THAT!' when presenting key verified evidence.
  - 'POINT OF ORDER' when the jury intervenes.

Respond STRICTLY with a valid JSON object matching:
{
  "script": [
    {
      "id": "turn_1",
      "speakerId": "debater_a" | "debater_b" | "jury",
      "speakerName": string,
      "text": string,
      "emotion": "neutral" | "confident" | "thinking" | "intense" | "surprised" | "synthesis",
      "callout": "OBJECTION!" | "HOLD IT!" | "TAKE THAT!" | "POINT OF ORDER" | null,
      "activeClaimId": string | null,
      "presentedEvidenceId": string | null,
      "originalCommentQuote": string,
      "isDramatized": boolean,
      "cinnaTeachingNote": {
        "concept": string,
        "explanation": string,
        "fallacyOrAssumption": string | null,
        "educationalTip": string
      }
    }
  ]
}`;

export async function scriptCourtroomDramaNode(
  state: CourtroomState
): Promise<CourtroomUpdate> {
  const stepStart = new Date().toISOString();
  if (state.error) {
    return {};
  }

  try {
    const claimsSummary = (state.claims || [])
      .map(
        (c) =>
          `- [${c.id}] ${c.speakerName}: "${c.text}" (${c.verificationStatus}) [Orig Quote: "${c.originalArgument || ''}"]`
      )
      .join('\n');

    const evidenceSummary = (state.evidenceRecord || [])
      .map((e) => `- [${e.id}] ${e.title} (${e.sourceName}): ${e.summary}`)
      .join('\n');

    const userPrompt = `Topic: ${state.topic}
Debater A (Defense): ${state.debaterA?.name} - ${state.debaterA?.coreStance} (Style: ${state.debaterA?.speechStyle})
Debater B (Prosecution): ${state.debaterB?.name} - ${state.debaterB?.coreStance} (Style: ${state.debaterB?.speechStyle})

Key Claims & Audited Evidence:
${claimsSummary}

Evidence Archives:
${evidenceSummary}

Original Transcript Context:
${state.debateText}

Write 6 to 10 turns of characterful visual novel courtroom exchanges with Cinna educational notes and original-comment links:`;

    const output = await callLLMStructured<ScriptDramaOutput>(
      SCRIPT_SYSTEM_PROMPT,
      userPrompt,
      {
        apiKey: state.apiKey,
        gatewayUrl: state.gatewayUrl,
        model: state.model,
        temperature: state.temperature ?? 0.3,
      }
    );

    const log: StepLogEntry = {
      step: 'scriptCourtroomDrama',
      status: 'completed',
      timestamp: stepStart,
      message: `Scripted ${output.script.length} courtroom turns with Cinna educational breakdowns and source comment traceability.`,
      details: {
        turnCount: output.script.length,
      },
    };

    return {
      script: output.script,
      stepLogs: [log],
    };
  } catch (err) {
    const log: StepLogEntry = {
      step: 'scriptCourtroomDrama',
      status: 'failed',
      timestamp: stepStart,
      message: `Failed to script courtroom drama: ${(err as Error).message}`,
    };
    return {
      error: (err as Error).message,
      stepLogs: [log],
    };
  }
}
