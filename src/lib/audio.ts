import type { AppSettings } from '../types';

let audioContext: AudioContext | undefined;
let musicTimer: number | undefined;
let musicGain: GainNode | undefined;

function getContext() {
  audioContext ??= new (window.AudioContext || (window as any).webkitAudioContext)();
  void audioContext.resume();
  return audioContext;
}

export function playChime(enabled: boolean, success = true) {
  if (!enabled) return;
  const context = getContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = success ? 'sine' : 'triangle';
  oscillator.frequency.value = success ? 720 : 220;
  gain.gain.setValueAtTime(0.08, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.35);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.35);
}

export function speak(text: string, settings: AppSettings) {
  if (!settings.voiceEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = settings.voiceRate;
  utterance.pitch = settings.voicePitch;
  window.speechSynthesis.speak(utterance);
}

function playMusicNote(context: AudioContext, frequency: number, startTime: number, duration = 1.1) {
  const oscillator = context.createOscillator();
  const oscillatorLayer = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillatorLayer.type = 'triangle';
  oscillator.frequency.value = frequency;
  oscillatorLayer.frequency.value = frequency * 2;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.055, startTime + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  oscillator.connect(gain);
  oscillatorLayer.connect(gain);
  gain.connect(musicGain!);
  oscillator.start(startTime);
  oscillatorLayer.start(startTime);
  oscillator.stop(startTime + duration);
  oscillatorLayer.stop(startTime + duration);
}

export function startBackgroundMusic() {
  if (musicTimer) return;
  const context = getContext();
  musicGain ??= context.createGain();
  musicGain.gain.value = 0.55;
  musicGain.connect(context.destination);
  const melody = [262, 330, 392, 523, 392, 330, 294, 349, 440, 349, 294, 262];
  let noteIndex = 0;
  const playNext = () => {
    playMusicNote(context, melody[noteIndex % melody.length], context.currentTime + 0.05);
    noteIndex += 1;
  };
  playNext();
  musicTimer = window.setInterval(playNext, 900);
}

export function stopBackgroundMusic() {
  if (musicTimer) {
    window.clearInterval(musicTimer);
    musicTimer = undefined;
  }
}
