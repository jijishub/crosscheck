'use client';

import React, { useState } from 'react';
import { PreTrialBriefing } from '@/types/debate';
import {
  Globe,
  FileText,
  Users,
  Scale,
  Target,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  MessageSquare,
  ShieldCheck,
  Play,
} from 'lucide-react';

interface CinnaPreTrialBriefingProps {
  briefing: PreTrialBriefing;
  onEnterCourtroom: () => void;
  isOpenAsModal?: boolean;
  onCloseModal?: () => void;
}

export function CinnaPreTrialBriefing({
  briefing,
  onEnterCourtroom,
  isOpenAsModal = false,
  onCloseModal,
}: CinnaPreTrialBriefingProps) {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 'origin',
      title: 'Origin',
      icon: Globe,
      badge: briefing.origin.platform,
    },
    {
      id: 'context',
      title: 'Real-World Context',
      icon: FileText,
      badge: 'Macroeconomic Reality',
    },
    {
      id: 'participants',
      title: 'The Participants',
      icon: Users,
      badge: 'Opposing Advocates',
    },
    {
      id: 'disagreement',
      title: 'Central Disagreement',
      icon: Scale,
      badge: 'What Is at Stake',
    },
    {
      id: 'objectives',
      title: 'Learning Objectives',
      icon: Target,
      badge: 'Key Takeaways',
    },
  ];

  const content = (
    <div className="bg-[#FFFDF9] border-4 border-[#F472B6] rounded-3xl shadow-2xl overflow-hidden flex flex-col select-none">
      {/* Top Banner: Cinna Welcome */}
      <div className="bg-gradient-to-r from-[#FCE7F3] via-[#FFF1F2] to-[#FEF3C7] p-4 sm:p-5 border-b-2 border-pink-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#F472B6] bg-[#FFFDF9] p-1 shrink-0 shadow-sm">
            <img
              src="/Cinna_1.png"
              alt="Cinna Bailiff"
              className="w-full h-full object-contain filter drop-shadow hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#DB2777] text-white px-2 py-0.5 rounded-full">
                Bailiff Pre-Trial Briefing
              </span>
              <span className="text-[10px] text-[#831843] font-bold">Step {activeStep + 1} of 5</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-[#831843] tracking-tight mt-0.5">
              Cinna&apos;s Case Origin & Context Guide
            </h2>
            <p className="text-xs text-[#A87B95] font-semibold">
              Grounding the courtroom drama in authentic community discussion and verified records
            </p>
          </div>
        </div>

        {isOpenAsModal && onCloseModal && (
          <button
            onClick={onCloseModal}
            className="p-1.5 rounded-full text-[#831843] hover:bg-pink-200 transition-colors shrink-0"
            title="Close Briefing"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Step Navigation Tabs */}
      <div className="bg-[#FAF5EB] border-b-2 border-[#E5C9A6] p-2 flex items-center justify-between gap-1 overflow-x-auto text-xs">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`flex-1 min-w-[100px] sm:min-w-0 px-2.5 py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 text-center ${
                isActive
                  ? 'bg-[#FFFDF9] text-[#831843] border-2 border-[#F472B6] shadow-xs'
                  : 'text-[#8C5338] hover:bg-[#F3E8FF]/60 border-2 border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#DB2777]' : 'text-[#B07D62]'}`} />
              <span className="truncate">{step.title}</span>
            </button>
          );
        })}
      </div>

      {/* Step Content Area */}
      <div className="p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        {/* Cinna's Spoken Narration Bubble */}
        <div className="p-3.5 rounded-2xl bg-[#FDF2F8] border-2 border-[#FBCFE8] flex items-start gap-3">
          <div className="w-8 h-8 rounded-full border border-[#F472B6] bg-white p-0.5 shrink-0 mt-0.5">
            <img src="/Cinna_2.png" alt="Cinna" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-black tracking-wider text-[#9D174D] block mb-0.5">
              Cinna Says:
            </span>
            <p className="text-xs text-[#831843] font-medium leading-relaxed italic">
              &ldquo;{briefing.cinnaNarration}&rdquo;
            </p>
          </div>
        </div>

        {/* Step 1: Origin */}
        {activeStep === 0 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-[#FFFBEB] border-2 border-[#FDE68A]">
              <span className="text-[10px] uppercase font-black tracking-wider text-[#92400E] block mb-1">
                Original Post & Thread Context
              </span>
              <h3 className="text-sm font-black text-[#78350F] mb-1">
                &ldquo;{briefing.origin.postTitle}&rdquo;
              </h3>
              <p className="text-xs text-[#78350F] font-medium leading-relaxed">
                {briefing.origin.circumstances}
              </p>
            </div>

            {briefing.origin.communityContextComments && briefing.origin.communityContextComments.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] uppercase font-black tracking-wider text-[#8C5338] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#D97706]" />
                  Authentic Community Voices from the Thread:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {briefing.origin.communityContextComments.map((c, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#FAF5EB] border border-[#E5C9A6] text-xs space-y-1"
                    >
                      <span className="font-bold text-[#8C5338] text-[10px] block">u/{c.author}</span>
                      <p className="italic text-[#2D1825] font-medium leading-snug">
                        &ldquo;{c.quote}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Real-World Context */}
        {activeStep === 1 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-[#FAF5EB] border-2 border-[#E5C9A6]">
              <span className="text-[10px] uppercase font-black tracking-wider text-[#8C5338] block mb-1">
                The Verified Real-World Issue
              </span>
              <p className="text-xs text-[#2D1825] font-medium leading-relaxed">
                {briefing.context.realWorldIssue}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#ECFDF5] border-2 border-[#A7F3D0]">
                <span className="text-[10px] uppercase font-black tracking-wider text-[#065F46] flex items-center gap-1 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                  Verified Institutional Background:
                </span>
                <ul className="space-y-1.5 text-xs text-[#064E3B] font-medium">
                  {briefing.context.verifiedBackground.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-snug">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFFBEB] border-2 border-[#FDE68A]">
                <span className="text-[10px] uppercase font-black tracking-wider text-[#92400E] flex items-center gap-1 mb-2">
                  <Users className="w-3.5 h-3.5 text-[#D97706]" />
                  Public Perceptions in Debate:
                </span>
                <ul className="space-y-1.5 text-xs text-[#78350F] font-medium">
                  {briefing.context.publicSentiments.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-snug">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-1 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: The Participants */}
        {activeStep === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
            {/* Debater A (Defense) */}
            <div className="p-4 rounded-2xl bg-[#F0F9FF] border-2 border-[#BAE6FD] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-[#0369A1]">
                  {briefing.participants.debaterA.name}
                </span>
                <span className="text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1] px-2 py-0.5 rounded-full border border-[#7DD3FC]">
                  Defense • {briefing.participants.debaterA.platformHandle || 'Forum User'}
                </span>
              </div>
              <p className="text-[11px] font-bold text-[#0C4A6E]">
                {briefing.participants.debaterA.roleTitle}
              </p>
              <div className="p-2.5 rounded-xl bg-white/80 border border-[#BAE6FD] text-xs text-[#0369A1] font-medium leading-relaxed">
                <span className="font-bold text-[#0C4A6E] block mb-0.5">Actual Position:</span>
                {briefing.participants.debaterA.actualPosition}
              </div>
              <div className="text-[11px] text-[#0284C7] font-medium leading-snug">
                <span className="font-bold">Core Argument: </span>
                {briefing.participants.debaterA.centralArgument}
              </div>
            </div>

            {/* Debater B (Prosecution) */}
            <div className="p-4 rounded-2xl bg-[#FFF1F2] border-2 border-[#FECDD3] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-[#BE123C]">
                  {briefing.participants.debaterB.name}
                </span>
                <span className="text-[10px] font-bold bg-[#FFE4E6] text-[#BE123C] px-2 py-0.5 rounded-full border border-[#FDA4AF]">
                  Prosecution • {briefing.participants.debaterB.platformHandle || 'Forum User'}
                </span>
              </div>
              <p className="text-[11px] font-bold text-[#881337]">
                {briefing.participants.debaterB.roleTitle}
              </p>
              <div className="p-2.5 rounded-xl bg-white/80 border border-[#FECDD3] text-xs text-[#BE123C] font-medium leading-relaxed">
                <span className="font-bold text-[#881337] block mb-0.5">Actual Position:</span>
                {briefing.participants.debaterB.actualPosition}
              </div>
              <div className="text-[11px] text-[#E11D48] font-medium leading-snug">
                <span className="font-bold">Core Argument: </span>
                {briefing.participants.debaterB.centralArgument}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Central Disagreement */}
        {activeStep === 3 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-[#FDF2F8] border-2 border-[#FBCFE8]">
              <span className="text-[10px] uppercase font-black tracking-wider text-[#9D174D] block mb-1">
                The Core Disagreement
              </span>
              <h3 className="text-sm font-black text-[#831843] leading-snug">
                {briefing.centralDisagreement.coreQuestion}
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFBEB] border-2 border-[#FDE68A]">
              <span className="text-[10px] uppercase font-black tracking-wider text-[#92400E] block mb-1">
                Why This Outcome Matters in Real Life
              </span>
              <p className="text-xs text-[#78350F] font-medium leading-relaxed">
                {briefing.centralDisagreement.whyItMatters}
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Learning Objectives */}
        {activeStep === 4 && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-[#ECFDF5] border-2 border-[#A7F3D0]">
              <span className="text-[10px] uppercase font-black tracking-wider text-[#065F46] flex items-center gap-1 mb-2">
                <Target className="w-4 h-4 text-[#059669]" />
                What You Will Understand by Following the Trial:
              </span>
              <ul className="space-y-2 text-xs text-[#064E3B] font-medium">
                {briefing.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-[#10B981] text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Bar */}
      <div className="p-3 sm:p-4 bg-[#FAF5EB] border-t-2 border-[#E5C9A6] flex items-center justify-between gap-3">
        <button
          onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
          disabled={activeStep === 0}
          className="px-3.5 py-1.5 rounded-full bg-[#FFFDF9] hover:bg-[#F3E8FF] disabled:opacity-40 text-[#78350F] border border-[#E5C9A6] text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous Step</span>
        </button>

        {activeStep < steps.length - 1 ? (
          <button
            onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
            className="px-4 py-1.5 rounded-full bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#78350F] border-2 border-[#F59E0B] text-xs font-black transition-all flex items-center gap-1 shadow-xs active:scale-95"
          >
            <span>Next: {steps[activeStep + 1].title}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={onEnterCourtroom}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#DB2777] to-[#BE185D] hover:from-[#BE185D] hover:to-[#9D174D] text-white text-xs font-black shadow-md transition-all flex items-center gap-2 active:scale-95 animate-pulse"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Enter Courtroom & Begin Examination ▶</span>
          </button>
        )}
      </div>
    </div>
  );

  if (isOpenAsModal) {
    return (
      <div className="fixed inset-0 z-[130] bg-black/55 flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-150">
        <div className="w-full max-w-3xl my-auto">{content}</div>
      </div>
    );
  }

  return <div className="w-full max-w-4xl mx-auto">{content}</div>;
}
