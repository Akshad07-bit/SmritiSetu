/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameSessionResult, SupportedLanguage } from '../../../types';
import { UI_STRINGS } from '../../../data/culturalData';
import { soundManager } from '../../../utils/audio';
import { SpeechNarrator } from '../../../utils/speech';
import { Award, RotateCcw, CheckCircle2, HelpCircle, Sparkles, Volume2 } from 'lucide-react';

interface FolkWisdomQuizProps {
  language: SupportedLanguage;
  voiceEnabled: boolean;
  onFinishSession: (result: GameSessionResult) => void;
  onBack: () => void;
}

interface LocalizedFolkQuestion {
  question: string;
  options: string[];
  hint: string;
  folkloreTrivia: string;
  correctSpeech: string;
  incorrectSpeech: string;
}

interface FolkQuestion {
  id: string;
  correctIdx: number;
  translations: Record<SupportedLanguage, LocalizedFolkQuestion>;
}

const FOLK_QUESTIONS: FolkQuestion[] = [
  {
    id: 'folk-1',
    correctIdx: 0,
    translations: {
      en: {
        question: 'Which wild orchid with purple-pink blooms heralds the arrival of springtime festivals?',
        options: ['Kopou Phool (Foxtail Orchid)', 'Wild Rose', 'Golden Marigold', 'Lotus Blossom'],
        hint: 'Young dancers weave it lovingly into their hair buns during springtime harvest dances.',
        folkloreTrivia: 'The Kopou Phool (Foxtail Orchid) is deeply cherished as the sacred blossoming crown of spring.',
        correctSpeech: 'Splendid! Kopou Phool is correct. A delightful springtime memory.',
        incorrectSpeech: 'The answer was Kopou Phool (Foxtail Orchid). How wonderful to recall this together.',
      },
      hi: {
        question: 'वसंत ऋतु के आगमन पर खिलने वाला वह कौन-सा सुंदर जंगली आर्किड फूल है जिसे बालों में सजाया जाता है?',
        options: ['कपौ फूल (फॉक्सटेल आर्किड)', 'गुलाब का फूल', 'गेंदे का फूल', 'कमल का फूल'],
        hint: 'वसंत के उत्सवों में नृत्यांगनाएं इसे अपने जूड़े में बड़े प्यार से सजाती हैं।',
        folkloreTrivia: 'कपौ फूल (फॉक्सटेल आर्किड) को वसंत के आगमन का सबसे पवित्र और सुंदर प्रतीक माना जाता है।',
        correctSpeech: 'अति सुंदर! कपौ फूल बिल्कुल सही उत्तर है। आपकी याददाश्त बहुत अच्छी है।',
        incorrectSpeech: 'सही उत्तर कपौ फूल (फॉक्सटेल आर्किड) था। इसे याद करके बहुत अच्छा लगा।',
      },
      mr: {
        question: 'वसंत ऋतूच्या आगमनाचे स्वागत करणारे आणि केसांच्या अंबाड्यात माळले जाणारे जांभळट-गुलाबी रानफूल कोणते?',
        options: ['कपौ फूल (फॉक्सटेल ऑर्किड)', 'गुलाबाचे फूल', 'झेंडूचे फूल', 'कमळाचे फूल'],
        hint: 'सण-उत्सवाच्या वेळी नृत्यांगना हे सुगंधी फूल आपल्या अंबाड्यात आवडीने माळतात.',
        folkloreTrivia: 'कपौ फूल (फॉक्सटेल ऑर्किड) हे वसंत ऋतूच्या नव्या पालवीचे आणि निसर्गाच्या मांगल्याचे प्रतीक मानले जाते.',
        correctSpeech: 'खूप छान! कपौ फूल अगदी बरोबर उत्तर आहे. आपली ही जुनी आठवण अतिशय सुंदर आहे.',
        incorrectSpeech: 'योग्य उत्तर कपौ फूल (फॉक्सटेल ऑर्किड) हे होते. ही आठवण फार सुखद आहे.',
      },
    },
  },
  {
    id: 'folk-2',
    correctIdx: 0,
    translations: {
      en: {
        question: 'Which sacred freshwater river island is world-renowned for traditional theater masks and peaceful monasteries?',
        options: ['Majuli River Island', 'Umananda Island', 'Dibru Island', 'Hajo Monastery'],
        hint: 'It is one of the largest inhabited river islands in the world.',
        folkloreTrivia: 'Majuli is the cradle of Neo-Vaishnavite culture, renowned for handcrafted Mukha bamboo masks and riverside prayer chants.',
        correctSpeech: 'Wonderful! Majuli River Island is correct. A blessed cultural treasure.',
        incorrectSpeech: 'The answer was Majuli River Island. A peaceful riverside heritage.',
      },
      hi: {
        question: 'नदी के बीच स्थित वह कौन-सा प्रसिद्ध द्वीप है जो पारंपरिक मिट्टी-बांस के मुखौटों और शांत भजन मठों के लिए जाना जाता है?',
        options: ['माजुली नदी द्वीप', 'उमानंद द्वीप', 'डिब्रू द्वीप', 'हाजो मठ'],
        hint: 'यह दुनिया का सबसे बड़ा शांत नदी द्वीप माना जाता है।',
        folkloreTrivia: 'माजुली द्वीप अपने पारंपरिक बांस व चिकनी मिट्टी के मुखौटों और शांत कृष्ण भजन परंपरा के लिए विश्व प्रसिद्ध है।',
        correctSpeech: 'बहुत बढ़िया! माजुली नदी द्वीप बिल्कुल सही उत्तर है। आपको पारंपरिक धरोहरों की अच्छी जानकारी है।',
        incorrectSpeech: 'सही उत्तर माजुली नदी द्वीप था। यह संस्कृति का एक पवित्र केंद्र है।',
      },
      mr: {
        question: 'नदीच्या मध्यभागी असलेले कोणते प्रसिद्ध बेट पारंपरिक मुखवटे आणि शांत अध्यात्मिक वातावरणासाठी ओळखले जाते?',
        options: ['माजुली नदीचे बेट', 'उमानंद बेट', 'डिब्रू बेट', 'हाजो देवालय'],
        hint: 'हे जगातील सर्वात मोठ्या नदी बेटांपैकी एक मानले जाते.',
        folkloreTrivia: 'माजुली बेट हे बांबू आणि मातीच्या वैशिष्ट्यपूर्ण मुखवट्यांसाठी आणि शांत अध्यात्मिक वातावरणासाठी जगभर प्रसिद्ध आहे.',
        correctSpeech: 'फार छान! माजुली बेट अगदी बरोबर उत्तर आहे. जुन्या संस्कृतीची ही आठवण फार सुखद आहे.',
        incorrectSpeech: 'योग्य उत्तर माजुली बेट हे होते. नदीकाठची ही संस्कृती अत्यंत पवित्र आहे.',
      },
    },
  },
  {
    id: 'folk-3',
    correctIdx: 0,
    translations: {
      en: {
        question: 'What is the tranquil freshwater lake known for natural circular floating green islands (Phumdis)?',
        options: ['Loktak Lake', 'Dal Lake', 'Chilika Lake', 'Ward Lake'],
        hint: 'Home to the rare and graceful dancing Sangai deer.',
        folkloreTrivia: 'Loktak Lake is famous for its floating circular islands of green vegetation where fishermen drift serenely on clear water.',
        correctSpeech: 'Splendid! Loktak Lake is correct. A tranquil natural wonder.',
        incorrectSpeech: 'The correct answer was Loktak Lake, famous for its floating islands.',
      },
      hi: {
        question: 'शांत नीले पानी पर तैरते हुए हरे-भरे गोल द्वीपों (फुमदी) के लिए कौन-सी प्रसिद्ध झील जानी जाती है?',
        options: ['लोकटक झील', 'डल झील', 'चिल्का झील', 'वार्ड्स झील'],
        hint: 'यह दुर्लभ और सुंदर नाचने वाले हिरण (संगाई) का प्राकृतिक घर है।',
        folkloreTrivia: 'लोकटक झील अपने तैरते हुए प्राकृतिक द्वीपों के लिए जानी जाती है, जहाँ मछुआरे पानी के साथ सामंजस्य में रहते हैं।',
        correctSpeech: 'बिल्कुल सही! लोकटक झील सही उत्तर है। यह प्रकृति का एक अद्भुत चमत्कार है।',
        incorrectSpeech: 'सही उत्तर लोकटक झील था। पानी पर तैरते द्वीप बहुत सुंदर होते हैं।',
      },
      mr: {
        question: 'शांत निळ्या पाण्यावर तरंगणाऱ्या हिरव्यागार बेटांसाठी (फुमदी) कोणती प्रसिद्ध गोड्या पाण्याची झील ओळखली जाते?',
        options: ['लोकटक तलाव', 'दाल सरोवर', 'चिल्का सरोवर', 'वार्ड्स तलाव'],
        hint: 'हे दुर्मिळ अशा संगाई हरणाचे (नाचणारे हरण) सुंदर घर मानले जाते.',
        folkloreTrivia: 'लोकटक तलाव हा पाण्यावर तरंगणाऱ्या हिरव्यागार निसर्ग बेटांसाठी आणि शांत होड्यांसाठी ओळखला जातो.',
        correctSpeech: 'अगदी अचूक! लोकटक तलाव हे योग्य उत्तर आहे. मनाला शांती देणारा हा सुंदर निसर्ग आहे.',
        incorrectSpeech: 'योग्य उत्तर लोकटक तलाव हे होते. पाण्यावर तरंगणारी बेटे खरोखर विलोभनीय आहेत.',
      },
    },
  },
  {
    id: 'folk-4',
    correctIdx: 0,
    translations: {
      en: {
        question: 'Which hill state unites its tribal communities in a grand cultural celebration named after the revered Hornbill bird?',
        options: ['Nagaland', 'Goa', 'Punjab', 'Kerala'],
        hint: 'Celebrated in early December with folk songs, log drums, and colorful woven shawls.',
        folkloreTrivia: 'The Hornbill Festival unites tribes in vibrant traditional songs, log drum beats, and dances around the winter hearth.',
        correctSpeech: 'Hearty congratulations! Nagaland is correct. Such rich folk traditions.',
        incorrectSpeech: 'The answer was Nagaland, home of the great Hornbill celebration.',
      },
      hi: {
        question: 'हॉर्नबिल पक्षी के नाम पर कौन-सा पहाड़ी राज्य अपने पारंपरिक लोक नृत्यों और ढोल की थाप का भव्य उत्सव मनाता है?',
        options: ['नागालैंड', 'गोवा', 'पंजाब', 'केरल'],
        hint: 'दिसंबर की शुरुआत में यह उत्सव सुंदर गर्म शॉलों, पारंपरिक गीतों और अलाव के साथ मनाया जाता है।',
        folkloreTrivia: 'हॉर्नबिल उत्सव सभी जनजातियों के पारंपरिक गीतों, लोक नृत्यों और गर्म कपड़ों की सुंदर संस्कृति को जोड़ता है।',
        correctSpeech: 'बहुत खूब! नागालैंड बिल्कुल सही उत्तर है। हमारी लोक कथाएं और उत्सव सचमुच अनमोल हैं।',
        incorrectSpeech: 'सही उत्तर नागालैंड था। यह लोक परंपराओं और गीतों से भरा सुंदर उत्सव है।',
      },
      mr: {
        question: 'हॉर्नबिल पक्षाच्या नावावरून कोणता डोंगराळ भाग आपल्या पारंपरिक लोकगीतांचा आणि वाद्यांचा मोठा उत्सव साजरा करतो?',
        options: ['नागालँड', 'गोवा', 'पंजाब', 'केरळ'],
        hint: 'डिसेंबरच्या सुरुवातीला पारंपरिक उबदार शाली, लोकनृत्य आणि शेकोटीभोवती हा सण साजरा केला जातो.',
        folkloreTrivia: 'हॉर्नबिल महोत्सव हा समृद्ध लोकपरंपरा, ढोलकाचा गजर आणि विविध जनजातींच्या एकतेचा सुंदर सण आहे.',
        correctSpeech: 'सुरेख! नागालँड हे अगदी बरोबर उत्तर आहे. आपली संस्कृती आणि लोकपरंपरा खरोखर अमूल्य आहे.',
        incorrectSpeech: 'योग्य उत्तर नागालँड हे होते. पारंपरिक संस्कृतीचा हा एक अतिशय देखणा सोहळा आहे.',
      },
    },
  },
];

