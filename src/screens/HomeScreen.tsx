import type { AppSettings, LearningModule, Progress } from '../types';

interface HomeScreenProps {
  settings: AppSettings;
  modules: LearningModule[];
  progress: Progress;
  onOpenModule: (moduleId: LearningModule['id']) => void;
  onOpenSettings: () => void;
  onOpenDraw: () => void;
  onToggleMusic: () => void;
}

export function HomeScreen({ settings, modules, progress, onOpenModule, onOpenSettings, onOpenDraw, onToggleMusic }: HomeScreenProps) {
  return (
    <main className="screen">
      <section className="hero">
        <div>
          <p className="eyebrow">Ayo belajar hari ini</p>
          <h1>Hai, {settings.childName}! 👋</h1>
          <p>Kamu sudah mengumpulkan <strong>{progress.stars}</strong> bintang. Pilih satu petualangan seru!</p>
        </div>
        <div className="hero-actions">
          <button className="music-button" type="button" onClick={onToggleMusic}>{settings.musicEnabled ? '🎵 Musik On' : '🔇 Musik Off'}</button>
          <div className="hero-badge" aria-hidden="true">🌟</div>
        </div>
      </section>

      <section className="module-grid">
        {modules.map((module) => (
          <button key={module.id} className={`module-card ${module.id}`} type="button" onClick={() => onOpenModule(module.id)}>
            <span className="module-icon" style={{ backgroundColor: `${module.color}1a`, color: module.color }}>{module.icon}</span>
            <strong>{module.title}</strong>
            <small>{module.subtitle}</small>
            <span className="module-skill">{module.skill}</span>
          </button>
        ))}
        <button key="menggambar" className="module-card menggambar" type="button" onClick={onOpenDraw}>
          <span className="module-icon" style={{ backgroundColor: '#ec48991a', color: '#ec4899' }}>🖍️</span>
          <strong>Mewarnai</strong>
          <small>Warnai contoh gambar</small>
          {(progress.completed['menggambar'] ?? 0) > 0 && (
            <span className="module-skill" style={{ color: '#ec4899' }}>{progress.completed['menggambar']} karya selesai ⭐</span>
          )}
          <span className="module-skill">Kreativitas &amp; motorik</span>
        </button>
      </section>

      <section className="parent-strip">
        <div><h2>Untuk Orang Tua</h2><p>Atur suara, tingkat kesulitan, modul aktif, dan tampilan.</p></div>
        <button className="secondary-button" type="button" onClick={onOpenSettings}>Buka Pengaturan</button>
      </section>
    </main>
  );
}
