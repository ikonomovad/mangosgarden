// Browser-only Web Audio, invoked exclusively from a user tap; no files or libraries.
let context: AudioContext | undefined;

export function playArrival(rare: boolean) {
  try {
    if (!window.AudioContext) return;
    context ??= new window.AudioContext();
    const audio = context;
    // Call resume synchronously in the tap, before scheduling the landing chirp.
    void audio.resume().then(() => {
      const start = audio.currentTime + 1;
      tone(audio, start, 1800, 2800, 0.12, 0.025, "sine");
      tone(audio, start + 0.15, 2300, 1700, 0.1, 0.02, "sine");
      if (rare) {
        tone(audio, start + 0.35, 650, 1050, 0.16, 0.018, "triangle");
        tone(audio, start + 0.53, 950, 500, 0.12, 0.015, "triangle");
      }
    }).catch(() => {});
  } catch {
    // Audio is optional: unsupported devices still play the game normally.
  }
}

function tone(audio: AudioContext, start: number, from: number, to: number, duration: number, volume: number, type: OscillatorType) {
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(from, start);
  oscillator.frequency.exponentialRampToValueAtTime(to, start + duration);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
}