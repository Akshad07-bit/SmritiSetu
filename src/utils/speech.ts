/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SupportedLanguage } from '../types';

// Web Speech API helper designed for seniors with dementia with multi-lingual regional voice matching

export class SpeechNarrator {
  private static isSpeaking = false;
  private static voices: SpeechSynthesisVoice[] = [];

  public static initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
    }
  }

  /**
   * Finds the best matching native voice for the given language.
   * Priority:
   * - 'mr': 'mr-IN', 'mr', then 'hi-IN' (Devanagari phonetic voice)
   * - 'hi': 'hi-IN', 'hi'
   * - 'en': 'en-IN', 'en-GB', 'en-US', 'en'
   */
  private static findBestVoice(lang: SupportedLanguage | string): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.initVoices();
    }
    const voices =
      this.voices.length > 0
        ? this.voices
        : typeof window !== 'undefined'
        ? window.speechSynthesis?.getVoices() || []
        : [];

    let searchLangs: string[] = [];

    switch (lang) {
      case 'mr':
        searchLangs = ['mr-in', 'mr', 'hi-in', 'hi'];
        break;
      case 'hi':
        searchLangs = ['hi-in', 'hi'];
        break;
      case 'en':
      default:
        searchLangs = ['en-in', 'en-gb', 'en-us', 'en'];
        break;
    }

    for (const target of searchLangs) {
      const match = voices.find((v) =>
        v.lang.toLowerCase().replace('_', '-').startsWith(target)
      );
      if (match) return match;
    }

    return null;
  }

  public static speak(text: string, lang: SupportedLanguage | string = 'en', onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (!text || !text.trim()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Slower, clearer cadence for elderly dementia comprehension
    utterance.pitch = 1.0;

    const matchedVoice = this.findBestVoice(lang);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang;
    } else {
      switch (lang) {
        case 'mr':
          utterance.lang = 'mr-IN';
          break;
        case 'hi':
          utterance.lang = 'hi-IN';
          break;
        default:
          utterance.lang = 'en-IN';
          break;
      }
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public static stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public static getSpeakingStatus(): boolean {
    return this.isSpeaking;
  }
}

// Pre-warm voices on load without interrupting playback
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  SpeechNarrator.initVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    SpeechNarrator.initVoices();
  };
}
