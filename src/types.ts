/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppMode = 'elder' | 'caregiver';

export type ElderTab = 'home' | 'games' | 'reminiscence' | 'family' | 'sounds' | 'routine';

export type GameId = 'heritage-match' | 'sound-recall' | 'daily-routine' | 'folk-wisdom';

export type SupportedLanguage = 'en' | 'hi' | 'mr';

export interface RegionalStateData {
  id: string;
  name: string;
  nativeName: string;
  capital: string;
  heritageSymbols: string[];
  traditionalMusic: string;
  nostalgicFoods: string[];
}

export interface CulturalArtifact {
  id: string;
  name: string;
  nativeName: string;
  state: string;
  description: string;
  therapeuticMemoryHint: string;
  iconType: 'jaapi' | 'gamusa' | 'dhol' | 'mukha' | 'kopou' | 'flute' | 'phumdi' | 'shawl';
}

export interface SoundscapeItem {
  id: string;
  title: string;
  nativeTitle?: string;
  nativeName?: string;
  location: string;
  description: string;
  synthType: 'monsoon' | 'dhol' | 'birds' | 'river' | 'bell' | 'flute';
  durationSeconds: number;
}

export interface FamilyMemoryItem {
  id: string;
  title: string;
  relation: string;
  personName: string;
  location: string;
  yearApprox: string;
  description: string;
  audioPromptHint: string;
  imageSrc?: string;
  aiStory?: string;
  translations?: Record<
    SupportedLanguage,
    {
      title: string;
      relation: string;
      location: string;
      description: string;
      audioPromptHint: string;
      aiStory?: string;
    }
  >;
}

export interface ReminiscenceMessage {
  id: string;
  sender: 'elder' | 'companion';
  text: string;
  timestamp: string;
  sentiment?: 'peaceful' | 'nostalgic' | 'joyful' | 'confused' | 'seeking_reassurance';
  topic?: string;
}

export interface GameSessionResult {
  id: string;
  gameId: GameId;
  gameName: string;
  score: number;
  totalQuestionsOrPairs: number;
  accuracyPercent: number;
  durationSeconds: number;
  timestamp: string;
  cognitiveDomain: 'Visuospatial' | 'Auditory Recall' | 'Executive Sequencing' | 'Semantic Memory';
}

export interface MedicationRoutineItem {
  id: string;
  name: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  timeLabel: string;
  dose: string;
  instructions: string;
  takenToday: boolean;
  elderIcon: string;
  translations?: Record<
    SupportedLanguage,
    {
      name: string;
      dose: string;
      instructions: string;
      timeSlotLabel: string;
    }
  >;
}

export interface ClinicalCognitiveSummary {
  overallStabilityScore: number;
  domainScores: {
    visuoSpatial: number;
    shortTermRecall: number;
    executiveSequencing: number;
    auditoryAttention: number;
  };
  clinicalSummary: string;
  sundowningRisk: 'Low' | 'Moderate' | 'Guarded';
  caregiverRecommendations: string[];
  translations?: Record<
    SupportedLanguage,
    {
      clinicalSummary: string;
      sundowningRisk: string;
      caregiverRecommendations: string[];
    }
  >;
}

