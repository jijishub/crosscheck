'use client';

import React, { useState } from 'react';
import { JurySynthesis, Claim, EvidenceItem } from '@/types/debate';
import { JuryForepersonPortrait } from './CourtroomCharacters';
import { BookOpen, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, Scale, ExternalLink } from 'lucide-react';

interface JuryBoardProps {
  verdict: JurySynthesis;
  claims: Claim[];
  evidenceRecord: EvidenceItem[];
  onOpenCourtRecord: (evidenceId?: string) => void;
}

export function JuryBoard({
  verdict,
  claims,
  evidenceRecord,
  onOpenCourtRecord,
}: JuryBoardProps) {
  const [activeTab, setActiveTab] = useState<'synthesis' | 'concepts' | 'ledger'>('synthesis');

  const verifiedClaims = claims.filter(c => c.verificationStatus === 'verified');
  const contradictedClaims = claims.filter(c => c.verificationStatus === 'contradicted');
  const forecastOrMixedClaims = claims.filter(
    c => c.verificationStatus === 'mixed_or_conditional' || c.claimType === 'forecast_prediction'
  );

  return (
    <div className="w-full bg-slate-900 border-2 border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden mt-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 px-6 py-5 border-b border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <JuryForepersonPortrait emotion="synthesis" />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold uppercase tracking-wider">
                Impartial Educational Assessment
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight mt-1">
              The Jury Chamber & Explainer Board
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Breaking down the real debate concepts and what verifiable evidence actually proves.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('synthesis')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'synthesis'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Verdict & Takeaways</span>
          </button>
          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'concepts'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Jargon Buster ({verdict.conceptGuide.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ledger'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Evidence Ledger ({claims.length})</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6">
        {activeTab === 'synthesis' && (
          <div className="space-y-6">
            {/* Core Disagreement Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                The Core Disagreement Explained
              </div>
              <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                {verdict.coreDisagreementSummary}
              </p>
            </div>

            {/* Split Findings: Verified Evidence vs Forecast Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* What Evidence Confirms */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  What the Credible Evidence Establishes
                </div>
                <ul className="space-y-2.5">
                  {verdict.whatTheEvidenceEstablishes.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What Remains Uncertain / Forecast Limits */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                  <AlertTriangle className="w-4 h-4" />
                  Key Uncertainties & Future Projections
                </div>
                <ul className="space-y-2.5">
                  {verdict.uncertaintiesAndForecastingLimits.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* The Balanced Synthesis (No false binary winner) */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                <Scale className="w-4 h-4" />
                The Jury's Qualified Synthesis
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                {verdict.balancedVerdict}
              </p>

              {/* Educational Takeaway Box */}
              <div className="p-4 rounded-xl bg-purple-950/40 border-l-4 border-purple-500 border-t border-r border-b border-purple-500/30">
                <div className="text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1">
                  🎓 Lesson For Readers New To This Topic:
                </div>
                <p className="text-xs sm:text-sm font-semibold text-purple-100 leading-relaxed">
                  {verdict.educationalTakeaway}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Concept Guide / Jargon Buster */}
        {activeTab === 'concepts' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Complex concepts used in this debate translated into plain English and intuitive analogies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {verdict.conceptGuide.map((concept, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-purple-500/50 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-bold text-sm text-amber-300">{concept.term}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
                        Concept Explainer
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {concept.plainDefinition}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/20 text-xs">
                      <span className="font-bold text-purple-300 text-[11px] uppercase tracking-wide block mb-0.5">
                        💡 Real-World Analogy:
                      </span>
                      <span className="text-slate-300 italic">{concept.everydayAnalogy}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">Why it matters here: </span>
                      {concept.contextInDebate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Evidence Ledger */}
        {activeTab === 'ledger' && (
          <div className="space-y-4">
            {/* Quick stats pills */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold">
                ✓ {verifiedClaims.length} Verified Facts
              </span>
              <span className="px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 font-semibold">
                ✗ {contradictedClaims.length} Contradicted / Corrected
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 font-semibold">
                ⚡ {forecastOrMixedClaims.length} Forecasts & Conditional Scenarios
              </span>
              <button
                onClick={() => onOpenCourtRecord()}
                className="ml-auto px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>Browse Full Court Record ({evidenceRecord.length})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Claims Table / Cards */}
            <div className="space-y-3">
              {claims.map(claim => {
                const isVerified = claim.verificationStatus === 'verified';
                const isContradicted = claim.verificationStatus === 'contradicted';
                const isForecast = claim.claimType === 'forecast_prediction';

                const borderCol = isVerified
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : isContradicted
                  ? 'border-rose-500/30 bg-rose-950/10'
                  : 'border-amber-500/30 bg-amber-950/10';

                return (
                  <div key={claim.id} className={`p-4 rounded-xl border ${borderCol} space-y-2`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">
                          {claim.speakerName}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {claim.claimType.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isVerified ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified by Data
                          </span>
                        ) : isContradicted ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-500/40 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Contradicted
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" />
                            {isForecast ? 'Future Projection' : 'Conditional / Nuanced'}
                          </span>
                        )}
                      </div>
                    </div>

                    <blockquote className="text-xs italic text-slate-200 font-medium">
                      &ldquo;{claim.text}&rdquo;
                    </blockquote>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {claim.explanation}
                    </p>

                    {/* Linked Evidence Buttons */}
                    {claim.linkedEvidenceIds.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[11px] text-slate-500 font-medium">Citations:</span>
                        {claim.linkedEvidenceIds.map(eid => {
                          const ev = evidenceRecord.find(e => e.id === eid);
                          if (!ev) return null;
                          return (
                            <button
                              key={eid}
                              onClick={() => onOpenCourtRecord(eid)}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/20 font-medium flex items-center gap-1 transition-colors"
                            >
                              <span>{ev.sourceName}: {ev.title.slice(0, 32)}...</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
