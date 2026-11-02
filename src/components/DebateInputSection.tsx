'use client';

import React, { useState, useEffect } from 'react';
import { DebateAnalysisResult } from '@/types/debate';
import {
  PHILIPPINE_GDP_PRESET,
  AI_CODING_PRESET,
  PHILIPPINE_REDDIT_JSON_SAMPLE,
  PHILIPPINE_REDDIT_SEED_RESULT,
} from '@/lib/gemini';
import {
  Sparkles,
  Key,
  Loader2,
  PlayCircle,
  AlertCircle,
  FileText,
  Server,
  Code2,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface DebateInputSectionProps {
  onAnalyze: (text: string, topicHint?: string, apiKey?: string) => Promise<void>;
  onDirectLoadCase?: (result: DebateAnalysisResult) => void;
  isLoading: boolean;
  error?: string | null;
}

export function DebateInputSection({
  onAnalyze,
  onDirectLoadCase,
  isLoading,
  error,
}: DebateInputSectionProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'json'>('text');

  // Text Tab State
  const [debateText, setDebateText] = useState(PHILIPPINE_GDP_PRESET.rawText);
  const [topicHint, setTopicHint] = useState(PHILIPPINE_GDP_PRESET.title);

  // JSON Tab State
  const [jsonText, setJsonText] = useState(PHILIPPINE_REDDIT_JSON_SAMPLE);
  const [jsonStatus, setJsonStatus] = useState<{
    isValid: boolean;
    errorMsg?: string;
    isFullCase?: boolean;
    itemCount?: number;
  }>({ isValid: true, isFullCase: false, itemCount: 6 });

  // Gateway key state
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Load saved API key from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai_gateway_key') || localStorage.getItem('gemini_api_key');
    if (saved) {
      setApiKey(saved);
    }
  }, []);

  // Validate JSON on change
  useEffect(() => {
    if (!jsonText.trim()) {
      setJsonStatus({ isValid: false, errorMsg: 'JSON field is empty' });
      return;
    }
    try {
      const parsed = JSON.parse(jsonText);
      const isFullCase = Boolean(
        parsed &&
          typeof parsed === 'object' &&
          parsed.topic &&
          parsed.debaterA &&
          parsed.debaterB &&
          parsed.script &&
          parsed.juryVerdict
      );
      const count = Array.isArray(parsed)
        ? parsed.length
        : Array.isArray(parsed.comments)
        ? parsed.comments.length
        : Object.keys(parsed).length;

      setJsonStatus({
        isValid: true,
        isFullCase,
        itemCount: count,
      });
    } catch (err) {
      setJsonStatus({
        isValid: false,
        errorMsg: err instanceof Error ? err.message : 'Invalid JSON format',
      });
    }
  }, [jsonText]);

  const handleSaveKey = (val: string) => {
    setApiKey(val);
    localStorage.setItem('ai_gateway_key', val);
  };

  const handleLoadTextPreset = (preset: typeof PHILIPPINE_GDP_PRESET) => {
    setDebateText(preset.rawText);
    setTopicHint(preset.title);
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
    } catch {
      // Keep as-is if invalid
    }
  };

  const handleLoadSeedRedditJson = () => {
    setJsonText(PHILIPPINE_REDDIT_JSON_SAMPLE);
  };

  const handleLoadFullTrialJson = () => {
    setJsonText(JSON.stringify(PHILIPPINE_REDDIT_SEED_RESULT, null, 2));
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debateText.trim()) return;
    onAnalyze(debateText, topicHint, apiKey);
  };

  const handleSubmitJson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonStatus.isValid) return;

    try {
      const parsed = JSON.parse(jsonText);

      // If it's a full pre-computed case result and handler provided, load instantly!
      if (jsonStatus.isFullCase && onDirectLoadCase) {
        onDirectLoadCase(parsed as DebateAnalysisResult);
        return;
      }

      // Otherwise convert comments or structured context into formatted debate text for AI
      let serialized = '';
      let derivedTopic = topicHint;

      if (parsed.topic) derivedTopic = parsed.topic;

      if (Array.isArray(parsed.comments)) {
        serialized = parsed.comments
          .map((c: { author?: string; text?: string }) => `${c.author || 'Debater'}:\n${c.text || ''}`)
          .join('\n\n');
      } else if (Array.isArray(parsed)) {
        serialized = parsed
          .map((c: { author?: string; text?: string; body?: string }) => `${c.author || 'Debater'}:\n${c.text || c.body || JSON.stringify(c)}`)
          .join('\n\n');
      } else {
        serialized = JSON.stringify(parsed, null, 2);
      }

      onAnalyze(serialized, derivedTopic, apiKey);
    } catch (err) {
      console.error('JSON submit error:', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 border-2 border-slate-800 rounded-3xl shadow-2xl overflow-hidden mb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-6 py-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold uppercase tracking-wider">
              CrossCheck! Case Intake
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-semibold flex items-center gap-1">
              <Server className="w-3 h-3 text-purple-400" />
              Gateway: luna @ api.jizellecasia.site
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-100 tracking-tight">
            Submit a Debate or Context for Trial
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit dialogue via plain text or structured JSON. The AI court deconstructs stances, verifies claims via live research, and stages the visual novel duel.
          </p>
        </div>

        {/* API Key Config Toggle Button */}
        <button
          type="button"
          onClick={() => setShowKeyInput(!showKeyInput)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shrink-0 ${
            apiKey
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Key className="w-3.5 h-3.5 text-amber-400" />
          <span>{apiKey ? 'Custom Key Set ✓' : 'Gateway Settings'}</span>
        </button>
      </div>

      {/* API Key / Gateway Drawer */}
      {showKeyInput && (
        <div className="p-4 bg-slate-950 border-b border-slate-800 text-xs space-y-2 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              AI Gateway Key / Token (Optional Override)
            </label>
            <span className="text-[11px] text-emerald-400 font-semibold">
              Default gateway active: https://api.jizellecasia.site/v1 (model: luna)
            </span>
          </div>
          <input
            type="password"
            placeholder="gds_live_... or custom API key"
            value={apiKey}
            onChange={e => handleSaveKey(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-400 font-mono text-xs"
          />
          <p className="text-[11px] text-slate-400">
            Pre-configured with <code className="text-purple-300 font-bold">luna</code> via your AI gateway.
            You can also configure <code className="text-blue-300">AI_GATEWAY_KEY</code> in <code className="text-slate-300">.env.local</code>.
          </p>
        </div>
      )}

      {/* Mode Tabs: Plaintext vs JSON */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-6 pt-3 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t-2 ${
            activeTab === 'text'
              ? 'bg-slate-900 text-sky-300 border-sky-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>💬 Plaintext Discussion</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('json')}
          className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t-2 ${
            activeTab === 'json'
              ? 'bg-slate-900 text-pink-300 border-pink-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>{`{ }`} JSON Argument Context</span>
        </button>
      </div>

      {/* TAB 1: PLAINTEXT DISCUSSION */}
      {activeTab === 'text' && (
        <div>
          {/* Preset Quick Loader */}
          <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap items-center gap-2.5 text-xs">
            <span className="font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick Presets:
            </span>
            <button
              type="button"
              onClick={() => handleLoadTextPreset(PHILIPPINE_GDP_PRESET)}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors flex items-center gap-1.5"
            >
              <span>🇵🇭 Philippine GDP Forecast (Melon vs Yon)</span>
            </button>
            <button
              type="button"
              onClick={() => handleLoadTextPreset(AI_CODING_PRESET)}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors flex items-center gap-1.5"
            >
              <span>💻 AI Coding: Speed vs Architecture Debt</span>
            </button>
          </div>

          <form onSubmit={handleSubmitText} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Topic Title or Subject Context (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Philippine Economic Baseline, Nuclear vs Renewable Energy, Remote Work..."
                value={topicHint}
                onChange={e => setTopicHint(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 text-xs sm:text-sm font-medium"
              />
            </div>

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

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Trial Initiation Stalled:</div>
                  <div>{error}</div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-slate-400">
                ⚖️ Live AI analysis deconstructs claims and synthesizes impartial evidence before courtroom dramatization.
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
      )}

      {/* TAB 2: JSON ARGUMENT CONTEXT */}
      {activeTab === 'json' && (
        <form onSubmit={handleSubmitJson} className="p-6 space-y-4 animate-in fade-in duration-150">
          {/* JSON Helper Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleLoadSeedRedditJson}
                className="px-3 py-1 rounded-lg bg-pink-950/60 hover:bg-pink-900/80 text-pink-300 border border-pink-500/30 font-medium transition-colors"
              >
                📋 Load Reddit Thread JSON
              </button>

              <button
                type="button"
                onClick={handleLoadFullTrialJson}
                className="px-3 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-500/30 font-medium transition-colors"
              >
                ⚖️ Load Full Case Schema JSON
              </button>

              <button
                type="button"
                onClick={handleFormatJson}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
              >
                ✨ Format
              </button>

              <button
                type="button"
                onClick={() => setJsonText('')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 font-medium transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Live JSON Validation Status */}
            <div>
              {jsonStatus.isValid ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {jsonStatus.isFullCase
                      ? '⚡ Ready: Complete Court Trial Case'
                      : `✓ Valid JSON (${jsonStatus.itemCount} items)`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-500/30">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="truncate max-w-xs">{jsonStatus.errorMsg}</span>
                </div>
              )}
            </div>
          </div>

          {/* JSON Textarea */}
          <div>
            <textarea
              rows={11}
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              placeholder="Paste JSON debate thread, comment objects, or full case schema..."
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-pink-200 focus:outline-none focus:border-pink-500 font-mono text-xs leading-relaxed resize-y"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold">JSON Trial Initiation Error:</div>
                <div>{error}</div>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-slate-400">
              {jsonStatus.isFullCase ? (
                <span className="text-purple-300 font-medium">
                  ⚡ Pre-structured case detected: Can be loaded directly into the visual novel stage without API latency.
                </span>
              ) : (
                <span>
                  💡 Structured comment threads or context dictionaries will be parsed and staged by the AI court.
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {jsonStatus.isFullCase && onDirectLoadCase && (
                <button
                  type="button"
                  onClick={() => {
                    const parsed = JSON.parse(jsonText);
                    onDirectLoadCase(parsed as DebateAnalysisResult);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-sm tracking-wide shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>⚡ Instant Preview Trial</span>
                </button>
              )}

              <button
                type="submit"
                disabled={isLoading || !jsonStatus.isValid}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-black text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing JSON Context...</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    <span>Commence Trial (Analyze JSON)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}