import { Annotation } from '@langchain/langgraph';
import {
  DebaterProfile,
  Claim,
  EvidenceItem,
  DialogueTurn,
  JurySynthesis,
  DebateAnalysisResult,
  PreTrialBriefing,
} from '@/types/debate';

export interface StepLogEntry {
  step: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  message: string;
  details?: Record<string, unknown>;
}

export const CourtroomStateAnnotation = Annotation.Root({
  // Input parameters
  debateText: Annotation<string>,
  topicHint: Annotation<string | undefined>,
  apiKey: Annotation<string | undefined>,
  gatewayUrl: Annotation<string | undefined>,
  model: Annotation<string | undefined>,
  temperature: Annotation<number | undefined>,

  // Deconstruction phase outputs
  topic: Annotation<string | undefined>,
  contextSummary: Annotation<string | undefined>,
  debaterA: Annotation<DebaterProfile | undefined>,
  debaterB: Annotation<DebaterProfile | undefined>,

  // Claims & Evidence investigation phase outputs
  claims: Annotation<Claim[] | undefined>,
  evidenceRecord: Annotation<EvidenceItem[] | undefined>,

  // Pre-Trial Context Builder outputs (Cinna's Introduction)
  preTrialBriefing: Annotation<PreTrialBriefing | undefined>,

  // Courtroom Scripting phase outputs
  script: Annotation<DialogueTurn[] | undefined>,

  // Jury Synthesis phase outputs
  juryVerdict: Annotation<JurySynthesis | undefined>,

  // Execution Step Logs (appends as graph nodes progress)
  stepLogs: Annotation<StepLogEntry[]>({
    reducer: (prev, next) => (next && next.length > 0 ? [...prev, ...next] : prev),
    default: () => [],
  }),

  // Final consolidated output
  finalResult: Annotation<DebateAnalysisResult | undefined>,
  error: Annotation<string | undefined>,
});

export type CourtroomState = typeof CourtroomStateAnnotation.State;
export type CourtroomUpdate = typeof CourtroomStateAnnotation.Update;
