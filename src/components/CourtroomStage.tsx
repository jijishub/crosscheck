'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DebateAnalysisResult, DialogueTurn, CalloutType } from '@/types/debate';
import { DebaterPortrait, CalloutStingerBanner } from './CourtroomCharacters';
import { CinnaNarrator } from './CinnaNarrator';
import { CharacterProfilesModal } from './CharacterProfilesModal';
import { courtAudio } from '@/lib/audio';
import { Play, Pause, SkipForward, SkipBack, History, BookOpen, Volume2, VolumeX, FolderOpen, Users } from 'lucide-react';

interface CourtroomStageProps {
  debate: DebateAnalysisResult;
  onOpenCourtRecord: (evidenceId?: string) => void;
  onScrollToJuryBoard: () => void;
  isPaused?: boolean;
}

export function CourtroomStage({
  debate,
  onOpenCourtRecord,
  onScrollToJuryBoard,
  isPaused = false,
}: CourtroomStageProps) {
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [activeCallout, setActiveCallout] = useState<CalloutType>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isMuted, setIsMuted] = useState(courtAudio.getMuted());
  const [showHistory, setShowHistory] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);

  const script = debate.script || [];
  const currentTurn: DialogueTurn | undefined = script[currentTurnIdx];

  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect
  useEffect(() => {
    if (!currentTurn) return;

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    let shakeTimer: ReturnType<typeof setTimeout> | undefined;
    let calloutTimer: ReturnType<typeof setTimeout> | undefined;

    // Callouts and dialogue run together, with one cleanup for all timers.
    const startTurnTimer = setTimeout(() => {
      if (currentTurn.callout) {
        setActiveCallout(currentTurn.callout);
        setIsShaking(true);
        shakeTimer = setTimeout(() => setIsShaking(false), 400);

        if (currentTurn.callout === 'OBJECTION!') {
          courtAudio.playObjectionStinger();
        } else if (currentTurn.callout === 'HOLD IT!') {
          courtAudio.playGavelThud();
        } else if (currentTurn.callout === 'TAKE THAT!') {
          courtAudio.playEvidenceChime();
        } else if (currentTurn.callout === 'POINT OF ORDER') {
          courtAudio.playPointOfOrder();
        }

        // Hide callout after 1.2s
        calloutTimer = setTimeout(() => {
          setActiveCallout(null);
        }, 1200);
      } else {
        setActiveCallout(null);
        setIsShaking(false);
      }

      setDisplayedText('');
      setIsTyping(true);

      let charIdx = 0;
      const fullText = currentTurn.text;
      const isJury = currentTurn.speakerId === 'jury';

      typingTimerRef.current = setInterval(() => {
        if (charIdx < fullText.length) {
          setDisplayedText(fullText.slice(0, charIdx + 1));
          if (charIdx % 3 === 0) {
            courtAudio.playBlip(isJury ? 'low' : currentTurn.speakerId === 'debater_a' ? 'mid' : 'high');
          }
          charIdx++;
        } else {
          setIsTyping(false);
          if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        }
      }, 22);
    }, 0);

    return () => {
      clearTimeout(startTurnTimer);
      clearTimeout(calloutTimer);
      clearTimeout(shakeTimer);
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [currentTurnIdx, currentTurn]);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlay || isTyping || isPaused || showHistory || showProfiles) {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setTimeout(() => {
      if (currentTurnIdx < script.length - 1) {
        setCurrentTurnIdx(prev => prev + 1);
      } else {
        setIsAutoPlay(false);
      }
    }, 3200);

    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isAutoPlay, isTyping, currentTurnIdx, script.length, isPaused, showHistory, showProfiles]);

  const handleNext = useCallback(() => {
    if (isTyping && currentTurn) {
      // Instant reveal
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      setDisplayedText(currentTurn.text);
      setIsTyping(false);
      return;
    }
    if (currentTurnIdx < script.length - 1) {
      setCurrentTurnIdx(prev => prev + 1);
    }
  }, [isTyping, currentTurn, currentTurnIdx, script.length]);

  const handlePrev = useCallback(() => {
    if (currentTurnIdx > 0) {
      setCurrentTurnIdx(prev => prev - 1);
    }
  }, [currentTurnIdx]);

  const toggleSound = () => {
    const muted = courtAudio.toggleMute();
    setIsMuted(muted);
  };

  // Keyboard navigation (Space, ArrowRight, Enter to advance; ArrowLeft to go back)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (isPaused || showHistory || showProfiles || e.altKey || e.ctrlKey || e.metaKey ||
          target?.closest('input, textarea, select, button, a, [role="dialog"], [contenteditable="true"]')) {
        return;
      }

      if (e.code === 'Space' || e.code === 'ArrowRight' || e.code === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isPaused, showHistory, showProfiles]);

  // Active claim & evidence reference
  const activeClaim = currentTurn?.activeClaimId
    ? debate.claims.find(c => c.id === currentTurn.activeClaimId)
    : undefined;

  const presentedEvidence = currentTurn?.presentedEvidenceId
    ? debate.evidenceRecord.find(e => e.id === currentTurn.presentedEvidenceId)
    : undefined;

  const isDebaterAActive = currentTurn?.speakerId === 'debater_a';
  const isDebaterBActive = currentTurn?.speakerId === 'debater_b';
  const isJurySpeaking = currentTurn?.speakerId === 'jury';

  // Authentic visual novel dialogue box frame asset matching character & assets
  const activeDiaBoxSrc = isDebaterBActive ? '/DiaBox_1_frame.png' : '/DiaBox_2_frame.png';

  return (
    <div
      className={`relative w-full rounded-3xl bg-[#FAF5EB] border-4 border-[#C58B58] shadow-2xl overflow-hidden flex flex-col justify-between min-h-[600px] sm:min-h-[660px] transition-transform select-none ${
        isShaking ? 'animate-court-shake ring-4 ring-rose-400/70' : ''
      }`}
    >
      {/* Courtroom Backdrop Image - Bright, Vibrant, and Pastel */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <img
          src="/scenes_and_overlays/Backdrop_01_Main_Courtroom.png"
          alt="Courtroom Backdrop"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Dramatic Callout Stinger Overlay */}
      <CalloutStingerBanner callout={activeCallout} />

      {/* Top HUD: Session Title, Claim Ticker, and Controls - Solid Warm Cream */}
      <div className="relative z-30 bg-[#FFFDF9] border-b-2 border-[#E5C9A6] shadow-sm">
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between text-xs gap-3">
          {/* Left: Case Docket Title */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-3 py-0.5 rounded-full bg-[#FEF3C7] text-[#78350F] border-2 border-[#F59E0B] font-black uppercase text-[10px] tracking-wider flex items-center gap-1 shrink-0 shadow-xs">
              <span>⚖️</span>
              <span>Court Docket</span>
            </span>
            <span className="text-[#381E2B] font-black truncate text-xs sm:text-sm">
              {debate.topic}
            </span>
          </div>

          {/* Right: Audio, Cast & Court Record buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded-xl border-2 transition-all ${
                isMuted
                  ? 'bg-[#FDF6ED] text-[#B07D62]/50 border-[#E5C9A6]/50'
                  : 'bg-[#FDF6ED] text-[#8C5338] border-[#E5C9A6] shadow-xs hover:bg-[#F5EBE1]'
              }`}
              title={isMuted ? 'Unmute Court SFX' : 'Mute Court SFX'}
              aria-label={isMuted ? 'Unmute Court SFX' : 'Mute Court SFX'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowProfiles(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#581C87] font-black text-xs transition-all shadow-xs border-2 border-[#C084FC] active:scale-95"
              title="View Character Profiles & Personality Dossier"
            >
              <Users className="w-3.5 h-3.5 text-[#581C87]" />
              <span className="hidden sm:inline">Cast & Bios</span>
            </button>

            <button
              onClick={() => onOpenCourtRecord()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#78350F] font-black text-xs transition-all shadow-xs border-2 border-[#F59E0B] active:scale-95"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#78350F]" />
              <span>Court Record</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#78350F] text-[#FEF3C7] text-[10px] font-black">
                {debate.evidenceRecord.length}
              </span>
            </button>
          </div>
        </div>

        {/* Claim / Evidence Single-Line Ribbon - Solid Warm Honey */}
        {(activeClaim || presentedEvidence) && (
          <div className="px-4 py-1.5 bg-[#FFF9EB] border-t-2 border-[#E5C9A6] flex flex-wrap items-center justify-between gap-2 text-[11px] animate-in slide-in-from-top-1 duration-150">
            <div className="flex items-center gap-2 min-w-0">
              {activeClaim && (
                <>
                  <span className="text-[#92400E] font-black uppercase tracking-wider shrink-0 text-[10px]">
                    🎯 Claim:
                  </span>
                  <span className="text-[#451A03] italic truncate max-w-xs sm:max-w-md md:max-w-xl font-bold">
                    &ldquo;{activeClaim.text}&rdquo;
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#FEF3C7] text-[#78350F] border border-[#F59E0B] shrink-0">
                    {activeClaim.verificationStatus.replace(/_/g, ' ')}
                  </span>
                </>
              )}
            </div>

            {presentedEvidence && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#E0F2FE] text-[#0369A1] border border-[#7DD3FC] uppercase">
                  Take That! Evidence
                </span>
                <button
                  onClick={() => onOpenCourtRecord(presentedEvidence.id)}
                  className="text-[#92400E] hover:text-[#451A03] font-black text-[10px] underline truncate max-w-[170px] sm:max-w-[320px]"
                >
                  {presentedEvidence.title} →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Courtroom Stage View: Grounded Debaters */}
      <div className="flex-1 px-4 sm:px-8 py-2 flex items-end justify-around gap-4 relative z-10 overflow-hidden">
        {/* Debater A (Defense - Melon) */}
        <div className="w-1/2 flex justify-center items-end">
          <DebaterPortrait
            side="debater_a"
            name={debate.debaterA.name}
            title={debate.debaterA.archetypeTitle}
            emotion={isDebaterAActive ? currentTurn?.emotion || 'neutral' : 'neutral'}
            isActive={isDebaterAActive}
          />
        </div>

        {/* Debater B (Prosecution - Yon) */}
        <div className="w-1/2 flex justify-center items-end">
          <DebaterPortrait
            side="debater_b"
            name={debate.debaterB.name}
            title={debate.debaterB.archetypeTitle}
            emotion={isDebaterBActive ? currentTurn?.emotion || 'neutral' : 'neutral'}
            isActive={isDebaterBActive}
          />
        </div>

        {/* Floating Jury Intervention Badge if jury is speaking */}
        {isJurySpeaking && (
          <div className="absolute top-6 inset-x-0 mx-auto w-fit z-30 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-2 rounded-2xl bg-[#FAF5FF] border-2 border-[#C084FC] text-[#581C87] font-black text-xs shadow-xl flex items-center gap-2">
              <span className="text-base">⚖️</span>
              <span>The Jury Foreperson Intervenes to Clarify the Record</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Visual Novel Dialogue Box - Solid Opaque Anime Frame */}
      <div className="relative z-30 p-4 sm:p-5 bg-[#FFFDF9] border-t-4 border-[#C58B58] shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-1.5 sm:space-y-2">
          {/* Header Row: Compact Companion & Utility Actions (Tightened spacing above bubble) */}
          <div className="flex items-center justify-end gap-2 pb-0.5">
            <CinnaNarrator
              emotion={currentTurn?.emotion}
              callout={currentTurn?.callout}
              speakerName={currentTurn?.speakerName}
              activeClaimText={activeClaim?.text}
            />

            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 py-1.5 rounded-full bg-[#FFFDF9] hover:bg-[#FAF5EB] text-[#78350F] font-bold border-2 border-[#E5C9A6] text-xs transition-colors flex items-center gap-1 shadow-xs"
              title="View Dialogue Log"
            >
              <History className="w-3.5 h-3.5 text-[#B07D62]" />
              <span className="hidden sm:inline">Log</span>
            </button>

            <button
              onClick={onScrollToJuryBoard}
              className="px-3.5 py-1.5 rounded-full bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#581C87] font-black text-xs border-2 border-[#C084FC] transition-all flex items-center gap-1 shadow-xs active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#581C87]" />
              <span className="hidden sm:inline">Jury Synthesis</span>
            </button>
          </div>

          {/* Authentic Visual Novel Dialogue Box using DiaBox Asset */}
          <div
            role="button"
            tabIndex={0}
            aria-label={isTyping ? 'Reveal dialogue' : 'Continue dialogue'}
            onClick={handleNext}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                handleNext();
              }
            }}
            className="relative rounded-3xl overflow-hidden cursor-pointer shadow-xl transition-all w-full h-[240px] sm:h-[240px] md:h-[260px] group border-4 border-[#C58B58] bg-[#FAF5EB]"
          >
            {/* Visual Novel Box Background Frame */}
            <img
              src={activeDiaBoxSrc}
              alt="Dialogue Frame"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
            />

            {/* Speaker Nameplate in the DiaBox Bubble */}
            <div className="absolute top-[3%] sm:top-[4%] left-[3%] sm:left-[5%] w-[32%] sm:w-[26%] md:w-[22%] h-[28%] sm:h-[26%] z-20 flex flex-col items-center justify-center pointer-events-none select-none px-2 text-center">
              <div className="flex items-center gap-1 min-w-0 max-w-full">
                <span className="text-[11px] sm:text-xs">
                  {isJurySpeaking ? '⚖️' : isDebaterAActive ? '🛡️' : '⚔️'}
                </span>
                <span
                  className={`font-black text-xs sm:text-sm md:text-base uppercase tracking-wider truncate drop-shadow-2xs ${
                    isJurySpeaking
                      ? 'text-[#581C87]'
                      : isDebaterAActive
                      ? 'text-[#0369A1]'
                      : 'text-[#9F1239]'
                  }`}
                >
                  {currentTurn?.speakerName || 'Speaker'}
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-[#78350F] font-black tracking-tight opacity-80 leading-none mt-0.5">
                Turn {currentTurnIdx + 1} of {script.length}
              </span>
            </div>

            {/* Inner Content overlay: Absolutely positioned strictly in the cream parchment writing zone (top: 38% to clear crest banner, right: 18% to clear right feather quill/courthouse art, bottom: 12% to clear bottom border) */}
            <div className="absolute top-[38%] sm:top-[38%] md:top-[39%] bottom-[12%] sm:bottom-[11%] left-[8%] sm:left-[10%] right-[10%] sm:right-[15%] md:right-[18%] z-10 flex flex-col justify-between select-none">
              <div className="flex-1 flex items-start overflow-y-auto pr-1 pt-1 sm:pt-2">
                <p className="text-xs sm:text-base md:text-lg text-[#2D1825] font-bold leading-relaxed sm:leading-loose drop-shadow-2xs">
                  {displayedText}
                  {isTyping && <span className="inline-block w-2.5 h-4 bg-[#D97706] ml-1.5 animate-pulse align-middle" />}
                </p>
              </div>

              {/* Advance prompt positioned in the clean bottom margin */}
              <div className="flex justify-end pt-0.5">
                <span className="text-[10px] text-[#78350F] font-black bg-[#FAF5EB]/95 px-3 py-0.5 rounded-full border border-[#E5C9A6] shadow-2xs select-none">
                  {isTyping ? 'Click to reveal' : 'Click / Space to continue ▶'}
                </span>
              </div>
            </div>
          </div>

          {/* Playback Controls Row */}
          <div className="flex items-center justify-between pt-0.5">
            <button
              onClick={handlePrev}
              disabled={currentTurnIdx === 0}
              className="px-4 py-1.5 rounded-full bg-[#FFFDF9] hover:bg-[#FAF5EB] disabled:opacity-40 text-[#78350F] border-2 border-[#E5C9A6] transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs active:scale-95"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-5 py-1.5 rounded-full text-xs font-black flex items-center gap-2 border-2 transition-all shadow-xs active:scale-95 ${
                isAutoPlay
                  ? 'bg-[#FBCFE8] text-[#831843] border-[#F472B6]'
                  : 'bg-[#FFFDF9] text-[#78350F] border-[#E5C9A6] hover:bg-[#FAF5EB]'
              }`}
            >
              {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlay ? 'Auto Playing...' : 'Auto Play'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!isTyping && currentTurnIdx >= script.length - 1}
              className="px-5 py-1.5 rounded-full bg-[#FEF3C7] hover:bg-[#FDE68A] disabled:opacity-40 text-[#78350F] border-2 border-[#F59E0B] transition-colors flex items-center gap-1.5 text-xs font-black shadow-xs active:scale-95"
            >
              <span>{isTyping ? 'Reveal' : 'Next'}</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* History Log Drawer Modal - Solid Warm Cream */}
      {showHistory && (
        <div className="absolute inset-0 z-40 bg-black/40 p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150 flex items-center justify-center">
          <div className="w-full max-w-2xl bg-[#FFFDF9] border-4 border-[#C58B58] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#E5C9A6] pb-3">
              <h3 className="font-black text-sm text-[#78350F] uppercase tracking-wide flex items-center gap-2">
                <History className="w-4 h-4 text-[#D97706]" />
                Dialogue Transcript History
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-xs px-3 py-1 rounded-full bg-[#FCE7F3] text-[#831843] border border-[#F472B6] hover:bg-[#FBCFE8] font-bold"
              >
                Close Log
              </button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {script.slice(0, currentTurnIdx + 1).map((turn, i) => (
                <div key={turn.id} className="p-3 rounded-2xl bg-[#FAF5EB] border-2 border-[#E5C9A6] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-[#8C5338]">
                      {turn.speakerName} {turn.callout ? `[${turn.callout}]` : ''}
                    </span>
                    <span className="text-[10px] text-[#B07D62] font-semibold">Step {i + 1}</span>
                  </div>
                  <p className="text-[#2D1825] font-medium leading-relaxed">{turn.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Character Profiles & Personality Dossier Modal */}
      <CharacterProfilesModal
        isOpen={showProfiles}
        onClose={() => setShowProfiles(false)}
        debaterA={debate.debaterA}
        debaterB={debate.debaterB}
      />
    </div>
  );
}
