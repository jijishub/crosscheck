'use client';

import React, { useState } from 'react';
import { DialogueEmotion, CalloutType } from '@/types/debate';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface CinnaNarratorProps {
  emotion?: DialogueEmotion;
  callout?: CalloutType;
  speakerName?: string;
  activeClaimText?: string;
}

export function CinnaNarrator({
  emotion = 'neutral',
  callout = null,
  speakerName = '',
  activeClaimText = '',
}: CinnaNarratorProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  // Pick Cinna sprite based on emotion and callout
  let spriteSrc = '/Cinna_1.png';
  let moodLabel = 'Bailiff';
  let moodBadgeColor = 'bg-pink-200 text-pink-950 border-pink-300';
  let commentary = 'Observing the courtroom debate...';

  if (callout || emotion === 'intense') {
    spriteSrc = '/Cinna_4.png';
    moodLabel = 'Shocked!';
    moodBadgeColor = 'bg-rose-200 text-rose-950 border-rose-300';
    commentary = `Whoa! Intense objection from ${speakerName || 'the debater'}! Check the dossier!`;
  } else if (emotion === 'thinking') {
    spriteSrc = '/Cinna_3.png';
    moodLabel = 'Pondering';
    moodBadgeColor = 'bg-purple-200 text-purple-950 border-purple-300';
    commentary = 'Notice how this argument tests whether external shocks break the forecast!';
  } else if (emotion === 'confident' || emotion === 'synthesis') {
    spriteSrc = '/Cinna_2.png';
    moodLabel = 'Cheerful';
    moodBadgeColor = 'bg-sky-200 text-sky-950 border-sky-300';
    commentary = 'A strong point backed by verified data! The Jury is noting this!';
  } else {
    spriteSrc = '/Cinna_1.png';
    moodLabel = 'Order';
    moodBadgeColor = 'bg-pink-200 text-pink-950 border-pink-300';
    commentary = activeClaimText
      ? `Examining: "${activeClaimText.slice(0, 55)}..."`
      : 'Welcome! I take notes on both sides to help you learn the core concepts!';
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF9] border-2 border-pink-300 hover:bg-[#FDF2F8] text-[11px] font-black text-[#831843] transition-all shadow-xs select-none active:scale-95"
        title="Open Cinna commentary"
      >
        <img src={spriteSrc} alt="Cinna" className="w-5 h-5 rounded-full object-cover" />
        <span className="hidden sm:inline">Cinna: {moodLabel}</span>
        <ChevronUp className="w-3 h-3 text-[#EC4899]" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFDF9] border-2 border-pink-300 shadow-sm select-none max-w-sm sm:max-w-md animate-in fade-in duration-200">
      {/* Cinna Avatar */}
      <div className="relative shrink-0 flex items-center">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-pink-300 bg-[#FDF2F8] p-0.5 overflow-hidden shadow-xs">
          <img
            src={spriteSrc}
            alt="Cinna"
            className="w-full h-full object-cover filter drop-shadow hover:scale-110 transition-transform duration-200"
          />
        </div>
        <span
          className={`absolute -bottom-1 -right-1 px-1 rounded-full text-[8px] font-black uppercase tracking-tight border ${moodBadgeColor}`}
        >
          {moodLabel}
        </span>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1 min-w-0 pr-1">
        <p className="text-[11px] text-[#4C1D38] font-bold leading-tight truncate">
          &ldquo;{commentary}&rdquo;
        </p>
      </div>

      {/* Minimize Button */}
      <button
        onClick={() => setIsMinimized(true)}
        className="text-[#A87B95] hover:text-[#831843] p-0.5 rounded transition-colors shrink-0"
        title="Minimize Cinna"
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
