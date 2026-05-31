// Haptic + sound feedback utilities.
//
// Sound is opt-in (default off) to respect the research caveat that
// constant noise can be annoying for some users — but for those who respond
// to audio cues, an instant chime is a strong dopamine signal.

export function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light') {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30
    };
    navigator.vibrate(patterns[type]);
  }
}

const SOUND_KEY = 'completionSound';

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(SOUND_KEY) === 'true';
}

export function setSoundEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SOUND_KEY, enabled ? 'true' : 'false');
}

// A short, pleasant two-note "ding" using the Web Audio API (no asset needed).
export function playCompletionChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Two ascending notes for a satisfying "win" feel.
    const notes = [
      { freq: 659.25, start: 0, dur: 0.12 },   // E5
      { freq: 987.77, start: 0.1, dur: 0.18 }, // B5
    ];

    notes.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.exponentialRampToValueAtTime(0.22, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      osc.start(now + start);
      osc.stop(now + start + dur);
    });

    setTimeout(() => ctx.close(), 600);
  } catch {
    // Audio not available — haptics still fire.
  }
}

export function triggerSuccess() {
  triggerHaptic('light');
}

export function triggerError() {
  triggerHaptic('medium');
}

// Called whenever an exercise is checked off. Fires haptic always, sound if enabled.
export function triggerCompletion() {
  triggerHaptic('light');
  if (isSoundEnabled()) playCompletionChime();
}
