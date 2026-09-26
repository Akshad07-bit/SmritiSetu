/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MedicationRoutineItem, SupportedLanguage } from '../../types';
import { INITIAL_MEDICATIONS } from '../../data/mockCaregiverData';
import { REGIONAL_AUDIO_PROMPTS, UI_STRINGS } from '../../data/culturalData';
import { soundManager } from '../../utils/audio';
import { SpeechNarrator } from '../../utils/speech';
import { Sun, Sunset, Moon, Sunrise, CheckCircle2, Circle, Clock, Volume2 } from 'lucide-react';

interface DailyOrientationClockProps {
  language: SupportedLanguage;
  voiceEnabled: boolean;
  onBack: () => void;
}

export const DailyOrientationClock: React.FC<DailyOrientationClockProps> = ({
  language,
  voiceEnabled,
  onBack,
}) => {
  const strings = UI_STRINGS[language];
  const [medications, setMedications] = useState<MedicationRoutineItem[]>(INITIAL_MEDICATIONS);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDateStr, setCurrentDateStr] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<{
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    color: string;
  }>({
    label: 'Morning',
    sublabel: 'Time for warm tea and gentle morning sunshine',
    icon: <Sunrise className="w-12 h-12 text-amber-500" />,
    color: 'from-amber-50 to-emerald-50 border-amber-200',
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );

      const localeCode =
        language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
      const formattedDate = now.toLocaleDateString(localeCode, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setCurrentDateStr(formattedDate);

      const hour = now.getHours();

      if (hour >= 5 && hour < 12) {
        setTimePeriod({
          label:
            language === 'en'
              ? 'Morning Dawn'
              : language === 'hi'
              ? 'सुबह का समय (प्रभात)'
              : 'सकाळची प्रसन्न वेळ (प्रभात)',
          sublabel:
            language === 'en'
              ? 'A fresh, peaceful dawn. Time for morning tea & prayer.'
              : language === 'hi'
              ? 'सुबह की ताजी और शांत बेला। चाय पीने और ईश्वर वंदना का समय।'
              : 'प्रसन्न आणि शांत पहाट. चहा आणि प्रार्थनेची सुखद वेळ.',
          icon: <Sunrise className="w-12 h-12 text-amber-500" />,
          color: 'from-amber-50/80 to-emerald-50/80 border-amber-200',
        });
      } else if (hour >= 12 && hour < 17) {
        setTimePeriod({
          label:
            language === 'en'
              ? 'Bright Afternoon'
              : language === 'hi'
              ? 'दोपहर का समय (मध्याह्न)'
              : 'दुपारची शांत वेळ',
          sublabel:
            language === 'en'
              ? 'Sun is high and bright. Time for light lunch and restful afternoon relaxation.'
              : language === 'hi'
              ? 'धूप खिली हुई है। हल्के भोजन और आराम का समय।'
              : 'सूर्य डोक्यावर आहे. हलके जेवण आणि विश्रांतीची वेळ.',
          icon: <Sun className="w-12 h-12 text-amber-600" />,
          color: 'from-amber-50 to-orange-50 border-amber-300',
        });
      } else if (hour >= 17 && hour < 20) {
        setTimePeriod({
          label:
            language === 'en'
              ? 'Twilight & Evening'
              : language === 'hi'
              ? 'संध्याकाल (गोधूलि)'
              : 'संध्याकाळची वेळ (सांजवेळ)',
          sublabel:
            language === 'en'
              ? 'Sunset hours. Light the peaceful lamp, drink evening tea and rest.'
              : language === 'hi'
              ? 'शाम ढल चुकी है। दिया बत्ती जलाने, चाय पीने और विश्राम का समय।'
              : 'सूर्यास्त झाला आहे. देवघरात दिवा लावण्याची आणि शांत बसण्याची वेळ.',
          icon: <Sunset className="w-12 h-12 text-rose-500" />,
          color: 'from-orange-50 to-rose-50 border-rose-200',
        });
      } else {
        setTimePeriod({
          label:
            language === 'en'
              ? 'Quiet Night'
              : language === 'hi'
              ? 'रात्रि काल'
              : 'रात्र (शांत झोप)',
          sublabel:
            language === 'en'
              ? 'The stars are shining quietly. Time for deep, peaceful sleep.'
              : language === 'hi'
              ? 'आकाश में तारे चमक रहे हैं। शांत और गहरी नींद का समय।'
              : 'आकाशात तारे चमकत आहेत. शांत आणि सुखद झोपेची वेळ.',
          icon: <Moon className="w-12 h-12 text-indigo-500" />,
          color: 'from-indigo-50 to-slate-100 border-indigo-200',
        });
      }
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 10000);
    return () => clearInterval(interval);
  }, [language]);

  const handleToggleMed = (id: string) => {
    soundManager.playSoftTap();
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = !m.takenToday;
          if (updated) soundManager.playSuccessChime();
          return { ...m, takenToday: updated };
        }
        return m;
      })
    );
  };

  const readOrientationAloud = () => {
    const locPlace =
      language === 'hi' ? 'घर' : language === 'mr' ? 'घरी' : 'home';
    const text = REGIONAL_AUDIO_PROMPTS[language].orientationSpeech(
      currentDateStr,
      currentTime,
      timePeriod.label,
      locPlace
    );
    SpeechNarrator.speak(text, language);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6 bg-white p-4 rounded-2xl border border-[#0f382c]/10 shadow-sm">
        <button
          onClick={onBack}
          className="text-base font-semibold text-[#0f382c] hover:text-[#2d6a4f] cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eef7f2]"
        >
          ← {strings.backToHome}
        </button>

        <div className="text-center">
          <h3 className="text-lg font-bold text-[#0f382c]">
            {strings.orientationTitle}
          </h3>
          <p className="text-xs text-[#1a2e26]/70">
            {strings.orientationSubtitle}
          </p>
        </div>

        <button
          onClick={readOrientationAloud}
          className="flex items-center gap-1.5 bg-[#2d6a4f] hover:bg-[#1f4e39] text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer transition-colors"
          title={strings.speakAloud}
        >
          <Volume2 className="w-4 h-4" />
          <span className="hidden sm:inline">{strings.speakAloud}</span>
        </button>
      </div>

      {/* Main Reality Orientation Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-10 border-2 bg-gradient-to-br ${timePeriod.color} shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-6`}
      >
        <div className="flex items-center gap-6">
          <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-black/5 shrink-0">
            {timePeriod.icon}
          </div>

          <div>
            <div className="inline-block text-xs font-bold text-[#2d6a4f] bg-white/80 px-3 py-1 rounded-md mb-2 shadow-2xs">
              {strings.timeOfDayStatus}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f382c]">
              {timePeriod.label}
            </h2>
            <p className="text-sm sm:text-base text-[#1a2e26]/80 mt-1 max-w-md font-medium">
              {timePeriod.sublabel}
            </p>
          </div>
        </div>

        {/* Large Time & Date Display */}
        <div className="text-center md:text-right bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-black/5 shadow-xs w-full md:w-auto">
          <div className="text-3xl sm:text-4xl font-black text-[#0f382c] tracking-tight tabular-nums">
            {currentTime}
          </div>
          <div className="text-sm sm:text-base font-bold text-[#2d6a4f] mt-1">
            {currentDateStr}
          </div>
          <div className="text-xs text-[#1a2e26]/70 mt-1 font-medium">
            ✓ {strings.safeAtHome}
          </div>
        </div>
      </div>

      {/* Daily Routine & Medicine Schedule */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0f382c]/10 shadow-md">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#0f382c] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2d6a4f]" />
              <span>{strings.todayRoutineTitle}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#1a2e26]/70 mt-0.5">
              {strings.tapToMark}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#2d6a4f]">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span>
              {medications.filter((m) => m.takenToday).length} / {medications.length} {strings.completedBadge}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {medications.map((med) => {
            const medLoc = (med as any).translations?.[language] || {
              name: med.name,
              dose: med.dose,
              instructions: med.instructions,
              timeSlotLabel: med.timeSlot,
            };

            return (
              <button
                key={med.id}
                onClick={() => handleToggleMed(med.id)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  med.takenToday
                    ? 'bg-[#eef7f2] border-[#2d6a4f]/50 opacity-90'
                    : 'bg-[#fbf9f5] border-[#0f382c]/15 hover:border-[#2d6a4f]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl p-2.5 rounded-xl bg-white shadow-2xs">
                    {med.elderIcon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#2d6a4f] bg-white px-2 py-0.5 rounded-md border border-[#2d6a4f]/20">
                        {medLoc.timeSlotLabel} · {med.timeLabel}
                      </span>
                      {med.takenToday && (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          ✓ {strings.completedBadge}
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-base sm:text-lg font-bold mt-1 ${
                        med.takenToday ? 'text-[#0f382c] line-through' : 'text-[#0f382c]'
                      }`}
                    >
                      {medLoc.name}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#1a2e26]/70 mt-0.5">
                      {medLoc.dose} · {medLoc.instructions}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {med.takenToday ? (
                    <CheckCircle2 className="w-7 h-7 text-[#2d6a4f]" />
                  ) : (
                    <Circle className="w-7 h-7 text-slate-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