export const FolkWisdomQuiz: React.FC<FolkWisdomQuizProps> = ({
  language,
  voiceEnabled,
  onFinishSession,
  onBack,
}) => {
  const strings = UI_STRINGS[language];
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());

  const currentQ = FOLK_QUESTIONS[currentIdx];
  const qLoc = currentQ.translations[language] || currentQ.translations.en;

  const handleSelectOption = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);

    const isCorrect = idx === currentQ.correctIdx;
    if (isCorrect) {
      soundManager.playSuccessChime();
      setScore((prev) => prev + 1);
      if (voiceEnabled) {
        SpeechNarrator.speak(qLoc.correctSpeech, language);
      }
    } else {
      soundManager.playSoftTap();
      if (voiceEnabled) {
        SpeechNarrator.speak(qLoc.incorrectSpeech, language);
      }
    }
  };

  const handleNext = () => {
    setSelectedIdx(null);
    setShowHint(false);
    if (currentIdx + 1 < FOLK_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      handleCompleteQuiz();
    }
  };

  const handleCompleteQuiz = () => {
    setIsCompleted(true);
    const duration = Math.round((Date.now() - startTime) / 1000);
    const accuracy = Math.round(
      ((score + (selectedIdx === currentQ.correctIdx ? 1 : 0)) / FOLK_QUESTIONS.length) * 100
    );

    const result: GameSessionResult = {
      id: `session-${Date.now()}`,
      gameId: 'folk-wisdom',
      gameName: 'Folk Tale & Word Wisdom',
      score: score + (selectedIdx === currentQ.correctIdx ? 1 : 0),
      totalQuestionsOrPairs: FOLK_QUESTIONS.length,
      accuracyPercent: accuracy,
      durationSeconds: duration,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      cognitiveDomain: 'Semantic Memory',
    };

    onFinishSession(result);
  };

  const readQuestionAloud = () => {
    SpeechNarrator.speak(qLoc.question, language);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setShowHint(false);
    setScore(0);
    setIsCompleted(false);
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
          {strings.heritageWisdomTitle} · {currentIdx + 1} / {FOLK_QUESTIONS.length}
        </span>

        <span className="text-sm font-semibold text-[#2d6a4f] bg-[#eef7f2] px-3 py-1 rounded-lg">
          {strings.correctLabel} {score}/{FOLK_QUESTIONS.length}
        </span>
      </div>

      {!isCompleted ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0f382c]/10 shadow-md space-y-6">
          {/* Question Card */}
          <div className="bg-[#eef7f2] rounded-2xl p-6 border border-[#2d6a4f]/20">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2d6a4f] bg-white px-2.5 py-1 rounded-md border border-[#2d6a4f]/20">
                  {strings.semanticMemoryAnchor}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0f382c] mt-3 leading-snug">
                  {qLoc.question}
                </h3>
              </div>

              <button
                onClick={readQuestionAloud}
                className="p-2.5 bg-white text-[#2d6a4f] hover:bg-[#2d6a4f] hover:text-white rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                title={strings.readQuestionTooltip}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Hint Box */}
            <div className="mt-4 pt-3 border-t border-[#2d6a4f]/15">
              {!showHint ? (
                <button
                  onClick={() => {
                    setShowHint(true);
                    if (voiceEnabled) {
                      SpeechNarrator.speak(qLoc.hint, language);
                    }
                  }}
                  className="text-xs font-semibold text-[#2d6a4f] hover:text-[#0f382c] cursor-pointer inline-flex items-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{strings.needHintPrompt}</span>
                </button>
              ) : (
                <div className="text-sm text-[#0f382c] font-medium bg-white/70 p-3 rounded-xl border border-[#2d6a4f]/20 animate-fadeIn">
                  💡 <strong>{strings.hintPrefix}</strong> {qLoc.hint}
                </div>
              )}
            </div>
          </div>

          {/* 4 Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {qLoc.options.map((opt, idx) => {
              const isSelected = selectedIdx === idx;
              const isCorrect = idx === currentQ.correctIdx;

              let btnStyle =
                'bg-[#fbf9f5] border-[#0f382c]/15 text-[#1a2e26] hover:bg-[#eef7f2] hover:border-[#2d6a4f]';

              if (selectedIdx !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-[#eef7f2] border-[#2d6a4f] text-[#0f382c] ring-2 ring-[#2d6a4f]/30';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-50 border-rose-300 text-rose-800';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedIdx !== null}
                  className={`p-4 rounded-2xl border-2 font-bold text-left transition-all cursor-pointer flex items-center justify-between gap-3 text-base sm:text-lg ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {selectedIdx !== null && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-[#2d6a4f] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Folklore Trivia Narrative Box on Answer */}
          {selectedIdx !== null && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-[#1a2e26] animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>{strings.folkloreRemembrance}</span>
              </div>
              <p className="text-sm sm:text-base leading-relaxed">
                {qLoc.folkloreTrivia}
              </p>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleNext}
                  className="bg-[#2d6a4f] hover:bg-[#1f4e39] text-white px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer shadow-sm transition-transform active:scale-95"
                >
                  {currentIdx + 1 < FOLK_QUESTIONS.length
                    ? strings.nextQuestionBtn
                    : strings.seeResultsBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl p-6 sm:p-10 text-center border border-[#0f382c]/10 shadow-lg animate-fadeIn max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-[#eef7f2] text-[#2d6a4f] flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-[#2d6a4f]" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#0f382c]">
            {strings.wellDone}
          </h3>
          <p className="text-base text-[#1a2e26]/80 mt-2 max-w-md mx-auto">
            {strings.folkVictorySub}
          </p>

          <div className="my-6 p-4 rounded-2xl bg-[#eef7f2] border border-[#2d6a4f]/20 flex items-center justify-around text-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1a2e26]/60">
                {strings.semanticRecallDomain}
              </span>
              <p className="text-2xl font-bold text-[#0f382c]">{score} / {FOLK_QUESTIONS.length}</p>
            </div>
            <div className="w-px h-10 bg-[#2d6a4f]/20" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1a2e26]/60">
                {strings.auditoryAccuracyLabel}
              </span>
              <p className="text-2xl font-bold text-[#2d6a4f]">
                {Math.round((score / FOLK_QUESTIONS.length) * 100)}%
              </p>
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
