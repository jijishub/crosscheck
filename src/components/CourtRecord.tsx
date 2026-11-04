'use client';

import React, { useState } from 'react';
import { EvidenceItem, Claim } from '@/types/debate';
import { ExternalLink, ShieldCheck, FileText, Calendar, Filter, X, Search, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface CourtRecordProps {
  isOpen: boolean;
  onClose: () => void;
  evidenceList: EvidenceItem[];
  claims: Claim[];
  highlightedEvidenceId?: string;
}

export function CourtRecordModal({
  isOpen,
  onClose,
  evidenceList,
  claims,
  highlightedEvidenceId,
}: CourtRecordProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterReliability, setFilterReliability] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [prevHighlightedId, setPrevHighlightedId] = useState(highlightedEvidenceId);

  // Synchronize state during render when highlighted citation prop changes (no useEffect cascade)
  if (highlightedEvidenceId !== prevHighlightedId) {
    setPrevHighlightedId(highlightedEvidenceId);
    setSelectedId(highlightedEvidenceId || null);
  }

  const activeEvidenceId = selectedId || highlightedEvidenceId || evidenceList[0]?.id;
  const selectedEvidence = evidenceList.find(e => e.id === activeEvidenceId) || evidenceList[0] || null;

  if (!isOpen) return null;

  const filteredEvidence = evidenceList.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterReliability === 'all' || item.reliability === filterReliability;
    return matchesSearch && matchesFilter;
  });

  const getReliabilityBadge = (rel: EvidenceItem['reliability']) => {
    switch (rel) {
      case 'primary_source':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#ECFDF5] text-[#065F46] border border-[#10B981]">Primary Data</span>;
      case 'official_report':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#E0F2FE] text-[#0369A1] border border-[#38BDF8]">Official Report</span>;
      case 'expert_analysis':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#F3E8FF] text-[#581C87] border border-[#C084FC]">Expert Analysis</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#FEF3C7] text-[#78350F] border border-[#F59E0B]">News Source</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 select-none">
      <div className="bg-[#FFFDF9] border-4 border-[#F59E0B] w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header - Solid Pastel Amber */}
        <div className="bg-[#FEF3C7] px-6 py-4 border-b-2 border-[#FDE68A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📁</span>
            <div>
              <h2 className="text-lg font-black tracking-wide text-[#78350F] uppercase flex items-center gap-2">
                Court Record • Evidence Dossier
                <span className="text-xs font-bold text-[#78350F] px-2.5 py-0.5 bg-[#FFFDF9] rounded-full border border-[#F59E0B]">
                  {evidenceList.length} items verified
                </span>
              </h2>
              <p className="text-xs text-[#92400E] font-medium">
                Traceable live search sources backing claims made during the trial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#FFFDF9] text-[#78350F] hover:bg-[#FDE68A] border-2 border-[#F59E0B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3.5 bg-[#FAF5EB] border-b-2 border-[#E5C9A6] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#B07D62]" />
            <input
              type="text"
              placeholder="Search evidence titles, sources, or text..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FFFDF9] border-2 border-[#E5C9A6] text-[#2D1825] placeholder-[#B07D62]/60 focus:outline-none focus:border-[#C58B58] font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#78350F]" />
            <select
              value={filterReliability}
              onChange={e => setFilterReliability(e.target.value)}
              className="bg-[#FFFDF9] border-2 border-[#E5C9A6] rounded-xl px-2.5 py-1.5 text-[#78350F] font-bold focus:outline-none focus:border-[#C58B58]"
            >
              <option value="all">All Source Types</option>
              <option value="primary_source">Primary Data</option>
              <option value="official_report">Official Reports</option>
              <option value="expert_analysis">Expert Analysis</option>
              <option value="news_media">News Media</option>
            </select>
          </div>
        </div>

        {/* Body Split View */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          {/* Left: Evidence Grid List */}
          <div className="md:col-span-5 border-r-2 border-[#E5C9A6] overflow-y-auto p-3 space-y-2 bg-[#FAF5EB]/50">
            {filteredEvidence.length === 0 ? (
              <div className="p-6 text-center text-[#7C5E74] text-xs font-medium">
                No matching evidence entries found.
              </div>
            ) : (
              filteredEvidence.map(item => {
                const isSelected = selectedEvidence?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full text-left p-3 rounded-2xl border-2 transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-[#FFFDF9] border-[#F59E0B] shadow-sm ring-2 ring-[#FDE68A]'
                        : 'bg-[#FFFDF9] border-[#E5C9A6] hover:bg-[#FAF5EB]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-[#2D1825] truncate flex-1">
                        {item.title}
                      </span>
                      {getReliabilityBadge(item.reliability)}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#7C5E74] font-medium">
                      <FileText className="w-3 h-3 text-[#D97706]" />
                      <span className="font-bold text-[#78350F] truncate">{item.sourceName}</span>
                      {item.publicationDate && (
                        <>
                          <span>•</span>
                          <span>{item.publicationDate}</span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right: Selected Evidence Detail */}
          <div className="md:col-span-7 p-5 overflow-y-auto bg-[#FFFDF9] flex flex-col justify-between">
            {selectedEvidence ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      {getReliabilityBadge(selectedEvidence.reliability)}
                      <span className="text-xs text-[#7C5E74] flex items-center gap-1 font-semibold">
                        <Calendar className="w-3 h-3 text-[#D97706]" />
                        {selectedEvidence.publicationDate || 'Recent'}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-[#78350F] leading-snug">
                      {selectedEvidence.title}
                    </h3>
                    <p className="text-xs text-[#7C5E74] mt-0.5 font-medium">
                      Published by: <span className="text-[#2D1825] font-bold">{selectedEvidence.sourceName}</span>
                    </p>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="p-4 rounded-2xl bg-[#FAF5EB] border-2 border-[#E5C9A6]">
                  <div className="text-[11px] uppercase tracking-wider text-[#92400E] font-black mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                    Key Finding / Summary
                  </div>
                  <p className="text-xs text-[#2D1825] leading-relaxed font-medium">
                    {selectedEvidence.summary}
                  </p>
                </div>

                {/* Quote Snippet if present */}
                {selectedEvidence.quoteSnippet && (
                  <div className="p-4 rounded-2xl bg-[#FEF3C7] border-l-4 border-[#F59E0B] border-t-2 border-r-2 border-b-2 border-[#FDE68A]">
                    <div className="text-[11px] uppercase tracking-wider text-[#92400E] font-black mb-1">
                      Direct Citation Excerpt
                    </div>
                    <blockquote className="text-xs italic text-[#78350F] leading-relaxed font-semibold">
                      &ldquo;{selectedEvidence.quoteSnippet}&rdquo;
                    </blockquote>
                  </div>
                )}

                {/* Relevance to Debate Claim */}
                <div className="p-3.5 rounded-2xl bg-[#FDF2F8] border-2 border-[#FBCFE8]">
                  <div className="text-[11px] uppercase tracking-wider text-[#831843] font-black mb-1">
                    Relevance in Trial
                  </div>
                  <p className="text-xs text-[#831843] font-medium leading-relaxed">
                    {selectedEvidence.relevanceToClaim}
                  </p>
                </div>

                {/* Linked Claim preview */}
                {claims.filter(c => c.linkedEvidenceIds.includes(selectedEvidence.id)).length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] uppercase tracking-wider text-[#78350F] font-black">
                      Claim Connected to this Evidence:
                    </div>
                    {claims
                      .filter(c => c.linkedEvidenceIds.includes(selectedEvidence.id))
                      .map(c => (
                        <div key={c.id} className="p-3 rounded-xl bg-[#FAF5EB] border-2 border-[#E5C9A6] text-xs text-[#2D1825] flex items-start gap-2">
                          {c.verificationStatus === 'verified' ? (
                            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                          ) : c.verificationStatus === 'contradicted' ? (
                            <AlertCircle className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
                          ) : (
                            <HelpCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-bold text-[#78350F]">{c.speakerName}:</span> &ldquo;{c.text}&rdquo;
                            <div className="text-[11px] text-[#7C5E74] mt-1 font-medium">{c.explanation}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* External link button */}
                <div className="pt-2">
                  <a
                    href={selectedEvidence.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#78350F] border-2 border-[#F59E0B] font-black text-xs transition-all shadow-xs active:scale-95"
                  >
                    <span>Inspect Original Source URL</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#78350F]" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-[#7C5E74] text-xs font-medium">
                Select an item from the left column to view its verified source dossier.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
