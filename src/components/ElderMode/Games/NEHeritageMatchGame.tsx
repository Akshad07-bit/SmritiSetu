/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CulturalArtifact, GameSessionResult, SupportedLanguage } from '../../../types';
import { CULTURAL_ARTIFACTS, REGIONAL_AUDIO_PROMPTS, UI_STRINGS } from '../../../data/culturalData';
import { soundManager } from '../../../utils/audio';
import { SpeechNarrator } from '../../../utils/speech';
import { Sparkles, RotateCcw, Volume2, CheckCircle2, Heart, Award } from 'lucide-react';

interface NEHeritageMatchGameProps {
  language: SupportedLanguage;
  voiceEnabled: boolean;
  onFinishSession: (result: GameSessionResult) => void;
  onBack: () => void;
}

interface CardItem {
  uid: string;
  artifactId: string;
  artifact: CulturalArtifact;
  isFlipped: boolean;
  isMatched: boolean;
}

export const NEHeritageMatchGame: React.FC<NEHeritageMatchGameProps> = ({
  language,
  voiceEnabled,
  onFinishSession,
  onBack,
}) => {
  const strings = UI_STRINGS[language];
  const [pairCount, setPairCount] = useState<number>(4); // 4 pairs (8 cards) or 6 pairs (12 cards)
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [turns, setTurns] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [recentMatchArtifact, setRecentMatchArtifact] = useState<CulturalArtifact | null>(null);
  const [startTime] = useState<number>(Date.now());

  // Initialize game deck
  const initializeGame = (count = pairCount) => {
    const selected = CULTURAL_ARTIFACTS.slice(0, count);
    const deck: CardItem[] = [];

    selected.forEach((artifact) => {
      // Pair 1
      deck.push({
        uid: `${artifact.id}-1`,
        artifactId: artifact.id,
        artifact,
        isFlipped: false,
        isMatched: false,
      });
      // Pair 2
      deck.push({
        uid: `${artifact.id}-2`,
        artifactId: artifact.id,
        artifact,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Gentle shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedUids([]);
    setMatchedPairs(0);
    setTurns(0);
    setIsCompleted(false);
    setRecentMatchArtifact(null);

    if (voiceEnabled) {
      SpeechNarrator.speak(REGIONAL_AUDIO_PROMPTS[language].matchGameIntro, language);
    }
  };

  useEffect(() => {
    initializeGame(pairCount);
  }, [pairCount]);

  const handleCardClick = (clickedCard: CardItem) => {
    if (clickedCard.isMatched || clickedCard.isFlipped) return;
    if (flippedUids.length === 2) return; // Wait for pair check

    soundManager.playSoftTap();

    const newFlipped = [...flippedUids, clickedCard.uid];
    setFlippedUids(newFlipped);

    // Update card flip state
    setCards((prev) =>
      prev.map((c) => (c.uid === clickedCard.uid ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      setTurns((prev) => prev + 1);
      const firstCard = cards.find((c) => c.uid === newFlipped[0]);
      const secondCard = clickedCard;

      if (firstCard && firstCard.artifactId === secondCard.artifactId) {
        // MATCH FOUND!
        soundManager.playSuccessChime();
        const matchedArtifact = firstCard.artifact;
        setRecentMatchArtifact(matchedArtifact);

        if (voiceEnabled) {
          const locName =
            (matchedArtifact as any).translations?.[language]?.name ||
            matchedArtifact.nativeName ||
            matchedArtifact.name;
          SpeechNarrator.speak(
            REGIONAL_AUDIO_PROMPTS[language].matchFound(locName),
            language
          );
        }

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.artifactId === firstCard.artifactId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedUids([]);
          setMatchedPairs((prev) => {
            const updated = prev + 1;
            if (updated === pairCount) {
              handleGameComplete();
            }
            return updated;
          });
        }, 600);
      } else {
        // No match - gentle flip back after 1.2s without hurry
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (newFlipped.includes(c.uid) ? { ...c, isFlipped: false } : c))
          );
          setFlippedUids([]);
        }, 1200);
      }
    }
  };

  const handleGameComplete = () => {
    setIsCompleted(true);
    const duration = Math.round((Date.now() - startTime) / 1000);
    const calculatedAccuracy = Math.max(70, Math.min(100, Math.round((pairCount / Math.max(turns, 1)) * 100)));

    const result: GameSessionResult = {
      id: `session-${Date.now()}`,
      gameId: 'heritage-match',
      gameName: 'NE Heritage Match',
      score: pairCount,
      totalQuestionsOrPairs: pairCount,
      accuracyPercent: calculatedAccuracy,
      durationSeconds: duration,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      cognitiveDomain: 'Visuospatial',
    };

    onFinishSession(result);

    if (voiceEnabled) {
      SpeechNarrator.speak(REGIONAL_AUDIO_PROMPTS[language].matchGameComplete, language);
    }
  };

  const readArtifactPrompt = (artifact: CulturalArtifact) => {
    const loc = (artifact as any).translations?.[language];
    const name = loc?.name || artifact.nativeName || artifact.name;
    const hint = loc?.hint || artifact.therapeuticMemoryHint;
    const text = language === 'en' ? `${name}. ${hint}` : `${name}। ${hint}`;
    SpeechNarrator.speak(text, language);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-4 rounded-2xl border border-[#0f382c]/10 shadow-sm">
        <button
          onClick={onBack}
          className="text-base font-semibold text-[#0f382c] hover:text-[#2d6a4f] cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eef7f2]"
        >
          ← {strings.backToHome}
        </button>

        <div className="flex items-center gap-4 text-sm sm:text-base font-medium text-[#1a2e26]">
          <span>
            {strings.matchesFoundLabel}{' '}
            <strong className="text-[#2d6a4f] text-lg font-bold">
              {matchedPairs}/{pairCount}
            </strong>
          </span>
          <span className="text-[#1a2e26]/30">|</span>
          <span>{strings.gentleTurnsLabel} {turns}</span>
        </div>

        {/* Difficulty switcher for elder comfort */}
        <div className="flex items-center gap-1 bg-[#eef7f2] p-1 rounded-xl">
          <button
            onClick={() => setPairCount(4)}
            className={`px-3 py-1 text-sm font-semibold rounded-lg cursor-pointer transition-colors ${
              pairCount === 4
                ? 'bg-[#2d6a4f] text-white shadow-xs'
                : 'text-[#0f382c] hover:bg-white/60'
            }`}
          >
            {strings.gentleDifficulty}
          </button>
          <button
            onClick={() => setPairCount(6)}
            className={`px-3 py-1 text-sm font-semibold rounded-lg cursor-pointer transition-colors ${
              pairCount === 6
                ? 'bg-[#2d6a4f] text-white shadow-xs'
                : 'text-[#0f382c] hover:bg-white/60'
            }`}
          >
            {strings.standardDifficulty}
          </button>
        </div>
      </div>

      {/* Recent Cultural Memory Discovery Banner */}
      {recentMatchArtifact && !isCompleted && (
        <div className="mb-6 p-4 rounded-2xl bg-[#eef7f2] border border-[#2d6a4f]/30 flex items-start justify-between gap-3 shadow-xs animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#0f382c]">
                {(recentMatchArtifact as any).translations?.[language]?.name || recentMatchArtifact.name}
              </h4>
              <p className="text-sm text-[#1a2e26]/90 mt-0.5">
                {(recentMatchArtifact as any).translations?.[language]?.hint || recentMatchArtifact.therapeuticMemoryHint}
              </p>
            </div>
          </div>
          <button
            onClick={() => readArtifactPrompt(recentMatchArtifact)}
            className="p-2 rounded-lg bg-white text-[#2d6a4f] hover:bg-[#2d6a4f] hover:text-white transition-colors cursor-pointer shrink-0"
            title={strings.readMemoryTooltip}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Active Game Cards Grid */}
      {!isCompleted ? (
        <div
          className={`grid gap-3 sm:gap-4 ${
            pairCount === 4
              ? 'grid-cols-2 sm:grid-cols-4'
              : 'grid-cols-3 sm:grid-cols-4'
          }`}
        >
          {cards.map((card) => {
            const showFace = card.isFlipped || card.isMatched;
            const loc = (card.artifact as any).translations?.[language] || {
              name: card.artifact.name,
              nativeName: card.artifact.nativeName,
              hint: card.artifact.therapeuticMemoryHint,
            };

            return (
              <button
                key={card.uid}
                onClick={() => handleCardClick(card)}
                disabled={card.isMatched || card.isFlipped}
                aria-label={showFace ? loc.name : strings.hiddenCardLabel}
                className={`aspect-4/3 sm:aspect-square rounded-2xl p-3 sm:p-4 text-center flex flex-col items-center justify-center transition-all duration-300 transform cursor-pointer border-2 relative ${
                  card.isMatched
                    ? 'bg-[#eef7f2] border-[#2d6a4f] opacity-90 scale-95 shadow-none'
                    : showFace
                    ? 'bg-white border-[#2d6a4f] shadow-md -translate-y-1'
                    : 'bg-gradient-to-br from-[#0f382c] to-[#1c5542] border-[#0f382c] text-white hover:brightness-105 shadow-sm active:scale-95'
                }`}
              >
                {showFace ? (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    {/* Cultural Artifact Badge */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#eef7f2] flex items-center justify-center text-2xl sm:text-3xl mb-2 shadow-xs">
                      {card.artifact.iconType === 'jaapi' && '👒'}
                      {card.artifact.iconType === 'gamusa' && '🧣'}
                      {card.artifact.iconType === 'dhol' && '🥁'}
                      {card.artifact.iconType === 'mukha' && '🎭'}
                      {card.artifact.iconType === 'kopou' && '🌸'}
                      {card.artifact.iconType === 'flute' && '🎵'}
                      {card.artifact.iconType === 'phumdi' && '🌿'}
                      {card.artifact.iconType === 'shawl' && '✨'}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#0f382c] line-clamp-1">
                      {loc.name}
                    </span>
                    <span className="text-[11px] text-[#1a2e26]/70 line-clamp-1">
                      {loc.nativeName}
                    </span>

                    {card.isMatched && (
                      <span className="absolute top-2 right-2 text-[#2d6a4f]">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center mb-1">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                    </div>
                    <span className="text-xs font-medium text-white/80">
                      {language === 'hi' ? 'स्मृति' : language === 'mr' ? 'स्मृती' : 'Memory'}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* Victory & Affirmation View */
        <div className="bg-white rounded-3xl p-6 sm:p-10 text-center border border-[#0f382c]/10 shadow-lg animate-fadeIn max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-[#eef7f2] text-[#2d6a4f] flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-[#2d6a4f]" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#0f382c]">
            {strings.wellDone}
          </h3>
          <p className="text-base text-[#1a2e26]/80 mt-2 max-w-md mx-auto">
            {strings.matchVictorySub}
          </p>

          <div className="my-6 p-4 rounded-2xl bg-[#eef7f2] border border-[#2d6a4f]/20 flex items-center justify-around text-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1a2e26]/60">
                {strings.treasuresFoundLabel}
              </span>
              <p className="text-2xl font-bold text-[#0f382c]">{pairCount} {language === 'hi' ? 'जोड़े' : language === 'mr' ? 'जोड्या' : 'Pairs'}</p>
            </div>
            <div className="w-px h-10 bg-[#2d6a4f]/20" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1a2e26]/60">
                {strings.visuospatialScoreLabel}
              </span>
              <p className="text-2xl font-bold text-[#2d6a4f]">100%</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => initializeGame(pairCount)}
              className="flex items-center gap-2 bg-[#2d6a4f] hover:bg-[#1f4e39] text-white px-6 py-3 rounded-xl font-bold text-base cursor-pointer shadow-sm transition-transform active:scale-95"
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
