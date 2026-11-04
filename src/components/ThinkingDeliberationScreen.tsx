'use client';

import React, { useState, useEffect } from 'react';
import { Scale, Sparkles, CheckCircle2, Loader2, BookOpen, ShieldAlert, Cpu, Globe } from 'lucide-react';

interface ThinkingDeliberationScreenProps {
  topicHint?: string;
  isLiveLangGraph?: boolean;
}

const DELIBERATION_STAGES = [
  {
    title: 'Deconstructing Debater Positions',
    desc: 'Extracting opposing stances, character speech styles, and core arguments (Defense vs Prosecution).',
    icon: ShieldAlert,
    durationMs: 2400,
  },
  {
    title: 'Cross-Examining Claims & Archives',
    desc: 'Formulating testable claims, categorizing statistics vs forecasts, and linking evidence citations.',
    icon: Scale,
    durationMs: 3200,
  },
  {
    title: 'Cinna Building Pre-Trial Case Origin',
    desc: 'Tracing authentic discussion context, participant motivations, and key learning objectives.',
    icon: Globe,
    durationMs: 2600,
  },
  {
    title: 'Scripting Courtroom Drama',
    desc: 'Staging visual novel turns with OBJECTION!, HOLD IT!, and anime expression shifts.',
    icon: Sparkles,
    durationMs: 2800,
  },
  {
    title: 'Jury Drafting Jargon Buster & Verdict',
    desc: 'Translating complex terms into everyday analogies and formulating a balanced, educational synthesis.',
    icon: BookOpen,
    durationMs: 3000,
  },
];

export function ThinkingDeliberationScreen({
  topicHint,
  isLiveLangGraph = true,
}: ThinkingDeliberationScreenProps) {
  const [activeStageIdx, setActiveStageIdx] = useState(0);

  // Smoothly advance through the stages while the AI is computing
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStageIdx((prev) => {
        if (prev < DELIBERATION_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  const progressPercent = Math.min(
    100,
    Math.round(((activeStageIdx + 1) / DELIBERATION_STAGES.length) * 95)
  );

  return (
    <div className="fixed inset-0 z-[120] bg-[#1a0f18]/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-300">
      <div className="max-w-xl w-full bg-[#FFFDF9] border-4 border-[#C58B58] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* Top Courtroom Deliberation Header */}
        <div className="bg-gradient-to-r from-[#78350F] via-[#92400E] to-[#78350F] p-4 text-center border-b-4 border-[#B45309] relative shadow-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5EB]/20 border border-[#FEF3C7]/40 text-[#FEF3C7] text-xs font-black uppercase tracking-wider mb-1.5 shadow-2xs">
            <Cpu className="w-3.5 h-3.5 animate-spin" />
            <span>{isLiveLangGraph ? 'LangGraph Agentic Pipeline' : 'AI Courtroom Provisioning'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase drop-shadow">
            ⚖️ Court in Recess: AI Deliberating
          </h2>
          {topicHint && (
            <p className="text-xs sm:text-[13px] text-[#FEF3C7]/95 font-semibold leading-relaxed px-4 max-w-lg mx-auto mt-1 break-words">
              Case Topic: &ldquo;{topicHint}&rdquo;
            </p>
          )}
        </div>

        {/* Mascot & Animated Progress Section */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center gap-4">
            {/* Mascot Thinking Sprite - cleanly positioned without overlapping badge */}
            <div className="relative flex items-center justify-center shrink-0 pt-2">
              <img
                src="/Cinna_2.png"
                alt="Cinna Pondering"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain animate-bounce"
                style={{ animationDuration: '2.5s' }}
              />
            </div>

            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#FDE047] text-[#713F12] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-[#CA8A04] shadow-2xs">
                    Pondering...
                  </span>
                  <span className="text-xs font-black text-[#78350F]">
                    Stage {activeStageIdx + 1} of {DELIBERATION_STAGES.length}
                  </span>
                </div>
                <span className="text-xs font-black text-[#92400E]">{progressPercent}%</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-3 bg-[#FAF5EB] rounded-full border-2 border-[#E5C9A6] overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-[#8C5338] italic">
                {DELIBERATION_STAGES[activeStageIdx].desc}
              </p>
            </div>
          </div>

          {/* Stepped Checklist */}
          <div className="space-y-2 bg-[#FAF5EB] p-3.5 rounded-2xl border-2 border-[#E5C9A6]">
            {DELIBERATION_STAGES.map((stage, idx) => {
              const isPast = idx < activeStageIdx;
              const isCurrent = idx === activeStageIdx;
              const StageIcon = stage.icon;

              return (
                <div
                  key={stage.title}
                  className={`flex items-start gap-3 p-2 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-[#FFFDF9] border-2 border-[#C58B58] shadow-xs'
                      : isPast
                      ? 'opacity-85'
                      : 'opacity-40'
                  }`}
                >
                  <div className="pt-0.5 shrink-0">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-[#D97706] animate-spin" />
                    ) : (
                      <StageIcon className="w-4 h-4 text-[#B07D62]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-black leading-tight ${
                        isCurrent
                          ? 'text-[#78350F]'
                          : isPast
                          ? 'text-emerald-900'
                          : 'text-[#8C5338]'
                      }`}
                    >
                      {stage.title}
                    </p>
                    {isCurrent && (
                      <p className="text-[11px] text-[#8C5338] mt-0.5 leading-snug">
                        {stage.desc}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <span className="text-[11px] text-[#A16207] font-semibold bg-[#FEF3C7] px-3.5 py-1 rounded-full border border-[#FDE047] shadow-2xs">
              ⚡ Crafting live courtroom drama & educational analogies...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
