import type { AppSettings, LearningItem, LearningModule, ThemePackId } from '../types';

export const learningModules: LearningModule[] = [
  {
    id: 'membaca', title: 'Membaca', subtitle: 'Huruf & kata', icon: '📖', color: '#2563eb',
    description: 'Kenali huruf, baca kata bergambar, dan latih kosakata.', skill: 'Literasi dasar',
  },
  {
    id: 'suara', title: 'Suara & Bunyi', subtitle: 'Dengar dan pilih', icon: '🎧', color: '#7c3aed',
    description: 'Latih pendengaran dengan bunyi huruf dan hewan.', skill: 'Fonik & pendengaran',
  },
  {
    id: 'gambar', title: 'Gambar & Warna', subtitle: 'Bentuk visual', icon: '🎨', color: '#059669',
    description: 'Kenali bentuk, warna, dan objek melalui kuis gambar.', skill: 'Observasi visual',
  },
  {
    id: 'menulis', title: 'Menulis', subtitle: 'Papan latihan', icon: '✏️', color: '#d97706',
    description: 'Telusuri huruf dengan jari atau stylus.', skill: 'Motorik halus',
  },
  {
    id: 'berhitung', title: 'Berhitung', subtitle: 'Angka & jumlah', icon: '🧮', color: '#dc2626',
    description: 'Hitung benda dan coba penjumlahan mudah.', skill: 'Numerasi awal',
  },
];

export const defaultSettings: AppSettings = {
  childName: 'Sahabat Cerdas',
  ageGroup: 5,
  voiceEnabled: true,
  soundEffects: true,
  musicEnabled: false,
  voiceRate: 0.9,
  voicePitch: 1.15,
  largeText: false,
  theme: 'cerah',
  themePack: 'tanpa',
  enabledModules: learningModules.map((module) => module.id),
};

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export interface ThemePack {
  id: ThemePackId;
  name: string;
  icon: string;
  objects: Array<{ label: string; emoji: string; say: string }>;
  mathEmojis: string[];
}

