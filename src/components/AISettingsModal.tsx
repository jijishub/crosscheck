'use client';

import React, { useState } from 'react';
import {
  X,
  Settings,
  Cpu,
  Key,
  Server,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Layers,
} from 'lucide-react';

export type ProvisioningMode = 'seed_test' | 'live_langgraph';

export interface AISettingsState {
  mode: ProvisioningMode;
  gatewayUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
}

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettingsState;
  onSaveSettings: (newSettings: AISettingsState) => void;
  onLoadSeedCase: () => void;
}

const MODEL_PRESETS = [
  { id: 'luna', label: 'Luna (Default AI Gateway)', desc: 'Balanced reasoning & debate character performance' },
  { id: 'gemini-2.5-flash', label: 'Gemini Flash (Primary AI)', desc: 'Fast claim extraction, research organization & dialogue' },
  { id: 'gemini-2.5-pro', label: 'Gemini Pro (Reasoning Specialist)', desc: 'Complex argument evaluation, contradictory claim & fallacy scrutiny' },
  { id: 'chatgpt-4o-latest', label: 'ChatGPT Web / GPT-6 Sol (Independent Evaluator)', desc: 'Cross-check conclusions, fact-check audit & educational assessment' },
  { id: 'gemini-2.5-flash-lite', label: 'Gemini Flash-Lite (Fast / Token-Efficient)', desc: 'Lightweight classification, structured JSON formatting' },
  { id: 'gpt-4o-mini', label: 'GPT-4o Mini (Cost-Efficient)', desc: 'Fast, cost-efficient analysis' },
];

