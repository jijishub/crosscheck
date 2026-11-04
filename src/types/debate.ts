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

export interface NumericalVerification {
  claimedValue: string;
  verifiedValue: string;
  unitOrScope: string; // e.g. "Monthly trade record ($9.11B in Aug 2026) vs claimed annual total ($91.1B)"
  isAccurate: boolean;
  notes?: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  sourceName: string;
  publisher?: string;
  url: string;
  publicationDate?: string;
  summary: string;
  reliability: 'primary_source' | 'official_report' | 'news_media' | 'expert_analysis';
  relevanceToClaim: string;
  quoteSnippet?: string;
  exactSupportingPassage?: string; // Verbatim excerpt from the source confirming or refuting the claim
  targetMetricOrUnit?: string; // Clarification of scope, time frame, and frequency
}

export interface Claim {
  id: string;
  speakerId: 'debater_a' | 'debater_b';
  speakerName: string;
  text: string;
  originalArgument?: string; // Direct quote or argument from the authentic debate thread
  originalCommentRef?: string; // Author/username and thread citation
  claimType: ClaimType;
  verificationStatus: VerificationStatus;
  numericalVerification?: NumericalVerification;
  explanation: string;
  exactSupportingPassage?: string;
  linkedEvidenceIds: string[];
}

export interface ConceptExplanation {
  term: string;
  plainDefinition: string;
  everydayAnalogy: string;
  contextInDebate: string;
}

export interface CinnaTeachingNote {
  concept?: string;
  explanation: string;
  fallacyOrAssumption?: string;
  educationalTip?: string;
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
  originalCommentQuote?: string; // Authentic snippet from the underlying discussion
  isDramatized?: boolean;
  cinnaTeachingNote?: CinnaTeachingNote;
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
  unsupportedOrMisleadingClaims?: string[]; // Arguments that failed verification or contained numerical/attribution errors
  uncertaintiesAndForecastingLimits: string[];
  conceptGuide: ConceptExplanation[];
  educationalTakeaway: string;
  balancedVerdict: string;
  practicalCitizenTakeaways?: string[]; // Actionable indicators for ordinary citizens to monitor
}

export interface PreTrialBriefing {
  origin: {
    platform: string; // e.g. "r/Philippines (Reddit)"
    postTitle: string; // The original headline or post title prompting debate
    postedDate?: string;
    circumstances: string; // Why and how the discussion formed
    communityContextComments?: Array<{ author: string; quote: string }>; // Context comments from thread
  };
  context: {
    realWorldIssue: string; // Grounded macroeconomic or policy issue
    verifiedBackground: string[]; // Factual verified background from reports
    publicSentiments: string[]; // Reddit community perceptions vs verified facts
  };
  participants: {
    debaterA: {
      name: string;
      platformHandle?: string;
      roleTitle: string;
      actualPosition: string; // Authentic position without caricature
      centralArgument: string;
    };
    debaterB: {
      name: string;
      platformHandle?: string;
      roleTitle: string;
      actualPosition: string;
      centralArgument: string;
    };
  };
  centralDisagreement: {
    coreQuestion: string;
    whyItMatters: string;
  };
  learningObjectives: string[];
  cinnaNarration: string; // In-character welcoming introduction from Cinna
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
  preTrialBriefing?: PreTrialBriefing;
  debaterA: DebaterProfile;
  debaterB: DebaterProfile;
  claims: Claim[];
  evidenceRecord: EvidenceItem[];
  script: DialogueTurn[];
  juryVerdict: JurySynthesis;
}
