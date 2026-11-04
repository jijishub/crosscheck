import { CourtroomState, CourtroomUpdate, StepLogEntry } from '../state';
import { callLLMStructured } from '../llm-client';
import { DebaterProfile } from '@/types/debate';

interface DeconstructOutput {
  topic: string;
  contextSummary: string;
  debaterA: DebaterProfile;
  debaterB: DebaterProfile;
}

const DECONSTRUCT_SYSTEM_PROMPT = `You are Node 1 (Debate Deconstructor) in the CrossCheck! LangGraph courtroom pipeline.
Your task is to analyze the user's submitted discussion/debate text and deconstruct the two opposing positions into compelling courtroom debater profiles.

MANDATE FOR DEBATER PROFILES:
- Debater A (Defense, usually 'Melon' or optimistic baseline advocate):
  - Role: "defense"
  - Personality: Energetic, charmingly optimistic, passionate champion of forward-looking potential.
  - Speech style: Uses relatable everyday analogies (cooking, marathon running, vehicle engines) so beginners immediately get the point.
  - Accent Color: "#2563eb" (electric blue)
- Debater B (Prosecution, usually 'Yon' or structural risk analyst):
  - Role: "prosecution"
  - Personality: Cool, composed, razor-sharp analytical realist. Allergic to hype and unexamined buzzwords.
  - Speech style: Clinical precision mixed with dry wit, tapping pen, pushing up glasses, stress-testing footnotes.
  - Accent Color: "#e11d48" (ruby crimson)

Respond STRICTLY with a valid JSON object matching:
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
  }
}`;

export async function deconstructDebatersNode(
  state: CourtroomState
): Promise<CourtroomUpdate> {
  const stepStart = new Date().toISOString();
  try {
    const userPrompt = `Topic Hint: ${state.topicHint || 'Infer from text'}\n\nSubmitted Debate Text:\n${state.debateText}`;

    const output = await callLLMStructured<DeconstructOutput>(
      DECONSTRUCT_SYSTEM_PROMPT,
      userPrompt,
      {
        apiKey: state.apiKey,
        gatewayUrl: state.gatewayUrl,
        model: state.model,
        temperature: state.temperature ?? 0.2,
      }
    );

    const log: StepLogEntry = {
      step: 'deconstructDebaters',
      status: 'completed',
      timestamp: stepStart,
      message: `Deconstructed debate: "${output.topic}" with ${output.debaterA.name} (Defense) vs ${output.debaterB.name} (Prosecution)`,
      details: {
        topic: output.topic,
        debaterA: output.debaterA.name,
        debaterB: output.debaterB.name,
      },
    };

    return {
      topic: output.topic,
      contextSummary: output.contextSummary,
      debaterA: output.debaterA,
      debaterB: output.debaterB,
      stepLogs: [log],
    };
  } catch (err) {
    const log: StepLogEntry = {
      step: 'deconstructDebaters',
      status: 'failed',
      timestamp: stepStart,
      message: `Failed to deconstruct debaters: ${(err as Error).message}`,
    };
    return {
      error: (err as Error).message,
      stepLogs: [log],
    };
  }
}
