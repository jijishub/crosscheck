'use client';

import React from 'react';
import { DebaterProfile } from '@/types/debate';
import { Sparkles, X, Heart, Award } from 'lucide-react';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-4xl max-h-[82vh] sm:max-h-[85vh] my-auto bg-[#FFFDF9] border-4 border-[#F472B6] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header - Solid Pastel Pink/Purple */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3.5 bg-[#FDF2F8] border-b-2 border-[#FBCFE8] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-[#FFFDF9] text-[#831843] border-2 border-[#F472B6]">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#831843] flex items-center gap-2">
                <span>Courtroom Cast & Character Profiles</span>
              </h2>
              <p className="text-[11px] text-[#7C5E74] font-medium">
                Meet the debaters, the bailiff, and the judge driving each courtroom clash
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#FFFDF9] hover:bg-[#FCE7F3] text-[#831843] border-2 border-[#F472B6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Debater Duel Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Debater A - Melon (Defense) - Solid Pastel Sky */}
            <div className="rounded-2xl bg-[#F0F9FF] border-2 border-[#7DD3FC] p-5 flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-[#0284C7] text-white text-[10px] font-black uppercase tracking-wider">
                Defense Counsel
              </div>

              <div className="flex items-start gap-4">
                <div className="w-20 h-24 rounded-2xl bg-[#E0F2FE] border-2 border-[#38BDF8] p-1 shrink-0 overflow-hidden shadow-xs flex items-end justify-center">
                  <img
                    src="/characters/A1_Melon_Confident.png"
                    alt={debaterA.name}
                    className="w-full h-full object-contain object-bottom"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-[#0369A1] flex items-center gap-1.5">
                    <span>{debaterA.name}</span>
                    <span className="text-xs text-[#0284C7] font-semibold">({debaterA.archetypeTitle})</span>
                  </h3>
                  <p className="text-xs text-[#0c4a6e] font-semibold italic">
                    &ldquo;{debaterA.catchphrase || 'Look at the underlying engine!'}&rdquo;
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(debaterA.personalityTraits || ['Energetic', 'Analogy Master', 'Forward-Looking']).map((trait, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full bg-[#FFFDF9] text-[#0369A1] border border-[#7DD3FC] text-[10px] font-black"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#0c4a6e] border-t-2 border-[#BAE6FD] pt-3">
                <div>
                  <span className="font-black text-[#0369A1] uppercase text-[10px] tracking-wider block">
                    Speech Style & Mannerisms:
                  </span>
                  <p className="mt-0.5 font-medium leading-relaxed">
                    {debaterA.speechStyle || 'Warm, conversational, and energetic. Loves comparing economic trends to everyday momentum like training athletes.'}
                  </p>
                </div>
                <div>
                  <span className="font-black text-[#0369A1] uppercase text-[10px] tracking-wider block">
                    Core Philosophy:
                  </span>
                  <p className="mt-0.5 font-medium leading-relaxed">
                    {debaterA.coreStance}
                  </p>
                </div>
              </div>
            </div>

            {/* Debater B - Yon (Prosecution) - Solid Pastel Rose */}
            <div className="rounded-2xl bg-[#FFF1F2] border-2 border-[#FDA4AF] p-5 flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-[#E11D48] text-white text-[10px] font-black uppercase tracking-wider">
                Prosecution Analyst
              </div>

              <div className="flex items-start gap-4">
                <div className="w-20 h-24 rounded-2xl bg-[#FFE4E6] border-2 border-[#FB7185] p-1 shrink-0 overflow-hidden shadow-xs flex items-end justify-center">
                  <img
                    src="/characters/B1_Openyon_Composed.png"
                    alt={debaterB.name}
                    className="w-full h-full object-contain object-bottom"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-[#9F1239] flex items-center gap-1.5">
                    <span>{debaterB.name}</span>
                    <span className="text-xs text-[#BE123C] font-semibold">({debaterB.archetypeTitle})</span>
                  </h3>
                  <p className="text-xs text-[#881337] font-semibold italic">
                    &ldquo;{debaterB.catchphrase || 'A headline without the downside footnotes is wishful thinking.'}&rdquo;
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(debaterB.personalityTraits || ['Surgical Precision', 'Dry Wit', 'Stress-Tester']).map((trait, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full bg-[#FFFDF9] text-[#9F1239] border border-[#FDA4AF] text-[10px] font-black"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#881337] border-t-2 border-[#FECDD3] pt-3">
                <div>
                  <span className="font-black text-[#9F1239] uppercase text-[10px] tracking-wider block">
                    Speech Style & Mannerisms:
                  </span>
                  <p className="mt-0.5 font-medium leading-relaxed">
                    {debaterB.speechStyle || 'Cool, clinical, analytical. Delivers sharp reality checks with a trademark glint of his round glasses.'}
                  </p>
                </div>
                <div>
                  <span className="font-black text-[#9F1239] uppercase text-[10px] tracking-wider block">
                    Core Philosophy:
                  </span>
                  <p className="mt-0.5 font-medium leading-relaxed">
                    {debaterB.coreStance}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Courtroom Companions & Officials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cinna Mascot */}
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border-2 border-[#F472B6] flex items-center gap-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-[#FDF2F8] border-2 border-[#FBCFE8] p-1 shrink-0 overflow-hidden shadow-xs">
                <img src="/Cinna_1.png" alt="Cinna Mascot" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-black text-[#831843]">
                  <Heart className="w-3.5 h-3.5 text-[#E11D48] fill-[#E11D48]" />
                  <span>Cinna • Court Bailiff & Companion</span>
                </div>
                <p className="text-[11px] text-[#7C5E74] font-medium leading-relaxed">
                  Reacts dynamically to intense objections, celebrates verified claims, and breaks down complex arguments into beginner baby-steps.
                </p>
              </div>
            </div>

            {/* The Jury Foreperson */}
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border-2 border-[#C084FC] flex items-center gap-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-[#FAF5FF] border-2 border-[#E9D5FF] p-1 shrink-0 overflow-hidden shadow-xs">
                <img
                  src="/characters/J1_Judge_Welcoming.png"
                  alt="Jury Foreperson"
                  className="w-full h-full object-contain object-top"
                />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-black text-[#581C87]">
                  <Award className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Jury Foreperson • Academic Jurist</span>
                </div>
                <p className="text-[11px] text-[#7C5E74] font-medium leading-relaxed">
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
