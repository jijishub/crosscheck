'use client';

import React, { useState, useRef } from 'react';
import { DebateAnalysisResult } from '@/types/debate';
import { PHILIPPINE_REDDIT_SEED_RESULT } from '@/lib/presets';
import { DebateInputSection } from '@/components/DebateInputSection';
import { CourtroomStage } from '@/components/CourtroomStage';
import { JuryBoard } from '@/components/JuryBoard';
import { CourtRecordModal } from '@/components/CourtRecord';
import { Scale, RefreshCw, Sparkles, FolderOpen, BookOpen } from 'lucide-react';

export default function CourtroomApp() {
  const [debateResult, setDebateResult] = useState<DebateAnalysisResult | null>(PHILIPPINE_REDDIT_SEED_RESULT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInputSection, setShowInputSection] = useState(false);

  // Court Record Modal state
  const [isCourtRecordOpen, setIsCourtRecordOpen] = useState(false);
  const [highlightedEvidenceId, setHighlightedEvidenceId] = useState<string | undefined>(undefined);

  // Section references for smooth scrolling
  const courtroomRef = useRef<HTMLDivElement | null>(null);
  const juryBoardRef = useRef<HTMLDivElement | null>(null);

  const handleAnalyze = async (text: string, topicHint?: string, apiKey?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          debateText: text,
          topicHint,
          apiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze debate.');
      }

      setDebateResult(data);

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
      {/* Top Courtroom Navigation Header - Solid Pastel Parchment */}
      <header className="sticky top-0 z-30 bg-[#fffdfa] border-b-2 border-[#eddcd2] px-4 sm:px-8 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/crosscheck logo.png"
              alt="CrossCheck!"
              className="h-12 sm:h-16 md:h-20 w-auto object-contain filter drop-shadow select-none hover:scale-105 transition-transform"
            />
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#fce7f3] text-[#831843] border border-[#f472b6] uppercase tracking-wider shadow-xs">
                  🌸 Ace Attorney Explainer
                </span>
              </div>
              <p className="text-[11px] text-[#7c5e74] font-medium mt-0.5">
                Playable debate court, live fact-checking, and beginner concept explainer
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            {debateResult && (
              <>
                <button
                  onClick={() => handleOpenCourtRecord()}
                  className="px-4 py-1.5 rounded-full bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] border-2 border-[#f59e0b] font-black text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-[#78350f]" />
                  <span className="hidden sm:inline">Court Record</span>
                </button>

                <button
                  onClick={handleResetTrial}
                  className="px-4 py-1.5 rounded-full bg-[#fce7f3] hover:bg-[#fbcfe8] text-[#831843] border-2 border-[#f472b6] font-black text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#831843]" />
                  <span className="hidden sm:inline">New Case</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 space-y-8">
        {/* Input Form Section (Collapsible when a trial is active) */}
        <section>
          {debateResult && !showInputSection ? (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#fffdfa] border-2 border-[#eddcd2] text-xs shadow-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-2.5 py-0.5 rounded-full bg-[#e0f2fe] text-[#0369a1] border border-[#7dd3fc] font-black uppercase text-[10px]">
                  Current Trial
                </span>
                <span className="text-[#2d1825] font-bold truncate text-xs sm:text-sm">
                  {debateResult.topic}
                </span>
              </div>
              <button
                onClick={() => setShowInputSection(true)}
                className="px-4 py-1.5 rounded-full bg-[#f3e8ff] hover:bg-[#e9d5ff] text-[#581c87] border-2 border-[#c084fc] font-black text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0 active:scale-95"
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
          <section ref={courtroomRef} className="space-y-10 scroll-mt-20">
            {/* Visual Novel Courtroom Stage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#78350f] bg-[#fef3c7] px-3 py-1 rounded-full border border-[#fde68a] shadow-xs">
                  <Sparkles className="w-4 h-4 text-[#d97706]" />
                  Phase 1: The Courtroom Examination
                </div>
                <button
                  onClick={handleScrollToJuryBoard}
                  className="px-3.5 py-1 rounded-full bg-[#fffdfa] hover:bg-[#faf5ff] border-2 border-[#d8b4fe] text-[#581c87] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#9333ea]" />
                  <span>Skip to Jury Synthesis & Jargon Buster ↓</span>
                </button>
              </div>

              <CourtroomStage
                debate={debateResult}
                onOpenCourtRecord={handleOpenCourtRecord}
                onScrollToJuryBoard={handleScrollToJuryBoard}
                isPaused={isCourtRecordOpen}
              />
            </div>

            {/* Jury Chamber & Explainer Board */}
            <div ref={juryBoardRef} className="space-y-3 scroll-mt-20">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#581c87] bg-[#f3e8ff] px-3 py-1 rounded-full border border-[#e9d5ff] shadow-xs w-fit">
                <Scale className="w-4 h-4 text-[#7c3aed]" />
                Phase 2: The Jury Deliberation & Concept Breakdown
              </div>

              <JuryBoard
                verdict={debateResult.juryVerdict}
                claims={debateResult.claims}
                evidenceRecord={debateResult.evidenceRecord}
                onOpenCourtRecord={handleOpenCourtRecord}
              />
            </div>
          </section>
        )}
      </main>

      {/* Evidence Dossier / Court Record Modal */}
      {debateResult && (
        <CourtRecordModal
          isOpen={isCourtRecordOpen}
          onClose={() => setIsCourtRecordOpen(false)}
          evidenceList={debateResult.evidenceRecord}
          claims={debateResult.claims}
          highlightedEvidenceId={highlightedEvidenceId}
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
