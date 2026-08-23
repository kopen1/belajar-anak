import { useState } from 'react';
import type { AppSettings, LearningModule } from '../types';
import { getThemePack } from '../data/learning';
import {
  createMathQuestion,
  createReadingQuestion,
  createSoundQuestion,
  createVisualQuestion,
} from '../lib/questions';
import { QuizActivity } from '../components/QuizActivity';
import { LearnCards, type LearnCard } from '../components/LearnCards';
import { WritingActivity } from '../components/WritingActivity';

interface ModuleScreenProps {
  module: LearningModule;
  settings: AppSettings;
  onBack: () => void;
  onComplete: (moduleId: string, earnedStar: boolean) => void;
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function createReadingLearnCards(): LearnCard[] {
  return alphabet.map((letter) => ({
    title: `${letter} ${letter.toLowerCase()}`, visual: letter,
    say: `Ini huruf ${letter}. Huruf kecilnya ${letter.toLowerCase()}`,
  }));
}

function createMathLearnCards(): LearnCard[] {
  const numberNames = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas', 'dua puluh'];
  const numberCards = numberNames.map((name, value) => ({
    title: `Angka ${value}`, visual: String(value), say: `Ini angka ${value}, dibaca ${name}`,
  }));
  return [...numberCards,
    { title: 'Penjumlahan', visual: '2 + 3 = 5', say: 'Dua tambah tiga sama dengan lima' },
    { title: 'Pengurangan', visual: '7 - 2 = 5', say: 'Tujuh kurang dua sama dengan lima' },
    { title: 'Lebih banyak', visual: '🍎🍎 > 🍎', say: 'Dua apel lebih banyak daripada satu apel' },
    { title: 'Sama banyak', visual: '⭐⭐ = ⭐⭐', say: 'Dua bintang sama banyak dengan dua bintang' },
  ];
}

export function ModuleScreen({ module, settings, onBack, onComplete }: ModuleScreenProps) {
  const [mode, setMode] = useState<'belajar' | 'latihan'>(module.id === 'membaca' || module.id === 'berhitung' ? 'belajar' : 'latihan');
  const theme = getThemePack(settings.themePack);
  let content = null;

  if (mode === 'belajar') {
    if (module.id === 'membaca') content = <LearnCards title="Pengenalan Huruf A-Z" cards={createReadingLearnCards()} settings={settings} />;
    else if (module.id === 'berhitung') content = <LearnCards title="Pengenalan Angka & Perhitungan" cards={createMathLearnCards()} settings={settings} />;
    else content = <LearnCards title={`Mengenal Tema ${theme.name}`} cards={theme.objects.map((object) => ({ title: object.label, visual: object.emoji, say: object.say }))} settings={settings} />;
  } else if (module.id === 'membaca') {
    content = <QuizActivity title="Latihan Membaca Tanpa Batas" settings={settings} generateQuestion={createReadingQuestion} onComplete={onComplete} />;
  } else if (module.id === 'suara') {
    content = <QuizActivity title="Latihan Suara Tanpa Batas" settings={settings} generateQuestion={() => createSoundQuestion(settings)} autoSpeak onComplete={onComplete} />;
  } else if (module.id === 'gambar') {
    content = <QuizActivity title="Kuis Gambar Tanpa Batas" settings={settings} generateQuestion={() => createVisualQuestion(settings)} onComplete={onComplete} />;
  } else if (module.id === 'menulis') {
    content = <WritingActivity settings={settings} moduleId={module.id} onComplete={onComplete} />;
  } else {
    content = <QuizActivity title="Latihan Perhitungan Tanpa Batas" settings={settings} generateQuestion={() => createMathQuestion(settings)} onComplete={onComplete} />;
  }

  return (
    <main className="screen">
      <button className="back-button" type="button" onClick={onBack}>← Beranda</button>
      <section className="page-head">
        <div><p className="eyebrow">{theme.icon} {theme.name}</p><h1>{module.icon} {module.title}</h1></div>
        <span className="pill">{module.skill}</span>
      </section>
      <div className="mode-tabs" role="tablist" aria-label="Jenis aktivitas">
        <button className={mode === 'belajar' ? 'active' : ''} role="tab" aria-selected={mode === 'belajar'} type="button" onClick={() => setMode('belajar')}>Belajar</button>
        <button className={mode === 'latihan' ? 'active' : ''} role="tab" aria-selected={mode === 'latihan'} type="button" onClick={() => setMode('latihan')}>Latihan Terus</button>
      </div>
      {content}
    </main>
  );
}
