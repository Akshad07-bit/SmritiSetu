/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ReminiscenceMessage, SupportedLanguage } from '../../types';
import { UI_STRINGS } from '../../data/culturalData';
import { SpeechNarrator } from '../../utils/speech';
import { Send, Volume2, Sparkles, Heart, Mic } from 'lucide-react';

interface ReminiscenceChatProps {
  language: SupportedLanguage;
  voiceEnabled: boolean;
  onBack: () => void;
}

const REGIONAL_CHAT_PROMPTS: Record<SupportedLanguage, string[]> = {
  en: [
    'Tell me about making festive sweets during harvest celebrations 🫓',
    'How did the morning mist feel in the green garden hills? 🍃',
    'What songs did your mother sing during peaceful rains? 🌧️',
    'I feel a little tired and confused right now... ❤️',
  ],
  hi: [
    'त्योहारों में पारंपरिक मीठे व्यंजन बनाने की बात बताइए 🫓',
    'पहाड़ों और बगीचों की सुबह की ताजी हवा कैसी लगती थी? 🍃',
    'बारिश के सुहावने दिनों में माँ कौन से मधुर गीत गाती थीं? 🌧️',
    'मुझे थोड़ा थकावट और घबराहट महसूस हो रही है... ❤️',
  ],
  mr: [
    'सण-उत्सवाच्या वेळी गोडधोड पदार्थ बनवण्याच्या जुन्या आठवणी सांगा 🫓',
    'सकाळच्या वेळी बागेतील आणि टेकड्यांवरील गार वारा कसा वाटायचा? 🍃',
    'पावसाच्या दिवसांत आई अंगाई किंवा कोणती गोड गाणी गायची? 🌧️',
    'मला सध्या थोडा थकवा आणि अस्वस्थता जाणवत आहे... ❤️',
  ],
};

const REGIONAL_WELCOME_MESSAGES: Record<SupportedLanguage, string> = {
  en: 'Pranam! I am Sathi, your caring memory companion. The morning is quiet and peaceful. What fond memory from your childhood or youth shall we cherish today?',
  hi: 'प्रणाम! मैं आपका स्नेही साथी हूँ। सुबह का वातावरण बहुत शांत और सुखद है। बचपन या पुराने दिनों की कौन सी सुंदर याद आज ताजा करना चाहेंगे?',
  mr: 'नमस्कार! मी आपला प्रेमळ सोबती आहे. आजची सकाळ अतिशय शांत आणि प्रसन्न आहे. लहानपणीची किंवा जुन्या दिवसांतील कोणती गोड आठवण आज आपल्याला आठवायची आहे?',
};