export const themePacks: ThemePack[] = [
  {
    id: 'tanpa', name: 'Tanpa Tema', icon: '🎓', mathEmojis: ['🍎', '🎈', '🐟', '🌸'],
    objects: [
      { label: 'Bola', emoji: '⚽', say: 'Bola' }, { label: 'Bintang', emoji: '⭐', say: 'Bintang' },
      { label: 'Pisang', emoji: '🍌', say: 'Pisang' }, { label: 'Hujan', emoji: '🌧️', say: 'Hujan' },
      { label: 'Buku', emoji: '📚', say: 'Buku' }, { label: 'Mobil', emoji: '🚗', say: 'Mobil' },
      { label: 'Rumah', emoji: '🏠', say: 'Rumah' }, { label: 'Sepatu', emoji: '👟', say: 'Sepatu' },
    ],
  },
  {
    id: 'hewan', name: 'Tema Hewan', icon: '🦁', mathEmojis: ['🐾', '🐔', '🐠', '🦋'],
    objects: [
      { label: 'Kucing', emoji: '🐱', say: 'Suara kucing. Meong' }, { label: 'Sapi', emoji: '🐄', say: 'Suara sapi. Moo' },
      { label: 'Ayam', emoji: '🐔', say: 'Suara ayam. Petok petok' }, { label: 'Bebek', emoji: '🦆', say: 'Suara bebek. Kwek kwek' },
      { label: 'Singa', emoji: '🦁', say: 'Suara singa. Aum' }, { label: 'Katak', emoji: '🐸', say: 'Suara katak. Kwok kwok' },
      { label: 'Kupu-kupu', emoji: '🦋', say: 'Kupu-kupu' }, { label: 'Ikan', emoji: '🐠', say: 'Ikan' },
    ],
  },
  {
    id: 'pantai', name: 'Tema Pantai', icon: '🏖️', mathEmojis: ['🐚', '⛱️', '🐬', '🍉'],
    objects: [
      { label: 'Pantai', emoji: '🏖️', say: 'Pantai' }, { label: 'Ombak', emoji: '🌊', say: 'Suara ombak' },
      { label: 'Kerang', emoji: '🐚', say: 'Kerang' }, { label: 'Lumba-lumba', emoji: '🐬', say: 'Lumba-lumba' },
      { label: 'Perahu', emoji: '⛵', say: 'Perahu' }, { label: 'Payung pantai', emoji: '⛱️', say: 'Payung pantai' },
      { label: 'Semangka', emoji: '🍉', say: 'Semangka' }, { label: 'Sandals', emoji: '🩴', say: 'Sandal pantai' },
    ],
  },
  {
    id: 'gunung', name: 'Tema Gunung', icon: '⛰️', mathEmojis: ['🌲', '🏕️', '🐿️', '🥾'],
    objects: [
      { label: 'Gunung', emoji: '⛰️', say: 'Gunung' }, { label: 'Pohon cemara', emoji: '🌲', say: 'Pohon cemara' },
      { label: 'Tenda', emoji: '🏕️', say: 'Tenda' }, { label: 'Tupai', emoji: '🐿️', say: 'Tupai' },
      { label: 'Elang', emoji: '🦅', say: 'Elang' }, { label: 'Sepatu gunung', emoji: '🥾', say: 'Sepatu gunung' },
      { label: 'Air terjun', emoji: '💧', say: 'Air terjun' }, { label: 'Peta', emoji: '🗺️', say: 'Peta' },
    ],
  },
  {
    id: 'angkasa', name: 'Tema Angkasa', icon: '🚀', mathEmojis: ['🌟', '🪐', '🛰️', '☄️'],
    objects: [
      { label: 'Roket', emoji: '🚀', say: 'Roket' }, { label: 'Astronaut', emoji: '👨‍🚀', say: 'Astronaut' },
      { label: 'Planet', emoji: '🪐', say: 'Planet' }, { label: 'Bintang jatuh', emoji: '☄️', say: 'Bintang jatuh' },
      { label: 'Satelit', emoji: '🛰️', say: 'Satelit' }, { label: 'Teleskop', emoji: '🔭', say: 'Teleskop' },
      { label: 'Bulan', emoji: '🌙', say: 'Bulan' }, { label: 'Bumi', emoji: '🌍', say: 'Bumi' },
    ],
  },
  {
    id: 'buah', name: 'Tema Buah', icon: '🍓', mathEmojis: ['🍎', '🍇', '🍊', '🍓'],
    objects: [
      { label: 'Apel', emoji: '🍎', say: 'Apel' }, { label: 'Anggur', emoji: '🍇', say: 'Anggur' },
      { label: 'Jeruk', emoji: '🍊', say: 'Jeruk' }, { label: 'Stroberi', emoji: '🍓', say: 'Stroberi' },
      { label: 'Nanas', emoji: '🍍', say: 'Nanas' }, { label: 'Semangka', emoji: '🍉', say: 'Semangka' },
      { label: 'Mangga', emoji: '🥭', say: 'Mangga' }, { label: 'Pisang', emoji: '🍌', say: 'Pisang' },
    ],
  },
];

export function getThemePack(id: ThemePackId) {
  return themePacks.find((pack) => pack.id === id) ?? themePacks[0];
}

export const readingItems: LearningItem[] = [
  ...letters.map((letter) => ({ id: `huruf-${letter}`, label: letter, say: `Ini huruf ${letter}`, visual: letter })),
  ...[
    { id: 'kata-bola', label: 'BOLA', say: 'Bo-La. Bola', visual: '⚽' },
    { id: 'kata-buku', label: 'BUKU', say: 'Bu-Ku. Buku', visual: '📚' },
    { id: 'kata-sapi', label: 'SAPI', say: 'Sa-Pi. Sapi', visual: '🐄' },
  ],
];

export function getEnabledModules(settings: AppSettings) {
  return learningModules.filter((module) => settings.enabledModules.includes(module.id));
}

export function shuffle<T>(values: T[]) {
  return [...values].sort(() => Math.random() - 0.5);
}

export function buildOptions(answer: string, pool: string[]) {
  const distractors = shuffle(pool.filter((value) => value !== answer)).slice(0, 3);
  return shuffle([answer, ...distractors]);
}
