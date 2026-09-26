/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldAlert, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { SpeechNarrator } from '../utils/speech';
import { SupportedLanguage } from '../types';
import { UI_STRINGS } from '../data/culturalData';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: SupportedLanguage;
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose, language = 'en' }) => {
  const strings = UI_STRINGS[language] || UI_STRINGS.en;
  const [alertSent, setAlertSent] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendCaregiverAlert = () => {
    soundManager.playSuccessChime();
    setAlertSent(true);

    const alertSpeech =
      language === 'hi'
        ? 'आपके परिवार को आपातकालीन संदेश भेज दिया गया है। सहायता तुरंत आ रही है। आप पूरी तरह सुरक्षित हैं।'
        : language === 'mr'
        ? 'आपल्या कुटुंबाला तातडीचा संदेश पाठवण्यात आला आहे. मदत लगेच येत आहे. आपण पूर्णपणे सुरक्षित आहात.'
        : 'An alert has been sent to your family. Help is on the way. You are safe.';

    SpeechNarrator.speak(alertSpeech, language);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-rose-400 animate-fadeIn text-center">
        <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f382c]">
          {strings.helpRightHere}
        </h2>
        <p className="text-base text-[#1a2e26]/80 mt-1 max-w-sm mx-auto font-medium">
          {strings.doNotWorry}
        </p>

        {/* Current Location Confirmation */}
        <div className="my-5 p-4 rounded-2xl bg-[#eef7f2] border border-[#2d6a4f]/20 text-left">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2d6a4f]">
            <MapPin className="w-4 h-4 text-[#2d6a4f]" />
            <span>{strings.youAreAtHome}</span>
          </div>
          <p className="text-base font-bold text-[#0f382c] mt-0.5">
            {strings.homeAddress}
          </p>
          <span className="text-xs text-emerald-800 font-medium">
            ✓ {strings.safePerimeterActive}
          </span>
        </div>

        {/* Caregiver Contacts */}
        <div className="space-y-2 mb-6 text-left">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#1a2e26]/60">{strings.eldestSonLabel}</div>
              <div className="text-sm font-bold text-[#0f382c]">Bhaskar Borah</div>
            </div>
            <a
              href="tel:+919435012345"
              className="flex items-center gap-1.5 bg-[#2d6a4f] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#1f4e39] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{strings.callNowBtn}</span>
            </a>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#1a2e26]/60">{strings.daughterLabel}</div>
              <div className="text-sm font-bold text-[#0f382c]">Nilakshi Borah</div>
            </div>
            <a
              href="tel:+919864012345"
              className="flex items-center gap-1.5 bg-[#2d6a4f] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#1f4e39] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{strings.callNowBtn}</span>
            </a>
          </div>
        </div>

        {/* Action Button */}
        {alertSent ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-center gap-2 mb-4 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{strings.alertSentSuccess}</span>
          </div>
        ) : (
          <button
            onClick={handleSendCaregiverAlert}
            className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base rounded-2xl cursor-pointer shadow-md transition-transform active:scale-95 mb-3 flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>{strings.sendAlertBtn}</span>
          </button>
        )}

        <button
          onClick={onClose}
          className="text-sm font-semibold text-[#1a2e26]/70 hover:text-[#0f382c] cursor-pointer"
        >
          {strings.closeModalBtn}
        </button>
      </div>
    </div>
  );
};
