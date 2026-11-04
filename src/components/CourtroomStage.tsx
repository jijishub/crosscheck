'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DebateAnalysisResult, DialogueTurn, CalloutType } from '@/types/debate';
import { DebaterPortrait, CalloutStingerBanner } from './CourtroomCharacters';
import { CharacterProfilesModal } from './CharacterProfilesModal';
import { CinnaPreTrialBriefing } from './CinnaPreTrialBriefing';
import { courtAudio } from '@/lib/audio';
import { Play, Pause, SkipForward, SkipBack, History, BookOpen, Volume2, VolumeX, FolderOpen, Users, MessageSquareQuote, X, Globe } from 'lucide-react';

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
  const [showOriginalModal, setShowOriginalModal] = useState(false);
  const [showBriefingModal, setShowBriefingModal] = useState(false);

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
      className={`relative w-full rounded-3xl bg-[#FAF5EB] border-4 border-[#C58B58] shadow-2xl overflow-hidden h-[540px] sm:h-[580px] md:h-[620px] transition-transform select-none ${
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
      <div className="absolute inset-0 pt-12 sm:pt-14 pb-22 sm:pb-26 flex items-end justify-around gap-2 px-2 sm:px-6 overflow-hidden z-10 pointer-events-none">
        {/* Debater A (Defense - Melon) */}
        <div
          className={`w-1/2 flex justify-center items-end transition-all duration-300 pointer-events-auto ${
            isJurySpeaking ? 'opacity-35 grayscale-[20%]' : ''
          }`}
        >
          <DebaterPortrait
            side="debater_a"
            name={debate.debaterA.name}
            title={debate.debaterA.archetypeTitle}
            emotion={isDebaterAActive ? currentTurn?.emotion || 'neutral' : 'neutral'}
            isActive={isDebaterAActive}
          />
        </div>

        {/* Center Lower Oval: Cinna Mascot (Standing cleanly in center stage without blocking bubble) */}
        {!isJurySpeaking && (Boolean(currentTurn?.callout || presentedEvidence || currentTurn?.emotion === 'intense')) && (
          <div className="absolute bottom-[27%] sm:bottom-[28%] md:bottom-[29%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none animate-in fade-in zoom-in-95 duration-300">
            {/* Clean Cinna Sprite without any blocking popup speech bubble */}
            <div className="relative flex items-center justify-center animate-bounce" style={{ animationDuration: '2.5s' }}>
              <img
                src={
                  currentTurn?.callout || currentTurn?.emotion === 'intense'
                    ? '/Cinna_4.png'
                    : currentTurn?.emotion === 'thinking'
                    ? '/Cinna_3.png'
                    : '/Cinna_2.png'
                }
                alt="Cinna Mascot"
                className="w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] select-none"
              />
            </div>
          </div>
        )}

        {/* Jury Foreperson Presiding in the Center when Speaking (Seated high on the judge's dais) */}
        {isJurySpeaking && (
          <div className="absolute inset-x-0 bottom-[21%] sm:bottom-[22%] md:bottom-[23%] mx-auto w-full max-w-sm flex flex-col items-center justify-end z-25 animate-in fade-in slide-in-from-bottom-8 duration-300 pointer-events-none">
            {/* Jury Royal Aura */}
            <div className="absolute bottom-6 w-60 h-60 rounded-full bg-purple-500/25 blur-3xl pointer-events-none" />

            <div className="relative w-56 sm:w-64 md:w-72 h-[240px] sm:h-[280px] md:h-[310px] flex items-end justify-center">
              <img
                src={
                  currentTurn?.emotion === 'synthesis'
                    ? '/characters/J2_Judge_Evidence_Ledger.png'
                    : '/characters/J1_Judge_Welcoming.png'
                }
                alt="Jury Foreperson"
                className="w-full h-full object-contain object-bottom drop-shadow-[0_12px_28px_rgba(147,51,234,0.45)] select-none"
              />
            </div>
          </div>
        )}

        {/* Debater B (Prosecution - Yon) */}
        <div
          className={`w-1/2 flex justify-center items-end transition-all duration-300 pointer-events-auto ${
            isJurySpeaking ? 'opacity-35 grayscale-[20%]' : ''
          }`}
        >
          <DebaterPortrait
            side="debater_b"
            name={debate.debaterB.name}
            title={debate.debaterB.archetypeTitle}
            emotion={isDebaterBActive ? currentTurn?.emotion || 'neutral' : 'neutral'}
            isActive={isDebaterBActive}
          />
        </div>
      </div>

      {/* Bottom Visual Novel Dialogue Box - True Overlapping Console (Ace Attorney Style) */}
      <div className="absolute bottom-2 sm:bottom-2.5 inset-x-2 sm:inset-x-4 md:inset-x-8 z-30 pointer-events-auto">
        <div className="max-w-4xl mx-auto space-y-1">
          {/* Header Row: Turn Counter & Compact Utility Actions */}
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-[10px] sm:text-[11px] text-[#8C5338] font-black uppercase tracking-wider bg-[#FFFDF9]/95 px-2.5 py-0.5 rounded-full border border-[#E5C9A6] shadow-2xs">
              Turn {currentTurnIdx + 1} of {script.length}
            </span>

            <div className="flex items-center gap-1.5">
              {debate.preTrialBriefing && (
                <button
                  onClick={() => setShowBriefingModal(true)}
                  className="px-2.5 py-1 rounded-full bg-[#FCE7F3]/95 hover:bg-[#FBCFE8] text-[#831843] font-bold border border-[#F472B6] text-[11px] transition-colors flex items-center gap-1 shadow-xs active:scale-95"
                  title="Cinna's Pre-Trial Introduction & Authentic Case Context"
                >
                  <Globe className="w-3 h-3 text-[#DB2777]" />
                  <span className="hidden sm:inline">Case Origin</span>
                </button>
              )}

              {currentTurn?.originalCommentQuote && (
                <button
                  onClick={() => setShowOriginalModal(true)}
                  className="px-2.5 py-1 rounded-full bg-[#FFFBEB]/95 hover:bg-[#FEF3C7] text-[#92400E] font-bold border border-[#F59E0B] text-[11px] transition-colors flex items-center gap-1 shadow-xs active:scale-95"
                  title="Inspect authentic original debate comment behind this courtroom statement"
                >
                  <MessageSquareQuote className="w-3 h-3 text-[#D97706]" />
                  <span className="hidden sm:inline">Source Quote</span>
                </button>
              )}

              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-2.5 py-1 rounded-full bg-[#FFFDF9]/95 hover:bg-[#FAF5EB] text-[#78350F] font-bold border border-[#E5C9A6] text-[11px] transition-colors flex items-center gap-1 shadow-xs"
                title="View Dialogue Log"
              >
                <History className="w-3 h-3 text-[#B07D62]" />
                <span className="hidden sm:inline">Log</span>
              </button>

              <button
                onClick={onScrollToJuryBoard}
                className="px-3 py-1 rounded-full bg-[#F3E8FF]/95 hover:bg-[#E9D5FF] text-[#581C87] font-black text-[11px] border border-[#C084FC] transition-all flex items-center gap-1 shadow-xs active:scale-95"
              >
                <BookOpen className="w-3 h-3 text-[#581C87]" />
                <span className="hidden sm:inline">Jury Synthesis</span>
              </button>
            </div>
          </div>

          {/* Authentic Visual Novel Dialogue Box using DiaBox Asset (Clean floating cutout, backdrop container removed) */}
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
            className="relative cursor-pointer transition-all w-full h-[155px] sm:h-[168px] md:h-[180px] group select-none filter drop-shadow-2xl"
          >
            {/* Visual Novel Box Background Frame */}
            <img
              src={activeDiaBoxSrc}
              alt="Dialogue Frame"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
            />

            {/* Speaker Nameplate dynamically aligned inside DiaBox 1 & 2 banner fills */}
            <div
              className={`absolute z-20 flex items-center justify-center pointer-events-none select-none px-2 text-center ${
                isDebaterAActive
                  ? 'top-[13.5%] left-[11%] w-[28%] h-[15%]'
                  : isDebaterBActive
                  ? 'top-[18%] left-[6.5%] w-[28%] h-[13%]'
                  : 'top-[13.5%] left-[11%] w-[28%] h-[15%]'
              }`}
            >
              <span className="font-black text-xs sm:text-sm md:text-base text-white tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] truncate">
                {currentTurn?.speakerName || 'Speaker'}
              </span>
            </div>

            {/* Inner Content overlay: Absolutely positioned strictly in the cream parchment writing zone */}
            <div className="absolute top-[36%] bottom-[10%] left-[8%] sm:left-[10%] right-[10%] sm:right-[15%] md:right-[18%] z-10 flex flex-col justify-between select-none">
              <div className="flex-1 flex items-start overflow-y-auto pr-1 pt-0.5">
                <p className="text-xs sm:text-sm md:text-base text-[#2D1825] font-bold leading-snug sm:leading-relaxed drop-shadow-2xs">
                  {displayedText}
                  {isTyping && <span className="inline-block w-2 h-3.5 bg-[#D97706] ml-1.5 animate-pulse align-middle" />}
                </p>
              </div>

              {/* Advance prompt positioned in the clean bottom margin */}
              <div className="flex justify-end pt-0.5">
                <span className="text-[9px] sm:text-[10px] text-[#78350F] font-black bg-[#FAF5EB]/95 px-2.5 py-0.5 rounded-full border border-[#E5C9A6] shadow-2xs select-none">
                  {isTyping ? 'Click to reveal' : 'Click / Space to continue ▶'}
                </span>
              </div>
            </div>
          </div>

          {/* Playback Controls Row */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={handlePrev}
              disabled={currentTurnIdx === 0}
              className="px-3 py-1 rounded-full bg-[#FFFDF9]/95 hover:bg-[#FAF5EB] disabled:opacity-40 text-[#78350F] border border-[#E5C9A6] transition-colors flex items-center gap-1 text-[11px] font-bold shadow-xs active:scale-95"
            >
              <SkipBack className="w-3 h-3" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-4 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 border transition-all shadow-xs active:scale-95 ${
                isAutoPlay
                  ? 'bg-[#FBCFE8] text-[#831843] border-[#F472B6]'
                  : 'bg-[#FFFDF9]/95 text-[#78350F] border-[#E5C9A6] hover:bg-[#FAF5EB]'
              }`}
            >
              {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isAutoPlay ? 'Auto Playing...' : 'Auto Play'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!isTyping && currentTurnIdx >= script.length - 1}
              className="px-4 py-1 rounded-full bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-black text-[11px] border border-[#92400E] shadow-sm hover:brightness-105 active:scale-95 flex items-center gap-1"
            >
              <span>{isTyping ? 'Reveal' : 'Next'}</span>
              <SkipForward className="w-3 h-3" />
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
                <div key={turn.id} className="p-3.5 rounded-2xl bg-[#FAF5EB] border-2 border-[#E5C9A6] text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#8C5338]">
                      {turn.speakerName} {turn.callout ? `[${turn.callout}]` : ''}
                    </span>
                    <span className="text-[10px] text-[#B07D62] font-semibold">Step {i + 1}</span>
                  </div>
                  <p className="text-[#2D1825] font-bold leading-relaxed">{turn.text}</p>
                  {turn.originalCommentQuote && (
                    <div className="p-2 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[11px] text-[#78350F] italic">
                      <span className="font-bold not-italic text-[#92400E]">Original Source: </span>
                      &ldquo;{turn.originalCommentQuote}&rdquo;
                    </div>
                  )}
                  {turn.cinnaTeachingNote && (
                    <div className="p-2 rounded-xl bg-[#FDF2F8] border border-[#FBCFE8] text-[11px] text-[#831843]">
                      <span className="font-bold text-[#9D174D]">Cinna Explains: </span>
                      {turn.cinnaTeachingNote.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Authentic Original Comment Inspector Modal */}
      {showOriginalModal && currentTurn?.originalCommentQuote && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#FFFDF9] border-4 border-[#F59E0B] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-[#FDE68A] pb-3">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-[#D97706]" />
                <div>
                  <h3 className="font-black text-sm text-[#78350F] uppercase tracking-wide">
                    Authentic Source Comment Inspector
                  </h3>
                  <p className="text-[11px] text-[#92400E]">
                    Direct citation from the unedited community discussion
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOriginalModal(false)}
                className="p-1 rounded-full text-[#78350F] hover:bg-[#FEF3C7] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#FEF3C7] border-2 border-[#FDE68A]">
                <span className="text-[10px] uppercase font-black tracking-wider text-[#92400E] block mb-1">
                  Original Comment Snippet:
                </span>
                <blockquote className="text-xs sm:text-sm text-[#78350F] italic font-semibold leading-relaxed">
                  &ldquo;{currentTurn.originalCommentQuote}&rdquo;
                </blockquote>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF5EB] border-2 border-[#E5C9A6]">
                <span className="text-[10px] uppercase font-black tracking-wider text-[#78350F] block mb-1">
                  Dramatized Courtroom Statement (Turn {currentTurnIdx + 1}):
                </span>
                <p className="text-xs text-[#2D1825] font-bold leading-relaxed">
                  &ldquo;{currentTurn.text}&rdquo;
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold bg-[#E0E7FF] text-[#3730A3] px-2 py-0.5 rounded-full border border-[#C7D2FE]">
                    {currentTurn.isDramatized ? 'Theatrical Adaptation' : 'Direct Quote'}
                  </span>
                  <span className="text-[10px] text-[#7C5E74] font-medium">
                    Speaker: {currentTurn.speakerName}
                  </span>
                </div>
              </div>

              {currentTurn.cinnaTeachingNote && (
                <div className="p-3.5 rounded-2xl bg-[#FDF2F8] border-2 border-pink-200">
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#9D174D] block mb-1">
                    Cinna Teaching Note:
                  </span>
                  <p className="text-xs text-[#831843] font-medium leading-relaxed">
                    {currentTurn.cinnaTeachingNote.explanation}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowOriginalModal(false)}
                className="px-4 py-1.5 rounded-full bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#78350F] border border-[#F59E0B] text-xs font-black transition-all"
              >
                Back to Debate
              </button>
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

      {/* Cinna's Pre-Trial Briefing Modal */}
      {showBriefingModal && debate.preTrialBriefing && (
        <CinnaPreTrialBriefing
          briefing={debate.preTrialBriefing}
          isOpenAsModal={true}
          onCloseModal={() => setShowBriefingModal(false)}
          onEnterCourtroom={() => setShowBriefingModal(false)}
        />
      )}
    </div>
  );
}
