'use client';

import React, { useState } from 'react';
import { DialogueEmotion, CalloutType } from '@/types/debate';
import { Sparkles, MessageSquareHeart, ChevronDown, ChevronUp } from 'lucide-react';

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
  let moodLabel = 'Narrator';
  let commentary = 'Observing the courtroom debate...';

  if (callout || emotion === 'intense') {
    spriteSrc = '/Cinna_4.png';
    moodLabel = 'Shocked!';
    commentary = `Whoa! ${speakerName || 'The debater'} dropped an intense objection! Check the evidence to see if it holds up!`;
  } else if (emotion === 'thinking') {
    spriteSrc = '/Cinna_3.png';
    moodLabel = 'Pondering';
    commentary = 'Notice how this argument questions whether current global conditions disrupt long-term forecasts!';
  } else if (emotion === 'confident' || emotion === 'synthesis') {
    spriteSrc = '/Cinna_2.png';
    moodLabel = 'Cheerful';
    commentary = 'A strong point supported by economic data! The Jury is noting this in the court record!';
  } else {
    spriteSrc = '/Cinna_1.png';
    moodLabel = 'Order in Court';
    commentary = activeClaimText
      ? `Examining claim: "${activeClaimText.slice(0, 75)}..."`
      : 'Welcome to Court! I will be taking notes on both sides to help you learn the core concepts!';
  }

  return (
    <div className="relative z-30 transition-all select-none">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-950/90 border border-pink-400/50 shadow-lg text-xs font-bold text-pink-200 hover:bg-pink-900 transition-all"
        >
          <img
            src="/Cinna_1.png"
            alt="Cinna"
            className="w-5 h-5 rounded-full object-cover"
          />
          <span>Cinna (Narrator)</span>
          <ChevronUp className="w-3.5 h-3.5 text-pink-300" />
        </button>
      ) : (
        <div className="flex items-end gap-3 max-w-sm sm:max-w-md bg-slate-950/90 p-2.5 rounded-2xl border border-pink-500/30 backdrop-blur-md shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Cinna Mascot Avatar */}
          <div className="relative shrink-0 flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-pink-500/20 to-purple-500/20 border border-pink-400/40 p-0.5 overflow-hidden shadow-md">
              <img
                src={spriteSrc}
                alt="Cinna Narrator"
                className="w-full h-full object-contain filter drop-shadow hover:scale-105 transition-transform duration-200"
              />
            </div>
            <span className="mt-1 px-1.5 py-0.2 rounded-full bg-pink-950 text-pink-300 border border-pink-500/30 text-[9px] font-bold uppercase tracking-wider">
              {moodLabel}
            </span>
          </div>

          {/* Commentary Speech Bubble */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-pink-300">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                <span>Cinna • Courtroom Narrator</span>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
                title="Minimize Cinna"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-200 leading-snug font-medium italic">
              &ldquo;{commentary}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
