import { CourtroomState, CourtroomUpdate, StepLogEntry } from '../state';
import { callLLMStructured } from '../llm-client';
import { PreTrialBriefing } from '@/types/debate';

interface PreTrialContextOutput {
  preTrialBriefing: PreTrialBriefing;
}

const CONTEXT_BUILDER_SYSTEM_PROMPT = `You are Node 3 (Cinna Pre-Trial Context Builder & Authentic Debate Chronicler) in the CrossCheck! LangGraph courtroom pipeline.
Your mission is to establish the authentic origin, real-world context, participant positions, central disagreement, and educational objectives BEFORE the courtroom battle commences.

CINNA'S CHARACTER MANDATE:
- Cinna is the audience's Court Bailiff, narrator, and educational companion.
- Warm, enthusiastic, welcoming, and deeply committed to explaining confusing topics in plain English.
- Cinna introduces the case to the user before proceedings start so the user understands how this dispute actually formed.

STRICT GROUNDEDNESS & SEQUENCE MANDATES:
1. Origin:
   - Identify where and why the discussion began (e.g. forum, subreddit, headline, community post).
   - Quote any authentic context comments that set the stage.
   - Do NOT fabricate the origin or chronology; ground it strictly in the submitted debate text.
2. Context:
   - Explain the real-world issue being discussed (e.g. GDP forecast, energy policy, inflation, trade).
   - Distinguish verified background data from debaters' subjective interpretations.
3. Participants:
   - Introduce both sides, their platform handles, actual positions, and central arguments WITHOUT caricature, exaggeration, or invented motivations.
4. Central Disagreement:
   - Clearly establish what the participants disagree about and why the outcome matters for real people.
5. Learning Objectives:
   - List 3-4 concrete takeaways the reader will master by following the trial.
6. Cinna Narration:
   - Write a lively, engaging 2-3 paragraph spoken greeting in Cinna's bailiff voice introducing the case to the reader.

Respond STRICTLY with a valid JSON object matching:
{
  "preTrialBriefing": {
    "origin": {
      "platform": string,
      "postTitle": string,
      "postedDate": string,
      "circumstances": string,
      "communityContextComments": [
        { "author": string, "quote": string }
      ]
    },
    "context": {
      "realWorldIssue": string,
      "verifiedBackground": [string, string],
      "publicSentiments": [string, string]
    },
    "participants": {
      "debaterA": {
        "name": string,
        "platformHandle": string,
        "roleTitle": string,
        "actualPosition": string,
        "centralArgument": string
      },
      "debaterB": {
        "name": string,
        "platformHandle": string,
        "roleTitle": string,
        "actualPosition": string,
        "centralArgument": string
      }
    },
    "centralDisagreement": {
      "coreQuestion": string,
      "whyItMatters": string
    },
    "learningObjectives": [string, string, string],
    "cinnaNarration": string
  }
}`;

export async function buildPreTrialContextNode(
  state: CourtroomState
): Promise<CourtroomUpdate> {
  const stepStart = new Date().toISOString();
  if (state.error) {
    return {};
  }

  try {
    const claimsBrief = (state.claims || [])
      .map((c) => `- ${c.speakerName}: "${c.text}" [${c.verificationStatus}]`)
      .join('\n');

    const evidenceBrief = (state.evidenceRecord || [])
      .map((e) => `- ${e.title} (${e.sourceName})`)
      .join('\n');

    const userPrompt = `Topic: ${state.topic}
Context Summary: ${state.contextSummary}

Debater A: ${state.debaterA?.name} (${state.debaterA?.archetypeTitle} - ${state.debaterA?.coreStance})
Debater B: ${state.debaterB?.name} (${state.debaterB?.archetypeTitle} - ${state.debaterB?.coreStance})

Audited Claims & Evidence:
${claimsBrief}
${evidenceBrief}

Original Debate Text:
${state.debateText}

Construct Cinna's authentic 5-step Pre-Trial Introduction sequence:`;

    const output = await callLLMStructured<PreTrialContextOutput>(
      CONTEXT_BUILDER_SYSTEM_PROMPT,
      userPrompt,
      {
        apiKey: state.apiKey,
        gatewayUrl: state.gatewayUrl,
        model: state.model,
        temperature: state.temperature ?? 0.2,
      }
    );

    const log: StepLogEntry = {
      step: 'buildPreTrialContext',
      status: 'completed',
      timestamp: stepStart,
      message: `Cinna generated grounded pre-trial context on "${output.preTrialBriefing.origin.postTitle}" with ${output.preTrialBriefing.learningObjectives.length} learning objectives.`,
      details: {
        platform: output.preTrialBriefing.origin.platform,
        objectivesCount: output.preTrialBriefing.learningObjectives.length,
      },
    };

    return {
      preTrialBriefing: output.preTrialBriefing,
      stepLogs: [log],
    };
  } catch (err) {
    const log: StepLogEntry = {
      step: 'buildPreTrialContext',
      status: 'failed',
      timestamp: stepStart,
      message: `Failed to build pre-trial context: ${(err as Error).message}`,
    };
    return {
      error: (err as Error).message,
      stepLogs: [log],
    };
  }
}
