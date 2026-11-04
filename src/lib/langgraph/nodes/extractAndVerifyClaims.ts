import { CourtroomState, CourtroomUpdate, StepLogEntry } from '../state';
import { callLLMStructured } from '../llm-client';
import { Claim, EvidenceItem } from '@/types/debate';

interface ClaimsAndEvidenceOutput {
  claims: Claim[];
  evidenceRecord: EvidenceItem[];
}

const CLAIMS_SYSTEM_PROMPT = `You are Node 2 (Claims Investigator, Numerical Auditor & Evidence Fact-Checker) in the CrossCheck! LangGraph courtroom pipeline.
Your task is to take the deconstructed debate, extract checkable factual and predictive claims made by both sides, and conduct rigorous evidence verification.

CATEGORIES FOR CLAIMS:
- 'verifiable_statistic'
- 'historical_fact'
- 'forecast_prediction'
- 'value_judgment'
- 'interpretation'

VERIFICATION STATUS:
- 'verified' (The source directly confirms the exact claim, including time frame and magnitude)
- 'contradicted' (The source or official data explicitly refutes the claim or shows a factual/numerical error)
- 'unverified' (No credible evidence directly substantiating the claim could be validated)
- 'mixed_or_conditional' (Partially true or subject to severe unstated caveats)
- 'opinion_not_testable' (Subjective value judgment)

RIGOROUS EVIDENCE VERIFICATION MANDATES:
1. NEVER label a claim 'verified' simply because a credible website or institutional report exists. The source MUST directly substantiate the specific claim, time horizon, and numerical figure.
2. NUMERICAL & UNIT AUDITING:
   - Check if debaters conflated units or frequencies (e.g. monthly vs annual, millions vs billions, gross vs net).
   - If a debater says $91.1B when the report says $9.11B in a single month, mark it 'contradicted' or 'mixed_or_conditional' and record the 10x numerical inflation!
3. ATTRIBUTION AUDITING:
   - Verify that the quoted report actually belongs to the cited authors/publisher (e.g. Bain & Company / DBS Bank vs OECD).
4. PRESERVE ORIGINAL ARGUMENTS:
   - Extract the debater's verbatim comment excerpt into "originalArgument".
   - Extract the source's exact quotation into "exactSupportingPassage".
5. Provide 3 to 6 checkable claims across both debaters. Link each claim to its corresponding evidence IDs.

Respond STRICTLY with a valid JSON object matching:
{
  "claims": [
    {
      "id": "claim_1",
      "speakerId": "debater_a" | "debater_b",
      "speakerName": string,
      "text": string,
      "originalArgument": string,
      "originalCommentRef": string,
      "claimType": "verifiable_statistic" | "historical_fact" | "forecast_prediction" | "value_judgment" | "interpretation",
      "verificationStatus": "verified" | "contradicted" | "unverified" | "mixed_or_conditional" | "opinion_not_testable",
      "numericalVerification": {
        "claimedValue": string,
        "verifiedValue": string,
        "unitOrScope": string,
        "isAccurate": boolean,
        "notes": string
      },
      "explanation": string,
      "exactSupportingPassage": string,
      "linkedEvidenceIds": ["ev_1"]
    }
  ],
  "evidenceRecord": [
    {
      "id": "ev_1",
      "title": string,
      "sourceName": string,
      "publisher": string,
      "url": string,
      "publicationDate": string,
      "summary": string,
      "reliability": "primary_source" | "official_report" | "news_media" | "expert_analysis",
      "relevanceToClaim": string,
      "quoteSnippet": string,
      "exactSupportingPassage": string,
      "targetMetricOrUnit": string
    }
  ]
}`;

export async function extractAndVerifyClaimsNode(
  state: CourtroomState
): Promise<CourtroomUpdate> {
  const stepStart = new Date().toISOString();
  if (state.error) {
    return {};
  }

  try {
    const userPrompt = `Topic: ${state.topic || 'General Debate'}
Context: ${state.contextSummary || ''}
Debater A: ${state.debaterA?.name} (${state.debaterA?.coreStance})
Debater B: ${state.debaterB?.name} (${state.debaterB?.coreStance})

Original Debate Transcript:
${state.debateText}`;

    const output = await callLLMStructured<ClaimsAndEvidenceOutput>(
      CLAIMS_SYSTEM_PROMPT,
      userPrompt,
      {
        apiKey: state.apiKey,
        gatewayUrl: state.gatewayUrl,
        model: state.model,
        temperature: state.temperature ?? 0.1,
      }
    );

    const log: StepLogEntry = {
      step: 'extractAndVerifyClaims',
      status: 'completed',
      timestamp: stepStart,
      message: `Extracted & audited ${output.claims.length} claims with numerical unit checks across ${output.evidenceRecord.length} primary sources.`,
      details: {
        claimsCount: output.claims.length,
        evidenceCount: output.evidenceRecord.length,
      },
    };

    return {
      claims: output.claims,
      evidenceRecord: output.evidenceRecord,
      stepLogs: [log],
    };
  } catch (err) {
    const log: StepLogEntry = {
      step: 'extractAndVerifyClaims',
      status: 'failed',
      timestamp: stepStart,
      message: `Failed to extract claims & evidence: ${(err as Error).message}`,
    };
    return {
      error: (err as Error).message,
      stepLogs: [log],
    };
  }
}