export const ReminiscenceChat: React.FC<ReminiscenceChatProps> = ({
  language,
  voiceEnabled,
  onBack,
}) => {
  const strings = UI_STRINGS[language];
  const quickPrompts = REGIONAL_CHAT_PROMPTS[language] || REGIONAL_CHAT_PROMPTS.en;

  const [messages, setMessages] = useState<ReminiscenceMessage[]>([
    {
      id: 'msg-0',
      sender: 'companion',
      text: REGIONAL_WELCOME_MESSAGES[language] || REGIONAL_WELCOME_MESSAGES.en,
      timestamp: 'Just now',
      sentiment: 'peaceful',
      topic: 'Welcome',
    },
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // When language changes, update the initial welcome message if no user messages sent yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'companion') {
        return [
          {
            ...prev[0],
            text: REGIONAL_WELCOME_MESSAGES[language] || REGIONAL_WELCOME_MESSAGES.en,
          },
        ];
      }
      return prev;
    });
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ReminiscenceMessage = {
      id: `user-${Date.now()}`,
      sender: 'elder',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.sender === 'elder' ? 'user' : 'assistant',
        text: m.text,
      }));

      const res = await fetch('/api/gemini/reminiscence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload,
          elderName: language === 'mr' ? 'आजी / आजोबा' : language === 'hi' ? 'दादी जी / बाबा जी' : 'Elder Friend',
          language: language === 'mr' ? 'Marathi' : language === 'hi' ? 'Hindi' : 'English',
          region: 'India',
        }),
      });

      const data = await res.json();

      const defaultCompanionText =
        language === 'en'
          ? 'It is so comforting to hear you speak. Take your time, dear friend.'
          : language === 'hi'
          ? 'आपकी बात सुनकर मन को बहुत शांति मिली। आराम से अपनी बात कहें, मैं सुन रहा हूँ।'
          : 'आपले बोलणे ऐकून मनाला खूप समाधान वाटले. अगदी शांतपणे सांगा, मी ऐकत आहे.';

      const companionMsg: ReminiscenceMessage = {
        id: `comp-${Date.now()}`,
        sender: 'companion',
        text: data.text || defaultCompanionText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sentiment: data.sentiment || 'peaceful',
        topic: data.topic || 'Familiar Memories',
      };

      setMessages((prev) => [...prev, companionMsg]);

      if (voiceEnabled) {
        SpeechNarrator.speak(companionMsg.text, language);
      }
    } catch (err) {
      console.error('Error fetching reminiscence response:', err);
      const fallbackMsg: ReminiscenceMessage = {
        id: `comp-${Date.now()}`,
        sender: 'companion',
        text:
          language === 'en'
            ? 'The beauty of our land and family memories stays in the heart forever. Remember the sweet smell of morning tea and the rain on the veranda? Tell me more, dear friend.'
            : language === 'hi'
            ? 'प्रकृति की सुंदरता और परिवार की पुरानी यादें हमेशा दिल में महकती रहती हैं। सुबह की चाय की खुशबू और बारिश की बूंदें याद हैं? मुझे और बताइए।'
            : 'निसर्गाचे सौंदर्य आणि कुटुंबाच्या जुन्या आठवणी कायम मनात जपलेल्या असतात. सकाळी वाफाळलेला चहा आणि छतावर पडणारा पाऊस आठवतो का? मला अजून सांगा.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sentiment: 'nostalgic',
        topic: 'Peaceful Memories',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      if (voiceEnabled) {
        SpeechNarrator.speak(fallbackMsg.text, language);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Browser Speech-to-Text for Elders who prefer speaking over typing
  const handleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice(
        language === 'en'
          ? 'Voice input is not supported in this browser. Please tap the quick buttons below.'
          : language === 'hi'
          ? 'इस ब्राउज़र में आवाज पहचान उपलब्ध नहीं है। कृपया नीचे दिए गए बटनों को छुएं।'
          : 'या ब्राउझरमध्ये आवाज ओळख उपलब्ध नाही. कृपया खालील बटणांवर स्पर्श करा.'
      );
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang =
        language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListeningVoice(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal(transcript);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListeningVoice(false);
      };

      recognition.onend = () => {
        setIsListeningVoice(false);
      };

      recognition.start();
    } catch {
      setIsListeningVoice(false);
    }
  };

  const readMessageAloud = (text: string) => {
    SpeechNarrator.speak(text, language);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-6 bg-white p-4 rounded-2xl border border-[#0f382c]/10 shadow-sm">
        <button
          onClick={onBack}
          className="text-base font-semibold text-[#0f382c] hover:text-[#2d6a4f] cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eef7f2]"
        >
          ← {strings.backToHome}
        </button>

        <div className="text-center">
          <h3 className="text-lg font-bold text-[#0f382c]">
            {strings.sathiTitle}
          </h3>
          <p className="text-xs text-[#1a2e26]/70">
            {strings.sathiSubtitle}
          </p>
        </div>

        <div className="w-24 text-right">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
            <Heart className="w-3 h-3 fill-current" />
            <span>{strings.calmAndSafeBadge}</span>
          </span>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-3xl border border-[#0f382c]/10 shadow-md flex flex-col h-[580px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#fbf9f5]/50">
          {messages.map((m) => {
            const isElder = m.sender === 'elder';

            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isElder ? 'justify-end' : 'justify-start'}`}
              >
                {!isElder && (
                  <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 shadow-2xs text-lg">
                    👵
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5 shadow-xs relative group ${
                    isElder
                      ? 'bg-[#2d6a4f] text-white rounded-br-xs'
                      : 'bg-white text-[#1a2e26] border border-[#0f382c]/10 rounded-bl-xs'
                  }`}
                >
                  <p className="text-base sm:text-lg leading-relaxed font-medium">
                    {m.text}
                  </p>

                  <div
                    className={`mt-2 flex items-center justify-between gap-4 text-xs ${
                      isElder ? 'text-white/70' : 'text-[#1a2e26]/60'
                    }`}
                  >
                    <span>{m.timestamp}</span>

                    <button
                      onClick={() => readMessageAloud(m.text)}
                      className={`p-1 rounded-md cursor-pointer transition-colors ${
                        isElder
                          ? 'hover:bg-white/20 text-white'
                          : 'hover:bg-[#eef7f2] text-[#2d6a4f]'
                      }`}
                      title={strings.speakAloud}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isElder && (
                  <div className="w-10 h-10 rounded-full bg-[#0f382c] text-white flex items-center justify-center shrink-0 shadow-2xs font-bold text-sm">
                    👤
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 text-sm text-[#2d6a4f] bg-[#eef7f2] p-4 rounded-2xl max-w-sm border border-[#2d6a4f]/20 animate-pulse">
              <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
              <span>{strings.sathiListening}</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Prompts Row */}
        <div className="p-3 bg-white border-t border-[#0f382c]/10 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1a2e26]/60 shrink-0 pl-1">
              {strings.memoriesToCherish}
            </span>
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                className="text-xs sm:text-sm font-medium bg-[#eef7f2] hover:bg-[#d8ece1] text-[#0f382c] px-3.5 py-1.5 rounded-full border border-[#2d6a4f]/20 cursor-pointer whitespace-nowrap transition-colors shrink-0"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {voiceNotice && (
          <div className="px-4 py-2 bg-amber-50 text-amber-900 text-xs font-medium border-t border-amber-200">
            {voiceNotice}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#0f382c]/10 flex items-center gap-2">
          {/* Voice Mic Button */}
          <button
            onClick={handleVoiceInput}
            title={strings.speakMemoryTooltip}
            className={`p-3 rounded-2xl cursor-pointer transition-colors border ${
              isListeningVoice
                ? 'bg-rose-600 text-white animate-pulse border-rose-600'
                : 'bg-[#eef7f2] hover:bg-[#d8ece1] text-[#2d6a4f] border-[#2d6a4f]/30'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage(inputVal);
            }}
            placeholder={strings.chatPlaceholder}
            className="flex-1 bg-[#fbf9f5] border border-[#0f382c]/20 rounded-2xl px-4 py-3 text-base text-[#1a2e26] focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
          />

          <button
            onClick={() => handleSendMessage(inputVal)}
            disabled={!inputVal.trim() || isLoading}
            title={strings.sendMemoryTooltip}
            className="p-3 bg-[#2d6a4f] hover:bg-[#1f4e39] disabled:opacity-50 text-white rounded-2xl cursor-pointer transition-colors shadow-xs"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
