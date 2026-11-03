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
    <div className="w-full max-w-4xl mx-auto bg-[#FFFDF9] border-4 border-[#F472B6] rounded-3xl shadow-xl overflow-hidden mb-8 select-none">
      {/* Header Banner - Solid Pastel Rose */}
      <div className="bg-[#FDF2F8] px-6 py-5 border-b-2 border-[#FBCFE8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full bg-[#FEF3C7] text-[#78350F] border-2 border-[#F59E0B] text-[10px] font-black uppercase tracking-wider shadow-xs">
              CrossCheck! Case Intake
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#581C87] border-2 border-[#C084FC] text-[10px] font-bold flex items-center gap-1 shadow-xs">
              <Server className="w-3 h-3 text-[#7C3AED]" />
              Gateway: luna @ api.jizellecasia.site
            </span>
          </div>
          <h2 className="text-xl font-black text-[#831843] tracking-tight">
            Submit a Debate or Context for Trial
          </h2>
          <p className="text-xs text-[#7C5E74] font-medium mt-0.5">
            Submit dialogue via plain text or structured JSON. The AI court deconstructs stances, verifies claims via live research, and stages the visual novel duel.
          </p>
        </div>

        {/* API Key Config Toggle Button */}
        <button
          type="button"
          onClick={() => setShowKeyInput(!showKeyInput)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 text-xs font-black transition-all shrink-0 shadow-xs active:scale-95 ${
            apiKey
              ? 'bg-[#ECFDF5] border-[#10B981] text-[#065F46]'
              : 'bg-[#FFFDF9] border-[#E5C9A6] text-[#78350F] hover:bg-[#FAF5EB]'
          }`}
        >
          <Key className="w-3.5 h-3.5 text-[#D97706]" />
          <span>{apiKey ? 'Custom Key Set ✓' : 'Gateway Settings'}</span>
        </button>
      </div>

      {/* API Key / Gateway Drawer */}
      {showKeyInput && (
        <div className="p-4 bg-[#FAF5EB] border-b-2 border-[#E5C9A6] text-xs space-y-2 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <label className="font-black text-[#78350F] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#D97706]" />
              AI Gateway Key / Token (Optional Override)
            </label>
            <span className="text-[11px] text-[#065F46] font-bold">
              Default gateway active: https://api.jizellecasia.site/v1 (model: luna)
            </span>
          </div>
          <input
            type="password"
            placeholder="gds_live_... or custom API key"
            value={apiKey}
            onChange={e => handleSaveKey(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#FFFDF9] border-2 border-[#E5C9A6] text-[#2D1825] placeholder-[#B07D62]/60 focus:outline-none focus:border-[#C58B58] font-mono text-xs"
          />
          <p className="text-[11px] text-[#7C5E74]">
            Pre-configured with <code className="text-[#581C87] font-bold">luna</code> via your AI gateway.
            You can also configure <code className="text-[#0369A1] font-bold">AI_GATEWAY_KEY</code> in <code className="text-[#831843] font-bold">.env.local</code>.
          </p>
        </div>
      )}

      {/* Mode Tabs: Plaintext vs JSON */}
      <div className="flex items-center border-b-2 border-[#FBCFE8] bg-[#FCE7F3] px-6 pt-3 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`px-4 py-2 rounded-t-xl text-xs font-black transition-all flex items-center gap-2 border-t-2 border-l-2 border-r-2 ${
            activeTab === 'text'
              ? 'bg-[#FFFDF9] text-[#831843] border-[#F472B6] shadow-xs'
              : 'text-[#7C5E74] hover:text-[#831843] border-transparent'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#EC4899]" />
          <span>💬 Plaintext Discussion</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('json')}
          className={`px-4 py-2 rounded-t-xl text-xs font-black transition-all flex items-center gap-2 border-t-2 border-l-2 border-r-2 ${
            activeTab === 'json'
              ? 'bg-[#FFFDF9] text-[#581C87] border-[#C084FC] shadow-xs'
              : 'text-[#7C5E74] hover:text-[#581C87] border-transparent'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-[#A855F7]" />
          <span>{`{ }`} JSON Argument Context</span>
        </button>
      </div>

      {/* TAB 1: PLAINTEXT DISCUSSION */}
      {activeTab === 'text' && (
        <div>
          {/* Preset Quick Loader */}
          <div className="px-6 py-3 bg-[#FAF5EB] border-b-2 border-[#E5C9A6] flex flex-wrap items-center gap-2.5 text-xs">
            <span className="font-bold text-[#78350F] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              Quick Presets:
            </span>
            <button
              type="button"
              onClick={() => handleLoadTextPreset(PHILIPPINE_GDP_PRESET)}
              className="px-3 py-1 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#78350F] border-2 border-[#F59E0B] font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
            >
              <span>🇵🇭 Philippine GDP Forecast (Melon vs Yon)</span>
            </button>
            <button
              type="button"
              onClick={() => handleLoadTextPreset(AI_CODING_PRESET)}
              className="px-3 py-1 rounded-xl bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#581C87] border-2 border-[#C084FC] font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
            >
              <span>💻 AI Coding: Speed vs Architecture Debt</span>
            </button>
          </div>

          <form onSubmit={handleSubmitText} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-black text-[#78350F] uppercase tracking-wider mb-1.5">
                Topic Title or Subject Context (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Philippine Economic Baseline, Nuclear vs Renewable Energy, Remote Work..."
                value={topicHint}
                onChange={e => setTopicHint(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] border-2 border-[#E5C9A6] text-[#2D1825] placeholder-[#B07D62]/60 focus:outline-none focus:border-[#C58B58] text-xs sm:text-sm font-semibold"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black text-[#78350F] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#0284C7]" />
                  Pasted Debate / Discussion Dialogue
                </label>
                <span className="text-[11px] text-[#7C5E74] font-medium">
                  {debateText.length} characters
                </span>
              </div>
              <textarea
                rows={7}
                placeholder="Paste discussion comments, Reddit arguments, tweet exchanges, or transcripts here..."
                value={debateText}
                onChange={e => setDebateText(e.target.value)}
                required
                className="w-full p-4 rounded-xl bg-[#FFFDF9] border-2 border-[#E5C9A6] text-[#2D1825] placeholder-[#B07D62]/60 focus:outline-none focus:border-[#C58B58] text-xs sm:text-sm font-sans leading-relaxed resize-y font-medium"
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-[#FFF1F2] border-2 border-[#FECDD3] text-[#9F1239] text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Trial Initiation Stalled:</div>
                  <div>{error}</div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-[#7C5E74] font-medium">
                ⚖️ Live AI analysis deconstructs claims and synthesizes impartial evidence before courtroom dramatization.
              </div>

              <button
                type="submit"
                disabled={isLoading || !debateText.trim()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#FBCFE8] hover:bg-[#F9A8D4] text-[#831843] border-2 border-[#F472B6] font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#831843]" />
                    <span>Convening Courtroom & Researching Claims...</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4 text-[#831843]" />
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
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#E5C9A6] pb-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleLoadSeedRedditJson}
                className="px-3 py-1 rounded-xl bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#831843] border-2 border-[#F472B6] font-black transition-all shadow-2xs active:scale-95"
              >
                📋 Load Reddit Thread JSON
              </button>

              <button
                type="button"
                onClick={handleLoadFullTrialJson}
                className="px-3 py-1 rounded-xl bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#581C87] border-2 border-[#C084FC] font-black transition-all shadow-2xs active:scale-95"
              >
                ⚖️ Load Full Case Schema JSON
              </button>

              <button
                type="button"
                onClick={handleFormatJson}
                className="px-3 py-1 rounded-xl bg-[#FAF5EB] hover:bg-[#F5EBE1] text-[#78350F] border-2 border-[#E5C9A6] font-bold transition-all shadow-2xs active:scale-95"
              >
                ✨ Format
              </button>

              <button
                type="button"
                onClick={() => setJsonText('')}
                className="px-3 py-1 rounded-xl bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#9F1239] border-2 border-[#FECDD3] font-bold transition-all shadow-2xs active:scale-95"
              >
                Clear
              </button>
            </div>

            {/* Live JSON Validation Status */}
            <div>
              {jsonStatus.isValid ? (
                <div className="flex items-center gap-1.5 text-xs text-[#065F46] font-black bg-[#ECFDF5] px-3 py-1 rounded-full border-2 border-[#A7F3D0]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                  <span>
                    {jsonStatus.isFullCase
                      ? '⚡ Ready: Complete Court Trial Case'
                      : `✓ Valid JSON (${jsonStatus.itemCount} items)`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-[#9F1239] font-black bg-[#FFF1F2] px-3 py-1 rounded-full border-2 border-[#FECDD3]">
                  <AlertCircle className="w-3.5 h-3.5 text-[#E11D48]" />
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
              className="w-full p-4 rounded-xl bg-[#FAF5EB] border-2 border-[#E5C9A6] text-[#2D1825] focus:outline-none focus:border-[#C58B58] font-mono text-xs leading-relaxed resize-y font-medium"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-[#FFF1F2] border-2 border-[#FECDD3] text-[#9F1239] text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold">JSON Trial Initiation Error:</div>
                <div>{error}</div>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-[#7C5E74] font-medium">
              {jsonStatus.isFullCase ? (
                <span className="text-[#581C87] font-bold">
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
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#78350F] border-2 border-[#F59E0B] font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Zap className="w-4 h-4 text-[#D97706]" />
                  <span>⚡ Instant Preview Trial</span>
                </button>
              )}

              <button
                type="submit"
                disabled={isLoading || !jsonStatus.isValid}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#581C87] border-2 border-[#C084FC] font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#581C87]" />
                    <span>Analyzing JSON Context...</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4 text-[#581C87]" />
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