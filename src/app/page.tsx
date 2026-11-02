'use client';

import React, { useState, useRef } from 'react';
import { DebateAnalysisResult } from '@/types/debate';
import { PHILIPPINE_REDDIT_SEED_RESULT } from '@/lib/gemini';
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
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between selection:bg-pink-400 selection:text-slate-950">
      {/* Top Courtroom Navigation Header */}
      <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-pink-500/20 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-pink-500/25 text-white font-black text-xl">
              ⚖️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-lg tracking-tight text-slate-100 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent font-black tracking-tight">
                    CrossCheck!
                  </span>
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30 uppercase tracking-wider">
                  🌸 Ace Attorney Explainer
                </span>
              </div>
              <p className="text-[11px] text-pink-200/60">
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
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Court Record</span>
                </button>

                <button
                  onClick={handleResetTrial}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
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
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold uppercase text-[10px]">
                  Current Trial
                </span>
                <span className="text-slate-200 font-semibold truncate text-xs sm:text-sm">
                  {debateResult.topic}
                </span>
              </div>
              <button
                onClick={() => setShowInputSection(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-300 border border-pink-500/30 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
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
                    className="text-xs text-slate-400 hover:text-slate-200 font-medium px-2 py-1"
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
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  Phase 1: The Courtroom Examination
                </div>
                <button
                  onClick={handleScrollToJuryBoard}
                  className="text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1 font-semibold"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Skip to Jury Synthesis & Jargon Buster ↓</span>
                </button>
              </div>

              <CourtroomStage
                debate={debateResult}
                onOpenCourtRecord={handleOpenCourtRecord}
                onScrollToJuryBoard={handleScrollToJuryBoard}
              />
            </div>

            {/* Jury Chamber & Explainer Board */}
            <div ref={juryBoardRef} className="space-y-3 scroll-mt-20">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                <Scale className="w-4 h-4" />
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

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <p className="max-w-xl mx-auto leading-relaxed">
          Inspired by Ace Attorney courtroom mechanics. Built to foster genuine topic understanding through
          fair debate reconstruction, verifiable citations, and beginner-accessible concept analogies.
        </p>
      </footer>
    </div>
  );
}
