import type { AppSettings } from '../types';
import { buildOptions, getThemePack, readingItems, shuffle } from '../data/learning';

export interface QuizQuestion {
  id: string;
  prompt: string;
  say: string;
  visual: string;
  options: string[];
  answer: string;
}

let questionSeed = 0;

function nextId(prefix: string) {
  questionSeed += 1;
  return `${prefix}-${Date.now()}-${questionSeed}`;
}

export function createReadingQuestion(): QuizQuestion {
  const item = readingItems[Math.floor(Math.random() * readingItems.length)];
  const pool = item.label.length === 1
    ? readingItems.filter((value) => value.label.length === 1).map((value) => value.label)
    : readingItems.filter((value) => value.label.length > 1).map((value) => value.label);
  return { id: nextId('baca'), prompt: 'Apa ini?', say: item.say, visual: item.visual, answer: item.label, options: buildOptions(item.label, pool) };
}

export function createSoundQuestion(settings: AppSettings): QuizQuestion {
  const objects = getThemePack(settings.themePack).objects;
  const object = objects[Math.floor(Math.random() * objects.length)];
  return {
    id: nextId('suara'), prompt: 'Dengarkan, lalu pilih gambar yang tepat.', say: object.say,
    visual: '🔊', answer: object.emoji,
    options: buildOptions(object.emoji, objects.map((value) => value.emoji)),
  };
}

export function createVisualQuestion(settings: AppSettings): QuizQuestion {
  const objects = getThemePack(settings.themePack).objects;
  const object = objects[Math.floor(Math.random() * objects.length)];
  return {
    id: nextId('gambar'), prompt: `Temukan ${object.label.toLowerCase()}.`, say: object.say,
    visual: object.emoji, answer: object.emoji,
    options: buildOptions(object.emoji, objects.map((value) => value.emoji)),
  };
}

export function createMathQuestion(settings: AppSettings): QuizQuestion {
  const emojis = getThemePack(settings.themePack).mathEmojis;
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  const operation = settings.ageGroup >= 6 && Math.random() > 0.45 ? ['tambah', 'kurang'][Math.floor(Math.random() * 2)] : 'hitung';

  if (operation === 'hitung') {
    const max = settings.ageGroup === 4 ? 8 : settings.ageGroup === 5 ? 12 : 20;
    const count = 1 + Math.floor(Math.random() * max);
    const visual = emoji.repeat(count);
    return {
      id: nextId('hitung'), prompt: 'Ada berapa banyak?', say: 'Hitung benda di layar.', visual,
      answer: String(count), options: buildOptions(String(count), Array.from({ length: 20 }, (_, index) => String(index + 1))),
    };
  }

  if (operation === 'tambah') {
    const first = Math.floor(Math.random() * 11);
    const second = Math.floor(Math.random() * (11 - first));
    const answer = first + second;
    return {
      id: nextId('tambah'), prompt: `${first} + ${second} = ?`, say: `Berapa ${first} tambah ${second}?`, visual: emoji.repeat(2),
      answer: String(answer), options: buildOptions(String(answer), Array.from({ length: 21 }, (_, index) => String(index))),
    };
  }

  const first = 3 + Math.floor(Math.random() * 9);
  const second = Math.floor(Math.random() * first);
  const answer = first - second;
  return {
    id: nextId('kurang'), prompt: `${first} - ${second} = ?`, say: `Berapa ${first} kurang ${second}?`, visual: emoji.repeat(2),
    answer: String(answer), options: buildOptions(String(answer), Array.from({ length: 21 }, (_, index) => String(index))),
  };
}

export { shuffle };
