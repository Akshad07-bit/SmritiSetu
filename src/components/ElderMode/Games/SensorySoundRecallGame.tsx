/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameSessionResult, SoundscapeItem, SupportedLanguage } from '../../../types';
import { REGIONAL_AUDIO_PROMPTS, REGIONAL_SOUNDSCAPES, UI_STRINGS } from '../../../data/culturalData';
import { soundManager } from '../../../utils/audio';
import { SpeechNarrator } from '../../../utils/speech';
import { Volume2, VolumeX, Play, RotateCcw, CheckCircle2, Award, Sparkles, Heart } from 'lucide-react';

interface SensorySoundRecallGameProps {
  language: SupportedLanguage;
  voiceEnabled: boolean;
  onFinishSession: (result: GameSessionResult) => void;
  onBack: () => void;
}

export const SensorySoundRecallGame: React.FC<SensorySoundRecallGameProps> = ({
  language,
  voiceEnabled,
  onFinishSession,
  onBack,
}) => {
  const strings = UI_STRINGS[language];
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPlayingSound, setIsPlayingSound] = useState<boolean>(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());

  const questions = REGIONAL_SOUNDSCAPES.slice(0, 4);
  const currentSound = questions[currentIdx];

  // Options for the current question: 1 correct + 2 distractors
  const [options, setOptions] = useState<SoundscapeItem[]>([]);

  useEffect(() => {
    if (!currentSound) return;
    const others = REGIONAL_SOUNDSCAPES.filter((s) => s.id !== currentSound.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 2);
    const combined = [currentSound, ...shuffledOthers].sort(() => 0.5 - Math.random());
    setOptions(combined);
    setSelectedOptionId(null);
    setIsCorrect(null);

    // Auto-play the sound initially
    handlePlayCurrentSound();

    return () => {
      soundManager.stopSoundscape();
    };
  }, [currentIdx]);

  const handlePlayCurrentSound = () => {
    if (!currentSound) return;
    soundManager.startSoundscape(currentSound.synthType);
    setIsPlayingSound(true);

    if (voiceEnabled) {
      SpeechNarrator.speak(REGIONAL_AUDIO_PROMPTS[language].soundGameIntro, language);
    }
  };

  const handleStopSound = () => {
    soundManager.stopSoundscape();
    setIsPlayingSound(false);
  };

  const handleSelectOption = (option: SoundscapeItem) => {
    if (selectedOptionId !== null) return; // Already picked

    setSelectedOptionId(option.id);
    const correct = option.id === currentSound.id;
    setIsCorrect(correct);

    const locSound = (currentSound as any).translations?.[language] || {
      title: currentSound.title,
      nativeName: currentSound.nativeName || '',
    };
    const soundTitle = locSound.title;

    if (correct) {
      soundManager.playSuccessChime();
      setScore((prev) => prev + 1);
      if (voiceEnabled) {
        SpeechNarrator.speak(
          REGIONAL_AUDIO_PROMPTS[language].soundGameCorrect(soundTitle),
          language
        );
      }
    } else {
      if (voiceEnabled) {
        const msg =
          language === 'en'
            ? `This soothing sound was ${soundTitle}. Listen to its warmth.`
            : language === 'hi'
            ? `यह शांत ध्वनि ${soundTitle} की थी। इसे ध्यान से महसूस करें।`
            : `हा शांत नाद ${soundTitle} याचा होता. मनाला शांती देणारा हा सुंदर आवाज आहे.`;
        SpeechNarrator.speak(msg, language);
      }
    }
  };

  const handleNextQuestion = () => {
    handleStopSound();
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      handleCompleteGame();
    }
  };

  const handleCompleteGame = () => {
    setIsGameOver(true);
    handleStopSound();
    const duration = Math.round((Date.now() - startTime) / 1000);
    const accuracy = Math.round(((score + (isCorrect ? 1 : 0)) / questions.length) * 100);

    const result: GameSessionResult = {
      id: `session-${Date.now()}`,
      gameId: 'sound-recall',
      gameName: 'Sensory Sound Recall',
      score: score + (isCorrect ? 1 : 0),
      totalQuestionsOrPairs: questions.length,
      accuracyPercent: accuracy,
      durationSeconds: duration,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      cognitiveDomain: 'Auditory Recall',
    };

    onFinishSession(result);
  };

  const restartGame = () => {
    setCurrentIdx(0);
    setScore(0);
    setIsGameOver(false);
    setSelectedOptionId(null);
    setIsCorrect(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-4 px-2 sm:px-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-6 bg-white p-4 rounded-2xl border border-[#0f382c]/10 shadow-sm">
        <button
          onClick={() => {
            handleStopSound();
            onBack();
          }}
          className="text-base font-semibold text-[#0f382c] hover:text-[#2d6a4f] cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eef7f2]"
        >
          ← {strings.backToHome}
        </button>

        <span className="text-base font-bold text-[#0f382c]">
          {strings.listeningMemoryLabel} · {currentIdx + 1} / {questions.length}
        </span>

        <span className="text-sm font-semibold text-[#2d6a4f] bg-[#eef7f2] px-3 py-1 rounded-lg">
          {strings.correctLabel} {score}/{questions.length}
        </span>
      </div>

      {!isGameOver ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0f382c]/10 shadow-md">
          {/* Sound listening player card */}
          <div className="bg-gradient-to-br from-[#eef7f2] to-[#d8ece1] rounded-2xl p-6 text-center border border-[#2d6a4f]/20 mb-8">
            <div className="w-20 h-20 rounded-full bg-[#0f382c] text-white flex items-center justify-center mx-auto mb-4 shadow-md animate-pulse">
              <Volume2 className="w-10 h-10 text-amber-300" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#0f382c]">
              {strings.closeEyesListen}
            </h3>
            <p className="text-sm sm:text-base text-[#1a2e26]/80 mt-1">
              {strings.whatMemorySings}
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              {isPlayingSound ? (
                <button
                  onClick={handleStopSound}
                  className="flex items-center gap-2 bg-[#c25e3d] hover:bg-[#a64e32] text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all"
                >
                  <VolumeX className="w-5 h-5" />
                  <span>{strings.pauseSoundBtn}</span>
                </button>
              ) : (
                <button
                  onClick={handlePlayCurrentSound}
                  className="flex items-center gap-2 bg-[#2d6a4f] hover:bg-[#1f4e39] text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>{strings.playSoundAgainBtn}</span>
                </button>
              )}
            </div>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1a2e26]/60 text-center mb-3">
              {strings.selectWhatYouHear}
            </h4>

            {options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isThisCorrect = opt.id === currentSound.id;
              const locOpt = (opt as any).translations?.[language] || {
                title: opt.title,
                nativeName: opt.nativeName || '',
                location: opt.location,
                description: opt.description,
              };

              let btnStyle =
                'bg-[#fbf9f5] border-[#0f382c]/15 text-[#1a2e26] hover:bg-[#eef7f2] hover:border-[#2d6a4f]';

              if (selectedOptionId !== null) {
                if (isThisCorrect) {
                  btnStyle = 'bg-[#eef7f2] border-[#2d6a4f] text-[#0f382c] shadow-xs';
                } else if (isSelected && !isThisCorrect) {
                  btnStyle = 'bg-rose-50 border-rose-300 text-rose-800';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  disabled={selectedOptionId !== null}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <div>
                    <div className="text-lg font-bold text-[#0f382c] flex items-center gap-2">
                      <span>{locOpt.title}</span>
                      <span className="text-sm font-normal text-[#2d6a4f]">
                        ({locOpt.nativeName})
                      </span>
                    </div>
                    <div className="text-sm text-[#1a2e26]/70 mt-0.5">
                      📍 {locOpt.location}
                    </div>
                  </div>

                  {selectedOptionId !== null && isThisCorrect && (
                    <div className="flex items-center gap-1 text-[#2d6a4f] font-bold text-sm bg-white px-3 py-1.5 rounded-lg border border-[#2d6a4f]/30">
                      <CheckCircle2 className="w-5 h-5 text-[#2d6a4f]" />
                      <span>{strings.familiarMemoryFound}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Proceed */}
          {selectedOptionId !== null && (
            <div className="mt-6 p-4 rounded-2xl bg-[#eef7f2] border border-[#2d6a4f]/30 animate-fadeIn">
              <p className="text-base text-[#0f382c] font-medium">
                {(currentSound as any).translations?.[language]?.description || currentSound.description}
              </p>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="bg-[#2d6a4f] hover:bg-[#1f4e39] text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer shadow-sm transition-transform active:scale-95"
                >
                  {currentIdx + 1 < questions.length ? strings.nextMemorySound : strings.seeResultsBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Results View */
        <div className="bg-white rounded-3xl p-6 sm:p-10 text-center border border-[#0f382c]/10 shadow-lg animate-fadeIn max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-[#eef7f2] text-[#2d6a4f] flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-[#2d6a4f]" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#0f382c]">
            {strings.wellDone}
          </h3>
          <p className="text-base text-[#1a2e26]/80 mt-2 max-w-md mx-auto">
            {strings.soundVictorySub}
          </p>

          <div className="my-6 p-4 rounded-2xl bg-[#eef7f2] border border-[#2d6a4f]/20 flex items-center justify-around text-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1a2e26]/60">
                {strings.auditoryAccuracyLabel}
              </span>
              <p className="text-2xl font-bold text-[#2d6a4f]">
                {Math.round((score / questions.length) * 100)}%
              </p>
            </div>
            <div className="w-px h-10 bg-[#2d6a4f]/20" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1a2e26]/60">
                {strings.sensoryDomainLabel}
              </span>
              <p className="text-base font-bold text-[#0f382c]">{strings.auditoryDomain}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={restartGame}
              className="flex items-center gap-2 bg-[#2d6a4f] hover:bg-[#1f4e39] text-white px-6 py-3 rounded-xl font-bold text-base cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{strings.playAgain}</span>
            </button>
            <button
              onClick={onBack}
              className="bg-[#eef7f2] hover:bg-[#d8ece1] text-[#0f382c] px-6 py-3 rounded-xl font-bold text-base cursor-pointer transition-colors"
            >
              {strings.backToHome}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
