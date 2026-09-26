/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameId, SupportedLanguage } from '../../../types';
import { UI_STRINGS } from '../../../data/culturalData';
import { Sparkles, Brain, Volume2, Calendar, BookOpen, ChevronRight } from 'lucide-react';

interface GamesHubProps {
  language: SupportedLanguage;
  onSelectGame: (gameId: GameId) => void;
  onBack: () => void;
}

export const GamesHub: React.FC<GamesHubProps> = ({
  language,
  onSelectGame,
  onBack,
}) => {
  const strings = UI_STRINGS[language];

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#0f382c]/10 shadow-sm">
        <button
          onClick={onBack}
          className="text-base font-semibold text-[#0f382c] hover:text-[#2d6a4f] cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eef7f2]"
        >
          ← {strings.backToHome}
        </button>

        <div className="text-center">
          <h3 className="text-lg font-bold text-[#0f382c]">
            {strings.mindGamesTitle}
          </h3>
          <p className="text-xs text-[#1a2e26]/70">
            {strings.mindGamesSubtitle}
          </p>
        </div>

        <div className="w-24 text-right text-xs font-bold text-[#2d6a4f] bg-[#eef7f2] px-3 py-1 rounded-lg hidden sm:block">
          {strings.fourGamesAvailable}
        </div>
      </div>

      {/* Games List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Game 1 */}
        <button
          onClick={() => onSelectGame('heritage-match')}
          className="text-left p-6 rounded-3xl bg-white border-2 border-[#0f382c]/15 hover:border-[#2d6a4f] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#eef7f2] text-3xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-2xs">
              👒
            </div>
            <div className="inline-block text-[11px] font-bold text-[#2d6a4f] bg-[#eef7f2] px-2.5 py-0.5 rounded-md mb-1.5">
              {strings.visuospatialDomain}
            </div>
            <h4 className="text-xl font-bold text-[#0f382c] group-hover:text-[#2d6a4f]">
              {strings.gameMatchTitle}
            </h4>
            <p className="text-sm text-[#1a2e26]/80 mt-1">
              {strings.gameMatchDesc}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-bold text-[#2d6a4f] pt-3 border-t border-[#0f382c]/10">
            <span>{strings.gameMatchAction}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Game 2 */}
        <button
          onClick={() => onSelectGame('sound-recall')}
          className="text-left p-6 rounded-3xl bg-white border-2 border-[#0f382c]/15 hover:border-[#2d6a4f] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-3xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-2xs">
              🌧️
            </div>
            <div className="inline-block text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md mb-1.5">
              {strings.auditoryDomain}
            </div>
            <h4 className="text-xl font-bold text-[#0f382c] group-hover:text-[#2d6a4f]">
              {strings.gameSoundTitle}
            </h4>
            <p className="text-sm text-[#1a2e26]/80 mt-1">
              {strings.gameSoundDesc}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-bold text-amber-800 pt-3 border-t border-[#0f382c]/10">
            <span>{strings.gameSoundAction}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Game 3 */}
        <button
          onClick={() => onSelectGame('daily-routine')}
          className="text-left p-6 rounded-3xl bg-white border-2 border-[#0f382c]/15 hover:border-[#2d6a4f] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-3xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-2xs">
              🌅
            </div>
            <div className="inline-block text-[11px] font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-md mb-1.5">
              {strings.executiveDomain}
            </div>
            <h4 className="text-xl font-bold text-[#0f382c] group-hover:text-[#2d6a4f]">
              {strings.gameRoutineTitle}
            </h4>
            <p className="text-sm text-[#1a2e26]/80 mt-1">
              {strings.gameRoutineDesc}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-bold text-teal-800 pt-3 border-t border-[#0f382c]/10">
            <span>{strings.gameRoutineAction}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Game 4 */}
        <button
          onClick={() => onSelectGame('folk-wisdom')}
          className="text-left p-6 rounded-3xl bg-white border-2 border-[#0f382c]/15 hover:border-[#2d6a4f] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-3xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-2xs">
              🌸
            </div>
            <div className="inline-block text-[11px] font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-md mb-1.5">
              {strings.semanticDomain}
            </div>
            <h4 className="text-xl font-bold text-[#0f382c] group-hover:text-[#2d6a4f]">
              {strings.gameFolkTitle}
            </h4>
            <p className="text-sm text-[#1a2e26]/80 mt-1">
              {strings.gameFolkDesc}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-bold text-rose-800 pt-3 border-t border-[#0f382c]/10">
            <span>{strings.gameFolkAction}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
};
