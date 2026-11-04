'use client';

import React, { useState, useRef } from 'react';
import { DebateAnalysisResult } from '@/types/debate';
import { PHILIPPINE_REDDIT_SEED_RESULT } from '@/lib/presets';
import { DebateInputSection } from '@/components/DebateInputSection';
import { CourtroomStage } from '@/components/CourtroomStage';
import { JuryBoard } from '@/components/JuryBoard';
import { CourtRecordModal } from '@/components/CourtRecord';
import { AISettingsModal, AISettingsState } from '@/components/AISettingsModal';
import { ThinkingDeliberationScreen } from '@/components/ThinkingDeliberationScreen';
import { CinnaPreTrialBriefing } from '@/components/CinnaPreTrialBriefing';
import { Scale, RefreshCw, Sparkles, FolderOpen, BookOpen, Settings, Download, Globe } from 'lucide-react';
import { exportCourtroomDebatePDF } from '@/lib/pdf-export';
import { resolveDebateTopic } from '@/lib/topic-utils';

export default function CourtroomApp() {
  const [debateResult, setDebateResult] = useState<DebateAnalysisResult | null>(PHILIPPINE_REDDIT_SEED_RESULT);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnalyzingTopic, setCurrentAnalyzingTopic] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showInputSection, setShowInputSection] = useState(false);
  const [isPreTrialBriefingOpen, setIsPreTrialBriefingOpen] = useState(false);

  // AI Provisioning Settings state
  const [aiSettings, setAiSettings] = useState<AISettingsState>(() => {
    if (typeof window === 'undefined') {
      return {
        mode: 'live_langgraph',
        gatewayUrl: 'https://api.jizellecasia.site/v1/chat/completions',
        apiKey: '',
        model: 'luna',
        temperature: 0.2,
      };
    }
    try {
      const saved = localStorage.getItem('crosscheck_ai_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      mode: 'live_langgraph',
      gatewayUrl: 'https://api.jizellecasia.site/v1/chat/completions',
      apiKey: localStorage.getItem('ai_gateway_key') || localStorage.getItem('gemini_api_key') || '',
      model: 'luna',
      temperature: 0.2,
    };
  });
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);

  // Court Record Modal state
  const [isCourtRecordOpen, setIsCourtRecordOpen] = useState(false);
  const [highlightedEvidenceId, setHighlightedEvidenceId] = useState<string | undefined>(undefined);

  // Section references for smooth scrolling
  const courtroomRef = useRef<HTMLDivElement | null>(null);
  const juryBoardRef = useRef<HTMLDivElement | null>(null);

  const handleAnalyze = async (text: string, topicHint?: string, apiKeyOverride?: string) => {
    setIsLoading(true);
    setError(null);
    const resolvedTopic = resolveDebateTopic(text, topicHint);
    setCurrentAnalyzingTopic(resolvedTopic);

    // Seed Test Mode: brief authentic deliberation screen (1.4s) to test UI and sequence without API calls
    if (aiSettings.mode === 'seed_test') {
      setTimeout(() => {
        setDebateResult(PHILIPPINE_REDDIT_SEED_RESULT);
        setIsLoading(false);
        setShowInputSection(false);
        setTimeout(() => {
          courtroomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }, 1400);
      return;
    }

    // Live Mode: Execute multi-node LangGraph pipeline
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          debateText: text,
          topicHint: resolvedTopic,
          apiKey: apiKeyOverride || aiSettings.apiKey,
          gatewayUrl: aiSettings.gatewayUrl,
          model: aiSettings.model,
          temperature: aiSettings.temperature,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze debate.');
      }

      setDebateResult(data);
      setShowInputSection(false);

      // Smooth scroll down to courtroom after generation
      setTimeout(() => {
        courtroomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err) {
      console.error('Debate breakdown error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCourtRecord = (evidenceId?: string) => {
    setHighlightedEvidenceId(evidenceId);
    setIsCourtRecordOpen(true);
  };

  const handleScrollToJuryBoard = () => {
    juryBoardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleResetTrial = () => {
    setDebateResult(null);
    setShowInputSection(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-[#2d1825] flex flex-col justify-between selection:bg-pink-300 selection:text-pink-950">
      {/* Top Courtroom Navigation Header - Solid Light Pink (Compact) */}
      <header className="sticky top-0 z-50 bg-[#FDF2F8] border-b-2 border-[#FBCFE8] px-3 sm:px-6 py-1.5 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/crosscheck logo.png"
              alt="CrossCheck!"
              className="h-9 sm:h-11 md:h-12 w-auto object-contain filter drop-shadow select-none hover:scale-105 transition-transform"
            />
          </div>

          {/* Quick Header Actions: Mode Pill + Court Record + New Case */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mode & AI Settings Pill */}
            <button
              onClick={() => setIsAISettingsOpen(true)}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-black border-2 flex items-center gap-1.5 transition-all shadow-xs active:scale-95 ${
                aiSettings.mode === 'seed_test'
                  ? 'bg-[#FEF3C7] text-[#78350F] border-[#F59E0B] hover:bg-[#FDE68A]'
                  : 'bg-[#FCE7F3] text-[#831843] border-[#F472B6] hover:bg-[#FBCFE8]'
              }`}
              title="Open AI Provisioning Settings"
            >
              <Settings className="w-3 h-3" />
              <span>
                {aiSettings.mode === 'seed_test'
                  ? '🌱 Seed Mode'
                  : `⚡ LangGraph (${aiSettings.model})`}
              </span>
            </button>

            {debateResult && (
              <>
                {debateResult.preTrialBriefing && (
                  <button
                    onClick={() => setIsPreTrialBriefingOpen(true)}
                    className="px-3 sm:px-3.5 py-1 rounded-full bg-[#fdf2f8] hover:bg-[#fce7f3] text-[#831843] border-2 border-[#f472b6] font-black text-[11px] sm:text-xs transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
                    title="Cinna's Pre-Trial Introduction & Authentic Case Context"
                  >
                    <Globe className="w-3 h-3 text-[#db2777]" />
                    <span className="hidden sm:inline">Case Origin</span>
                  </button>
                )}

                <button
                  onClick={() => debateResult && exportCourtroomDebatePDF(debateResult)}
                  className="px-3 sm:px-3.5 py-1 rounded-full bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border-2 border-[#10B981] font-black text-[11px] sm:text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  title="Export conversation logs (Phase 1), Cinna's takes, and jury findings (Phase 2) to PDF"
                >
                  <Download className="w-3 h-3 text-[#059669]" />
                  <span>Export PDF</span>
                </button>

                <button
                  onClick={() => handleOpenCourtRecord()}
                  className="px-3 sm:px-4 py-1 rounded-full bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] border-2 border-[#f59e0b] font-black text-[11px] sm:text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <FolderOpen className="w-3 h-3 text-[#78350f]" />
                  <span className="hidden sm:inline">Court Record</span>
                </button>

                <button
                  onClick={handleResetTrial}
                  className="px-3 sm:px-4 py-1 rounded-full bg-[#fce7f3] hover:bg-[#fbcfe8] text-[#831843] border-2 border-[#f472b6] font-black text-[11px] sm:text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <RefreshCw className="w-3 h-3 text-[#831843]" />
                  <span className="hidden sm:inline">New Case</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Container - Compact Spacing to Fit Laptop Screens */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-2 sm:py-3 space-y-3 relative z-0">
        {/* Input Form Section (Collapsible when a trial is active) */}
        <section>
          {debateResult && !showInputSection ? (
            <div className="flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#fffdfa] border-2 border-[#eddcd2] text-xs shadow-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2 py-0.5 rounded-full bg-[#e0f2fe] text-[#0369a1] border border-[#7dd3fc] font-black uppercase text-[9px]">
                  Current Trial
                </span>
                <span className="text-[#2d1825] font-bold truncate text-xs">
                  {debateResult.topic}
                </span>
              </div>
              <button
                onClick={() => setShowInputSection(true)}
                className="px-3 py-1 rounded-full bg-[#f3e8ff] hover:bg-[#e9d5ff] text-[#581c87] border-2 border-[#c084fc] font-black text-xs flex items-center gap-1 transition-all shadow-xs shrink-0 active:scale-95"
              >
                <span>➕ Submit New Discussion</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {debateResult && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowInputSection(false)}
                    className="text-xs text-[#7c5e74] hover:text-[#2d1825] font-bold px-3 py-1 rounded-full bg-[#eddcd2]/50 hover:bg-[#eddcd2] transition-colors"
                  >
                    ✕ Close Input Drawer
                  </button>
                </div>
              )}
              <DebateInputSection
                onAnalyze={async (t, h, k) => {
                  await handleAnalyze(t, h, k);
                  setShowInputSection(false);
                }}
                onDirectLoadCase={(res) => {
                  setDebateResult(res);
                  setShowInputSection(false);
                  setTimeout(() => {
                    courtroomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                isLoading={isLoading}
                error={error}
              />
            </div>
          )}
        </section>

        {/* Courtroom Visual Novel Experience */}
        {debateResult && (
          <section ref={courtroomRef} className="space-y-10 scroll-mt-28 sm:scroll-mt-32">
            {/* Visual Novel Courtroom Stage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#78350f] bg-[#fef3c7] px-3 py-1 rounded-full border border-[#fde68a] shadow-xs">
                  <Sparkles className="w-4 h-4 text-[#d97706]" />
                  Phase 1: The Courtroom Examination
                </div>
              </div>

              <CourtroomStage
                debate={debateResult}
                onOpenCourtRecord={handleOpenCourtRecord}
                onScrollToJuryBoard={handleScrollToJuryBoard}
                isPaused={isCourtRecordOpen}
              />
            </div>

            {/* Jury Chamber & Explainer Board */}
            <div ref={juryBoardRef} className="space-y-3 scroll-mt-28 sm:scroll-mt-32">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#581c87] bg-[#f3e8ff] px-3 py-1 rounded-full border border-[#e9d5ff] shadow-xs w-fit">
                <Scale className="w-4 h-4 text-[#7c3aed]" />
                Phase 2: The Jury Deliberation & Concept Breakdown
              </div>

              <JuryBoard
                verdict={debateResult.juryVerdict}
                claims={debateResult.claims}
                evidenceRecord={debateResult.evidenceRecord}
                onOpenCourtRecord={handleOpenCourtRecord}
                onExportPDF={() => exportCourtroomDebatePDF(debateResult)}
              />
            </div>
          </section>
        )}
      </main>

      {/* AI Provisioning Settings Modal */}
      <AISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
        settings={aiSettings}
        onSaveSettings={(newSettings) => {
          setAiSettings(newSettings);
          try {
            localStorage.setItem('crosscheck_ai_settings', JSON.stringify(newSettings));
            if (newSettings.apiKey) {
              localStorage.setItem('ai_gateway_key', newSettings.apiKey);
            }
          } catch {}
        }}
        onLoadSeedCase={() => {
          setDebateResult(PHILIPPINE_REDDIT_SEED_RESULT);
          setShowInputSection(false);
        }}
      />

      {/* Ace Attorney AI Deliberation / Thinking Screen */}
      {isLoading && (
        <ThinkingDeliberationScreen
          topicHint={currentAnalyzingTopic}
          isLiveLangGraph={aiSettings.mode === 'live_langgraph'}
        />
      )}

      {/* Evidence Dossier / Court Record Modal */}
      {debateResult && (
        <CourtRecordModal
          isOpen={isCourtRecordOpen}
          onClose={() => setIsCourtRecordOpen(false)}
          evidenceList={debateResult.evidenceRecord}
          claims={debateResult.claims}
          highlightedEvidenceId={highlightedEvidenceId}
          onExportPDF={() => exportCourtroomDebatePDF(debateResult)}
        />
      )}

      {/* Cinna's Pre-Trial Briefing Modal */}
      {isPreTrialBriefingOpen && debateResult?.preTrialBriefing && (
        <CinnaPreTrialBriefing
          briefing={debateResult.preTrialBriefing}
          isOpenAsModal={true}
          onCloseModal={() => setIsPreTrialBriefingOpen(false)}
          onEnterCourtroom={() => {
            setIsPreTrialBriefingOpen(false);
            courtroomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />
      )}

      {/* Footer - Pastel Parchment */}
      <footer className="border-t-2 border-[#eddcd2] bg-[#f7efe7] py-6 px-4 text-center text-xs text-[#7c5e74]">
        <p className="max-w-xl mx-auto leading-relaxed font-medium">
          Inspired by Ace Attorney courtroom mechanics. Built to foster genuine topic understanding through
          fair debate reconstruction, verifiable citations, and beginner-accessible concept analogies.
        </p>
      </footer>
    </div>
  );
}
