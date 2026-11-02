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
  let moodBadgeColor = 'bg-pink-950 text-pink-300 border-pink-500/40';
  let commentary = 'Observing the courtroom debate...';

  if (callout || emotion === 'intense') {
    spriteSrc = '/Cinna_4.png';
    moodLabel = 'Shocked!';
    moodBadgeColor = 'bg-rose-950 text-rose-300 border-rose-500/50';
    commentary = `Whoa! Intense objection from ${speakerName || 'the debater'}! Check the dossier!`;
  } else if (emotion === 'thinking') {
    spriteSrc = '/Cinna_3.png';
    moodLabel = 'Pondering';
    moodBadgeColor = 'bg-purple-950 text-purple-300 border-purple-500/40';
    commentary = 'Notice how this argument tests whether external shocks break the forecast!';
  } else if (emotion === 'confident' || emotion === 'synthesis') {
    spriteSrc = '/Cinna_2.png';
    moodLabel = 'Cheerful';
    moodBadgeColor = 'bg-sky-950 text-sky-300 border-sky-500/40';
    commentary = 'A strong point backed by verified data! The Jury is noting this!';
  } else {
    spriteSrc = '/Cinna_1.png';
    moodLabel = 'Order';
    moodBadgeColor = 'bg-pink-950 text-pink-300 border-pink-500/40';
    commentary = activeClaimText
      ? `Examining: "${activeClaimText.slice(0, 55)}..."`
      : 'Welcome! I take notes on both sides to help you learn the core concepts!';
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-950/80 border border-pink-400/40 hover:bg-pink-900/90 text-[11px] font-bold text-pink-200 transition-all shadow-md select-none"
        title="Open Cinna commentary"
      >
        <img src={spriteSrc} alt="Cinna" className="w-5 h-5 rounded-full object-cover" />
        <span className="hidden sm:inline">Cinna: {moodLabel}</span>
        <ChevronUp className="w-3 h-3 text-pink-300" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 px-2.5 py-1 rounded-2xl bg-slate-900/90 border border-pink-500/30 backdrop-blur-md shadow-lg select-none max-w-sm sm:max-w-md animate-in fade-in duration-200">
      {/* Cinna Avatar */}
      <div className="relative shrink-0 flex items-center">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-pink-400/50 bg-gradient-to-b from-pink-500/20 to-purple-500/20 p-0.5 overflow-hidden shadow">
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
        <p className="text-[11px] text-pink-100 font-medium leading-tight truncate">
          &ldquo;{commentary}&rdquo;
        </p>
      </div>

      {/* Minimize Button */}
      <button
        onClick={() => setIsMinimized(true)}
        className="text-slate-400 hover:text-pink-300 p-0.5 rounded transition-colors shrink-0"
        title="Minimize Cinna"
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
