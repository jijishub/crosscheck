import { StateGraph, START, END } from '@langchain/langgraph';
import { CourtroomStateAnnotation, CourtroomState, StepLogEntry } from './state';
import { deconstructDebatersNode } from './nodes/deconstructDebaters';
import { extractAndVerifyClaimsNode } from './nodes/extractAndVerifyClaims';
import { buildPreTrialContextNode } from './nodes/buildPreTrialContext';
import { scriptCourtroomDramaNode } from './nodes/scriptCourtroomDrama';
import { synthesizeJuryVerdictNode } from './nodes/synthesizeJuryVerdict';
import { DebateAnalysisResult } from '@/types/debate';

/**
 * The CrossCheck! LangGraph Agentic Workflow
 * Graph Topology:
 * START -> deconstructDebaters -> extractAndVerifyClaims -> buildPreTrialContext -> scriptCourtroomDrama -> synthesizeJuryVerdict -> END
 */
const workflow = new StateGraph(CourtroomStateAnnotation)
  .addNode('deconstructDebaters', deconstructDebatersNode)
  .addNode('extractAndVerifyClaims', extractAndVerifyClaimsNode)
  .addNode('buildPreTrialContext', buildPreTrialContextNode)
  .addNode('scriptCourtroomDrama', scriptCourtroomDramaNode)
  .addNode('synthesizeJuryVerdict', synthesizeJuryVerdictNode)
  .addEdge(START, 'deconstructDebaters')
  .addEdge('deconstructDebaters', 'extractAndVerifyClaims')
  .addEdge('extractAndVerifyClaims', 'buildPreTrialContext')
  .addEdge('buildPreTrialContext', 'scriptCourtroomDrama')
  .addEdge('scriptCourtroomDrama', 'synthesizeJuryVerdict')
  .addEdge('synthesizeJuryVerdict', END);

export const courtroomDebateGraph = workflow.compile();

export interface PipelineExecutionOptions {
  debateText: string;
  topicHint?: string;
  apiKey?: string;
  gatewayUrl?: string;
  model?: string;
  temperature?: number;
  onStepProgress?: (step: string, log: StepLogEntry) => void;
}

export interface PipelineExecutionResult {
  result: DebateAnalysisResult;
  stepLogs: StepLogEntry[];
}

/**
 * Execute the LangGraph debate breakdown pipeline
 */
export async function runCourtroomDebatePipeline(
  options: PipelineExecutionOptions
): Promise<PipelineExecutionResult> {
  const initialState: Partial<CourtroomState> = {
    debateText: options.debateText,
    topicHint: options.topicHint,
    apiKey: options.apiKey,
    gatewayUrl: options.gatewayUrl,
    model: options.model,
    temperature: options.temperature,
    stepLogs: [],
  };

  const finalState = await courtroomDebateGraph.invoke(initialState);

  if (finalState.error) {
    throw new Error(`LangGraph Pipeline Error: ${finalState.error}`);
  }

  if (!finalState.finalResult) {
    throw new Error('LangGraph completed without generating a final courtroom case result.');
  }

  return {
    result: finalState.finalResult,
    stepLogs: finalState.stepLogs || [],
  };
}
