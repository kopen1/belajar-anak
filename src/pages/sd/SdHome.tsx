import { Link } from 'react-router-dom';

export default function SdHome() {
  return (
    <main className="screen">
      <Link className="back-button" to="/">← Pilih Jenjang</Link>
      <section className="page-head">
        <div>
          <p className="eyebrow">Sekolah Dasar</p>
          <h1>✏️ Jenjang SD</h1>
        </div>
        <span className="pill">Segera Hadir</span>
      </section>
      <section className="activity-card">
        <h2>Sedang Dibangun 🏗️</h2>
        <p className="muted">
          Materi SD sedang disusun: matematika, bahasa, IPA ringan, dan kuis interaktif.
          Pantau terus perkembangannya!
        </p>
      </section>
    </main>
  );
}
