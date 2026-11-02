'use client';

import React, { useState, useEffect } from 'react';
import { PHILIPPINE_GDP_PRESET, AI_CODING_PRESET } from '@/lib/gemini';
import { Sparkles, Key, Loader2, PlayCircle, AlertCircle, FileText } from 'lucide-react';

interface DebateInputSectionProps {
  onAnalyze: (text: string, topicHint?: string, apiKey?: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export function DebateInputSection({
  onAnalyze,
  isLoading,
  error,
}: DebateInputSectionProps) {
  const [debateText, setDebateText] = useState('');
  const [topicHint, setTopicHint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Load saved API key from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gemini_api_key');
    if (saved) {
      setApiKey(saved);
    }
  }, []);

  const handleSaveKey = (val: string) => {
    setApiKey(val);
    localStorage.setItem('gemini_api_key', val);
  };

  const handleLoadPreset = (preset: typeof PHILIPPINE_GDP_PRESET) => {
    setDebateText(preset.rawText);
    setTopicHint(preset.title);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debateText.trim()) return;
    onAnalyze(debateText, topicHint, apiKey);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 border-2 border-slate-800 rounded-2xl shadow-xl overflow-hidden mb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-6 py-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold uppercase tracking-wider">
              Court Docket & Case Intake
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-100 tracking-tight">
            Submit a Debate or Discussion for Breakdown
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste any thread, argument, or conflicting claims. The AI court will reconstruct the stances, verify claims via live web search, and explain the core disagreement.
          </p>
        </div>

        {/* API Key Config Toggle Button */}
        <button
          type="button"
          onClick={() => setShowKeyInput(!showKeyInput)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
            apiKey
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>{apiKey ? 'API Key Configured ✓' : 'Set Gemini API Key'}</span>
        </button>
      </div>

      {/* API Key Drawer */}
      {showKeyInput && (
        <div className="p-4 bg-slate-950 border-b border-slate-800 text-xs space-y-2 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              Google Gemini API Key
            </label>
            <span className="text-[11px] text-slate-500">
              Stored locally in your browser session
            </span>
          </div>
          <input
            type="password"
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={e => handleSaveKey(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-400 font-mono text-xs"
          />
          <p className="text-[11px] text-slate-400">
            Powered by <code className="text-amber-300">gemini-2.5-flash</code> with Google Search grounding.
            You can also configure <code className="text-blue-300">GEMINI_API_KEY</code> in a <code className="text-slate-300">.env.local</code> file.
          </p>
        </div>
      )}

      {/* Preset Quick Loader */}
      <div className="px-6 py-3.5 bg-slate-950/50 border-b border-slate-800/80 flex flex-wrap items-center gap-2.5 text-xs">
        <span className="font-semibold text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Quick Test Case Presets:
        </span>
        <button
          type="button"
          onClick={() => handleLoadPreset(PHILIPPINE_GDP_PRESET)}
          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors flex items-center gap-1.5"
        >
          <span>🇵🇭 Philippine GDP Forecast (Melon vs OpenYon)</span>
        </button>
        <button
          type="button"
          onClick={() => handleLoadPreset(AI_CODING_PRESET)}
          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors flex items-center gap-1.5"
        >
          <span>💻 AI Coding: Speed vs Architecture Debt</span>
        </button>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Optional Topic Hint */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Topic Title or Subject Context (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Philippine Economic Baseline, Nuclear vs Renewable Energy, Remote Work Productivity..."
            value={topicHint}
            onChange={e => setTopicHint(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 text-xs sm:text-sm font-medium"
          />
        </div>

        {/* Raw Debate Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Pasted Debate / Discussion Dialogue
            </label>
            <span className="text-[11px] text-slate-500">
              {debateText.length} characters
            </span>
          </div>
          <textarea
            rows={7}
            placeholder="Paste discussion comments, Reddit arguments, tweet exchanges, or transcripts here..."
            value={debateText}
            onChange={e => setDebateText(e.target.value)}
            required
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 text-xs sm:text-sm font-sans leading-relaxed resize-y"
          />
        </div>

        {/* Error Alert if any */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold">Trial Initiation Stalled:</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-[11px] text-slate-400">
            ⚖️ Live search grounding verifies claims before courtroom dramatization.
          </div>

          <button
            type="submit"
            disabled={isLoading || !debateText.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-black text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Convening Courtroom & Researching Claims...</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4" />
                <span>Begin Courtroom Breakdown</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
