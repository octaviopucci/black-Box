const MUTE_KEY = "mesaflow_order_sound_muted";

type OscillatorTypeName = OscillatorType;

let sharedCtx: AudioContext | null = null;
let unlocked = false;
const unlockListeners = new Set<() => void>();

function notifyUnlockListeners() {
  for (const listener of unlockListeners) listener();
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedCtx || sharedCtx.state === "closed") {
    sharedCtx = new AudioCtx();
    unlocked = sharedCtx.state === "running";
  }
  return sharedCtx;
}

export function isOrderSoundMuted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MUTE_KEY) === "1";
}

export function setOrderSoundMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
}

export function isOrderSoundUnlocked(): boolean {
  return unlocked;
}

export function subscribeOrderSoundUnlock(listener: () => void): () => void {
  unlockListeners.add(listener);
  return () => unlockListeners.delete(listener);
}

/** Resume AudioContext após gesto do usuário — necessário por autoplay policy. */
export async function unlockOrderSound(): Promise<boolean> {
  if (typeof window === "undefined" || isOrderSoundMuted()) return false;
  const ctx = getAudioContext();
  if (!ctx) return false;

  try {
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    if (ctx.state === "running") {
      if (!unlocked) {
        unlocked = true;
        notifyUnlockListeners();
      }
      return true;
    }
  } catch {
    /* browser blocked */
  }
  return false;
}

/** Desbloqueia no primeiro clique/toque/tecla em qualquer lugar do admin. */
export function setupOrderSoundAutoUnlock(): () => void {
  if (typeof window === "undefined") return () => undefined;

  const tryUnlock = () => {
    if (unlocked || isOrderSoundMuted()) return;
    void unlockOrderSound();
  };

  const opts: AddEventListenerOptions = { capture: true, passive: true };
  const events = ["pointerdown", "keydown", "touchstart"] as const;
  for (const event of events) {
    window.addEventListener(event, tryUnlock, opts);
  }
  return () => {
    for (const event of events) {
      window.removeEventListener(event, tryUnlock, opts);
    }
  };
}

function scheduleDoorbell(ctx: AudioContext, master: GainNode): void {
  const playTone = (
    freq: number,
    start: number,
    duration: number,
    volume: number,
    type: OscillatorTypeName = "triangle",
  ) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain);
    gain.connect(master);
    osc.start(start);
    osc.stop(start + duration + 0.04);
  };

  const t = ctx.currentTime;
  // Sino de balcão: ding-dong + repique longo e alto
  playTone(880, t, 0.42, 0.82);
  playTone(660, t + 0.38, 0.52, 0.88, "square");
  playTone(880, t + 0.86, 0.38, 0.78);
  playTone(1175, t + 1.18, 0.62, 0.92);
  playTone(1568, t + 1.34, 0.72, 0.85, "sine");
}

async function playDoorbellOnce(attempt: number): Promise<boolean> {
  const ctx = getAudioContext();
  if (!ctx) return false;

  try {
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    if (ctx.state !== "running") {
      if (attempt === 0) {
        await new Promise((resolve) => window.setTimeout(resolve, 80));
        return playDoorbellOnce(1);
      }
      return false;
    }

    if (!unlocked) {
      unlocked = true;
      notifyUnlockListeners();
    }

    const master = ctx.createGain();
    master.gain.value = 0.95;
    master.connect(ctx.destination);
    scheduleDoorbell(ctx, master);

    window.setTimeout(() => {
      master.disconnect();
    }, 2400);

    return true;
  } catch {
    if (attempt === 0) {
      await new Promise((resolve) => window.setTimeout(resolve, 80));
      return playDoorbellOnce(1);
    }
    return false;
  }
}

/** Sino alto de novo pedido — requer AudioContext desbloqueado (gesto prévio). */
export async function playOrderBell(): Promise<boolean> {
  if (typeof window === "undefined" || isOrderSoundMuted()) return false;
  return playDoorbellOnce(0);
}
