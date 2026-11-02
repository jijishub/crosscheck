'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DebateAnalysisResult, DialogueTurn, CalloutType } from '@/types/debate';
import { DebaterPortrait, CalloutStingerBanner } from './CourtroomCharacters';
import { courtAudio } from '@/lib/audio';
import { Play, Pause, SkipForward, SkipBack, History, BookOpen, Volume2, VolumeX, FolderOpen } from 'lucide-react';

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
      className={`relative w-full rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-pink-500/30 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[580px] sm:min-h-[640px] transition-transform ${
        isShaking ? 'animate-court-shake ring-4 ring-rose-500/50' : ''
      }`}
    >
      {/* Courtroom Backdrop Image with Soft Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 select-none">
        <img
          src="/scenes_and_overlays/Backdrop_01_Main_Courtroom.png"
          alt="Courtroom Backdrop"
          className="w-full h-full object-cover object-center filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/75" />
      </div>

      {/* Dramatic Callout Stinger Overlay */}
      <CalloutStingerBanner callout={activeCallout} />

      {/* Top Courtroom Header Bar */}
      <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>⚖️</span>
            <span className="hidden sm:inline">Court in Session:</span>
          </span>
          <span className="text-slate-300 font-semibold truncate max-w-[280px] sm:max-w-md">
            {debate.topic}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Mute Button */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-lg border transition-colors ${
              isMuted
                ? 'bg-slate-800 text-slate-500 border-slate-700'
                : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
            }`}
            title={isMuted ? 'Unmute Court SFX' : 'Mute Court SFX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Open Evidence Dossier Button */}
          <button
            onClick={() => onOpenCourtRecord()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold transition-all shadow-sm shadow-amber-500/30"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Court Record</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-300 text-[10px]">
              {debate.evidenceRecord.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Courtroom Stage View: Split Debater Portraits */}
      <div className="flex-1 px-4 py-6 flex flex-col sm:flex-row items-center justify-around gap-6 relative">
        {/* Debater A (Defense) */}
        <div className="w-full sm:w-1/2 flex justify-center">
          <DebaterPortrait
            side="debater_a"
            name={debate.debaterA.name}
            title={debate.debaterA.archetypeTitle}
            emotion={isDebaterAActive ? currentTurn?.emotion || 'neutral' : 'neutral'}
            isActive={isDebaterAActive}
          />
        </div>

        {/* Center Courtroom Crest / VS Divider */}
        <div className="hidden md:flex flex-col items-center justify-center text-slate-700 select-none">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
          <div className="my-2 px-3 py-1 rounded-full border border-slate-700 bg-slate-900/80 text-[10px] font-black tracking-widest text-slate-400">
            VS
          </div>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
        </div>

        {/* Debater B (Prosecution) */}
        <div className="w-full sm:w-1/2 flex justify-center">
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
          <div className="absolute top-4 inset-x-0 mx-auto w-fit z-20 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-2 rounded-2xl bg-purple-950 border-2 border-purple-400 text-amber-300 font-bold text-xs shadow-xl flex items-center gap-2">
              <span className="text-base">⚖️</span>
              <span>The Jury Foreperson Intervenes to Clarify the Record</span>
            </div>
          </div>
        )}
      </div>

      {/* Claim Highlight Overlay Pill */}
      {activeClaim && (
        <div className="px-4 sm:px-8 mb-2">
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-amber-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                🎯 Claim Under Examination:
              </span>
              <span className="text-slate-200 font-medium italic truncate max-w-sm sm:max-w-md">
                &ldquo;{activeClaim.text}&rdquo;
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-800 text-amber-300">
                {activeClaim.verificationStatus.replace(/_/g, ' ')}
              </span>
              {activeClaim.linkedEvidenceIds[0] && (
                <button
                  onClick={() => onOpenCourtRecord(activeClaim.linkedEvidenceIds[0])}
                  className="text-[10px] text-amber-400 hover:underline font-semibold"
                >
                  View Source Proof →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Evidence Presented Pill */}
      {presentedEvidence && (
        <div className="px-4 sm:px-8 mb-2">
          <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-between gap-2 text-xs animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white uppercase">
                Take That! Evidence
              </span>
              <span className="text-blue-200 font-semibold truncate max-w-sm">
                {presentedEvidence.title}
              </span>
            </div>
            <button
              onClick={() => onOpenCourtRecord(presentedEvidence.id)}
              className="text-xs text-amber-300 hover:text-white font-bold transition-colors"
            >
              Inspect Dossier →
            </button>
          </div>
        </div>
      )}

      {/* Bottom Visual Novel Dialogue Box */}
      <div className="p-4 sm:p-6 bg-slate-950 border-t-2 border-slate-800">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Speaker Tag & Turn Counter */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider ${
                  isJurySpeaking
                    ? 'bg-purple-700 text-white shadow-md shadow-purple-600/40'
                    : isDebaterAActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                    : 'bg-rose-600 text-white shadow-md shadow-rose-600/40'
                }`}
              >
                {currentTurn?.speakerName || 'Speaker'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Turn {currentTurnIdx + 1} of {script.length}
              </span>
            </div>

            {/* Turn History Toggle & Skip to Jury */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <History className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log</span>
              </button>
              <button
                onClick={onScrollToJuryBoard}
                className="px-3 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Jump to Jury Verdict</span>
              </button>
            </div>
          </div>

          {/* Dialogue Text Box */}
          <div
            onClick={handleNext}
            className="min-h-[80px] sm:min-h-[90px] p-4 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors relative"
          >
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              {displayedText}
              {isTyping && <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse" />}
            </p>

            {/* Click to advance hint */}
            <div className="absolute bottom-2 right-3 text-[10px] text-slate-500 font-semibold flex items-center gap-1">
              {isTyping ? 'Click to skip text' : 'Click to continue ▶'}
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handlePrev}
              disabled={currentTurnIdx === 0}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 text-slate-300 border border-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <SkipBack className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                isAutoPlay
                  ? 'bg-amber-600 text-slate-950 border-amber-500 shadow-md shadow-amber-500/30'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isAutoPlay ? 'Auto Playing...' : 'Auto Play'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentTurnIdx >= script.length - 1}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 text-slate-300 border border-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <span className="hidden sm:inline">Next</span>
              <SkipForward className="w-4 h-4" />
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
    </div>
  );
}
