import { useCallback, useEffect, useRef, useState } from 'react';
import type { AppSettings } from '../types';
import { playChime, speak } from '../lib/audio';
import { coloringTemplates, templateCategories, type TemplateCategory } from '../data/coloring';
import { floodFill } from '../lib/floodFill';
import { useLocalStorage } from '../lib/storage';

interface Artwork {
  id: string;
  label: string;
  src: string;
  createdAt: number;
}

const defaultGallery: { items: Artwork[] } = { items: [] };

type ModeId = 'warnai' | 'bebas';
type ToolId = 'kuas' | 'isi' | 'hapus';

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 520;
const MAX_UNDO_STEPS = 12;

const palette = [
  { id: 'hitam', label: 'Hitam', value: '#1f2937' },
  { id: 'abu', label: 'Abu-abu', value: '#94a3b8' },
  { id: 'putih', label: 'Putih', value: '#ffffff' },
  { id: 'merah', label: 'Merah', value: '#ef4444' },
  { id: 'oranye', label: 'Oranye', value: '#f97316' },
  { id: 'kuning', label: 'Kuning', value: '#facc15' },
  { id: 'hijau', label: 'Hijau', value: '#22c55e' },
  { id: 'toska', label: 'Toska', value: '#06b6d4' },
  { id: 'biru', label: 'Biru', value: '#3b82f6' },
  { id: 'ungu', label: 'Ungu', value: '#a855f7' },
  { id: 'pink', label: 'Pink', value: '#ec4899' },
  { id: 'coklat', label: 'Coklat', value: '#92400e' },
];

const brushSizes = [
  { id: 'tipis', label: 'Tipis', px: 6 },
  { id: 'sedang', label: 'Sedang', px: 14 },
  { id: 'tebal', label: 'Tebal', px: 26 },
];

const tools: Array<{ id: ToolId; label: string; icon: string }> = [
  { id: 'kuas', label: 'Kuas', icon: '🖌️' },
  { id: 'isi', label: 'Isi Warna', icon: '🪣' },
  { id: 'hapus', label: 'Penghapus', icon: '🧽' },
];

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

interface DrawScreenProps {
  settings: AppSettings;
  onBack: () => void;
  onComplete: (moduleId: string, earnedStar: boolean) => void;
}

interface SwatchProps {
  color: string;
  tool: ToolId;
  onPick: (value: string) => void;
}

function ColorSwatches({ color, tool, onPick }: SwatchProps) {
  return (
    <div className="palette" role="radiogroup" aria-label="Pilih warna">
      {palette.map((item) => (
        <button
          key={item.id}
          className={`swatch ${color === item.value && tool !== 'hapus' ? 'active' : ''}`}
          style={{ backgroundColor: item.value }}
          role="radio"
          aria-checked={color === item.value && tool !== 'hapus'}
          aria-label={`Warna ${item.label}`}
          title={item.label}
          type="button"
          onClick={() => onPick(item.value)}
        />
      ))}
    </div>
  );
}

interface ToolRowProps {
  tool: ToolId;
  sizeIndex: number;
  canUndo: boolean;
  onTool: (id: ToolId) => void;
  onSize: (index: number) => void;
  onUndo: () => void;
}

function ToolButtons({ tool, sizeIndex, canUndo, onTool, onSize, onUndo }: ToolRowProps) {
  return (
    <div className="tool-row" role="radiogroup" aria-label="Pilih alat">
      {tools.map((item) => (
        <button
          key={item.id}
          className={`tool-button ${tool === item.id ? 'active' : ''}`}
          role="radio"
          aria-checked={tool === item.id}
          type="button"
          onClick={() => onTool(item.id)}
        >
          <span aria-hidden="true">{item.icon}</span> {item.label}
        </button>
      ))}
      {brushSizes.map((size, index) => (
        <button
          key={size.id}
          className={`tool-button size-button ${sizeIndex === index ? 'active' : ''}`}
          role="radio"
          aria-checked={sizeIndex === index}
          aria-label={`Kuas ${size.label}`}
          type="button"
          onClick={() => onSize(index)}
        >
          <span className="size-dot" style={{ width: Math.max(8, size.px), height: Math.max(8, size.px) }} aria-hidden="true" />
          {size.label}
        </button>
      ))}
      <button className="tool-button" type="button" disabled={!canUndo} onClick={onUndo}>↩️ Urungkan</button>
    </div>
  );
}

