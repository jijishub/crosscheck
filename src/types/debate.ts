export type ClaimType =
  | 'verifiable_statistic'
  | 'historical_fact'
  | 'forecast_prediction'
  | 'value_judgment'
  | 'interpretation';

export type VerificationStatus =
  | 'verified'
  | 'contradicted'
  | 'unverified'
  | 'mixed_or_conditional'
  | 'opinion_not_testable';

export interface EvidenceItem {
  id: string;
  title: string;
  sourceName: string;
  url: string;
  publicationDate?: string;
  summary: string;
  reliability: 'primary_source' | 'official_report' | 'news_media' | 'expert_analysis';
  relevanceToClaim: string;
  quoteSnippet?: string;
}

export interface Claim {
  id: string;
  speakerId: 'debater_a' | 'debater_b';
  speakerName: string;
  text: string;
  claimType: ClaimType;
  verificationStatus: VerificationStatus;
  explanation: string;
  linkedEvidenceIds: string[];
}

export interface ConceptExplanation {
  term: string;
  plainDefinition: string;
  everydayAnalogy: string;
  contextInDebate: string;
}

export type DialogueEmotion =
  | 'neutral'
  | 'confident'
  | 'thinking'
  | 'intense'
  | 'surprised'
  | 'synthesis';

export type CalloutType = 'OBJECTION!' | 'HOLD IT!' | 'TAKE THAT!' | 'POINT OF ORDER' | null;

export interface DialogueTurn {
  id: string;
  speakerId: 'debater_a' | 'debater_b' | 'jury';
  speakerName: string;
  text: string;
  emotion: DialogueEmotion;
  callout?: CalloutType;
  activeClaimId?: string;
  presentedEvidenceId?: string;
}

export interface DebaterProfile {
  id: 'debater_a' | 'debater_b';
  name: string;
  role: 'defense' | 'prosecution';
  archetypeTitle: string; // e.g. "Baseline Growth Optimist" or "Structural Risk Realist"
  coreStance: string;
  accentColor: string;
  personalityTraits?: string[]; // e.g. ["Energetic", "Uses food analogies", "Optimistic"]
  catchphrase?: string; // e.g. "Look at the underlying momentum!"
  speechStyle?: string; // e.g. "Warm, enthusiastic, relatable metaphors"
  bio?: string;
}

export interface JurySynthesis {
  topicTitle: string;
  coreDisagreementSummary: string;
  whatTheEvidenceEstablishes: string[];
  uncertaintiesAndForecastingLimits: string[];
  conceptGuide: ConceptExplanation[];
  educationalTakeaway: string;
  balancedVerdict: string;
}

export interface DebateAnalysisResult {
  research?: {
    mode: 'demo' | 'unverified' | 'grounded' | 'imported';
    summary: string;
    searchedAt?: string;
    sources?: { title: string; url: string }[];
  };
  topic: string;
  contextSummary: string;
  debaterA: DebaterProfile;
  debaterB: DebaterProfile;
  claims: Claim[];
  evidenceRecord: EvidenceItem[];
  script: DialogueTurn[];
  juryVerdict: JurySynthesis;
}
