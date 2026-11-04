'use client';

import React, { useState } from 'react';
import { DialogueEmotion, CalloutType, CinnaTeachingNote } from '@/types/debate';
import { ChevronDown, ChevronUp, GraduationCap, AlertCircle, Lightbulb, X } from 'lucide-react';

interface CinnaNarratorProps {
  emotion?: DialogueEmotion;
  callout?: CalloutType;
  speakerName?: string;
  activeClaimText?: string;
  teachingNote?: CinnaTeachingNote;
}

export function CinnaNarrator({
  emotion = 'neutral',
  callout = null,
  speakerName = '',
  activeClaimText = '',
  teachingNote,
}: CinnaNarratorProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showFullNoteModal, setShowFullNoteModal] = useState(false);

  // Pick Cinna sprite based on emotion and callout
  let spriteSrc = '/Cinna_1.png';
  let moodLabel = 'Bailiff';
  let moodBadgeColor = 'bg-pink-200 text-pink-950 border-pink-300';

  if (teachingNote?.fallacyOrAssumption) {
    spriteSrc = '/Cinna_4.png';
    moodLabel = 'Spotcheck!';
    moodBadgeColor = 'bg-rose-200 text-rose-950 border-rose-300';
  } else if (callout || emotion === 'intense') {
    spriteSrc = '/Cinna_4.png';
    moodLabel = 'Urgent!';
    moodBadgeColor = 'bg-rose-200 text-rose-950 border-rose-300';
  } else if (emotion === 'thinking' || teachingNote?.concept) {
    spriteSrc = '/Cinna_3.png';
    moodLabel = 'Teacher';
    moodBadgeColor = 'bg-purple-200 text-purple-950 border-purple-300';
  } else if (emotion === 'confident' || emotion === 'synthesis') {
    spriteSrc = '/Cinna_2.png';
    moodLabel = 'Explaining';
    moodBadgeColor = 'bg-sky-200 text-sky-950 border-sky-300';
  }

  // Derive contextual commentary
  let commentary = teachingNote?.explanation;
  if (!commentary) {
    if (callout || emotion === 'intense') {
      commentary = `Notice how ${speakerName || 'the debater'} presses on critical downside vulnerabilities.`;
    } else if (emotion === 'thinking') {
      commentary = 'Notice how this argument tests whether external shocks break the forecast.';
    } else if (activeClaimText) {
      commentary = `Bailiff check: examining evidence for "${activeClaimText.slice(0, 50)}..."`;
    } else {
      commentary = 'Tracking courtroom arguments and concept definitions to help you learn!';
    }
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF9] border-2 border-pink-300 hover:bg-[#FDF2F8] text-[11px] font-black text-[#831843] transition-all shadow-xs select-none active:scale-95"
        title="Open Cinna commentary"
      >
        <img src={spriteSrc} alt="Cinna" className="w-5 h-5 rounded-full object-cover" />
        <span className="hidden sm:inline">Cinna: {teachingNote?.concept || moodLabel}</span>
        <ChevronUp className="w-3 h-3 text-[#EC4899]" />
      </button>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFDF9] border-2 border-pink-300 shadow-sm select-none max-w-sm sm:max-w-md animate-in fade-in duration-200">
        {/* Cinna Avatar */}
        <button
          onClick={() => setShowFullNoteModal(true)}
          className="relative shrink-0 flex items-center cursor-pointer group"
          title="Click to view Cinna's full educational note"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-pink-300 bg-[#FDF2F8] p-0.5 overflow-hidden shadow-xs group-hover:scale-105 transition-transform">
            <img
              src={spriteSrc}
              alt="Cinna"
              className="w-full h-full object-cover filter drop-shadow"
            />
          </div>
          <span
            className={`absolute -bottom-1 -right-1 px-1 rounded-full text-[8px] font-black uppercase tracking-tight border ${moodBadgeColor}`}
          >
            {moodLabel}
          </span>
        </button>

        {/* Speech Bubble */}
        <div
          onClick={() => setShowFullNoteModal(true)}
          className="flex-1 min-w-0 pr-1 cursor-pointer group"
          title="Click to view full educational breakdown"
        >
          {teachingNote?.concept && (
            <span className="inline-block text-[9px] font-black uppercase tracking-wider text-[#9D174D] bg-[#FCE7F3] px-1.5 py-0.2 rounded mr-1">
              {teachingNote.concept}
            </span>
          )}
          <p className="text-[11px] text-[#4C1D38] font-bold leading-tight truncate group-hover:text-[#9D174D] transition-colors">
            &ldquo;{commentary}&rdquo;
          </p>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setShowFullNoteModal(true)}
            className="text-[#DB2777] hover:text-[#9D174D] p-0.5 rounded transition-colors"
            title="Open educational breakdown"
          >
            <GraduationCap className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-[#A87B95] hover:text-[#831843] p-0.5 rounded transition-colors"
            title="Minimize Cinna"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Cinna Educational Modal */}
      {showFullNoteModal && (
        <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 select-none">
          <div className="w-full max-w-lg bg-[#FFFDF9] border-4 border-[#F472B6] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-pink-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full border-2 border-pink-300 bg-[#FDF2F8] p-1 shrink-0">
                  <img src={spriteSrc} alt="Cinna" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-[#831843] flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#DB2777]" />
                    Cinna&apos;s Courtroom Educational Breakdown
                  </h3>
                  <p className="text-[11px] text-[#A87B95] font-semibold">
                    Translating legal-style debate maneuvers into everyday understanding
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFullNoteModal(false)}
                className="p-1 rounded-full text-[#9D174D] hover:bg-pink-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Teaching Content */}
            <div className="space-y-3 text-xs">
              {teachingNote?.concept && (
                <div className="p-3 rounded-2xl bg-[#FDF2F8] border-2 border-pink-200">
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#9D174D] block mb-1">
                    Key Term / Concept
                  </span>
                  <p className="text-sm font-black text-[#831843]">{teachingNote.concept}</p>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border-2 border-[#FDE68A]">
                <span className="text-[10px] uppercase font-black tracking-wider text-[#92400E] block mb-1">
                  What is Happening Here:
                </span>
                <p className="text-xs text-[#78350F] font-medium leading-relaxed">{commentary}</p>
              </div>

              {teachingNote?.fallacyOrAssumption && (
                <div className="p-3.5 rounded-2xl bg-[#FEF2F2] border-2 border-red-200">
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#991B1B] flex items-center gap-1 mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                    Assumption or Reasoning Flaw Identified:
                  </span>
                  <p className="text-xs text-[#7F1D1D] font-bold leading-relaxed">
                    {teachingNote.fallacyOrAssumption}
                  </p>
                </div>
              )}

              {teachingNote?.educationalTip && (
                <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border-2 border-[#A7F3D0]">
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#065F46] flex items-center gap-1 mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-[#059669]" />
                    Reader Takeaway / Tip:
                  </span>
                  <p className="text-xs text-[#064E3B] font-bold leading-relaxed">
                    {teachingNote.educationalTip}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowFullNoteModal(false)}
                className="px-4 py-1.5 rounded-full bg-[#FDF2F8] hover:bg-[#FCE7F3] text-[#831843] border border-pink-300 text-xs font-black transition-all"
              >
                Back to Trial
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
