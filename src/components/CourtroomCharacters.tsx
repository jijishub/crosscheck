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

  // Cute feminine-accented pastel courtroom theme
  const primaryBg = isA
    ? 'from-sky-950/90 via-slate-900/90 to-rose-950/40'
    : 'from-purple-950/90 via-slate-900/90 to-pink-950/40';

  const borderRing = isActive
    ? isA
      ? 'ring-4 ring-sky-400 shadow-xl shadow-sky-500/30'
      : 'ring-4 ring-rose-400 shadow-xl shadow-rose-500/30'
    : 'border border-slate-700/60 opacity-85';

  return (
    <div className={`relative flex flex-col items-center transition-all duration-300 ${isActive ? 'scale-105 z-10' : 'scale-95'}`}>
      {/* Cute Speaker Tag Pill */}
      <div
        className={`mb-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md ${
          isActive
            ? isA
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-500/40 ring-2 ring-white/30'
              : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-500/40 ring-2 ring-white/30'
            : 'bg-slate-800/90 text-slate-400 border border-slate-700'
        }`}
      >
        <span>{isA ? '⚖️ Defense' : '⚔️ Prosecution'}</span>
        <span>•</span>
        <span>{name}</span>
      </div>

      {/* Subtitle / Archetype */}
      <div className="text-[11px] text-pink-200/80 font-medium mb-1.5 text-center max-w-[200px] truncate">
        {title}
      </div>

      {/* Character Frame with soft glow & courtroom arch */}
      <div className={`w-48 h-60 sm:w-56 sm:h-68 rounded-3xl bg-gradient-to-b ${primaryBg} ${borderRing} overflow-hidden relative flex items-center justify-center p-2 backdrop-blur-md transition-shadow`}>
        {/* Soft pastel arched window courtroom backdrop */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-col items-center justify-center">
          <div className="w-32 h-44 border-2 border-pink-300/40 rounded-t-full bg-gradient-to-b from-pink-500/20 via-sky-500/10 to-transparent" />
        </div>

        {/* Dynamic Vector Portrait */}
        {isA ? (
          <DebaterAFemaleSVG emotion={emotion} isActive={isActive} />
        ) : (
          <DebaterBMaleSVG emotion={emotion} isActive={isActive} />
        )}

        {/* Emotion Indicator Badge with cute pastel pill */}
        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-slate-950/80 backdrop-blur-md text-pink-300 border border-pink-500/30 flex items-center gap-1 shadow-sm">
          <span>{emotion === 'intense' ? '⚡' : emotion === 'thinking' ? '💭' : emotion === 'confident' ? '✨' : '🌸'}</span>
          <span>{emotion}</span>
        </div>
      </div>
    </div>
  );
}

