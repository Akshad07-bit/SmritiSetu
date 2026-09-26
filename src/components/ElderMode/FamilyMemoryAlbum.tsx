/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FamilyMemoryItem, SupportedLanguage } from '../../types';
import { INITIAL_FAMILY_MEMORIES } from '../../data/mockCaregiverData';
import { REGIONAL_AUDIO_PROMPTS, UI_STRINGS } from '../../data/culturalData';
import { SpeechNarrator } from '../../utils/speech';
import { Heart, Volume2, Sparkles, Plus, Image as ImageIcon, MapPin, Calendar } from 'lucide-react';

interface FamilyMemoryAlbumProps {
  language: SupportedLanguage;
  voiceEnabled: boolean;
  onBack: () => void;
}

export const FamilyMemoryAlbum: React.FC<FamilyMemoryAlbumProps> = ({
  language,
  voiceEnabled,
  onBack,
}) => {
  const strings = UI_STRINGS[language];
  const [memories, setMemories] = useState<FamilyMemoryItem[]>(INITIAL_FAMILY_MEMORIES);
  const [activeMemory, setActiveMemory] = useState<FamilyMemoryItem>(INITIAL_FAMILY_MEMORIES[0]);
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Memory Form State
  const [newTitle, setNewTitle] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newPerson, setNewPerson] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const getLoc = (memory: FamilyMemoryItem) => {
    return (
      memory.translations?.[language] || {
        title: memory.title,
        relation: memory.relation,
        location: memory.location,
        description: memory.description,
        audioPromptHint: memory.audioPromptHint,
        aiStory: memory.aiStory,
      }
    );
  };

  const playMemoryNarration = (memory: FamilyMemoryItem) => {
    const loc = getLoc(memory);
    const intro = REGIONAL_AUDIO_PROMPTS[language].familyIntro(
      loc.title,
      loc.relation,
      memory.personName,
      loc.description
    );
    const fullText = loc.aiStory ? `${intro} ${loc.aiStory}` : intro;
    SpeechNarrator.speak(fullText, language);
  };

  const handleGenerateAIStory = async (memory: FamilyMemoryItem) => {
    setIsGeneratingStory(true);
    const loc = getLoc(memory);
    try {
      const res = await fetch('/api/gemini/memory-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoTitle: loc.title,
          photoContext: loc.description,
          familyNames: [memory.personName, loc.relation],
          elderName: language === 'mr' ? 'आजी' : language === 'hi' ? 'दादी जी' : 'Elder Friend',
          language: language === 'mr' ? 'Marathi' : language === 'hi' ? 'Hindi' : 'English',
        }),
      });
      const data = await res.json();
      if (data.story) {
        const updatedTranslations = {
          ...(memory.translations || ({} as any)),
          [language]: {
            ...loc,
            aiStory: data.story,
          },
        };
        const updated = {
          ...memory,
          aiStory: data.story,
          translations: updatedTranslations,
        };
        setMemories((prev) => prev.map((m) => (m.id === memory.id ? updated : m)));
        setActiveMemory(updated);

        if (voiceEnabled) {
          SpeechNarrator.speak(data.story, language);
        }
      }
    } catch (e) {
      console.error('Error generating AI story:', e);
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: FamilyMemoryItem = {
      id: `mem-${Date.now()}`,
      title: newTitle,
      relation: newRelation || 'Beloved Family',
      personName: newPerson || 'Family Member',
      location: 'Home Residence',
      yearApprox: 'Family Archive',
      description: newDesc || 'A happy and loving family memory preserved in your heart.',
      audioPromptHint: 'They send you their warmest love and blessings today.',
      imageSrc: '/src/assets/images/ne_cultural_artifacts_1790407120815.jpg',
      translations: {
        en: {
          title: newTitle,
          relation: newRelation || 'Family Member',
          location: 'Home Residence',
          description: newDesc || 'A loving family moment preserved forever.',
          audioPromptHint: 'They send you love and blessings today.',
        },
        hi: {
          title: newTitle,
          relation: newRelation || 'प्रिय परिजन',
          location: 'घर का आंगन',
          description: newDesc || 'परिवार का एक बहुत ही सुखद और प्यारा क्षण।',
          audioPromptHint: 'वे आपको अपना ढेर सारा प्यार और आदर भेजते हैं।',
        },
        mr: {
          title: newTitle,
          relation: newRelation || 'कुटुंबातील प्रिय व्यक्ती',
          location: 'आपले घर',
          description: newDesc || 'कुटुंबासोबत घालवलेला एक अतिशय गोड आणि अनमोल क्षण.',
          audioPromptHint: 'ते आपल्याला खूप प्रेम आणि आदर पाठवत आहेत.',
        },
      },
    };

    setMemories([newItem, ...memories]);
    setActiveMemory(newItem);
    setShowAddModal(false);
    setNewTitle('');
    setNewRelation('');
    setNewPerson('');
    setNewDesc('');
  };

  const activeLoc = getLoc(activeMemory);

  return (
    <div className="max-w-5xl mx-auto py-4 px-2 sm:px-4">
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
            {strings.familyTitle}
          </h3>
          <p className="text-xs text-[#1a2e26]/70">
            {strings.familySubtitle}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-[#2d6a4f] hover:bg-[#1f4e39] text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{strings.addMemoryBtn}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Memory Selector Gallery (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a2e26]/60 pl-1">
            {strings.cherishedPhotos} ({memories.length})
          </h4>

          <div className="space-y-3">
            {memories.map((mem) => {
              const isActive = activeMemory.id === mem.id;
              const memLoc = getLoc(mem);

              return (
                <button
                  key={mem.id}
                  onClick={() => setActiveMemory(mem)}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                    isActive
                      ? 'bg-white border-[#2d6a4f] shadow-md ring-2 ring-[#2d6a4f]/20'
                      : 'bg-white/80 border-[#0f382c]/10 hover:border-[#2d6a4f]/50'
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-[#0f382c]/10">
                    <img
                      src={mem.imageSrc || '/src/assets/images/ne_family_memory_1790407141661.jpg'}
                      alt={memLoc.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#2d6a4f] bg-[#eef7f2] px-2 py-0.5 rounded-md truncate">
                        {memLoc.relation}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-[#0f382c] truncate mt-1">
                      {memLoc.title}
                    </h5>
                    <p className="text-xs text-[#1a2e26]/60 truncate mt-0.5">
                      {mem.personName} · {memLoc.location}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Memory Spotlight & AI Reminiscence (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#0f382c]/10 shadow-md p-6 sm:p-8 space-y-6">
          {/* Main Visual */}
          <div className="relative aspect-16/10 rounded-2xl overflow-hidden border border-[#0f382c]/10 shadow-sm bg-slate-900">
            <img
              src={activeMemory.imageSrc || '/src/assets/images/ne_family_memory_1790407141661.jpg'}
              alt={activeLoc.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 sm:p-6 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-xs">
                {activeLoc.relation}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold mt-1 text-white">
                {activeLoc.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {activeLoc.location}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  {activeMemory.yearApprox}
                </span>
              </div>
            </div>
          </div>

          {/* Description & Loving Prompt */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a2e26]/60">
                {strings.aboutThisMoment}
              </h4>
              <p className="text-base sm:text-lg text-[#1a2e26] mt-1 leading-relaxed font-medium">
                {activeLoc.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#eef7f2] border border-[#2d6a4f]/20 flex items-start gap-3">
              <Heart className="w-5 h-5 text-[#2d6a4f] shrink-0 mt-0.5 fill-current" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2d6a4f]">
                  {strings.rememberPrompt}
                </span>
                <p className="text-sm sm:text-base text-[#0f382c] font-semibold mt-0.5">
                  {activeLoc.audioPromptHint}
                </p>
              </div>
            </div>

            {/* AI Generated Narrative Story */}
            {activeLoc.aiStory && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{strings.comfortingStoryTitle}</span>
                </div>
                <p className="text-sm sm:text-base text-[#1a2e26] leading-relaxed italic">
                  "{activeLoc.aiStory}"
                </p>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => playMemoryNarration(activeMemory)}
                className="flex items-center gap-2 bg-[#2d6a4f] hover:bg-[#1f4e39] text-white px-5 py-3 rounded-xl font-bold text-sm cursor-pointer shadow-xs transition-transform active:scale-95"
              >
                <Volume2 className="w-5 h-5" />
                <span>{strings.listenMemoryBtn}</span>
              </button>

              <button
                onClick={() => handleGenerateAIStory(activeMemory)}
                disabled={isGeneratingStory}
                className="flex items-center gap-2 bg-[#eef7f2] hover:bg-[#d8ece1] text-[#0f382c] border border-[#2d6a4f]/30 px-5 py-3 rounded-xl font-bold text-sm cursor-pointer transition-colors"
              >
                <Sparkles className={`w-4 h-4 ${isGeneratingStory ? 'animate-spin' : ''}`} />
                <span>{isGeneratingStory ? strings.weavingStoryBtn : strings.aiStorytellerBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#0f382c]/20 animate-fadeIn">
            <h3 className="text-xl font-bold text-[#0f382c]">
              {strings.addModalHeading}
            </h3>
            <p className="text-xs text-[#1a2e26]/70 mt-1">
              {strings.addModalSub}
            </p>

            <form onSubmit={handleAddMemory} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-[#1a2e26]">
                  {strings.modalTitleLabel}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Garden Walk with Priyakshi"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#1a2e26]">
                    {strings.modalRelLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={newRelation}
                    onChange={(e) => setNewRelation(e.target.value)}
                    placeholder="e.g. Granddaughter"
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1a2e26]">
                    {strings.modalNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={newPerson}
                    onChange={(e) => setNewPerson(e.target.value)}
                    placeholder="e.g. Priyakshi"
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1a2e26]">
                  {strings.modalDescLabel}
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe what was happening and what happy feeling it brings..."
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  {strings.cancelAction}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-[#2d6a4f] text-white hover:bg-[#1f4e39] cursor-pointer shadow-xs"
                >
                  {strings.saveMemoryAction}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
