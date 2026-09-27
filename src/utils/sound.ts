// TSE Urna Sound Engine - Clean single-bip trimming & end tone player

class SoundEngine {
  private isMuted: boolean = false;
  private currentBip: HTMLAudioElement | null = null;
  private currentPilili: HTMLAudioElement | null = null;
  private bipTimeout: ReturnType<typeof setTimeout> | null = null;

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Play crisp 100ms single keypress bip from /sons/bip.m4a
   */
  public playBeep() {
    if (this.isMuted) return;
    try {
      // Clear previous bip timeout & audio
      if (this.bipTimeout) clearTimeout(this.bipTimeout);
      if (this.currentBip) {
        this.currentBip.pause();
        this.currentBip = null;
      }

      const audio = new Audio('/sons/bip.m4a');
      this.currentBip = audio;
      audio.volume = 0.8;
      audio.currentTime = 0;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.playSynthBeep();
        });
      }

      // Cut off bip after 120ms so it only plays 1 single key click
      this.bipTimeout = setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 120);
    } catch {
      this.playSynthBeep();
    }
  }

  /**
   * Play error tone (low pitch buzz)
   */
  public playErrorBeep() {
    if (this.isMuted) return;
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(320, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  /**
   * Play final vote confirmation sound (/sons/encerrou.m4a)
   */
  public playPilili() {
    if (this.isMuted) return;
    try {
      // Stop any keypress bip audio
      if (this.bipTimeout) clearTimeout(this.bipTimeout);
      if (this.currentBip) {
        this.currentBip.pause();
        this.currentBip = null;
      }

      if (this.currentPilili) {
        this.currentPilili.pause();
        this.currentPilili = null;
      }

      const audio = new Audio('/sons/encerrou.m4a');
      this.currentPilili = audio;
      audio.volume = 1.0;
      audio.currentTime = 0;
      audio.play().catch(() => {
        this.playSynthPilili();
      });
    } catch {
      this.playSynthPilili();
    }
  }

  private playSynthBeep() {
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1250, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {
      console.warn('Synth beep error:', e);
    }
  }

  private playSynthPilili() {
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now);
      osc.frequency.setValueAtTime(1318.5, now + 0.12);
      osc.frequency.setValueAtTime(1568.0, now + 0.24);
      osc.frequency.setValueAtTime(2093.0, now + 0.36);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
      gain.gain.setValueAtTime(0.35, now + 1.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.55);
    } catch (e) {
      console.warn('Synth pilili error:', e);
    }
  }
}

export const soundEngine = new SoundEngine();
