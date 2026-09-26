/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SoundscapeItem, SupportedLanguage } from '../../types';
import { REGIONAL_SOUNDSCAPES, UI_STRINGS } from '../../data/culturalData';
import { soundManager } from '../../utils/audio';
import { Volume2, Play, Pause, Waves, CloudRain, Music, Bird, Bell, Wind } from 'lucide-react';

interface SoundscapePlayerProps {
  language: SupportedLanguage;
  onBack: () => void;
}

export const SoundscapePlayer: React.FC<SoundscapePlayerProps> = ({
  language,
  onBack,
}) => {
  const strings = UI_STRINGS[language];
  const [activeItem, setActiveItem] = useState<SoundscapeItem>(REGIONAL_SOUNDSCAPES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      soundManager.stopSoundscape();
    };
  }, []);

  const handleToggleSound = (item: SoundscapeItem) => {
    if (activeItem.id === item.id && isPlaying) {
      soundManager.stopSoundscape();
      setIsPlaying(false);
    } else {
      setActiveItem(item);
      soundManager.startSoundscape(item.synthType);
      setIsPlaying(true);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'monsoon':
        return <CloudRain className="w-8 h-8 text-blue-600" />;
      case 'dhol':
        return <Music className="w-8 h-8 text-amber-600" />;
      case 'birds':
        return <Bird className="w-8 h-8 text-emerald-600" />;
      case 'river':
        return <Waves className="w-8 h-8 text-cyan-600" />;
      case 'bell':
        return <Bell className="w-8 h-8 text-amber-500" />;
      case 'flute':
      default:
        return <Wind className="w-8 h-8 text-teal-600" />;
    }
  };

  const locActive = (activeItem as any).translations?.[language] || {
    title: activeItem.title,
    nativeName: activeItem.nativeName || '',
    location: activeItem.location,
    description: activeItem.description,
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6 bg-white p-4 rounded-2xl border border-[#0f382c]/10 shadow-sm">
        <button
          onClick={() => {
            soundManager.stopSoundscape();
            onBack();
          }}
          className="text-base font-semibold text-[#0f382c] hover:text-[#2d6a4f] cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eef7f2]"
        >
          ← {strings.backToHome}
        </button>

        <div className="text-center">
          <h3 className="text-lg font-bold text-[#0f382c]">
            {strings.soundscapeTitle}
          </h3>
          <p className="text-xs text-[#1a2e26]/70">
            {strings.soundscapeSubtitle}
          </p>
        </div>

        <div className="w-24 text-right">
          {isPlaying && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full animate-pulse">
              {strings.playingBadge}
            </span>
          )}
        </div>
      </div>

      {/* Featured Playing Card */}
      <div className="bg-gradient-to-br from-[#0f382c] to-[#1c5542] text-white rounded-3xl p-6 sm:p-10 text-center shadow-lg relative overflow-hidden mb-8">
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-4">
            {getIconForType(activeItem.synthType)}
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
            📍 {locActive.location}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-1 mb-2">
            {locActive.title}
          </h2>
          <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-lg mx-auto">
            {locActive.description}
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => handleToggleSound(activeItem)}
              className="flex items-center gap-3 bg-white text-[#0f382c] hover:bg-[#eef7f2] font-bold px-8 py-4 rounded-2xl cursor-pointer text-lg shadow-md transition-transform active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-6 h-6 fill-current" />
                  <span>{strings.pauseSoundscapeBtn}</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-current" />
                  <span>{strings.playSoundscapeBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Ambient background ripples when playing */}
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-96 h-96 rounded-full border-2 border-white animate-ping" />
            <div className="w-[500px] h-[500px] rounded-full border border-white/40 animate-pulse" />
          </div>
        )}
      </div>

      {/* Soundscape List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REGIONAL_SOUNDSCAPES.map((item) => {
          const isThisActive = activeItem.id === item.id;
          const isThisPlaying = isThisActive && isPlaying;
          const loc = (item as any).translations?.[language] || {
            title: item.title,
            nativeName: item.nativeName || '',
            location: item.location,
            description: item.description,
          };

          return (
            <button
              key={item.id}
              onClick={() => handleToggleSound(item)}
              className={`text-left p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                isThisActive
                  ? 'bg-white border-[#2d6a4f] shadow-md ring-2 ring-[#2d6a4f]/20'
                  : 'bg-white/80 border-[#0f382c]/10 hover:border-[#2d6a4f]/50 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-2xl bg-[#eef7f2] group-hover:scale-105 transition-transform shadow-2xs">
                    {getIconForType(item.synthType)}
                  </div>

                  {isThisPlaying && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{strings.playingBadge}</span>
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-bold text-[#2d6a4f] uppercase tracking-wider">
                  {loc.location}
                </span>
                <h4 className="text-lg font-bold text-[#0f382c] mt-0.5 group-hover:text-[#2d6a4f]">
                  {loc.title}
                </h4>
                <p className="text-xs text-[#1a2e26]/70 mt-1 line-clamp-2">
                  {loc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#0f382c]/10 flex items-center justify-between text-xs font-bold text-[#2d6a4f]">
                <span>{isThisPlaying ? strings.pauseSoundscapeBtn : strings.playSoundscapeBtn}</span>
                {isThisPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
