import { useEffect, useState } from 'react';
import type { AppSettings } from '../types';
import type { QuizQuestion } from '../lib/questions';
import { playChime, speak } from '../lib/audio';

interface QuizActivityProps {
  title: string;
  settings: AppSettings;
  generateQuestion: () => QuizQuestion;
  autoSpeak?: boolean;
  onComplete: (moduleId: string, earnedStar: boolean) => void;
}

export function QuizActivity({ title, settings, generateQuestion, autoSpeak = false, onComplete }: QuizActivityProps) {
  const [question, setQuestion] = useState(generateQuestion);
  const [selected, setSelected] = useState<string | undefined>();
  const [wrongOption, setWrongOption] = useState<string | undefined>();
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setSelected(undefined);
    setWrongOption(undefined);
    if (autoSpeak) speak(question.say, settings);
  }, [autoSpeak, question, settings]);

  function choose(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === question.answer) {
      playChime(settings.soundEffects, true);
      const nextCorrect = correctCount + 1;
      const nextStreak = streak + 1;
      setCorrectCount(nextCorrect);
      setStreak(nextStreak);
      if (nextCorrect % 5 === 0) onComplete(question.id, true);
      window.setTimeout(() => setQuestion(generateQuestion()), 800);
    } else {
      setWrongOption(option);
      setStreak(0);
      playChime(settings.soundEffects, false);
      window.setTimeout(() => {
        setSelected(undefined);
        setWrongOption(undefined);
        speak('Coba lagi ya!', settings);
      }, 700);
    }
  }

  return (
    <section className="activity-card">
      <div className="section-head">
        <h2>{title}</h2>
        <span className="pill">{streak >= 3 ? `🔥 ${streak}x` : `${correctCount} benar`}</span>
      </div>
      <p className="continuous-note">Latihan berlanjut. Setiap 5 jawaban benar mendapat bintang.</p>
      <button className="prompt-visual" type="button" onClick={() => speak(question.say, settings)}>
        <span aria-hidden="true">{question.visual}</span>
      </button>
      <p className="question-prompt">{question.prompt}</p>
      <div className={`choice-grid ${question.options.some((option) => option.length > 2 || /^\d+$/.test(option)) ? 'wide' : ''}`}>
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            className={['choice', selected === option && option === question.answer ? 'correct' : '', wrongOption === option ? 'wrong' : ''].join(' ').trim()}
            onClick={() => choose(option)}
            disabled={Boolean(selected)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="action-row"><button className="secondary-button" type="button" onClick={() => setQuestion(generateQuestion())}>Soal Berikutnya</button></div>
    </section>
  );
}
