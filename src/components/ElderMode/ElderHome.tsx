/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ElderTab, GameId, SupportedLanguage } from '../../types';
import { UI_STRINGS } from '../../data/culturalData';
import { Brain, MessageSquareHeart, Users, Waves, Clock, ShieldAlert, Sparkles, ChevronRight, Heart } from 'lucide-react';

interface ElderHomeProps {
  language: SupportedLanguage;
  onSelectTab: (tab: ElderTab) => void;
  onSelectGame: (gameId: GameId) => void;
  onTriggerSOS: () => void;
}

export const ElderHome: React.FC<ElderHomeProps> = ({
  language,
  onSelectTab,
  onSelectGame,
  onTriggerSOS,
}) => {
  const strings = UI_STRINGS[language];

  return (
    <div className="max-w-5xl mx-auto py-4 px-2 sm:px-4 space-y-6">
      {/* Warm Regional Greeting Banner with generated tea garden visual */}
      <div className="relative rounded-3xl overflow-hidden shadow-md border border-[#0f382c]/10 bg-slate-900 text-white">
        <div className="relative aspect-21/9 sm:aspect-24/8 w-full overflow-hidden">
          <img
            src="/src/assets/images/ne_reminiscence_tea_garden_1790407105183.jpg"
            alt="Scenic morning garden"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent flex items-center p-6 sm:p-10">
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-1.5 bg-[#2d6a4f]/90 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{strings.tagline}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {strings.welcomeElder}
              </h1>
              <p className="text-sm sm:text-base text-white/90 mt-2 font-medium">
                {strings.subWelcome}. {strings.subWelcomeExtra}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4 Primary Action Tiles (Big, High-Contrast, WCAG Compliant) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Tile 1: Cognitive Mind Games */}
        <button
          onClick={() => onSelectTab('games')}
          className="text-left p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#0f382c]/15 hover:border-[#2d6a4f] hover:shadow-lg transition-all duration-200 cursor-pointer flex items-start justify-between gap-4 group"
        >
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#eef7f2] border border-[#2d6a4f]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-3xl">
              🧩
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[#0f382c] group-hover:text-[#2d6a4f]">
                  {strings.mindGames}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-[#1a2e26]/80 mt-1 font-medium">
                {strings.mindGamesDesc}
              </p>
              <div className="mt-3 inline-flex items-center text-xs font-bold text-[#2d6a4f] bg-[#eef7f2] px-3 py-1 rounded-lg">
                {strings.mindGamesBadge}
              </div>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-[#2d6a4f] shrink-0 mt-2 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Tile 2: Talk with Sathi (Reminiscence AI) */}
        <button
          onClick={() => onSelectTab('reminiscence')}
          className="text-left p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#0f382c]/15 hover:border-[#2d6a4f] hover:shadow-lg transition-all duration-200 cursor-pointer flex items-start justify-between gap-4 group"
        >
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-3xl">
              👵
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0f382c] group-hover:text-[#2d6a4f]">
                {strings.reminiscence}
              </h3>
              <p className="text-sm sm:text-base text-[#1a2e26]/80 mt-1 font-medium">
                {strings.reminiscenceDesc}
              </p>
              <div className="mt-3 inline-flex items-center text-xs font-bold text-amber-800 bg-amber-100/70 px-3 py-1 rounded-lg">
                {strings.reminiscenceBadge}
              </div>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-[#2d6a4f] shrink-0 mt-2 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Tile 3: Loved Ones (Family Album) */}
        <button
          onClick={() => onSelectTab('family')}
          className="text-left p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#0f382c]/15 hover:border-[#2d6a4f] hover:shadow-lg transition-all duration-200 cursor-pointer flex items-start justify-between gap-4 group"
        >
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-3xl">
              📸
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0f382c] group-hover:text-[#2d6a4f]">
                {strings.familyAlbum}
              </h3>
              <p className="text-sm sm:text-base text-[#1a2e26]/80 mt-1 font-medium">
                {strings.familyAlbumDesc}
              </p>
              <div className="mt-3 inline-flex items-center text-xs font-bold text-rose-800 bg-rose-100/70 px-3 py-1 rounded-lg">
                {strings.familyAlbumBadge}
              </div>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-[#2d6a4f] shrink-0 mt-2 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Tile 4: Peaceful Sounds */}
        <button
          onClick={() => onSelectTab('sounds')}
          className="text-left p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#0f382c]/15 hover:border-[#2d6a4f] hover:shadow-lg transition-all duration-200 cursor-pointer flex items-start justify-between gap-4 group"
        >
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-3xl">
              🍃
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0f382c] group-hover:text-[#2d6a4f]">
                {strings.peacefulSounds}
              </h3>
              <p className="text-sm sm:text-base text-[#1a2e26]/80 mt-1 font-medium">
                {strings.peacefulSoundsDesc}
              </p>
              <div className="mt-3 inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-lg">
                {strings.peacefulSoundsBadge}
              </div>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-[#2d6a4f] shrink-0 mt-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Secondary Bottom Row: Reality Orientation Clock & Emergency Anchor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Reality Orientation Clock Link (2 cols) */}
        <button
          onClick={() => onSelectTab('routine')}
          className="md:col-span-2 text-left p-5 rounded-2xl bg-[#eef7f2] border border-[#2d6a4f]/30 hover:bg-[#d8ece1] transition-colors cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-2xs">
              <Clock className="w-8 h-8 text-[#2d6a4f]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#0f382c]">
                {strings.dailyClock}
              </h4>
              <p className="text-xs sm:text-sm text-[#1a2e26]/80 mt-0.5">
                {strings.dailyClockDesc}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#2d6a4f] bg-white px-3 py-1.5 rounded-lg border border-[#2d6a4f]/20">
            {strings.openBoard}
          </span>
        </button>

        {/* Instant SOS Help (1 col) */}
        <button
          onClick={onTriggerSOS}
          className="text-left p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 hover:bg-rose-100 transition-colors cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-xl text-rose-600 shadow-2xs">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h4 className="text-base font-bold text-rose-900">
                {strings.sosHelp}
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                {strings.sosHelpDesc}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
