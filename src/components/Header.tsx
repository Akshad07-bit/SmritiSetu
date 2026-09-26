/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppMode, SupportedLanguage } from '../types';
import { REGIONAL_AUDIO_PROMPTS, SUPPORTED_LANGUAGES, UI_STRINGS } from '../data/culturalData';
import { Volume2, VolumeX, ShieldAlert, HeartHandshake } from 'lucide-react';
import { SpeechNarrator } from '../utils/speech';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onTriggerSOS: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  language,
  onSelectLanguage,
  voiceEnabled,
  onToggleVoice,
  onTriggerSOS,
}) => {
  const strings = UI_STRINGS[language];

  return (
    <header className="sticky top-0 z-50 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#0f382c]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectMode('elder')}
            className="text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2d6a4f]"
          >
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f382c] flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2d6a4f] inline-block animate-pulse" />
              <span>{strings.appName || 'SmritiSetu'}</span>
              <span className="text-sm font-normal text-[#2d6a4f]/70 hidden md:inline">
                {language === 'hi' ? '· स्मृति सेतु' : language === 'mr' ? '· स्मृती सेतू' : '· Memory Bridge'}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean text with hover underlines) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#1a2e26]/80">
          <button
            onClick={() => onSelectMode('elder')}
            className={`transition-colors py-1 cursor-pointer ${
              currentMode === 'elder'
                ? 'text-[#0f382c] font-bold border-b-2 border-[#2d6a4f]'
                : 'hover:text-[#0f382c]'
            }`}
          >
            {strings.elderMode}
          </button>
          <button
            onClick={() => onSelectMode('caregiver')}
            className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              currentMode === 'caregiver'
                ? 'text-[#0f382c] font-bold border-b-2 border-[#2d6a4f]'
                : 'hover:text-[#0f382c]'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-[#2d6a4f]" />
            <span>{strings.caregiverMode}</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Language, Audio Narration Toggle, SOS Button) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              aria-label="Select Language"
              onChange={(e) => {
                const newLang = e.target.value as SupportedLanguage;
                onSelectLanguage(newLang);
                if (voiceEnabled) {
                  SpeechNarrator.speak(REGIONAL_AUDIO_PROMPTS[newLang].welcomeGreeting, newLang);
                }
              }}
              className="text-xs sm:text-sm font-medium bg-[#eef7f2] text-[#0f382c] border border-[#2d6a4f]/30 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native} ({lang.label})
                </option>
              ))}
            </select>
          </div>

          {/* Voice Narration Assistant Toggle */}
          <button
            onClick={() => {
              if (voiceEnabled) {
                SpeechNarrator.stop();
                onToggleVoice();
              } else {
                onToggleVoice();
                SpeechNarrator.speak(REGIONAL_AUDIO_PROMPTS[language].voiceActivated, language);
              }
            }}
            title={voiceEnabled ? 'Mute voice narration' : 'Enable voice read-aloud'}
            className={`p-2 rounded-lg transition-colors cursor-pointer border ${
              voiceEnabled
                ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]'
                : 'bg-[#eef7f2] text-[#1a2e26]/70 border-[#2d6a4f]/20 hover:text-[#0f382c]'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Emergency SOS Button for Elders */}
          <button
            onClick={onTriggerSOS}
            className="flex items-center gap-1.5 bg-[#c25e3d] hover:bg-[#a64e32] text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">{strings.sosHelp ? strings.sosHelp.split('/')[0].trim() : 'SOS Help'}</span>
          </button>

          {/* Mobile Mode Switcher */}
          <div className="lg:hidden flex items-center bg-[#eef7f2] rounded-lg p-1 border border-[#2d6a4f]/20">
            <button
              onClick={() => onSelectMode('elder')}
              className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer ${
                currentMode === 'elder' ? 'bg-[#0f382c] text-white' : 'text-[#0f382c]'
              }`}
            >
              {strings.elderMode ? strings.elderMode.split(' ')[0] : 'Elder'}
            </button>
            <button
              onClick={() => onSelectMode('caregiver')}
              className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer ${
                currentMode === 'caregiver' ? 'bg-[#0f382c] text-white' : 'text-[#0f382c]'
              }`}
            >
              {strings.caregiverMode ? strings.caregiverMode.split(' ')[0] : 'Care'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
