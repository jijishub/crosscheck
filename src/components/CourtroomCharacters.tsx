'use client';

import React from 'react';
import { DialogueEmotion, CalloutType } from '@/types/debate';

interface DebaterPortraitProps {
  side: 'debater_a' | 'debater_b';
  name: string;
  title: string;
  emotion: DialogueEmotion;
  isActive: boolean;
  accentColor?: string;
}

export function DebaterPortrait({
  side,
  name,
  title,
  emotion,
  isActive,
}: DebaterPortraitProps) {
  const isA = side === 'debater_a';

  // Base theme colors
  const primaryBg = isA ? 'from-blue-950/80 to-slate-900/90' : 'from-rose-950/80 to-slate-900/90';
  const borderRing = isActive
    ? isA
      ? 'ring-4 ring-blue-500 shadow-lg shadow-blue-500/30'
      : 'ring-4 ring-rose-500 shadow-lg shadow-rose-500/30'
    : 'border border-slate-700/60 opacity-80';

  return (
    <div className={`relative flex flex-col items-center transition-all duration-300 ${isActive ? 'scale-105 z-10' : 'scale-95'}`}>
      {/* Speaker Tag Pill */}
      <div
        className={`mb-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
          isActive
            ? isA
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/50'
              : 'bg-rose-600 text-white shadow-md shadow-rose-500/50'
            : 'bg-slate-800 text-slate-400'
        }`}
      >
        {isA ? '⚖️ Defense' : '⚔️ Prosecution'} • {name}
      </div>

      {/* Subtitle / Archetype */}
      <div className="text-[11px] text-slate-400 font-medium mb-1 text-center max-w-[200px] truncate">
        {title}
      </div>

      {/* Character Frame */}
      <div className={`w-44 h-56 sm:w-52 sm:h-64 rounded-2xl bg-gradient-to-b ${primaryBg} ${borderRing} overflow-hidden relative flex items-center justify-center p-2 backdrop-blur-md`}>
        {/* Courtroom Background Silhouette inside frame */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full border-t border-b border-white/20 grid grid-cols-4 gap-1">
            <div className="bg-white/10" />
            <div className="bg-white/5" />
            <div className="bg-white/10" />
            <div className="bg-white/5" />
          </div>
        </div>

        {/* Dynamic Vector Portrait */}
        {isA ? (
          <DebaterASVG emotion={emotion} isActive={isActive} />
        ) : (
          <DebaterBSVG emotion={emotion} isActive={isActive} />
        )}

        {/* Emotion Indicator Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-black/60 backdrop-blur-sm text-slate-300 border border-white/10">
          {emotion}
        </div>
      </div>
    </div>
  );
}

// Debater A: Sharp Blue Suit, Determined Expression, Pointing or Thinking
function DebaterASVG({ emotion, isActive }: { emotion: DialogueEmotion; isActive: boolean }) {
  const isObjection = emotion === 'intense';
  const isThinking = emotion === 'thinking';
  const isConfident = emotion === 'confident';
  const isSurprised = emotion === 'surprised';

  return (
    <svg viewBox="0 0 200 240" className="w-full h-full object-contain filter drop-shadow-md select-none">
      <defs>
        <linearGradient id="suitA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="tieA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
      </defs>

      {/* Shoulders & Suit */}
      <path d="M 20 240 L 45 150 L 80 140 L 120 140 L 155 150 L 180 240 Z" fill="url(#suitA)" />
      {/* White Shirt Collar */}
      <polygon points="80,140 100,180 120,140 110,135 90,135" fill="#f8fafc" />
      {/* Red Tie */}
      <polygon points="96,155 104,155 108,210 100,225 92,210" fill="url(#tieA)" />
      {/* Lapels */}
      <polygon points="45,150 78,185 85,140" fill="#2563eb" opacity="0.7" />
      <polygon points="155,150 122,185 115,140" fill="#2563eb" opacity="0.7" />

      {/* Head & Neck */}
      <rect x="90" y="115" width="20" height="28" fill="#fed7aa" rx="2" />
      <ellipse cx="100" cy="95" rx="34" ry="38" fill="#ffedd5" />

      {/* Hair (Spiky / Styled Blue-Black) */}
      <path
        d="M 66 85 Q 60 50 85 45 Q 100 35 125 42 Q 145 48 135 85 Q 145 75 130 65 Q 110 55 90 62 Q 72 70 66 85 Z"
        fill="#0f172a"
      />
      <path d="M 68 85 L 75 105 L 80 92 Z" fill="#0f172a" />
      <path d="M 132 85 L 125 105 L 120 92 Z" fill="#0f172a" />

      {/* Eyebrows based on emotion */}
      {isObjection ? (
        <>
          <line x1="75" y1="80" x2="94" y2="88" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="125" y1="80" x2="106" y2="88" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
        </>
      ) : isThinking ? (
        <>
          <line x1="75" y1="84" x2="93" y2="84" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="107" y1="82" x2="125" y2="76" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="76" y1="82" x2="94" y2="84" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="106" y1="84" x2="124" y2="82" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {/* Eyes */}
      {isSurprised ? (
        <>
          <circle cx="86" cy="94" r="5" fill="#0f172a" />
          <circle cx="114" cy="94" r="5" fill="#0f172a" />
          <circle cx="87" cy="92" r="1.5" fill="#ffffff" />
          <circle cx="115" cy="92" r="1.5" fill="#ffffff" />
        </>
      ) : (
        <>
          <ellipse cx="86" cy="94" rx="4" ry="3" fill="#0f172a" />
          <ellipse cx="114" cy="94" rx="4" ry="3" fill="#0f172a" />
          <circle cx="87" cy="93" r="1" fill="#ffffff" />
          <circle cx="115" cy="93" r="1" fill="#ffffff" />
        </>
      )}

      {/* Mouth */}
      {isObjection ? (
        // Open shouting mouth
        <polygon points="94,110 106,110 100,122" fill="#7f1d1d" stroke="#0f172a" strokeWidth="1" />
      ) : isConfident ? (
        // Confident smirk
        <path d="M 94 112 Q 102 116 110 110" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
      ) : isThinking ? (
        // Small focused mouth
        <line x1="97" y1="114" x2="105" y2="114" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
      ) : (
        // Neutral
        <line x1="95" y1="113" x2="107" y2="113" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
      )}

      {/* Gesture overlay */}
      {isObjection && isActive && (
        // Pointing Arm & Finger overlay
        <g className="animate-pulse">
          <path d="M 120 180 L 175 140 L 195 135 L 175 155 Z" fill="#ffedd5" stroke="#0f172a" strokeWidth="2" />
          <circle cx="195" cy="135" r="4" fill="#ffedd5" stroke="#0f172a" strokeWidth="1.5" />
        </g>
      )}

      {isThinking && (
        // Hand to chin
        <g>
          <ellipse cx="112" cy="120" rx="9" ry="7" fill="#fed7aa" stroke="#0f172a" strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
}

// Debater B: Crimson Vest, Analytical Glasses, Stern/Composed demeanor
function DebaterBSVG({ emotion, isActive }: { emotion: DialogueEmotion; isActive: boolean }) {
  const isObjection = emotion === 'intense';
  const isThinking = emotion === 'thinking';
  const isConfident = emotion === 'confident';
  const isSurprised = emotion === 'surprised';

  return (
    <svg viewBox="0 0 200 240" className="w-full h-full object-contain filter drop-shadow-md select-none">
      <defs>
        <linearGradient id="suitB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#881337" />
          <stop offset="100%" stopColor="#2e0514" />
        </linearGradient>
        <linearGradient id="vestB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#be123c" />
          <stop offset="100%" stopColor="#4c0519" />
        </linearGradient>
      </defs>

      {/* Shoulders & Coat */}
      <path d="M 20 240 L 45 150 L 80 140 L 120 140 L 155 150 L 180 240 Z" fill="url(#suitB)" />
      {/* Charcoal/Black Inner Vest */}
      <polygon points="75,140 100,195 125,140" fill="url(#vestB)" />
      {/* High Ascot / Cravat Collar */}
      <polygon points="85,135 100,165 115,135" fill="#f1f5f9" />
      <polygon points="95,150 105,150 100,175" fill="#94a3b8" />

      {/* Head & Neck */}
      <rect x="90" y="115" width="20" height="28" fill="#fed7aa" rx="2" />
      <ellipse cx="100" cy="95" rx="33" ry="38" fill="#ffedd5" />

      {/* Hair (Sleek Dark Silver / Charcoal parted hair) */}
      <path
        d="M 64 88 Q 62 48 95 44 Q 130 42 138 88 Q 132 60 100 58 Q 72 60 64 88 Z"
        fill="#334155"
      />
      <path d="M 65 88 L 72 108 L 78 95 Z" fill="#334155" />
      <path d="M 136 88 L 128 108 L 122 95 Z" fill="#334155" />

      {/* Glasses Frames */}
      <circle cx="85" cy="94" r="9" fill="none" stroke="#f59e0b" strokeWidth="2" />
      <circle cx="115" cy="94" r="9" fill="none" stroke="#f59e0b" strokeWidth="2" />
      <line x1="94" y1="94" x2="106" y2="94" stroke="#f59e0b" strokeWidth="2" />
      {/* Glasses glare */}
      <path d="M 80 90 L 88 98" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <path d="M 110 90 L 118 98" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

      {/* Eyebrows */}
      {isObjection ? (
        <>
          <line x1="75" y1="78" x2="94" y2="86" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          <line x1="125" y1="78" x2="106" y2="86" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : isThinking ? (
        <>
          <line x1="76" y1="82" x2="94" y2="80" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="106" y1="82" x2="124" y2="86" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="76" y1="81" x2="94" y2="82" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="106" y1="82" x2="124" y2="81" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {/* Eyes behind glasses */}
      <ellipse cx="85" cy="94" rx="3.5" ry="3" fill="#0f172a" />
      <ellipse cx="115" cy="94" rx="3.5" ry="3" fill="#0f172a" />

      {/* Mouth */}
      {isObjection ? (
        <polygon points="94,112 106,112 100,123" fill="#4c0519" stroke="#0f172a" strokeWidth="1" />
      ) : isConfident ? (
        <path d="M 94 112 Q 100 115 107 111" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
      ) : isSurprised ? (
        <circle cx="100" cy="114" r="4" fill="#4c0519" />
      ) : (
        <line x1="95" y1="113" x2="105" y2="113" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
      )}

      {/* Sweat drop if surprised */}
      {isSurprised && (
        <path d="M 125 75 Q 128 85 125 90 Q 122 85 125 75 Z" fill="#67e8f9" />
      )}

      {/* Gesture overlay */}
      {isObjection && isActive && (
        <g className="animate-pulse">
          {/* Slamming gesture lines */}
          <line x1="40" y1="210" x2="160" y2="210" stroke="#f43f5e" strokeWidth="3" strokeDasharray="6,4" />
        </g>
      )}
    </svg>
  );
}

// Neutral Jury Foreperson: Central Explainer & Impartial Synthesizer
export function JuryForepersonPortrait({ emotion }: { emotion: DialogueEmotion }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-amber-400/80 bg-gradient-to-b from-purple-900 to-slate-900 p-1 shadow-md shadow-amber-500/20 overflow-hidden relative">
        <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
          {/* Robe Collar */}
          <path d="M 15 120 L 35 90 L 60 85 L 85 90 L 105 120 Z" fill="#4c1d95" />
          <polygon points="50,85 60,105 70,85" fill="#f59e0b" />

          {/* Head & Neck */}
          <rect x="54" y="70" width="12" height="18" fill="#fed7aa" />
          <ellipse cx="60" cy="58" rx="20" ry="24" fill="#ffedd5" />

          {/* White Jurist Wig / Hair */}
          <path
            d="M 38 55 Q 36 30 60 28 Q 84 30 82 55 Q 86 75 75 80 Q 60 76 45 80 Q 36 75 38 55 Z"
            fill="#e2e8f0"
          />

          {/* Glasses */}
          <circle cx="51" cy="58" r="6" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx="69" cy="58" r="6" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1="57" y1="58" x2="63" y2="58" stroke="#f59e0b" strokeWidth="1.5" />

          {/* Eyes */}
          <circle cx="51" cy="58" r="2" fill="#0f172a" />
          <circle cx="69" cy="58" r="2" fill="#0f172a" />

          {/* Warm Impartial Smile */}
          <path d="M 55 70 Q 60 74 65 70" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {/* Small Scale of Justice Badge */}
        <div className="absolute top-1 right-1 text-xs select-none">
          ⚖️
        </div>
      </div>
      <div className="mt-1 px-2.5 py-0.5 rounded-full bg-purple-950/90 border border-purple-500/40 text-[11px] font-bold text-amber-300 tracking-wide uppercase">
        Jury Foreperson • Neutral Synthesis
      </div>
    </div>
  );
}

// Theatrical Callout Banner ("OBJECTION!", "HOLD IT!", "TAKE THAT!")
export function CalloutStingerBanner({ callout }: { callout: CalloutType }) {
  if (!callout) return null;

  const isObjection = callout === 'OBJECTION!';
  const isHoldIt = callout === 'HOLD IT!';
  const isTakeThat = callout === 'TAKE THAT!';

  const bgGradient = isObjection
    ? 'from-red-600 via-rose-500 to-amber-500'
    : isHoldIt
    ? 'from-amber-600 via-yellow-500 to-orange-500'
    : 'from-blue-600 via-indigo-500 to-cyan-500';

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Background Flash / Speedlines */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150" />

      {/* Spiked Comic Burst Container */}
      <div className="relative animate-in zoom-in-75 duration-200">
        <div
          className={`px-8 py-4 sm:px-14 sm:py-6 rounded-3xl bg-gradient-to-r ${bgGradient} text-white font-black italic tracking-widest text-3xl sm:text-5xl md:text-6xl uppercase shadow-2xl border-4 border-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transform -rotate-3 select-none flex items-center gap-3`}
        >
          <span>⚡</span>
          <span>{callout}</span>
          <span>⚡</span>
        </div>
      </div>
    </div>
  );
}
