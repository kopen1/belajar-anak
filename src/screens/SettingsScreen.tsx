import type { AppSettings, ModuleId } from '../types';
import { learningModules, themePacks } from '../data/learning';
import { speak } from '../lib/audio';

interface SettingsScreenProps {
  settings: AppSettings;
  onChange: (settings: AppSettings) => void;
  onBack: () => void;
  stars: number;
}

function Toggle({ checked, onChange, title, description }: { checked: boolean; onChange: () => void; title: string; description: string }) {
  return (
    <label className="setting-row">
      <span><strong>{title}</strong><small>{description}</small></span>
      <input type="checkbox" checked={checked} onChange={onChange} />
    </label>
  );
}

export function SettingsScreen({ settings, onChange, onBack, stars }: SettingsScreenProps) {
  function update<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    onChange({ ...settings, [key]: value });
  }

  function toggleModule(moduleId: ModuleId) {
    const active = settings.enabledModules.includes(moduleId);
    if (active && settings.enabledModules.length === 1) return;
    update('enabledModules', active
      ? settings.enabledModules.filter((id) => id !== moduleId)
      : [...learningModules.map((module) => module.id).filter((id) => settings.enabledModules.includes(id) || id === moduleId)]);
  }

  return (
    <main className="screen">
      <section className="page-head"><div><p className="eyebrow">Mode orang tua</p><h1>Pengaturan Belajar</h1></div><span className="pill">{stars} ⭐</span></section>
      <section className="form-card">
        <h2>Profil Anak</h2>
        <label className="field"><span>Nama panggilan</span><input value={settings.childName} onChange={(event) => update('childName', event.target.value || 'Sahabat Cerdas')} /></label>
        <label className="field"><span>Usia</span>
          <select value={settings.ageGroup} onChange={(event) => update('ageGroup', Number(event.target.value) as AppSettings['ageGroup'])}>
            <option value={4}>4 tahun</option><option value={5}>5 tahun</option><option value={6}>6 tahun</option>
          </select>
        </label>
      </section>
      <section className="form-card">
        <h2>Suara & Audio</h2>
        <Toggle checked={settings.voiceEnabled} onChange={() => update('voiceEnabled', !settings.voiceEnabled)} title="Suara bicara" description="Membacakan soal dan instruksi secara otomatis." />
        <Toggle checked={settings.soundEffects} onChange={() => update('soundEffects', !settings.soundEffects)} title="Efek bunyi" description="Bunyi benar dan salah saat latihan." />
        <Toggle checked={settings.musicEnabled} onChange={() => update('musicEnabled', !settings.musicEnabled)} title="Musik latar" description="Nada lembut untuk membuat belajar lebih menyenangkan." />
        <label className="range-row"><span>Kecepatan bicara</span><input type="range" min={0.6} max={1.3} step={0.05} value={settings.voiceRate} onChange={(event) => update('voiceRate', Number(event.target.value))} /><output>{settings.voiceRate.toFixed(2)}×</output></label>
        <label className="range-row"><span>Nada suara</span><input type="range" min={0.8} max={1.4} step={0.05} value={settings.voicePitch} onChange={(event) => update('voicePitch', Number(event.target.value))} /><output>{settings.voicePitch.toFixed(2)}</output></label>
        <button className="secondary-button" type="button" onClick={() => speak('Halo! Aku siap belajar bersamamu.', settings)}>Uji Suara</button>
      </section>
      <section className="form-card">
        <h2>Tema Belajar</h2>
        <label className="field"><span>Pilihan tema</span>
          <select value={settings.themePack} onChange={(event) => update('themePack', event.target.value as AppSettings['themePack'])}>
            {themePacks.map((pack) => <option key={pack.id} value={pack.id}>{pack.icon} {pack.name}</option>)}
          </select>
        </label>
        <p className="muted">Tema mengubah gambar, contoh suara, dan benda berhitung.</p>
      </section>
      <section className="form-card">
        <h2>Tampilan</h2>
        <Toggle checked={settings.largeText} onChange={() => update('largeText', !settings.largeText)} title="Huruf besar" description="Membantu anak yang masih belajar membaca." />
        <label className="field"><span>Tema warna</span>
          <select value={settings.theme} onChange={(event) => update('theme', event.target.value as AppSettings['theme'])}><option value="cerah">Cerah</option><option value="lembut">Lembut</option></select>
        </label>
      </section>
      <section className="form-card">
        <h2>Modul Aktif</h2>
        <div className="toggle-grid">{learningModules.map((module) => (
          <Toggle key={module.id} checked={settings.enabledModules.includes(module.id)} onChange={() => toggleModule(module.id)} title={`${module.icon} ${module.title}`} description={module.skill} />
        ))}</div>
      </section>
      <button className="primary-button full" type="button" onClick={onBack}>Simpan & Kembali</button>
    </main>
  );
}
