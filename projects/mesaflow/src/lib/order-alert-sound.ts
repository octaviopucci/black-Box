const MUTE_KEY = "mesaflow_order_sound_muted";

export function isOrderSoundMuted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MUTE_KEY) === "1";
}

export function setOrderSoundMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
}

/** Sino curto gerado via Web Audio — sem arquivo externo. */
export function playOrderBell(): void {
  if (typeof window === "undefined" || isOrderSoundMuted()) return;
  try {
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const playTone = (freq: number, start: number, duration: number, volume = 0.28) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };
    const t = ctx.currentTime;
    playTone(784, t, 0.18);
    playTone(988, t + 0.14, 0.22, 0.22);
    playTone(1175, t + 0.28, 0.25, 0.18);
    window.setTimeout(() => void ctx.close().catch(() => undefined), 700);
  } catch {
    /* optional */
  }
}
