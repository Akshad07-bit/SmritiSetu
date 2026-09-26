/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameSessionResult, SupportedLanguage } from '../../../types';
import { REGIONAL_AUDIO_PROMPTS, UI_STRINGS } from '../../../data/culturalData';
import { soundManager } from '../../../utils/audio';
import { SpeechNarrator } from '../../../utils/speech';
import { CheckCircle2, RotateCcw, Award, Sparkles } from 'lucide-react';

interface DailyRoutineSequencerProps {
  language: SupportedLanguage;
  voiceEnabled: boolean;
  onFinishSession: (result: GameSessionResult) => void;
  onBack: () => void;
}

interface RoutineStep {
  id: string;
  order: number;
  icon: string;
  translations: Record<
    SupportedLanguage,
    {
      title: string;
      context: string;
    }
  >;
}

const MORNING_STEPS: RoutineStep[] = [
  {
    id: 'step-1',
    order: 1,
    icon: '🌅',
    translations: {
      en: {
        title: 'Wake up & Morning Prayer',
        context: 'Open the window to the morning hills, bow to the family shrine lamp.',
      },
      hi: {
        title: 'सुबह उठना व ईश्वर वंदना',
        context: 'सुबह उठकर खिड़की खोलना, ताजी हवा लेना और घर के मंदिर में दिया जलाकर नमन करना।',
      },
      mr: {
        title: 'सकाळी उठणे व देवाची प्रार्थना',
        context: 'पहाटे उठून खिडकी उघडणे, प्रसन्न हवा घेणे आणि देवघरात दिवा लावून मनोभावे हात जोडणे.',
      },
    },
  },
  {
    id: 'step-2',
    order: 2,
    icon: '🪥',
    translations: {
      en: {
        title: 'Wash Face & Morning Freshening',
        context: 'Rinse with refreshing cool water and gentle herbal wash.',
      },
      hi: {
        title: 'हाथ-मुंह धोना व मंजन करना',
        context: 'ताजे शीतल जल से मुंह धोना, मंजन करना और खुद को तरोताजा महसूस करना।',
      },
      mr: {
        title: 'तोंड धुणे व दात घासणे',
        context: 'स्वच्छ आणि गार पाण्याने तोंड धुणे, दात घासून प्रसन्न आणि ताजेतवाने होणे.',
      },
    },
  },
  {
    id: 'step-3',
    order: 3,
    icon: '🍵',
    translations: {
      en: {
        title: 'Warm Morning Tea & Light Breakfast',
        context: 'Sip comforting warm tea with traditional fresh breakfast.',
      },
      hi: {
        title: 'सुबह की गरमा-गरम चाय व नाश्ता',
        context: 'स्नेह से भरी अदरक वाली गरमा-गरम चाय की चुस्की और हल्का-फुल्का नाश्ता।',
      },
      mr: {
        title: 'गरम चहा आणि सकाळचा नाश्ता',
        context: 'आल्याचा वाफाळलेला गरम चहा आणि आवडीचा हलका, चवदार नाश्ता घेणे.',
      },
    },
  },
  {
    id: 'step-4',
    order: 4,
    icon: '💊',
    translations: {
      en: {
        title: 'Morning Medicine & Glass of Water',
        context: 'Take memory and blood pressure tablets on time with water.',
      },
      hi: {
        title: 'सुबह की दवाई व ताजा पानी',
        context: 'समय पर याददाश्त और स्वास्थ्य की गोलियां सादे पानी के साथ लेना।',
      },
      mr: {
        title: 'सकाळची नियमित औषधे आणि पाणी',
        context: 'वेळेवर स्मरणशक्तीची आणि रक्तदाबाची गोळी स्वच्छ पाण्यासोबत घेणे.',
      },
    },
  },
  {
    id: 'step-5',
    order: 5,
    icon: '🌿',
    translations: {
      en: {
        title: 'Gentle Garden Walk & Fresh Air',
        context: 'Step out into the veranda or garden to greet the morning birds and flowers.',
      },
      hi: {
        title: 'बगीचे या बालकनी में टहलना',
        context: 'सुबह की गुनगुनी धूप में टहलना, पेड़-पौधों को देखना और पक्षियों की चहचहाहट सुनना।',
      },
      mr: {
        title: 'बागेत किंवा बाल्कनीत फेरफटका',
        context: 'सकाळच्या प्रसन्न हवेत शांतपणे फेरफटका मारणे, झाडे-फुले आणि पाखरांची किलबिल पाहणे.',
      },
    },
  },
];