export function AISettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onLoadSeedCase,
}: AISettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<AISettingsState>(settings);
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          debateText: 'Test Ping: Does the Philippine economy sustain baseline momentum or face downside exposure?',
          topicHint: 'Connectivity Verification',
          apiKey: localSettings.apiKey,
          gatewayUrl: localSettings.gatewayUrl,
          model: localSettings.model,
          temperature: 0.1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Connection failed');
      }

      setTestStatus('success');
      setTestMessage(`Successfully connected to model "${localSettings.model}"! LangGraph pipeline is ready.`);
    } catch (err) {
      setTestStatus('error');
      setTestMessage(err instanceof Error ? err.message : 'Failed to reach AI gateway.');
    }
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-[#1a0f18]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="max-w-2xl w-full my-auto bg-[#FFFDF9] border-4 border-[#C58B58] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-[#FAF5EB] border-b-2 border-[#E5C9A6] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FCE7F3] border border-[#F472B6] text-[#831843]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#78350F] uppercase tracking-wide">
                ⚙️ AI Provisioning & Settings
              </h3>
              <p className="text-xs text-[#8C5338]">
                Configure LangGraph pipeline, AI gateway models, and testing mode
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#E5C9A6]/50 text-[#78350F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-[#2D1825]">
          {/* Section 1: Execution Mode Switcher */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-[#78350F] tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C58B58]" />
              Courtroom Execution Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Seed Mode Card */}
              <button
                type="button"
                onClick={() => setLocalSettings((prev) => ({ ...prev, mode: 'seed_test' }))}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  localSettings.mode === 'seed_test'
                    ? 'bg-[#FEF3C7] border-[#D97706] shadow-sm'
                    : 'bg-[#FFFDF9] border-[#E5C9A6] hover:bg-[#FAF5EB]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-sm text-[#78350F]">🌱 Seed Test Mode</span>
                  {localSettings.mode === 'seed_test' && (
                    <CheckCircle2 className="w-4 h-4 text-[#D97706]" />
                  )}
                </div>
                <p className="text-xs text-[#8C5338] leading-relaxed">
                  Instantly uses pre-seeded Reddit GDP debate data. Zero API calls, instant testing for UI, typewriter, audio, and visual novel sequence.
                </p>
              </button>

              {/* Live LangGraph Card */}
              <button
                type="button"
                onClick={() => setLocalSettings((prev) => ({ ...prev, mode: 'live_langgraph' }))}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  localSettings.mode === 'live_langgraph'
                    ? 'bg-[#FCE7F3] border-[#F472B6] shadow-sm'
                    : 'bg-[#FFFDF9] border-[#E5C9A6] hover:bg-[#FAF5EB]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-sm text-[#831843]">⚡ Live LangGraph Mode</span>
                  {localSettings.mode === 'live_langgraph' && (
                    <CheckCircle2 className="w-4 h-4 text-[#F472B6]" />
                  )}
                </div>
                <p className="text-xs text-[#831843]/80 leading-relaxed">
                  Executes the full 4-node LangGraph agentic pipeline with live deconstruction, claim verification, dynamic scripting, and jury synthesis.
                </p>
              </button>
            </div>
          </div>

          {/* Section 2: AI Gateway & Model Configuration */}
          <div className="space-y-4 bg-[#FAF5EB] p-4 sm:p-5 rounded-2xl border-2 border-[#E5C9A6]">
            <label className="text-xs font-black uppercase text-[#78350F] tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#C58B58]" />
              AI Gateway & Model Provisioning
            </label>

            {/* Model Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#78350F]">AI Model</label>
              <select
                value={localSettings.model}
                onChange={(e) => setLocalSettings((prev) => ({ ...prev, model: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-[#FFFDF9] border-2 border-[#E5C9A6] text-xs font-bold text-[#2D1825] focus:outline-none focus:border-[#C58B58]"
              >
                {MODEL_PRESETS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label} ({m.desc})
                  </option>
                ))}
              </select>
              <div className="pt-1">
                <input
                  type="text"
                  placeholder="Or enter custom model ID (e.g. gemini-2.5-pro, gpt-6-sol, codex)..."
                  value={localSettings.model}
                  onChange={(e) => setLocalSettings((prev) => ({ ...prev, model: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#FFFDF9] border border-[#E5C9A6] text-xs font-mono text-[#78350F]"
                />
              </div>
              <p className="text-[10px] text-[#8C5338] leading-relaxed pt-0.5">
                <strong>Orchestration Strategy:</strong> Flash-first pipeline for fast claim extraction & dialogue, Pro for complex reasoning, and GPT-6 Sol / Web models for independent verdict evaluation.
              </p>
            </div>

            {/* Gateway Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#78350F]">AI Gateway Key</label>
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-[11px] text-[#A16207] hover:underline font-bold"
                >
                  {showKey ? 'Hide' : 'Show Key'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={localSettings.apiKey}
                  onChange={(e) => setLocalSettings((prev) => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="gds_live_... or AIza..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFDF9] border-2 border-[#E5C9A6] text-xs font-mono text-[#2D1825] focus:outline-none focus:border-[#C58B58]"
                />
              </div>
              <p className="text-[11px] text-[#8C5338]">
                Defaults to your configured key in <code className="font-mono">.env.local</code>. Stored securely in your browser session.
              </p>
            </div>

            {/* Gateway Endpoint */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#78350F]">Gateway Endpoint URL</label>
              <input
                type="text"
                value={localSettings.gatewayUrl}
                onChange={(e) => setLocalSettings((prev) => ({ ...prev, gatewayUrl: e.target.value }))}
                placeholder="https://api.jizellecasia.site/v1/chat/completions"
                className="w-full px-3 py-2 rounded-xl bg-[#FFFDF9] border-2 border-[#E5C9A6] text-xs font-mono text-[#78350F]"
              />
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-[#78350F]">
                <span>Temperature (Creativity & Strictness)</span>
                <span className="font-mono">{localSettings.temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={localSettings.temperature}
                onChange={(e) =>
                  setLocalSettings((prev) => ({ ...prev, temperature: parseFloat(e.target.value) }))
                }
                className="w-full accent-[#C58B58] cursor-pointer"
              />
            </div>
          </div>

          {/* Section 3: Connection Testing Harness */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-[#78350F] tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#C58B58]" />
                Test AI Provisioning Connection
              </label>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus === 'testing'}
                className="px-4 py-1.5 rounded-full bg-[#FAF5EB] hover:bg-[#E5C9A6]/60 border-2 border-[#C58B58] text-xs font-black text-[#78350F] flex items-center gap-1.5 transition-all disabled:opacity-50 active:scale-95"
              >
                {testStatus === 'testing' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Pinging Gateway...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Test Connection</span>
                  </>
                )}
              </button>
            </div>

            {testStatus === 'success' && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{testMessage}</span>
              </div>
            )}

            {testStatus === 'error' && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="truncate">{testMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-[#FAF5EB] border-t-2 border-[#E5C9A6] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onLoadSeedCase();
              onClose();
            }}
            className="px-4 py-2 rounded-full bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#78350F] border-2 border-[#F59E0B] font-black text-xs transition-all active:scale-95"
          >
            🌱 Reload Seed Case
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-[#FFFDF9] hover:bg-[#FAF5EB] text-[#78350F] border-2 border-[#E5C9A6] font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#C58B58] to-[#92400E] text-white font-black text-xs shadow-md hover:brightness-105 active:scale-95 transition-all"
            >
              Save & Apply Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
