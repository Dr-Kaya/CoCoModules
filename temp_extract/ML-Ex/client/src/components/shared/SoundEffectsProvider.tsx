import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type SoundType = "click" | "correct" | "wrong" | "celebrate" | "capture";

interface SoundEffectsContextValue {
  soundEnabled: boolean;
  toggleSound: () => void;
  playSound: (type: SoundType) => void;
}

const SoundEffectsContext = createContext<SoundEffectsContextValue>({
  soundEnabled: false,
  toggleSound: () => {},
  playSound: () => {},
});

const audioContextRef: { current: AudioContext | null } = { current: null };

function getAudioContext(): AudioContext {
  if (!audioContextRef.current) {
    audioContextRef.current = new AudioContext();
  }
  return audioContextRef.current;
}

function playBeep(frequency: number, duration: number, type: OscillatorType = "sine") {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
  }
}

const soundEffects: Record<SoundType, () => void> = {
  click: () => playBeep(600, 0.08, "square"),
  correct: () => {
    playBeep(523, 0.12, "sine");
    setTimeout(() => playBeep(659, 0.12, "sine"), 120);
    setTimeout(() => playBeep(784, 0.15, "sine"), 240);
  },
  wrong: () => {
    playBeep(300, 0.2, "sawtooth");
    setTimeout(() => playBeep(250, 0.25, "sawtooth"), 200);
  },
  celebrate: () => {
    [523, 587, 659, 784, 880, 1047].forEach((freq, i) => {
      setTimeout(() => playBeep(freq, 0.15, "sine"), i * 80);
    });
  },
  capture: () => playBeep(880, 0.06, "square"),
};

export function SoundEffectsProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem("ml-explorer-sound") === "true";
    } catch {
      return false;
    }
  });

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("ml-explorer-sound", String(next));
      } catch {}
      if (next) {
        playBeep(523, 0.1, "sine");
      }
      return next;
    });
  }, []);

  const playSound = useCallback(
    (type: SoundType) => {
      if (soundEnabled) {
        soundEffects[type]?.();
      }
    },
    [soundEnabled],
  );

  return (
    <SoundEffectsContext.Provider value={{ soundEnabled, toggleSound, playSound }}>
      {children}
    </SoundEffectsContext.Provider>
  );
}

export function useSoundEffects() {
  return useContext(SoundEffectsContext);
}
