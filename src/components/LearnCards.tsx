import { useEffect, useState } from 'react';
import type { AppSettings } from '../types';
import { speak } from '../lib/audio';

export interface LearnCard {
  title: string;
  visual: string;
  say: string;
}

interface LearnCardsProps {
  title: string;
  cards: LearnCard[];
  settings: AppSettings;
}

export function LearnCards({ title, cards, settings }: LearnCardsProps) {
  const [index, setIndex] = useState(0);
  const card = cards[index];

  useEffect(() => {
    speak(card.say, settings);
  }, [card, settings]);

  function move(step: number) {
    setIndex((current) => (current + step + cards.length) % cards.length);
  }

  return (
    <section className="activity-card">
      <div className="section-head"><h2>{title}</h2><span className="pill">{index + 1}/{cards.length}</span></div>
      <div className="learn-card">
        <span className="learn-visual" aria-hidden="true">{card.visual}</span>
        <strong>{card.title}</strong>
        <button className="primary-button" type="button" onClick={() => speak(card.say, settings)}>Dengarkan 🔊</button>
      </div>
      <div className="action-row">
        <button className="secondary-button" type="button" onClick={() => move(-1)}>← Sebelumnya</button>
        <button className="primary-button" type="button" onClick={() => move(1)}>Berikutnya →</button>
      </div>
    </section>
  );
}