// Debater A: Female Defense Advocate ("Melon") - Cute, energetic, navy blazer, pink bow tie, brown bangs
function DebaterAFemaleSVG({ emotion, isActive }: { emotion: DialogueEmotion; isActive: boolean }) {
  const isObjection = emotion === 'intense';
  const isThinking = emotion === 'thinking';
  const isConfident = emotion === 'confident';
  const isSurprised = emotion === 'surprised';

  return (
    <svg viewBox="0 0 200 240" className="w-full h-full object-contain filter drop-shadow-md select-none">
      <defs>
        <linearGradient id="suitCuteA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="ribbonCuteA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>
        <linearGradient id="hairCuteA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5c3826" />
          <stop offset="100%" stopColor="#3d2114" />
        </linearGradient>
      </defs>

      {/* Back Hair (flowing soft curls behind shoulders) */}
      <path
        d="M 52 90 Q 40 140 46 195 Q 60 185 64 150 Q 136 150 140 185 Q 146 140 134 90 Z"
        fill="url(#hairCuteA)"
      />

      {/* Shoulders & Tailored Blazer */}
      <path d="M 28 240 L 48 155 L 80 144 L 120 144 L 152 155 L 172 240 Z" fill="url(#suitCuteA)" />
      {/* Cream Blouse V-neck */}
      <polygon points="80,144 100,185 120,144 110,140 90,140" fill="#fffbeb" />

      {/* Cute Blush-Pink Ribbon Tie with Knot */}
      <ellipse cx="100" cy="158" rx="4" ry="4" fill="url(#ribbonCuteA)" />
      {/* Ribbon bow loops */}
      <ellipse cx="91" cy="156" rx="7" ry="5" fill="url(#ribbonCuteA)" transform="rotate(-15 91 156)" />
      <ellipse cx="109" cy="156" rx="7" ry="5" fill="url(#ribbonCuteA)" transform="rotate(15 109 156)" />
      {/* Ribbon tails */}
      <path d="M 97 160 L 92 182 L 98 178 Z" fill="#e11d48" />
      <path d="M 103 160 L 108 182 L 102 178 Z" fill="#e11d48" />

      {/* Gold scales lapel brooch */}
      <circle cx="68" cy="168" r="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />

      {/* Neck & Head */}
      <rect x="91" y="118" width="18" height="26" fill="#fed7aa" rx="2" />
      <ellipse cx="100" cy="96" rx="32" ry="36" fill="#ffedd5" />

      {/* Cute Soft Blush on Cheeks */}
      <ellipse cx="78" cy="104" rx="6" ry="3.5" fill="#f43f5e" opacity="0.4" />
      <ellipse cx="122" cy="104" rx="6" ry="3.5" fill="#f43f5e" opacity="0.4" />

      {/* Front Hair & Bangs */}
      <path
        d="M 62 82 Q 58 48 95 44 Q 138 42 136 82 Q 130 58 100 58 Q 68 58 62 82 Z"
        fill="url(#hairCuteA)"
      />
      {/* Soft anime bangs */}
      <path d="M 68 80 Q 78 102 85 90 Q 94 105 102 88 Q 112 104 122 88 Q 130 102 134 82 Z" fill="url(#hairCuteA)" />
      {/* Cute side hair strands */}
      <path d="M 64 85 Q 60 115 68 135 L 73 115 Z" fill="url(#hairCuteA)" />
      <path d="M 136 85 Q 140 115 132 135 L 127 115 Z" fill="url(#hairCuteA)" />

      {/* Eyebrows */}
      {isObjection ? (
        <>
          <line x1="75" y1="80" x2="93" y2="86" stroke="#3d2114" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="125" y1="80" x2="107" y2="86" stroke="#3d2114" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : isThinking ? (
        <>
          <line x1="76" y1="84" x2="94" y2="83" stroke="#3d2114" strokeWidth="2" strokeLinecap="round" />
          <line x1="106" y1="81" x2="124" y2="76" stroke="#3d2114" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M 76 83 Q 85 80 94 83" fill="none" stroke="#3d2114" strokeWidth="2" strokeLinecap="round" />
          <path d="M 106 83 Q 115 80 124 83" fill="none" stroke="#3d2114" strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {/* Big Cute Anime Eyes (Hazel / Amber) */}
      {isSurprised ? (
        <>
          <ellipse cx="85" cy="94" rx="6" ry="7" fill="#b45309" />
          <ellipse cx="115" cy="94" rx="6" ry="7" fill="#b45309" />
          <circle cx="83" cy="91" r="2.5" fill="#ffffff" />
          <circle cx="113" cy="91" r="2.5" fill="#ffffff" />
          <circle cx="87" cy="96" r="1.2" fill="#ffffff" />
          <circle cx="117" cy="96" r="1.2" fill="#ffffff" />
        </>
      ) : (
        <>
          <ellipse cx="85" cy="94" rx="5" ry="6" fill="#78350f" />
          <ellipse cx="115" cy="94" rx="5" ry="6" fill="#78350f" />
          <circle cx="85" cy="94" rx="4" ry="4.5" fill="#b45309" />
          <circle cx="115" cy="94" rx="4" ry="4.5" fill="#b45309" />
          {/* Eye sparkles */}
          <circle cx="83" cy="92" r="2" fill="#ffffff" />
          <circle cx="113" cy="92" r="2" fill="#ffffff" />
          <circle cx="87" cy="96" r="1" fill="#ffffff" />
          <circle cx="117" cy="96" r="1" fill="#ffffff" />
        </>
      )}

      {/* Mouth */}
      {isObjection ? (
        // Open shouting mouth
        <ellipse cx="100" cy="115" rx="6" ry="7" fill="#be123c" stroke="#3d2114" strokeWidth="1" />
      ) : isConfident ? (
        // Sweet determined smile
        <path d="M 94 112 Q 100 117 106 112" fill="none" stroke="#3d2114" strokeWidth="2.2" strokeLinecap="round" />
      ) : isThinking ? (
        // Small cute 'o' mouth
        <circle cx="100" cy="114" r="2.5" fill="#e11d48" />
      ) : (
        // Gentle smile
        <path d="M 95 113 Q 100 116 105 113" fill="none" stroke="#3d2114" strokeWidth="2" strokeLinecap="round" />
      )}

      {/* Comical sweat-drop if thinking */}
      {isThinking && (
        <path d="M 128 76 Q 131 84 128 88 Q 125 84 128 76 Z" fill="#38bdf8" />
      )}

      {/* Objection Finger Point with cute star sparkles */}
      {isObjection && isActive && (
        <g className="animate-pulse">
          <path d="M 125 180 L 175 140 L 195 136 L 175 152 Z" fill="#ffedd5" stroke="#3d2114" strokeWidth="1.8" />
          <circle cx="195" cy="136" r="3.5" fill="#ffedd5" stroke="#3d2114" strokeWidth="1.5" />
          {/* Cute sparkle stars */}
          <path d="M 195 120 L 197 125 L 202 127 L 197 129 L 195 134 L 193 129 L 188 127 L 193 125 Z" fill="#facc15" />
          <path d="M 170 125 L 171 128 L 174 129 L 171 130 L 170 133 L 169 130 L 166 129 L 169 128 Z" fill="#f43f5e" />
        </g>
      )}

      {/* Finger to cheek if thinking */}
      {isThinking && (
        <g>
          <ellipse cx="115" cy="116" rx="6" ry="5" fill="#fed7aa" stroke="#3d2114" strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
}

// Debater B: Male Prosecutor ("OpenYon") - Cool, elegant, round glasses with glint, plum vest, silver tie
function DebaterBMaleSVG({ emotion, isActive }: { emotion: DialogueEmotion; isActive: boolean }) {
  const isObjection = emotion === 'intense';
  const isThinking = emotion === 'thinking';
  const isConfident = emotion === 'confident';
  const isSurprised = emotion === 'surprised';

  return (
    <svg viewBox="0 0 200 240" className="w-full h-full object-contain filter drop-shadow-md select-none">
      <defs>
        <linearGradient id="vestPlumB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#701a75" />
          <stop offset="100%" stopColor="#4a044e" />
        </linearGradient>
        <linearGradient id="hairSilverB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {/* Shoulders & Charcoal Coat / Ivory Shirt */}
      <path d="M 28 240 L 48 155 L 80 144 L 120 144 L 152 155 L 172 240 Z" fill="#1e1b4b" />
      {/* Fitted Plum/Burgundy Vest */}
      <polygon points="76,144 100,205 124,144" fill="url(#vestPlumB)" />
      {/* Crisp White Shirt Collar & Neat Silver Tie */}
      <polygon points="85,140 100,170 115,140" fill="#f8fafc" />
      <polygon points="96,155 104,155 106,215 100,225 94,215" fill="#94a3b8" />
      {/* Rose-gold tie bar */}
      <line x1="95" y1="172" x2="105" y2="172" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />

      {/* Head & Neck */}
      <rect x="91" y="118" width="18" height="26" fill="#fed7aa" rx="2" />
      <ellipse cx="100" cy="96" rx="31" ry="36" fill="#ffedd5" />

      {/* Hair (Sleek ash-grey hair with elegant side part) */}
      <path
        d="M 64 85 Q 60 46 95 42 Q 134 40 136 85 Q 130 56 100 55 Q 70 56 64 85 Z"
        fill="url(#hairSilverB)"
      />
      <path d="M 65 86 L 73 110 L 78 96 Z" fill="url(#hairSilverB)" />
      <path d="M 135 86 L 127 110 L 122 96 Z" fill="url(#hairSilverB)" />

      {/* Round Rose-Gold Wire Glasses */}
      <circle cx="85" cy="94" r="9" fill="none" stroke="#f472b6" strokeWidth="2" />
      <circle cx="115" cy="94" r="9" fill="none" stroke="#f472b6" strokeWidth="2" />
      <line x1="94" y1="94" x2="106" y2="94" stroke="#f472b6" strokeWidth="2" />

      {/* Dramatic Anime Glasses Glint if Objection/Confident */}
      {(isObjection || isConfident) && (
        <g className="animate-pulse">
          <polygon points="85,87 87,93 93,95 87,97 85,103 83,97 77,95 83,93" fill="#ffffff" />
          <polygon points="115,87 117,93 123,95 117,97 115,103 113,97 107,95 113,93" fill="#ffffff" />
        </g>
      )}

      {/* Eyes behind glasses */}
      {isSurprised ? (
        <>
          <ellipse cx="85" cy="94" rx="4.5" ry="4.5" fill="#0f172a" />
          <ellipse cx="115" cy="94" rx="4.5" ry="4.5" fill="#0f172a" />
          <circle cx="87" cy="92" r="1.5" fill="#ffffff" />
          <circle cx="117" cy="92" r="1.5" fill="#ffffff" />
          {/* Anime blush of embarrassment */}
          <ellipse cx="78" cy="104" rx="5" ry="3" fill="#ec4899" opacity="0.4" />
          <ellipse cx="122" cy="104" rx="5" ry="3" fill="#ec4899" opacity="0.4" />
        </>
      ) : (
        <>
          <ellipse cx="85" cy="94" rx="3.5" ry="3.5" fill="#1e293b" />
          <ellipse cx="115" cy="94" rx="3.5" ry="3.5" fill="#1e293b" />
          <circle cx="87" cy="92.5" r="1.2" fill="#ffffff" />
          <circle cx="117" cy="92.5" r="1.2" fill="#ffffff" />
        </>
      )}

      {/* Eyebrows */}
      {isObjection ? (
        <>
          <line x1="76" y1="80" x2="94" y2="86" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="124" y1="80" x2="106" y2="86" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : isSurprised ? (
        <>
          <line x1="76" y1="78" x2="94" y2="83" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <line x1="124" y1="78" x2="106" y2="83" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="76" y1="82" x2="94" y2="82" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <line x1="106" y1="82" x2="124" y2="82" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {/* Mouth */}
      {isObjection ? (
        <polygon points="94,113 106,113 100,123" fill="#701a75" stroke="#1e293b" strokeWidth="1" />
      ) : isConfident ? (
        // Composed cool smirk
        <path d="M 94 113 Q 100 115 107 110" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      ) : isSurprised ? (
        // Small shocked circle
        <circle cx="100" cy="115" r="3.5" fill="#701a75" />
      ) : (
        <line x1="95" y1="113" x2="105" y2="113" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      )}

      {/* Sweat drop if surprised */}
      {isSurprised && (
        <path d="M 126 76 Q 129 84 126 88 Q 123 84 126 76 Z" fill="#38bdf8" />
      )}

      {/* Desk tap or glasses push gesture */}
      {isObjection && isActive && (
        <g className="animate-pulse">
          <line x1="45" y1="215" x2="155" y2="215" stroke="#f472b6" strokeWidth="3" strokeDasharray="6,4" />
        </g>
      )}
    </svg>
  );
}

// Neutral Jury Foreperson / Judge: Dignified, warm female educator with lavender robes & spectacles
export function JuryForepersonPortrait({ emotion }: { emotion: DialogueEmotion }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-pink-400/80 bg-gradient-to-b from-purple-900 via-slate-900 to-pink-950 p-1 shadow-lg shadow-pink-500/20 overflow-hidden relative">
        <svg viewBox="0 0 120 120" className="w-full h-full object-contain">
          {/* Lavender Robes & Cream Trim */}
          <path d="M 15 120 L 35 90 L 60 85 L 85 90 L 105 120 Z" fill="#6b21a8" />
          <polygon points="50,85 60,105 70,85" fill="#fdf4ff" />

          {/* Cute gold ribbon brooch */}
          <circle cx="60" cy="92" r="3" fill="#f59e0b" />
          <ellipse cx="56" cy="91" rx="3" ry="2" fill="#ec4899" />
          <ellipse cx="64" cy="91" rx="3" ry="2" fill="#ec4899" />

          {/* Head & Neck */}
          <rect x="54" y="70" width="12" height="18" fill="#fed7aa" />
          <ellipse cx="60" cy="58" rx="20" ry="23" fill="#ffedd5" />

          {/* Soft blush */}
          <ellipse cx="49" cy="63" rx="4" ry="2" fill="#f43f5e" opacity="0.35" />
          <ellipse cx="71" cy="63" rx="4" ry="2" fill="#f43f5e" opacity="0.35" />

          {/* Elegant soft lilac bun & hair */}
          <path
            d="M 40 55 Q 38 32 60 30 Q 82 32 80 55 Q 84 75 75 78 Q 60 74 45 78 Q 38 75 40 55 Z"
            fill="#c084fc"
          />
          {/* Hair Bun with pink floral hairpin */}
          <circle cx="60" cy="27" r="11" fill="#a855f7" />
          <circle cx="70" cy="28" r="3" fill="#f472b6" />

          {/* Cute oval reading spectacles */}
          <ellipse cx="51" cy="58" rx="6" ry="5" fill="none" stroke="#f472b6" strokeWidth="1.2" />
          <ellipse cx="69" cy="58" rx="6" ry="5" fill="none" stroke="#f472b6" strokeWidth="1.2" />
          <line x1="57" y1="58" x2="63" y2="58" stroke="#f472b6" strokeWidth="1.2" />

          {/* Eyes behind glasses */}
          <circle cx="51" cy="58" r="2" fill="#3b0764" />
          <circle cx="69" cy="58" r="2" fill="#3b0764" />
          <circle cx="52" cy="57" r="0.8" fill="#ffffff" />
          <circle cx="70" cy="57" r="0.8" fill="#ffffff" />

          {/* Warm Reassuring Smile */}
          <path d="M 56 68 Q 60 72 64 68" fill="none" stroke="#581c87" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

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

// Cute Theatrical Callout Banner ("OBJECTION!", "HOLD IT!", "TAKE THAT!")
export function CalloutStingerBanner({ callout }: { callout: CalloutType }) {
  if (!callout) return null;

  const isObjection = callout === 'OBJECTION!';
  const isHoldIt = callout === 'HOLD IT!';

  const bgGradient = isObjection
    ? 'from-rose-600 via-pink-500 to-amber-400'
    : isHoldIt
    ? 'from-amber-500 via-pink-400 to-rose-400'
    : 'from-sky-500 via-indigo-500 to-pink-500';

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Background Soft Glow Flash */}
      <div className="absolute inset-0 bg-pink-950/30 backdrop-blur-xs animate-in fade-in duration-150" />

      {/* Comic Burst with cute stars and sparkles */}
      <div className="relative animate-in zoom-in-75 duration-200">
        <div
          className={`px-8 py-4 sm:px-14 sm:py-6 rounded-3xl bg-gradient-to-r ${bgGradient} text-white font-black italic tracking-widest text-3xl sm:text-5xl md:text-6xl uppercase shadow-2xl border-4 border-white drop-shadow-[0_10px_25px_rgba(244,63,94,0.5)] transform -rotate-2 select-none flex items-center gap-3`}
        >
          <span className="text-yellow-200 animate-spin">✨</span>
          <span>{callout}</span>
          <span className="text-yellow-200 animate-spin">✨</span>
        </div>
      </div>
    </div>
  );
}
