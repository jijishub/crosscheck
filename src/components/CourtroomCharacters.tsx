'use client';

import React, { useState } from 'react';
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
  const [imgError, setImgError] = useState(false);

  // Cute feminine-accented pastel courtroom theme
  const primaryBg = isA
    ? 'from-sky-950/90 via-slate-900/90 to-rose-950/40'
    : 'from-purple-950/90 via-slate-900/90 to-pink-950/40';

  const borderRing = isActive
    ? isA
      ? 'ring-4 ring-sky-400 shadow-2xl shadow-sky-500/40 scale-105'
      : 'ring-4 ring-rose-400 shadow-2xl shadow-rose-500/40 scale-105'
    : 'border border-slate-700/60 opacity-80 scale-95';

  // Determine sprite path based on character and emotion
  let spriteSrc = '';
  if (isA) {
    if (emotion === 'intense') {
      spriteSrc = '/characters/A2_Melon_Objection.png';
    } else if (emotion === 'thinking' || emotion === 'surprised') {
      spriteSrc = '/characters/A3_Melon_Thinking.png';
    } else {
      spriteSrc = '/characters/A1_Melon_Confident.png';
    }
  } else {
    if (emotion === 'intense') {
      spriteSrc = '/characters/B2_Openyon_Objection.png';
    } else if (emotion === 'surprised') {
      spriteSrc = '/characters/B3_Openyon_Shocked.png';
    } else {
      spriteSrc = '/characters/B1_Openyon_Composed.png';
    }
  }

  return (
    <div className={`relative flex flex-col items-center transition-all duration-300 ${isActive ? 'z-20' : 'z-10'}`}>
      {/* Speaker Tag Pill */}
      <div
        className={`mb-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md ${
          isActive
            ? isA
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-500/40 ring-2 ring-white/40'
              : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-500/40 ring-2 ring-white/40'
            : 'bg-slate-800/90 text-slate-400 border border-slate-700'
        }`}
      >
        <span>{isA ? '⚖️ Defense' : '⚔️ Prosecution'}</span>
        <span>•</span>
        <span>{name}</span>
      </div>

      {/* Subtitle / Archetype */}
      <div className="text-[11px] text-pink-200/90 font-medium mb-1.5 text-center max-w-[200px] truncate">
        {title}
      </div>

      {/* Character Frame */}
      <div className={`w-52 h-68 sm:w-64 sm:h-80 rounded-3xl bg-gradient-to-b ${primaryBg} ${borderRing} overflow-hidden relative flex items-center justify-center p-1.5 backdrop-blur-md transition-all`}>
        {/* Soft arched ambient backdrop inside frame */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-col items-center justify-center">
          <div className="w-36 h-52 border-2 border-pink-300/40 rounded-t-full bg-gradient-to-b from-pink-500/20 via-sky-500/10 to-transparent" />
        </div>

        {/* High-Res AI Generated Sprite with SVG Fallback */}
        {!imgError ? (
          <img
            src={spriteSrc}
            alt={`${name} - ${emotion}`}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain filter drop-shadow-lg select-none transition-transform duration-300 hover:scale-102"
          />
        ) : isA ? (
          <DebaterAFemaleSVG emotion={emotion} isActive={isActive} />
        ) : (
          <DebaterBMaleSVG emotion={emotion} isActive={isActive} />
        )}

        {/* Emotion Indicator Badge with cute pastel pill */}
        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-slate-950/85 backdrop-blur-md text-pink-300 border border-pink-500/40 flex items-center gap-1 shadow-md">
          <span>{emotion === 'intense' ? '⚡' : emotion === 'thinking' ? '💭' : emotion === 'confident' ? '✨' : '🌸'}</span>
          <span>{emotion}</span>
        </div>
      </div>
    </div>
  );
}

// Neutral Jury Foreperson / Judge: Dignified, warm female educator
export function JuryForepersonPortrait({ emotion }: { emotion: DialogueEmotion }) {
  const [imgError, setImgError] = useState(false);
  const spriteSrc =
    emotion === 'synthesis'
      ? '/characters/J2_Judge_Evidence_Ledger.png'
      : '/characters/J1_Judge_Welcoming.png';

  return (
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-pink-400/80 bg-gradient-to-b from-purple-900 via-slate-900 to-pink-950 p-1 shadow-lg shadow-pink-500/25 overflow-hidden relative flex items-center justify-center">
        {!imgError ? (
          <img
            src={spriteSrc}
            alt="Jury Foreperson"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover rounded-full select-none"
          />
        ) : (
          <JurySVG />
        )}

        {/* Small Scale of Justice Badge */}
        <div className="absolute top-1 right-1 text-xs select-none">
          ⚖️
        </div>
      </div>
      <div className="mt-1 px-3 py-0.5 rounded-full bg-purple-950/95 border border-pink-400/40 text-[11px] font-bold text-pink-200 tracking-wide uppercase shadow-sm">
        Jury Foreperson • Neutral Synthesis
      </div>
    </div>
  );
}

function JurySVG() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
      <path d="M 15 120 L 35 90 L 60 85 L 85 90 L 105 120 Z" fill="#6b21a8" />
      <polygon points="50,85 60,105 70,85" fill="#fdf4ff" />
      <circle cx="60" cy="92" r="3" fill="#f59e0b" />
      <rect x="54" y="70" width="12" height="18" fill="#fed7aa" />
      <ellipse cx="60" cy="58" rx="20" ry="23" fill="#ffedd5" />
      <circle cx="60" cy="27" r="11" fill="#a855f7" />
      <ellipse cx="51" cy="58" rx="6" ry="5" fill="none" stroke="#f472b6" strokeWidth="1.2" />
      <ellipse cx="69" cy="58" rx="6" ry="5" fill="none" stroke="#f472b6" strokeWidth="1.2" />
      <circle cx="51" cy="58" r="2" fill="#3b0764" />
      <circle cx="69" cy="58" r="2" fill="#3b0764" />
      <path d="M 56 68 Q 60 72 64 68" fill="none" stroke="#581c87" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Theatrical Callout Overlay Graphic ("OBJECTION!", "HOLD IT!", "TAKE THAT!")
