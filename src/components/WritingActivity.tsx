import { useEffect, useRef, useState } from 'react';
import type { AppSettings } from '../types';
import { playChime, speak } from '../lib/audio';

const targets = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', ...'0123456789'];

interface WritingActivityProps {
  settings: AppSettings;
  moduleId: string;
  onComplete: (moduleId: string, earnedStar: boolean) => void;
}

export function WritingActivity({ settings, moduleId, onComplete }: WritingActivityProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [targetIndex, setTargetIndex] = useState(0);
  const target = targets[targetIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 18;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#2563eb';
  }, [targetIndex]);

  function position(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * event.currentTarget.width,
      y: ((event.clientY - rect.top) / rect.height) * event.currentTarget.height,
    };
  }

  function startDraw(event: React.PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    lastPoint.current = position(event);
  }

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || !lastPoint.current) return;
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    const point = position(event);
    context.beginPath();
    context.moveTo(lastPoint.current.x, lastPoint.current.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    lastPoint.current = point;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function finish() {
    playChime(settings.soundEffects, true);
    speak(`Bagus sekali! Kamu menulis ${target}`, settings);
    onComplete(moduleId, true);
    clearCanvas();
    setTargetIndex((current) => (current + 1) % targets.length);
  }

  return (
    <section className="activity-card">
      <div className="section-head"><h2>Papan Menulis</h2><span>{targetIndex + 1}/{targets.length}</span></div>
      <p className="muted">Telusuri huruf atau angka di atas garis putus-putus.</p>
      <div className="writing-stage">
        <span className="trace-letter" aria-hidden="true">{target}</span>
        <canvas
          ref={canvasRef}
          width={720}
          height={520}
          onPointerDown={startDraw}
          onPointerMove={draw}
          onPointerUp={() => { drawing.current = false; lastPoint.current = null; }}
          onPointerLeave={() => { drawing.current = false; lastPoint.current = null; }}
        />
      </div>
      <div className="action-row">
        <button className="secondary-button" type="button" onClick={() => speak(`Tulis huruf ${target}`, settings)}>Dengarkan</button>
        <button className="secondary-button" type="button" onClick={clearCanvas}>Hapus</button>
        <button className="primary-button" type="button" onClick={finish}>Selesai ✓</button>
      </div>
    </section>
  );
}
