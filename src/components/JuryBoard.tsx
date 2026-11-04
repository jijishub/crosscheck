'use client';

import React, { useState } from 'react';
import { JurySynthesis, Claim, EvidenceItem } from '@/types/debate';
import { JuryForepersonPortrait } from './CourtroomCharacters';
import { BookOpen, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, Scale, ExternalLink, Download, AlertCircle, Compass } from 'lucide-react';

interface JuryBoardProps {
  verdict: JurySynthesis;
  claims: Claim[];
  evidenceRecord: EvidenceItem[];
  onOpenCourtRecord: (evidenceId?: string) => void;
  onExportPDF?: () => void;
}

export function JuryBoard({
  verdict,
  claims,
  evidenceRecord,
  onOpenCourtRecord,
  onExportPDF,
}: JuryBoardProps) {
  const [activeTab, setActiveTab] = useState<'synthesis' | 'concepts' | 'ledger'>('synthesis');

  const verifiedClaims = claims.filter(c => c.verificationStatus === 'verified');
  const contradictedClaims = claims.filter(c => c.verificationStatus === 'contradicted');
  const forecastOrMixedClaims = claims.filter(
    c => c.verificationStatus === 'mixed_or_conditional' || c.claimType === 'forecast_prediction'
  );

  return (
    <div className="w-full bg-[#FFFDF9] border-4 border-[#C084FC] rounded-3xl shadow-xl overflow-hidden mt-6 select-none">
      {/* Top Header Banner with Deliberation Chamber Backdrop - Pastel Tint */}
      <div className="relative bg-[#FAF5FF] px-6 py-5 border-b-2 border-[#E9D5FF] flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden">
        {/* Subtle Deliberation Chamber Background */}
        <div className="absolute inset-0 opacity-25 pointer-events-none select-none">
          <img
            src="/scenes_and_overlays/Backdrop_02_Jury_Chamber.png"
            alt="Jury Chamber"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF5FF]/90 via-[#FFFDF9]/75 to-[#FAF5FF]/90" />
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <JuryForepersonPortrait emotion="synthesis" />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-[#FEF3C7] text-[#78350F] border-2 border-[#F59E0B] text-[10px] font-black uppercase tracking-wider shadow-xs">
                ⚖️ Impartial Educational Assessment
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#581C87] tracking-tight mt-1">
              The Jury Chamber & Explainer Board
            </h2>
            <p className="text-xs text-[#7C5E74] font-medium mt-0.5">
              Breaking down the real debate concepts and what verifiable evidence actually proves.
            </p>
          </div>
        </div>

        {/* Tab Buttons & Export PDF - Solid Pastel Pills */}
        <div className="relative z-10 flex flex-wrap items-center gap-2">
          <div className="flex bg-[#F3E8FF] p-1.5 rounded-2xl border-2 border-[#E9D5FF] text-xs gap-1 shadow-xs">
            <button
              onClick={() => setActiveTab('synthesis')}
              className={`px-3.5 py-1.5 rounded-xl font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'synthesis'
                  ? 'bg-[#FFFDF9] text-[#581C87] border-2 border-[#C084FC] shadow-xs'
                  : 'text-[#7C5E74] hover:text-[#581C87] border-2 border-transparent'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Verdict & Takeaways</span>
            </button>
            <button
              onClick={() => setActiveTab('concepts')}
              className={`px-3.5 py-1.5 rounded-xl font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'concepts'
                  ? 'bg-[#FFFDF9] text-[#581C87] border-2 border-[#C084FC] shadow-xs'
                  : 'text-[#7C5E74] hover:text-[#581C87] border-2 border-transparent'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Jargon Buster ({verdict.conceptGuide.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-3.5 py-1.5 rounded-xl font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'ledger'
                  ? 'bg-[#FFFDF9] text-[#581C87] border-2 border-[#C084FC] shadow-xs'
                  : 'text-[#7C5E74] hover:text-[#581C87] border-2 border-transparent'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Evidence Ledger ({claims.length})</span>
            </button>
          </div>

          {onExportPDF && (
            <button
              onClick={onExportPDF}
              className="px-3.5 py-2 rounded-2xl font-black text-xs bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border-2 border-[#10B981] shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
              title="Export complete trial dossier (Phase 1 + Phase 2 + Evidence links) as PDF"
            >
              <Download className="w-3.5 h-3.5 text-[#059669]" />
              <span>Export PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6">
        {activeTab === 'synthesis' && (
          <div className="space-y-6">
            {/* Core Disagreement Card - Solid Pastel Lilac */}
            <div className="p-5 rounded-2xl bg-[#FAF5FF] border-2 border-[#D8B4FE] shadow-xs">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#581C87] mb-2">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                The Core Disagreement Explained
              </div>
              <p className="text-sm sm:text-base text-[#2D1825] font-semibold leading-relaxed">
                {verdict.coreDisagreementSummary}
              </p>
            </div>

            {/* Split Findings: Verified Evidence vs Unsupported Claims vs Forecast Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* What Evidence Confirms - Solid Pastel Mint */}
              <div className="p-5 rounded-2xl bg-[#ECFDF5] border-2 border-[#A7F3D0] shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#065F46] mb-3">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  What the Credible Evidence Establishes
                </div>
                <ul className="space-y-2.5">
                  {verdict.whatTheEvidenceEstablishes.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#064E3B] font-medium leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-[#10B981] mt-1 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Unsupported or Misleading Claims Exposed */}
              {verdict.unsupportedOrMisleadingClaims && verdict.unsupportedOrMisleadingClaims.length > 0 && (
                <div className="p-5 rounded-2xl bg-[#FEF2F2] border-2 border-[#FECACA] shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#991B1B] mb-3">
                    <AlertCircle className="w-4 h-4 text-[#DC2626]" />
                    Unsupported or Misleading Claims Exposed
                  </div>
                  <ul className="space-y-2.5">
                    {verdict.unsupportedOrMisleadingClaims.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#7F1D1D] font-medium leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-[#EF4444] mt-1 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What Remains Uncertain / Forecast Limits - Solid Pastel Amber */}
              <div className="p-5 rounded-2xl bg-[#FFFBEB] border-2 border-[#FDE68A] shadow-xs">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#92400E] mb-3">
                  <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                  Key Uncertainties & Future Projections
                </div>
                <ul className="space-y-2.5">
                  {verdict.uncertaintiesAndForecastingLimits.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#78350F] font-medium leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B] mt-1 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Practical Indicators for Citizens */}
              {verdict.practicalCitizenTakeaways && verdict.practicalCitizenTakeaways.length > 0 && (
                <div className="p-5 rounded-2xl bg-[#F0FDF4] border-2 border-[#BBF7D0] shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#166534] mb-3">
                    <Compass className="w-4 h-4 text-[#16A34A]" />
                    Practical Indicators Ordinary Citizens Should Monitor
                  </div>
                  <ul className="space-y-2.5">
                    {verdict.practicalCitizenTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#14532D] font-medium leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-[#22C55E] mt-1 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* The Balanced Synthesis (Rigorous evaluation distinguishing truth from errors) - Solid Cream Parchment */}
            <div className="p-5 rounded-2xl bg-[#FFFDF9] border-2 border-[#E5C9A6] shadow-xs">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#78350F] mb-2">
                <Scale className="w-4 h-4 text-[#B45309]" />
                The Jury&apos;s Rigorous Synthesis
              </div>
              <p className="text-xs sm:text-sm text-[#2D1825] font-medium leading-relaxed mb-4">
                {verdict.balancedVerdict}
              </p>

              {/* Educational Takeaway Box - Solid Pastel Rose Ribbon */}
              <div className="p-4 rounded-xl bg-[#FDF2F8] border-l-4 border-[#F472B6] border-t-2 border-r-2 border-b-2 border-[#FBCFE8]">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#831843] mb-1">
                  🎓 Core Educational Takeaway:
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#831843] leading-relaxed">
                  {verdict.educationalTakeaway}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Concept Guide / Jargon Buster - Solid Pastel Cards */}
        {activeTab === 'concepts' && (
          <div className="space-y-4">
            <p className="text-xs text-[#7C5E74] font-medium">
              Complex concepts used in this debate translated into plain English and intuitive analogies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {verdict.conceptGuide.map((concept, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#FFFDF9] border-2 border-[#E9D5FF] hover:border-[#C084FC] transition-colors flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-black text-sm text-[#581C87]">{concept.term}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F3E8FF] text-[#581C87] border border-[#D8B4FE]">
                        Concept Explainer
                      </span>
                    </div>
                    <p className="text-xs text-[#2D1825] font-medium leading-relaxed mb-3">
                      {concept.plainDefinition}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t-2 border-[#F3E8FF]">
                    <div className="p-3 rounded-xl bg-[#FEF3C7] border-2 border-[#FDE68A] text-xs">
                      <span className="font-black text-[#92400E] text-[11px] uppercase tracking-wide block mb-0.5">
                        💡 Real-World Analogy:
                      </span>
                      <span className="text-[#78350F] italic font-semibold">{concept.everydayAnalogy}</span>
                    </div>
                    <div className="text-[11px] text-[#7C5E74] font-medium">
                      <span className="font-bold text-[#2D1825]">Why it matters here: </span>
                      {concept.contextInDebate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Evidence Ledger - Solid Pastel Table */}
        {activeTab === 'ledger' && (
          <div className="space-y-4">
            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-[#ECFDF5] border-2 border-[#A7F3D0] text-[#065F46] font-black">
                ✓ {verifiedClaims.length} Verified Facts
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FFF1F2] border-2 border-[#FECDD3] text-[#9F1239] font-black">
                ✗ {contradictedClaims.length} Contradicted / Corrected
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FFFBEB] border-2 border-[#FDE68A] text-[#92400E] font-black">
                ⚡ {forecastOrMixedClaims.length} Forecasts & Conditional Scenarios
              </span>
              <button
                onClick={() => onOpenCourtRecord()}
                className="ml-auto px-4 py-1.5 rounded-full bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#78350F] border-2 border-[#F59E0B] font-black text-xs transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
              >
                <span>Browse Full Court Record ({evidenceRecord.length})</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#78350F]" />
              </button>
            </div>

            {/* Claims Table / Cards */}
            <div className="space-y-3">
              {claims.map(claim => {
                const isVerified = claim.verificationStatus === 'verified';
                const isContradicted = claim.verificationStatus === 'contradicted';
                const isForecast = claim.claimType === 'forecast_prediction';

                const borderCol = isVerified
                  ? 'border-2 border-[#A7F3D0] bg-[#F0FDF4]'
                  : isContradicted
                  ? 'border-2 border-[#FECDD3] bg-[#FFF1F2]'
                  : 'border-2 border-[#FDE68A] bg-[#FFFBEB]';

                return (
                  <div key={claim.id} className={`p-4 sm:p-5 rounded-2xl ${borderCol} space-y-2 shadow-xs`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#2D1825]">
                          {claim.speakerName}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#FFFDF9] text-[#7C5E74] border border-[#E5C9A6]">
                          {claim.claimType.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isVerified ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#ECFDF5] text-[#065F46] border border-[#10B981] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                            Verified by Data
                          </span>
                        ) : isContradicted ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#FFF1F2] text-[#9F1239] border border-[#F43F5E] flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-[#E11D48]" />
                            Contradicted
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#FFFBEB] text-[#92400E] border border-[#F59E0B] flex items-center gap-1">
                            <HelpCircle className="w-3 h-3 text-[#D97706]" />
                            {isForecast ? 'Future Projection' : 'Conditional / Nuanced'}
                          </span>
                        )}
                      </div>
                    </div>

                    <blockquote className="text-xs sm:text-sm italic text-[#2D1825] font-bold">
                      &ldquo;{claim.text}&rdquo;
                    </blockquote>

                    <p className="text-xs text-[#57414F] font-medium leading-relaxed">
                      {claim.explanation}
                    </p>

                    {/* Linked Evidence Buttons */}
                    {claim.linkedEvidenceIds.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E5C9A6]/40">
                        <span className="text-[11px] text-[#7C5E74] font-bold">Citations:</span>
                        {claim.linkedEvidenceIds.map(eid => {
                          const ev = evidenceRecord.find(e => e.id === eid);
                          if (!ev) return null;
                          return (
                            <button
                              key={eid}
                              onClick={() => onOpenCourtRecord(eid)}
                              className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FFFDF9] hover:bg-[#FAF5EB] text-[#78350F] border border-[#E5C9A6] font-bold flex items-center gap-1 transition-colors shadow-2xs"
                            >
                              <span>{ev.sourceName}: {ev.title.slice(0, 32)}...</span>
                              <ExternalLink className="w-2.5 h-2.5 text-[#B45309]" />
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