export const DailyRoutineSequencer: React.FC<DailyRoutineSequencerProps> = ({
  language,
  voiceEnabled,
  onFinishSession,
  onBack,
}) => {
  const strings = UI_STRINGS[language];
  const [availableSteps, setAvailableSteps] = useState<RoutineStep[]>(() =>
    [...MORNING_STEPS].sort(() => 0.5 - Math.random())
  );
  const [placedSteps, setPlacedSteps] = useState<RoutineStep[]>([]);
  const [mistakeCount, setMistakeCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [startTime] = useState<number>(Date.now());

  const handleStepClick = (step: RoutineStep) => {
    const expectedOrder = placedSteps.length + 1;
    const stepLoc = step.translations[language] || step.translations.en;

    if (step.order === expectedOrder) {
      soundManager.playSuccessChime();
      const newPlaced = [...placedSteps, step];
      setPlacedSteps(newPlaced);
      setAvailableSteps((prev) => prev.filter((s) => s.id !== step.id));

      const successFeedback =
        language === 'en'
          ? `Wonderful! "${stepLoc.title}" comes next.`
          : language === 'hi'
          ? `अति सुंदर! इसके बाद "${stepLoc.title}" ही आता है।`
          : `खूप छान! यानंतर "${stepLoc.title}" हीच पायरी येते.`;
      setFeedbackMsg(successFeedback);

      if (voiceEnabled) {
        SpeechNarrator.speak(
          REGIONAL_AUDIO_PROMPTS[language].routineStepCorrect(stepLoc.title),
          language
        );
      }

      if (newPlaced.length === MORNING_STEPS.length) {
        handleComplete();
      }
    } else {
      soundManager.playSoftTap();
      setMistakeCount((prev) => prev + 1);

      const gentleReminder =
        language === 'en'
          ? 'Take your time. Think what we usually do before that in the morning.'
          : language === 'hi'
          ? 'जल्दबाजी न करें। सोचिए, सुबह इसके पहले हम आमतौर पर क्या करते हैं?'
          : 'शांतपणे विचार करा. सकाळी याच्या आधी आपण कोणती गोष्ट करतो?';
      setFeedbackMsg(gentleReminder);

      if (voiceEnabled) {
        SpeechNarrator.speak(gentleReminder, language);
      }
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    const duration = Math.round((Date.now() - startTime) / 1000);
    const accuracy = Math.max(
      65,
      Math.min(
        100,
        Math.round((MORNING_STEPS.length / (MORNING_STEPS.length + mistakeCount)) * 100)
      )
    );

    const result: GameSessionResult = {
      id: `session-${Date.now()}`,
      gameId: 'daily-routine',
      gameName: 'Daily Routine Sequencer',
      score: MORNING_STEPS.length,
      totalQuestionsOrPairs: MORNING_STEPS.length,
      accuracyPercent: accuracy,
      durationSeconds: duration,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      cognitiveDomain: 'Executive Sequencing',
    };

    onFinishSession(result);

    if (voiceEnabled) {
      SpeechNarrator.speak(REGIONAL_AUDIO_PROMPTS[language].routineGameComplete, language);
    }
  };

  const handleRestart = () => {
    setAvailableSteps([...MORNING_STEPS].sort(() => 0.5 - Math.random()));
    setPlacedSteps([]);
    setMistakeCount(0);
    setIsCompleted(false);
    setFeedbackMsg(null);

    if (voiceEnabled) {
      SpeechNarrator.speak(REGIONAL_AUDIO_PROMPTS[language].routineGameIntro, language);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 px-2 sm:px-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-6 bg-white p-4 rounded-2xl border border-[#0f382c]/10 shadow-sm">
        <button
          onClick={onBack}
          className="text-base font-semibold text-[#0f382c] hover:text-[#2d6a4f] cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eef7f2]"
        >
          ← {strings.backToHome}
        </button>

        <span className="text-base font-bold text-[#0f382c]">
          {strings.peacefulMorningTitle}
        </span>

        <span className="text-sm font-semibold text-[#2d6a4f] bg-[#eef7f2] px-3 py-1 rounded-lg">
          {strings.stepsDoneLabel} {placedSteps.length}/{MORNING_STEPS.length}
        </span>
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          {/* Instructions card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#0f382c]/10 shadow-xs">
            <h3 className="text-xl font-bold text-[#0f382c] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>{strings.arrangeMorningPrompt}</span>
            </h3>
            <p className="text-sm sm:text-base text-[#1a2e26]/80 mt-1">
              {strings.arrangeMorningSub}
            </p>

            {feedbackMsg && (
              <div className="mt-3 p-3 rounded-xl bg-[#eef7f2] text-[#0f382c] text-sm font-medium border border-[#2d6a4f]/20">
                {feedbackMsg}
              </div>
            )}
          </div>

          {/* Chronological Completed Steps Ladder */}
          {placedSteps.length > 0 && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#2d6a4f]/30 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2d6a4f]">
                {strings.yourMorningFlow}
              </h4>
              <div className="space-y-2">
                {placedSteps.map((step, idx) => {
                  const stepLoc = step.translations[language] || step.translations.en;
                  return (
                    <div
                      key={step.id}
                      className="p-3.5 rounded-xl bg-[#eef7f2] border border-[#2d6a4f]/30 flex items-center justify-between gap-3 animate-fadeIn"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{step.icon}</span>
                        <div>
                          <span className="text-base font-bold text-[#0f382c]">
                            {idx + 1}. {stepLoc.title}
                          </span>
                          <p className="text-xs text-[#1a2e26]/70">{stepLoc.context}</p>
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-[#2d6a4f] shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Steps To Choose Next */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#0f382c]/10 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a2e26]/60 mb-3">
              {placedSteps.length === 0
                ? strings.whatFirstAtDawn
                : `${strings.whatHappensNext} (${placedSteps.length + 1}/${MORNING_STEPS.length})`}
            </h4>

            <div className="grid gap-3">
              {availableSteps.map((step) => {
                const stepLoc = step.translations[language] || step.translations.en;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step)}
                    className="w-full text-left p-4 rounded-2xl border-2 border-[#0f382c]/15 hover:border-[#2d6a4f] bg-[#fbf9f5] hover:bg-[#eef7f2] transition-colors cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 rounded-xl bg-white shadow-2xs">
                        {step.icon}
                      </span>
                      <div>
                        <div className="text-base font-bold text-[#0f382c]">
                          {stepLoc.title}
                        </div>
                        <p className="text-xs text-[#1a2e26]/70 mt-0.5">
                          {stepLoc.context}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#2d6a4f] bg-white px-3 py-1.5 rounded-lg border border-[#2d6a4f]/20 shrink-0">
                      {strings.pickThisBtn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Completion View */
        <div className="bg-white rounded-3xl p-6 sm:p-10 text-center border border-[#0f382c]/10 shadow-lg animate-fadeIn max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-[#eef7f2] text-[#2d6a4f] flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-[#2d6a4f]" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#0f382c]">
            {strings.wellDone}
          </h3>
          <p className="text-base text-[#1a2e26]/80 mt-2 max-w-md mx-auto">
            {strings.routineVictorySub}
          </p>

          <div className="my-6 p-4 rounded-2xl bg-[#eef7f2] border border-[#2d6a4f]/20 flex items-center justify-around text-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1a2e26]/60">
                {strings.executiveDomainLabel}
              </span>
              <p className="text-2xl font-bold text-[#0f382c]">5 / 5</p>
            </div>
            <div className="w-px h-10 bg-[#2d6a4f]/20" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1a2e26]/60">
                {strings.independenceRatingLabel}
              </span>
              <p className="text-2xl font-bold text-[#2d6a4f]">{strings.optimalRating}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleRestart}
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
