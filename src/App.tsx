/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppMode, ElderTab, GameId, GameSessionResult, SupportedLanguage } from './types';
import { Header } from './components/Header';
import { ElderHome } from './components/ElderMode/ElderHome';
import { GamesHub } from './components/ElderMode/Games/GamesHub';
import { NEHeritageMatchGame } from './components/ElderMode/Games/NEHeritageMatchGame';
import { SensorySoundRecallGame } from './components/ElderMode/Games/SensorySoundRecallGame';
import { DailyRoutineSequencer } from './components/ElderMode/Games/DailyRoutineSequencer';
import { FolkWisdomQuiz } from './components/ElderMode/Games/FolkWisdomQuiz';
import { ReminiscenceChat } from './components/ElderMode/ReminiscenceChat';
import { FamilyMemoryAlbum } from './components/ElderMode/FamilyMemoryAlbum';
import { SoundscapePlayer } from './components/ElderMode/SoundscapePlayer';
import { DailyOrientationClock } from './components/ElderMode/DailyOrientationClock';
import { CaregiverDashboard } from './components/CaregiverMode/CaregiverDashboard';
import { SOSModal } from './components/SOSModal';
import { UI_STRINGS } from './data/culturalData';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('elder');
  const [elderTab, setElderTab] = useState<ElderTab>('home');
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [sessionHistory, setSessionHistory] = useState<GameSessionResult[]>([]);
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);

  const handleFinishGameSession = (result: GameSessionResult) => {
    setSessionHistory((prev) => [result, ...prev]);
  };

  const handleSelectGame = (gameId: GameId) => {
    setActiveGame(gameId);
    setElderTab('games');
  };

  const handleSelectTab = (tab: ElderTab) => {
    setElderTab(tab);
    if (tab !== 'games') {
      setActiveGame(null);
    }
  };

  const handleBackToElderHome = () => {
    setActiveGame(null);
    setElderTab('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5] text-[#1a2e26] selection:bg-[#2d6a4f]/20 selection:text-[#0f382c]">
      {/* Top Bar Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          if (mode === 'elder') {
            setElderTab('home');
            setActiveGame(null);
          }
        }}
        language={language}
        onSelectLanguage={setLanguage}
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => setVoiceEnabled((prev) => !prev)}
        onTriggerSOS={() => setIsSOSOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentMode === 'caregiver' && (
          <CaregiverDashboard
            language={language}
            sessionHistory={sessionHistory}
            onSwitchToElderMode={() => {
              setCurrentMode('elder');
              setElderTab('home');
            }}
          />
        )}

        {currentMode === 'elder' && (
          <>
            {elderTab === 'home' && (
              <ElderHome
                language={language}
                onSelectTab={handleSelectTab}
                onSelectGame={handleSelectGame}
                onTriggerSOS={() => setIsSOSOpen(true)}
              />
            )}

            {elderTab === 'games' && !activeGame && (
              <GamesHub
                language={language}
                onSelectGame={handleSelectGame}
                onBack={handleBackToElderHome}
              />
            )}

            {elderTab === 'games' && activeGame === 'heritage-match' && (
              <NEHeritageMatchGame
                language={language}
                voiceEnabled={voiceEnabled}
                onFinishSession={handleFinishGameSession}
                onBack={() => setActiveGame(null)}
              />
            )}

            {elderTab === 'games' && activeGame === 'sound-recall' && (
              <SensorySoundRecallGame
                language={language}
                voiceEnabled={voiceEnabled}
                onFinishSession={handleFinishGameSession}
                onBack={() => setActiveGame(null)}
              />
            )}

            {elderTab === 'games' && activeGame === 'daily-routine' && (
              <DailyRoutineSequencer
                language={language}
                voiceEnabled={voiceEnabled}
                onFinishSession={handleFinishGameSession}
                onBack={() => setActiveGame(null)}
              />
            )}

            {elderTab === 'games' && activeGame === 'folk-wisdom' && (
              <FolkWisdomQuiz
                language={language}
                voiceEnabled={voiceEnabled}
                onFinishSession={handleFinishGameSession}
                onBack={() => setActiveGame(null)}
              />
            )}

            {elderTab === 'reminiscence' && (
              <ReminiscenceChat
                language={language}
                voiceEnabled={voiceEnabled}
                onBack={handleBackToElderHome}
              />
            )}

            {elderTab === 'family' && (
              <FamilyMemoryAlbum
                language={language}
                voiceEnabled={voiceEnabled}
                onBack={handleBackToElderHome}
              />
            )}

            {elderTab === 'sounds' && (
              <SoundscapePlayer
                language={language}
                onBack={handleBackToElderHome}
              />
            )}

            {elderTab === 'routine' && (
              <DailyOrientationClock
                language={language}
                voiceEnabled={voiceEnabled}
                onBack={handleBackToElderHome}
              />
            )}
          </>
        )}
      </main>

      {/* Emergency SOS Modal */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        language={language}
      />

      {/* Quiet Non-Intrusive Footer */}
      <footer className="border-t border-[#0f382c]/10 bg-white/70 py-4 px-6 text-center text-xs text-[#1a2e26]/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{UI_STRINGS[language].footerTitle}</span>
          <span>{UI_STRINGS[language].footerDedication}</span>
        </div>
      </footer>
    </div>
  );
}
