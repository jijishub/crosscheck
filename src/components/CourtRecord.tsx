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
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(
    evidenceList.find(e => e.id === highlightedEvidenceId) || evidenceList[0] || null
  );

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
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">Primary Data</span>;
      case 'official_report':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-500/30">Official Report</span>;
      case 'expert_analysis':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-400 border border-purple-500/30">Expert Analysis</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">News Source</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-amber-500/40 w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 px-5 py-4 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📁</span>
            <div>
              <h2 className="text-lg font-black tracking-wide text-amber-300 uppercase flex items-center gap-2">
                Court Record • Evidence Dossier
                <span className="text-xs font-normal text-slate-400 px-2 py-0.5 bg-slate-800 rounded-full">
                  {evidenceList.length} items verified
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Traceable live search sources backing claims made during the trial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search evidence titles, sources, or text..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterReliability}
              onChange={e => setFilterReliability(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-amber-400"
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
          <div className="md:col-span-5 border-r border-slate-800 overflow-y-auto p-3 space-y-2">
            {filteredEvidence.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No matching evidence entries found.
              </div>
            ) : (
              filteredEvidence.map(item => {
                const isSelected = selectedEvidence?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedEvidence(item)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/60 shadow-md ring-1 ring-amber-500/40'
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-slate-200 truncate flex-1">
                        {item.title}
                      </span>
                      {getReliabilityBadge(item.reliability)}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <FileText className="w-3 h-3 text-amber-400" />
                      <span className="font-medium text-slate-300 truncate">{item.sourceName}</span>
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
          <div className="md:col-span-7 p-5 overflow-y-auto bg-slate-900/60 flex flex-col justify-between">
            {selectedEvidence ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      {getReliabilityBadge(selectedEvidence.reliability)}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {selectedEvidence.publicationDate || 'Recent'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-amber-200 leading-snug">
                      {selectedEvidence.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Published by: <span className="text-slate-200 font-semibold">{selectedEvidence.sourceName}</span>
                    </p>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Key Finding / Summary
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedEvidence.summary}
                  </p>
                </div>

                {/* Quote Snippet if present */}
                {selectedEvidence.quoteSnippet && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border-l-4 border-amber-500 border-t border-r border-b border-slate-800">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      Direct Citation Excerpt
                    </div>
                    <blockquote className="text-xs italic text-amber-100/90 leading-relaxed">
                      &ldquo;{selectedEvidence.quoteSnippet}&rdquo;
                    </blockquote>
                  </div>
                )}

                {/* Relevance to Debate Claim */}
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Relevance in Trial
                  </div>
                  <p className="text-xs text-slate-300">
                    {selectedEvidence.relevanceToClaim}
                  </p>
                </div>

                {/* Linked Claim preview */}
                {claims.filter(c => c.linkedEvidenceIds.includes(selectedEvidence.id)).length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      Claim Connected to this Evidence:
                    </div>
                    {claims
                      .filter(c => c.linkedEvidenceIds.includes(selectedEvidence.id))
                      .map(c => (
                        <div key={c.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                          {c.verificationStatus === 'verified' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : c.verificationStatus === 'contradicted' ? (
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          ) : (
                            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold text-slate-200">{c.speakerName}:</span> &ldquo;{c.text}&rdquo;
                            <div className="text-[11px] text-slate-400 mt-1">{c.explanation}</div>
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
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-600/30"
                  >
                    <span>Inspect Original Source URL</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Select an item from the left column to view its verified source dossier.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
