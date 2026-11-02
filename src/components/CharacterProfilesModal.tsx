'use client';

import React from 'react';
import { DebaterProfile } from '@/types/debate';
import { Sparkles, X, Heart, Shield, Award, MessageCircle } from 'lucide-react';

interface CharacterProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  debaterA: DebaterProfile;
  debaterB: DebaterProfile;
}

export function CharacterProfilesModal({
  isOpen,
  onClose,
  debaterA,
  debaterB,
}: CharacterProfilesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-pink-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-950 via-purple-950 to-pink-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-pink-500/20 text-pink-300 border border-pink-500/40">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
                <span>Courtroom Cast & Character Profiles</span>
              </h2>
              <p className="text-[11px] text-pink-200/70">
                Meet the debaters, the bailiff, and the judge driving each courtroom clash
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Debater Duel Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Debater A - Melon */}
            <div className="rounded-2xl bg-slate-950/80 border-2 border-sky-500/40 p-5 flex flex-col justify-between space-y-4 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-sky-600 text-white text-[10px] font-black uppercase tracking-wider">
                Defense Counsel
              </div>

              <div className="flex items-start gap-4">
                <div className="w-20 h-24 rounded-2xl bg-sky-950/60 border border-sky-400/50 p-1 shrink-0 overflow-hidden shadow-md flex items-end justify-center">
                  <img
                    src="/characters/A1_Melon_Confident.png"
                    alt={debaterA.name}
                    className="w-full h-full object-contain object-bottom"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-sky-300 flex items-center gap-1.5">
                    <span>{debaterA.name}</span>
                    <span className="text-xs text-slate-400 font-medium">({debaterA.archetypeTitle})</span>
                  </h3>
                  <p className="text-xs text-sky-100/90 font-medium italic">
                    &ldquo;{debaterA.catchphrase || 'Look at the underlying engine!'}&rdquo;
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(debaterA.personalityTraits || ['Energetic', 'Analogy Master', 'Forward-Looking']).map((trait, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-sky-950 text-sky-200 border border-sky-500/30 text-[10px] font-bold"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                    Speech Style & Mannerisms:
                  </span>
                  <p className="mt-0.5 text-slate-200">
                    {debaterA.speechStyle || 'Warm, conversational, and energetic. Loves comparing economic trends to everyday momentum like training athletes.'}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                    Core Philosophy:
                  </span>
                  <p className="mt-0.5 text-slate-300">
                    {debaterA.coreStance}
                  </p>
                </div>
              </div>
            </div>

            {/* Debater B - Yon */}
            <div className="rounded-2xl bg-slate-950/80 border-2 border-rose-500/40 p-5 flex flex-col justify-between space-y-4 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider">
                Prosecution Analyst
              </div>

              <div className="flex items-start gap-4">
                <div className="w-20 h-24 rounded-2xl bg-rose-950/60 border border-rose-400/50 p-1 shrink-0 overflow-hidden shadow-md flex items-end justify-center">
                  <img
                    src="/characters/B1_Openyon_Composed.png"
                    alt={debaterB.name}
                    className="w-full h-full object-contain object-bottom"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-rose-300 flex items-center gap-1.5">
                    <span>{debaterB.name}</span>
                    <span className="text-xs text-slate-400 font-medium">({debaterB.archetypeTitle})</span>
                  </h3>
                  <p className="text-xs text-rose-100/90 font-medium italic">
                    &ldquo;{debaterB.catchphrase || 'A headline without the downside footnotes is wishful thinking.'}&rdquo;
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(debaterB.personalityTraits || ['Surgical Precision', 'Dry Wit', 'Stress-Tester']).map((trait, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-200 border border-rose-500/30 text-[10px] font-bold"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                    Speech Style & Mannerisms:
                  </span>
                  <p className="mt-0.5 text-slate-200">
                    {debaterB.speechStyle || 'Cool, clinical, analytical. Delivers sharp reality checks with a trademark glint of his round glasses.'}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block">
                    Core Philosophy:
                  </span>
                  <p className="mt-0.5 text-slate-300">
                    {debaterB.coreStance}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Courtroom Companions & Officials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cinna Mascot */}
            <div className="p-4 rounded-2xl bg-pink-950/30 border border-pink-500/30 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-pink-500/20 border border-pink-400/40 p-1 shrink-0 overflow-hidden shadow">
                <img src="/Cinna_1.png" alt="Cinna Mascot" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-pink-300">
                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                  <span>Cinna • Court Bailiff & Companion</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Reacts dynamically to intense objections, celebrates verified claims, and breaks down complex arguments into beginner baby-steps.
                </p>
              </div>
            </div>

            {/* The Jury Foreperson */}
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-400/40 p-1 shrink-0 overflow-hidden shadow">
                <img
                  src="/characters/J1_Judge_Welcoming.png"
                  alt="Jury Foreperson"
                  className="w-full h-full object-contain object-top"
                />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-purple-300">
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  <span>Jury Foreperson • Academic Jurist</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Impartial teacher-like judge who unrolls the Evidence Ledger and explains dense technical terms using everyday analogies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}