export function CalloutStingerBanner({ callout }: { callout: CalloutType }) {
  const [imgError, setImgError] = useState(false);
  if (!callout) return null;

  let graphicSrc = '';
  if (callout === 'OBJECTION!') {
    graphicSrc = '/scenes_and_overlays/Graphic_01_Objection.png';
  } else if (callout === 'HOLD IT!') {
    graphicSrc = '/scenes_and_overlays/Graphic_02_Hold_It.png';
  } else if (callout === 'TAKE THAT!') {
    graphicSrc = '/scenes_and_overlays/Graphic_03_Take_That.png';
  }

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Background Soft Glow Flash */}
      <div className="absolute inset-0 bg-pink-950/40 backdrop-blur-xs animate-in fade-in duration-150" />

      {/* Comic Burst Graphic */}
      <div className="relative animate-in zoom-in-75 duration-200 flex items-center justify-center max-w-[90%] max-h-[80%]">
        {!imgError && graphicSrc ? (
          <img
            src={graphicSrc}
            alt={callout}
            onError={() => setImgError(true)}
            className="w-auto h-auto max-w-[420px] sm:max-w-[540px] max-h-[220px] object-contain drop-shadow-[0_15px_30px_rgba(244,63,94,0.6)] select-none transform -rotate-2"
          />
        ) : (
          <div
            className="px-8 py-4 sm:px-14 sm:py-6 rounded-3xl bg-gradient-to-r from-rose-600 via-pink-500 to-amber-400 text-white font-black italic tracking-widest text-3xl sm:text-5xl md:text-6xl uppercase shadow-2xl border-4 border-white drop-shadow-[0_10px_25px_rgba(244,63,94,0.5)] transform -rotate-2 select-none flex items-center gap-3"
          >
            <span className="text-yellow-200 animate-spin">✨</span>
            <span>{callout}</span>
            <span className="text-yellow-200 animate-spin">✨</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Fallback SVGs
function DebaterAFemaleSVG({ emotion, isActive }: { emotion: DialogueEmotion; isActive: boolean }) {
  const isObjection = emotion === 'intense';
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full object-contain filter drop-shadow-md select-none">
      <defs>
        <linearGradient id="suitCuteA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <path d="M 28 240 L 48 155 L 80 144 L 120 144 L 152 155 L 172 240 Z" fill="url(#suitCuteA)" />
      <polygon points="80,144 100,185 120,144 110,140 90,140" fill="#fffbeb" />
      <ellipse cx="100" cy="158" rx="4" ry="4" fill="#f43f5e" />
      <rect x="91" y="118" width="18" height="26" fill="#fed7aa" rx="2" />
      <ellipse cx="100" cy="96" rx="32" ry="36" fill="#ffedd5" />
      <ellipse cx="78" cy="104" rx="6" ry="3.5" fill="#f43f5e" opacity="0.4" />
      <ellipse cx="122" cy="104" rx="6" ry="3.5" fill="#f43f5e" opacity="0.4" />
      <ellipse cx="85" cy="94" rx="5" ry="6" fill="#78350f" />
      <ellipse cx="115" cy="94" rx="5" ry="6" fill="#78350f" />
      <circle cx="83" cy="92" r="2" fill="#ffffff" />
      <circle cx="113" cy="92" r="2" fill="#ffffff" />
      {isObjection ? (
        <ellipse cx="100" cy="115" rx="6" ry="7" fill="#be123c" />
      ) : (
        <path d="M 95 113 Q 100 116 105 113" fill="none" stroke="#3d2114" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}

function DebaterBMaleSVG({ emotion, isActive }: { emotion: DialogueEmotion; isActive: boolean }) {
  const isObjection = emotion === 'intense';
  return (
    <svg viewBox="0 0 200 240" className="w-full h-full object-contain filter drop-shadow-md select-none">
      <defs>
        <linearGradient id="vestPlumB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#701a75" />
          <stop offset="100%" stopColor="#4a044e" />
        </linearGradient>
      </defs>
      <path d="M 28 240 L 48 155 L 80 144 L 120 144 L 152 155 L 172 240 Z" fill="#1e1b4b" />
      <polygon points="76,144 100,205 124,144" fill="url(#vestPlumB)" />
      <polygon points="85,140 100,170 115,140" fill="#f8fafc" />
      <rect x="91" y="118" width="18" height="26" fill="#fed7aa" rx="2" />
      <ellipse cx="100" cy="96" rx="31" ry="36" fill="#ffedd5" />
      <circle cx="85" cy="94" r="9" fill="none" stroke="#f472b6" strokeWidth="2" />
      <circle cx="115" cy="94" r="9" fill="none" stroke="#f472b6" strokeWidth="2" />
      <circle cx="87" cy="92.5" r="1.2" fill="#ffffff" />
      <circle cx="117" cy="92.5" r="1.2" fill="#ffffff" />
      {isObjection ? (
        <polygon points="94,113 106,113 100,123" fill="#701a75" />
      ) : (
        <line x1="95" y1="113" x2="105" y2="113" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}
