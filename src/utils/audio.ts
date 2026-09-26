/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Synthesizer for Dementia-Safe, Non-Startling Soundscapes & Affirmation Chimes

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private activeSoundscapeNodes: { [key: string]: any } = {};
  private isSoundscapePlaying = false;
  private activeType: string | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Plays a gentle, harmonic chime (pentatonic scale) when an elder completes a task.
   * Frequency and envelope are chosen to be warm and avoid any sudden acoustic startle.
   */
  public playSuccessChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (warm major arpeggio)

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 1.3);
    });
  }

  /**
   * Gentle wooden soft tap for card flips
   */
  public playSoftTap() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  /**
   * Generates serene procedural nature and regional soundscapes:
   * 'monsoon' = Soft rainfall on tin roof with low-pass noise
   * 'dhol' = Rhythmic gentle traditional heart-rate tempo drum rhythm (Bihu folk cadence)
   * 'river' = Brahmaputra rolling slow water pink noise waves
   * 'bell' = Meditative temple resonance
   * 'birds' = Soft chirping morning forest
   * 'flute' = Bamboo flute modal drone
   */
  public startSoundscape(type: 'monsoon' | 'dhol' | 'birds' | 'river' | 'bell' | 'flute') {
    const ctx = this.getContext();
    if (!ctx) return;

    this.stopSoundscape();
    this.isSoundscapePlaying = true;
    this.activeType = type;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 1.5);
    masterGain.connect(ctx.destination);

    if (type === 'monsoon' || type === 'river') {
      // Noise buffer for rain or water
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise filter
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = type === 'monsoon' ? 'bandpass' : 'lowpass';
      filter.frequency.setValueAtTime(type === 'monsoon' ? 800 : 350, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      this.activeSoundscapeNodes = { whiteNoise, filter, masterGain };
    } else if (type === 'bell') {
      // Resonant harmonic temple chime
      const freqs = [330, 660, 990, 1320];
      const oscs = freqs.map((f, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        g.gain.setValueAtTime(0.08 / (i + 1), ctx.currentTime);
        osc.connect(g);
        g.connect(masterGain);
        osc.start();
        return { osc, g };
      });
      this.activeSoundscapeNodes = { oscs, masterGain };
    } else if (type === 'flute') {
      // Bamboo flute warm modal note
      const osc = ctx.createOscillator();
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4

      vibrato.frequency.setValueAtTime(5.5, ctx.currentTime); // 5.5 Hz vibrato
      vibratoGain.gain.setValueAtTime(4, ctx.currentTime);

      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);

      osc.connect(filter);
      filter.connect(masterGain);

      vibrato.start();
      osc.start();

      this.activeSoundscapeNodes = { osc, vibrato, filter, masterGain };
    } else if (type === 'dhol') {
      // Gentle rhythmic pulse (60 BPM soothing rhythm)
      const timer = setInterval(() => {
        if (!this.isSoundscapePlaying) {
          clearInterval(timer);
          return;
        }
        this.playDholBeat();
      }, 950);
      this.activeSoundscapeNodes = { timer, masterGain };
      this.playDholBeat();
    } else {
      // Birds: occasional gentle chirp
      const timer = setInterval(() => {
        if (!this.isSoundscapePlaying) {
          clearInterval(timer);
          return;
        }
        this.playBirdChirp();
      }, 2200);
      this.activeSoundscapeNodes = { timer, masterGain };
      this.playBirdChirp();
    }
  }

  private playDholBeat() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  private playBirdChirp() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const base = 2400 + Math.random() * 400;
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.linearRampToValueAtTime(base + 500, now + 0.08);
    osc.frequency.linearRampToValueAtTime(base + 200, now + 0.16);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  public stopSoundscape() {
    const ctx = this.getContext();
    if (this.activeSoundscapeNodes.masterGain && ctx) {
      try {
        this.activeSoundscapeNodes.masterGain.gain.linearRampToValueAtTime(
          0.001,
          ctx.currentTime + 0.5
        );
      } catch (e) {
        // ignore
      }
    }
    if (this.activeSoundscapeNodes.whiteNoise) {
      try {
        this.activeSoundscapeNodes.whiteNoise.stop();
      } catch (e) {}
    }
    if (this.activeSoundscapeNodes.osc) {
      try {
        this.activeSoundscapeNodes.osc.stop();
      } catch (e) {}
    }
    if (this.activeSoundscapeNodes.timer) {
      clearInterval(this.activeSoundscapeNodes.timer);
    }
    this.activeSoundscapeNodes = {};
    this.isSoundscapePlaying = false;
    this.activeType = null;
  }

  public getIsPlaying(): boolean {
    return this.isSoundscapePlaying;
  }

  public getActiveType(): string | null {
    return this.activeType;
  }
}

export const soundManager = new AudioSynthesizer();