export function DrawScreen({ settings, onBack, onComplete }: DrawScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const undoStack = useRef<ImageData[]>([]);
  const generation = useRef(0);

  const [mode, setMode] = useState<ModeId>('warnai');
  const [templateIndex, setTemplateIndex] = useState(0);
  const [tool, setTool] = useState<ToolId>('kuas');
  const [color, setColor] = useState(palette[8].value);
  const [sizeIndex, setSizeIndex] = useState(1);
  const [canUndo, setCanUndo] = useState(false);
  const [cheer, setCheer] = useState('');
  const [showExample, setShowExample] = useState(true);
  const [immersive, setImmersive] = useState(false);
  const [barHeight, setBarHeight] = useState(222);
  const [category, setCategory] = useState<'semua' | TemplateCategory>('semua');
  const [gallery, setGallery] = useLocalStorage('belajar.artworks.v1', defaultGallery);
  const [zoom, setZoom] = useState({ scale: 1, tx: 0, ty: 0 });

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ dist: number; scale: number; mx: number; my: number; tx: number; ty: number } | null>(null);

  const template = coloringTemplates[templateIndex];
  const visibleTemplates =
    category === 'semua' ? coloringTemplates : coloringTemplates.filter((item) => item.category === category);

  function pushUndo() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    undoStack.current.push(context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT));
    if (undoStack.current.length > MAX_UNDO_STEPS) undoStack.current.shift();
    setCanUndo(true);
  }

  const resetBase = useCallback(
    async (recordUndo: boolean) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (!canvas || !context) return;
      if (recordUndo) pushUndo();
      const currentGeneration = ++generation.current;
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      if (mode === 'warnai') {
        try {
          const image = await loadImage(template.src);
          if (generation.current !== currentGeneration) return;
          context.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        } catch {
          return;
        }
      }
    },
    [mode, templateIndex],
  );

  useEffect(() => {
    void resetBase(false);
  }, [mode, templateIndex, resetBase]);

  useEffect(() => {
    if (!cheer) return;
    const timer = window.setTimeout(() => setCheer(''), 2600);
    return () => window.clearTimeout(timer);
  }, [cheer]);

  useEffect(() => {
    if (!immersive) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setImmersive(false);
    };
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) setImmersive(false);
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.body.style.overflow = '';
    };
  }, [immersive]);

  useEffect(() => {
    if (!immersive) return;
    const measure = () => {
      const height = barRef.current?.offsetHeight;
      if (height) setBarHeight(height);
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    const observer = new ResizeObserver(measure);
    if (barRef.current) observer.observe(barRef.current);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
      observer.disconnect();
    };
  }, [immersive]);

  async function enterFull() {
    setImmersive(true);
    const element = backdropRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> | void }) | null;
    if (!element) return;
    try {
      if (document.fullscreenEnabled && element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      }
    } catch {
      return;
    }
  }

  function exitFull() {
    const doc = document as Document & { webkitExitFullscreen?: () => void };
    if (doc.fullscreenElement) {
      if (doc.exitFullscreen) void doc.exitFullscreen().catch(() => {});
      else doc.webkitExitFullscreen?.();
    }
    setImmersive(false);
  }

  function position(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * event.currentTarget.width,
      y: ((event.clientY - rect.top) / rect.height) * event.currentTarget.height,
    };
  }

  function strokeStyle() {
    return tool === 'hapus' ? '#ffffff' : color;
  }

  function strokeWidth() {
    return brushSizes[sizeIndex].px;
  }

  function startDraw(event: React.PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size >= 2) {
      drawing.current = false;
      lastPoint.current = null;
      const [first, second] = [...pointers.current.values()];
      pinchStart.current = {
        dist: Math.hypot(second.x - first.x, second.y - first.y) || 1,
        scale: zoom.scale,
        mx: (first.x + second.x) / 2,
        my: (first.y + second.y) / 2,
        tx: zoom.tx,
        ty: zoom.ty,
      };
      return;
    }
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    const point = position(event);
    pushUndo();
    if (tool === 'isi') {
      drawing.current = false;
      lastPoint.current = null;
      floodFill(context, point.x, point.y, color);
      return;
    }
    drawing.current = true;
    lastPoint.current = point;
    context.fillStyle = strokeStyle();
    context.beginPath();
    context.arc(point.x, point.y, strokeWidth() / 2, 0, Math.PI * 2);
    context.fill();
  }

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pinchStart.current && pointers.current.size >= 2) {
      const [first, second] = [...pointers.current.values()];
      const dist = Math.hypot(second.x - first.x, second.y - first.y) || 1;
      const midX = (first.x + second.x) / 2;
      const midY = (first.y + second.y) / 2;
      const scale = Math.min(4, Math.max(1, pinchStart.current.scale * (dist / pinchStart.current.dist)));
      setZoom({
        scale,
        tx: pinchStart.current.tx + (midX - pinchStart.current.mx),
        ty: pinchStart.current.ty + (midY - pinchStart.current.my),
      });
      return;
    }
    if (!drawing.current || !lastPoint.current) return;
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    const point = position(event);
    context.strokeStyle = strokeStyle();
    context.lineWidth = strokeWidth();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(lastPoint.current.x, lastPoint.current.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    lastPoint.current = point;
  }

  function stopDraw(event?: React.PointerEvent<HTMLCanvasElement>) {
    if (event) pointers.current.delete(event.pointerId);
    else pointers.current.clear();
    if (pointers.current.size < 2) pinchStart.current = null;
    drawing.current = false;
    lastPoint.current = null;
  }

  function toggleZoom(clientX: number, clientY: number) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setZoom((current) => {
      if (current.scale > 1.01) return { scale: 1, tx: 0, ty: 0 };
      return { scale: 2, tx: -(clientX - rect.left), ty: -(clientY - rect.top) };
    });
  }

  function undoStep() {
    const snapshot = undoStack.current.pop();
    const context = canvasRef.current?.getContext('2d');
    if (snapshot && context) context.putImageData(snapshot, 0, 0);
    setCanUndo(undoStack.current.length > 0);
  }

  function pickColor(value: string) {
    setColor(value);
    if (tool === 'hapus') setTool('kuas');
  }

  function speakSay(index: number) {
    const target = coloringTemplates[index];
    if (target) speak(target.say, settings);
  }

  function selectTemplate(index: number) {
    setTemplateIndex(index);
    speakSay(index);
  }

  function stepTemplate(step: number) {
    const list = visibleTemplates;
    const position = list.findIndex((item) => item.id === template.id);
    const next = list[(position + step + list.length) % list.length];
    selectTemplate(coloringTemplates.indexOf(next));
  }

  function finish() {
    playChime(settings.soundEffects, true);
    speak(
      mode === 'warnai' ? `Wah, ${template.label} karyamu bagus sekali!` : 'Wah, karyamu bagus sekali!',
      settings,
    );
    onComplete('menggambar', true);
    setCheer('⭐ Kamu dapat 1 bintang!');
  }

  function saveArtwork() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const artwork: Artwork = {
      id: String(Date.now()),
      label: mode === 'warnai' ? template.label : 'Gambar Bebas',
      src: canvas.toDataURL('image/png'),
      createdAt: Date.now(),
    };
    setGallery((current) => ({ items: [artwork, ...current.items].slice(0, 12) }));
    playChime(settings.soundEffects, true);
    speak('Karyamu sudah disimpan!', settings);
  }

  async function loadArtwork(artwork: Artwork) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    pushUndo();
    const currentGeneration = ++generation.current;
    context.globalCompositeOperation = 'source-over';
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    try {
      const image = await loadImage(artwork.src);
      if (generation.current !== currentGeneration) return;
      context.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } catch {
      return;
    }
  }

  const stageNode = (
    <div className="draw-stage">
      <div
        className="draw-zoom"
        style={{ transform: `translate(${zoom.tx}px, ${zoom.ty}px) scale(${zoom.scale})` }}
      >
        {mode === 'warnai' && (
          <div className="draw-template-layer" aria-hidden="true">
            <img src={template.src} alt="" draggable={false} />
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onPointerDown={startDraw}
          onPointerMove={draw}
          onPointerUp={stopDraw}
          onPointerCancel={stopDraw}
          onPointerLeave={stopDraw}
          onDoubleClick={(event) => toggleZoom(event.clientX, event.clientY)}
        />
      </div>
      {zoom.scale > 1.01 && (
        <button
          className="zoom-reset"
          type="button"
          aria-label="Kembalikan zoom ke normal"
          onClick={() => setZoom({ scale: 1, tx: 0, ty: 0 })}
        >
          🔍 {(Math.round(zoom.scale * 10) / 10).toFixed(1)}× ↺
        </button>
      )}
      {!immersive && (
        <button
          className="stage-full-button"
          type="button"
          aria-label="Layar penuh"
          onClick={() => void enterFull()}
        >
          ⛶ Layar Penuh
        </button>
      )}
    </div>
  );

  return (
    <main className="screen">
      <button className="back-button" type="button" onClick={onBack}>← Beranda</button>
      <section className="page-head">
        <div>
          <p className="eyebrow">🖍️ Studio Kreatif</p>
          <h1>🎨 Menggambar &amp; Mewarnai</h1>
        </div>
        <span className="pill">Motorik halus &amp; kreativitas</span>
      </section>

      <div className="mode-tabs" role="tablist" aria-label="Jenis aktivitas menggambar">
        <button
          className={mode === 'warnai' ? 'active' : ''}
          role="tab"
          aria-selected={mode === 'warnai'}
          type="button"
          onClick={() => setMode('warnai')}
        >
          Mewarnai Contoh
        </button>
        <button
          className={mode === 'bebas' ? 'active' : ''}
          role="tab"
          aria-selected={mode === 'bebas'}
          type="button"
          onClick={() => setMode('bebas')}
        >
          Gambar Bebas
        </button>
      </div>

      {mode === 'warnai' && (
        <>
          <p className="continuous-note">Pilih contoh gambar, lalu warnai seperti contoh jadi di sebelah kanan!</p>
          <div className="cat-chips" role="tablist" aria-label="Kategori gambar">
            {templateCategories.map((item) => (
              <button
                key={item.id}
                className={`chip ${category === item.id ? 'active' : ''}`}
                role="tab"
                aria-selected={category === item.id}
                type="button"
                onClick={() => setCategory(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="template-grid" role="listbox" aria-label="Contoh gambar mewarnai">
            {visibleTemplates.map((item) => (
              <button
                key={item.id}
                className={`template-card ${item.id === template.id ? 'active' : ''}`}
                role="option"
                aria-selected={item.id === template.id}
                aria-label={`Contoh ${item.label}`}
                type="button"
                onClick={() => selectTemplate(coloringTemplates.indexOf(item))}
              >
                <img src={item.src} alt="" draggable={false} loading="lazy" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      <div className={`draw-workspace ${mode === 'bebas' ? 'solo' : ''}`}>
        <div
          className={`draw-backdrop ${immersive ? 'open' : ''}`}
          ref={backdropRef}
          style={{ '--bar-h': `${barHeight}px` } as React.CSSProperties}
        >
          {stageNode}
          {immersive && mode === 'warnai' && (
            <div className="ref-float" aria-label={`Contoh ${template.label}`}>
              <img src={template.doneSrc} alt="" draggable={false} />
              <span>{template.label}</span>
            </div>
          )}
          {immersive && (
            <p className="rotate-hint" aria-hidden="true">🔄 Putar HP ke lanskap ya!</p>
          )}
          {immersive && (
            <div className="immersive-bar" ref={barRef}>
              <ColorSwatches color={color} tool={tool} onPick={pickColor} />
              <ToolButtons
                tool={tool}
                sizeIndex={sizeIndex}
                canUndo={canUndo}
                onTool={setTool}
                onSize={setSizeIndex}
                onUndo={undoStep}
              />
              <div className="action-row immersive-actions">
                {mode === 'warnai' && (
                  <>
                    <button className="secondary-button" type="button" aria-label="Gambar sebelumnya" onClick={() => stepTemplate(-1)}>⬅️</button>
                    <button className="primary-button" type="button" onClick={() => stepTemplate(1)}>Gambar Berikutnya ➡️</button>
                  </>
                )}
                <button className="secondary-button" type="button" onClick={saveArtwork}>💾 Simpan</button>
                <button className="secondary-button" type="button" onClick={() => void resetBase(true)}>🗑️ Hapus</button>
                <button className="primary-button" type="button" onClick={finish}>Selesai ✓</button>
                <button className="secondary-button" type="button" onClick={exitFull}>✕ Keluar</button>
              </div>
            </div>
          )}
        </div>
        {mode === 'warnai' && (
          <aside className="example-card">
            <div className="section-head">
              <h3>🖼️ Contoh Jadi</h3>
              <button className="mini-toggle" type="button" onClick={() => setShowExample((current) => !current)}>
                {showExample ? '🙈 Sembunyikan' : '👁️ Lihat'}
              </button>
            </div>
            {showExample ? (
              <>
                <img src={template.doneSrc} alt={`Contoh ${template.label} yang sudah diwarnai`} draggable={false} />
                <p>Warnai <strong>{template.label}</strong> mirip contoh ini ya! Boleh juga pakai warna favoritmu sendiri.</p>
              </>
            ) : (
              <p className="muted">Contoh disembunyikan. Ayo warnai dari imajinasimu!</p>
            )}
          </aside>
        )}
      </div>

      <section className="activity-card studio-card">
        <div className="section-head">
          <h2>{tool === 'hapus' ? '🧽 Penghapus Aktif' : '🎨 Kotak Alat'}</h2>
          {cheer ? <span className="pill">{cheer}</span> : <span className="pill">{mode === 'warnai' ? template.label : 'Bebas Berkarya'}</span>}
        </div>

        <ColorSwatches color={color} tool={tool} onPick={pickColor} />

        <ToolButtons
          tool={tool}
          sizeIndex={sizeIndex}
          canUndo={canUndo}
          onTool={setTool}
          onSize={setSizeIndex}
          onUndo={undoStep}
        />

        <div className="action-row">
          <button className="secondary-button" type="button" disabled={!canUndo} onClick={undoStep}>↩️ Urungkan</button>
          <button className="secondary-button" type="button" onClick={() => void resetBase(true)}>🗑️ Hapus Semua</button>
          {mode === 'warnai' && (
            <>
              <button className="secondary-button" type="button" aria-label="Gambar sebelumnya" onClick={() => stepTemplate(-1)}>⬅️</button>
              <button className="primary-button" type="button" onClick={() => stepTemplate(1)}>Gambar Berikutnya ➡️</button>
            </>
          )}
          <button className="secondary-button" type="button" onClick={saveArtwork}>💾 Simpan</button>
          <button className="secondary-button" type="button" onClick={() => void enterFull()}>⛶ Layar Penuh</button>
          <button className="primary-button" type="button" onClick={finish}>Selesai ✓</button>
        </div>
      </section>

      {gallery.items.length > 0 && (
        <section className="activity-card studio-card">
          <div className="section-head">
            <h2>🖼️ Karyaku</h2>
            <span className="pill">{gallery.items.length}/12</span>
          </div>
          <div className="gallery-grid">
            {gallery.items.map((artwork) => (
              <figure key={artwork.id} className="art-card">
                <img src={artwork.src} alt={`Karya ${artwork.label}`} draggable={false} onClick={() => void loadArtwork(artwork)} />
                <figcaption>
                  <span>{artwork.label}</span>
                  <button
                    type="button"
                    aria-label={`Hapus karya ${artwork.label}`}
                    onClick={() => setGallery((current) => ({ items: current.items.filter((item) => item.id !== artwork.id) }))}
                  >
                    🗑️
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
