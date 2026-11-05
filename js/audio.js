// Procedural Web Audio API sound synthesizer
// Completely zero-latency, works offline and on mobile, no external audio files needed

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.initialized = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.initialized = true;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  // Neon wall bounce tick / laser thump
  playBounce(intensity = 1.0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = 240 + Math.random() * 60;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);

    gain.gain.setValueAtTime(0.18 * Math.min(1.5, intensity), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Puck-to-puck elastic collision
  playPuckClash(intensity = 1.0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.06);

    gain.gain.setValueAtTime(0.22 * Math.min(1.5, intensity), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Post hit sound (direk sesi)
  playPostHit() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.35);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Referee Whistle (Hakem Düdüğü)
  // Generates dual modulated frequencies (2800Hz & 3150Hz) with rapid air flutter (28Hz vibrato)
  playWhistle(type = 'short') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    if (type === 'halfTime') {
      // One long whistle
      this._whistleBlast(0.65);
    } else if (type === 'fullTime') {
      // Three sharp whistles: pip, pip, peeeep!
      this._whistleBlast(0.22, 0);
      this._whistleBlast(0.22, 0.3);
      this._whistleBlast(0.75, 0.6);
    } else {
      // Single normal blast
      this._whistleBlast(0.35);
    }
  }

  _whistleBlast(duration = 0.4, delay = 0) {
    const now = this.ctx.currentTime + delay;

    // Flutter LFO (vibrato)
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(26, now);
    lfoGain.gain.setValueAtTime(140, now);
    lfo.connect(lfoGain);

    // Primary whistle tone
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(2850, now);
    lfoGain.connect(osc1.frequency);

    // Secondary harmonic tone
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(3200, now);
    lfoGain.connect(osc2.frequency);

    // Envelope
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.04);
    gain.gain.setValueAtTime(0.35, now + duration - 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Filter to soften high shrillness
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3000, now);
    filter.Q.setValueAtTime(2.0, now);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(filter);
    filter.connect(this.ctx.destination);

    lfo.start(now);
    osc1.start(now);
    osc2.start(now);

    lfo.stop(now + duration);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // Goal Horn & Stadium Roar (Gooool!)
  playGoal() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Stadium Air Horn (Major chord)
    const freqs = [220, 277.18, 329.63, 440]; // A major
    freqs.forEach(f => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
      gain.gain.setValueAtTime(0.12, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      osc.connect(gain);
      gain.connect(filter);
      filter.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.8);
    });

    // 2. Crowd Cheering Roar (Synthesized noise burst with formant filter)
    this._playCrowdRoar(now, 2.2);
  }

  _playCrowdRoar(startTime, duration = 2.0) {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, startTime);
    filter.frequency.exponentialRampToValueAtTime(1100, startTime + duration * 0.4);
    filter.frequency.exponentialRampToValueAtTime(450, startTime + duration);
    filter.Q.setValueAtTime(1.8, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.28, startTime + 0.25);
    gain.gain.setValueAtTime(0.25, startTime + duration * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(startTime);
    whiteNoise.stop(startTime + duration);
  }

  // Elimination Zap for Battle Royale mode
  playElimination() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.45);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.45);

    osc.connect(gain);
    gain.connect(filter);
    filter.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  // Champion Victory Fanfare
  playChampionFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [
      { f: 392.00, d: 0.15, t: 0 },       // G4
      { f: 392.00, d: 0.15, t: 0.18 },    // G4
      { f: 392.00, d: 0.15, t: 0.36 },    // G4
      { f: 523.25, d: 0.6,  t: 0.54 },    // C5
      { f: 659.25, d: 0.8,  t: 1.15 }     // E5
    ];

    notes.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.001, now + note.t);
      gain.gain.linearRampToValueAtTime(0.25, now + note.t + 0.03);
      gain.gain.setValueAtTime(0.25, now + note.t + note.d - 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + note.t);
      osc.stop(now + note.t + note.d);
    });

    this._playCrowdRoar(now + 0.5, 2.5);
  }
}

export const soundEngine = new SoundEngine();
