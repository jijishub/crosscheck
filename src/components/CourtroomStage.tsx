'use client';

import React, { useState, useEffect, useRef } from 'react';
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
}

export function CourtroomStage({
  debate,
  onOpenCourtRecord,
  onScrollToJuryBoard,
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

    // Trigger callout animation and sound if present
    if (currentTurn.callout) {
      setActiveCallout(currentTurn.callout);
      setIsShaking(true);
      const shakeTimer = setTimeout(() => setIsShaking(false), 400);

      if (currentTurn.callout === 'OBJECTION!') {
        courtAudio.playObjectionStinger();
      } else if (currentTurn.callout === 'HOLD IT!') {
        courtAudio.playGavelThud();
      } else if (currentTurn.callout === 'TAKE THAT!') {
        courtAudio.playEvidenceChime();
      }

      // Hide callout after 1.2s
      const calloutTimer = setTimeout(() => {
        setActiveCallout(null);
      }, 1200);
      return () => {
        clearTimeout(calloutTimer);
        clearTimeout(shakeTimer);
      };
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

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [currentTurnIdx, currentTurn]);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlay || isTyping) {
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
  }, [isAutoPlay, isTyping, currentTurnIdx, script.length]);

  const handleNext = () => {
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
  };

  const handlePrev = () => {
    if (currentTurnIdx > 0) {
      setCurrentTurnIdx(prev => prev - 1);
    }
  };

  const toggleSound = () => {
    const muted = courtAudio.toggleMute();
    setIsMuted(muted);
  };

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

  return (
    <div
      className={`relative w-full rounded-3xl bg-slate-950 border-2 border-pink-500/30 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[600px] sm:min-h-[660px] transition-transform select-none ${
        isShaking ? 'animate-court-shake ring-4 ring-rose-500/50' : ''
      }`}
    >
      {/* Courtroom Backdrop Image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <img
          src="/scenes_and_overlays/Backdrop_01_Main_Courtroom.png"
          alt="Courtroom Backdrop"
          className="w-full h-full object-cover object-center opacity-75 filter contrast-105"
        />
        {/* Soft vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/80" />
      </div>

      {/* Dramatic Callout Stinger Overlay */}
      <CalloutStingerBanner callout={activeCallout} />

      {/* Top HUD: Session Title, Claim Ticker, and Controls */}
      <div className="relative z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/90 shadow-md">
        <div className="px-4 py-2.5 flex items-center justify-between text-xs gap-3">
          {/* Left: Case Docket Title */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1 shrink-0">
              <span>⚖️</span>
              <span>Court Docket</span>
            </span>
            <span className="text-slate-200 font-semibold truncate text-xs sm:text-sm">
              {debate.topic}
            </span>
          </div>

          {/* Right: Audio and Court Record buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded-lg border transition-all ${
                isMuted
                  ? 'bg-slate-800 text-slate-500 border-slate-700'
                  : 'bg-amber-950/60 text-amber-300 border-amber-500/40 shadow-sm'
              }`}
              title={isMuted ? 'Unmute Court SFX' : 'Mute Court SFX'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowProfiles(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-bold text-xs transition-all shadow-sm"
              title="View Character Profiles & Personality Dossier"
            >
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Cast & Bios</span>
            </button>

            <button
              onClick={() => onOpenCourtRecord()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/30"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Court Record</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-300 text-[10px]">
                {debate.evidenceRecord.length}
              </span>
            </button>
          </div>
        </div>

        {/* Sleek Claim / Evidence Single-Line Ribbon */}
        {(activeClaim || presentedEvidence) && (
          <div className="px-4 py-1.5 bg-slate-900/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] animate-in slide-in-from-top-1 duration-150">
            <div className="flex items-center gap-2 min-w-0">
              {activeClaim && (
                <>
                  <span className="text-amber-400 font-bold uppercase tracking-wider shrink-0 text-[10px]">
                    🎯 Claim:
                  </span>
                  <span className="text-slate-300 italic truncate max-w-xs sm:max-w-md md:max-w-xl font-medium">
                    &ldquo;{activeClaim.text}&rdquo;
                  </span>
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-bold uppercase bg-slate-800 text-amber-300 border border-amber-500/30 shrink-0">
                    {activeClaim.verificationStatus.replace(/_/g, ' ')}
                  </span>
                </>
              )}
            </div>

            {presentedEvidence && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-600 text-white uppercase">
                  Take That! Evidence
                </span>
                <button
                  onClick={() => onOpenCourtRecord(presentedEvidence.id)}
                  className="text-amber-300 hover:underline font-bold text-[10px]"
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
            <div className="px-4 py-2 rounded-2xl bg-purple-950/95 border-2 border-purple-400 text-amber-300 font-bold text-xs shadow-2xl flex items-center gap-2 backdrop-blur-md">
              <span className="text-base">⚖️</span>
              <span>The Jury Foreperson Intervenes to Clarify the Record</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Visual Novel Dialogue Box */}
      <div className="relative z-30 p-4 sm:p-5 bg-slate-950/95 backdrop-blur-md border-t-2 border-pink-500/30 shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Header Row: Nameplate + Cinna Companion + Shortcuts */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Speaker Nameplate Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`px-3.5 py-1 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg transition-all ${
                  isJurySpeaking
                    ? 'bg-purple-700 text-white shadow-purple-600/40 ring-2 ring-purple-400/50'
                    : isDebaterAActive
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-500/40 ring-2 ring-sky-300/50'
                    : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-500/40 ring-2 ring-rose-300/50'
                }`}
              >
                {currentTurn?.speakerName || 'Speaker'}
              </span>

              <span className="text-[11px] text-slate-500 font-medium">
                Turn {currentTurnIdx + 1} of {script.length}
              </span>
            </div>

            {/* Right: Cinna Narrator & Log Buttons */}
            <div className="flex items-center gap-2">
              <CinnaNarrator
                emotion={currentTurn?.emotion}
                callout={currentTurn?.callout}
                speakerName={currentTurn?.speakerName}
                activeClaimText={activeClaim?.text}
              />

              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-800 flex items-center gap-1 transition-colors"
                title="View Dialogue Log"
              >
                <History className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log</span>
              </button>

              <button
                onClick={onScrollToJuryBoard}
                className="px-2.5 py-1 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Jury Verdict</span>
              </button>
            </div>
          </div>

          {/* Dialogue Text Box */}
          <div
            onClick={handleNext}
            className="min-h-[85px] sm:min-h-[95px] p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 cursor-pointer transition-all shadow-inner relative"
          >
            <p className="text-sm sm:text-base text-slate-50 font-medium leading-relaxed">
              {displayedText}
              {isTyping && <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse" />}
            </p>

            {/* Click to advance prompt */}
            <div className="absolute bottom-2.5 right-3 text-[10px] text-pink-300/70 font-bold flex items-center gap-1 select-none">
              {isTyping ? 'Click to skip text' : 'Click to continue ▶'}
            </div>
          </div>

          {/* Playback Controls Row */}
          <div className="flex items-center justify-between pt-0.5">
            <button
              onClick={handlePrev}
              disabled={currentTurnIdx === 0}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 text-slate-300 border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-5 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 border transition-all ${
                isAutoPlay
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlay ? 'Auto Playing...' : 'Auto Play'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentTurnIdx >= script.length - 1}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 text-slate-300 border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <span>Next</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* History Log Drawer Modal */}
      {showHistory && (
        <div className="absolute inset-0 z-40 bg-slate-950/95 p-6 overflow-y-auto animate-in fade-in duration-150">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" />
                Dialogue Transcript History
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
              >
                Close Log
              </button>
            </div>
            <div className="space-y-3">
              {script.slice(0, currentTurnIdx + 1).map((turn, i) => (
                <div key={turn.id} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-300">
                      {turn.speakerName} {turn.callout ? `[${turn.callout}]` : ''}
                    </span>
                    <span className="text-[10px] text-slate-500">Step {i + 1}</span>
                  </div>
                  <p className="text-slate-300">{turn.text}</p>
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
