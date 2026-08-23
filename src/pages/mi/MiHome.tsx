import { Link } from 'react-router-dom';

export default function MiHome() {
  return (
    <main className="screen">
      <Link className="back-button" to="/">← Pilih Jenjang</Link>
      <section className="page-head">
        <div>
          <p className="eyebrow">Madrasah Ibtidaiyah</p>
          <h1>📚 Jenjang MI</h1>
        </div>
        <span className="pill">Segera Hadir</span>
      </section>
      <section className="activity-card">
        <h2> Sedang Disiapkan 🛠️</h2>
        <p className="muted">
          Latihan pelajaran untuk jenjang MI sedang dibangun: membaca lebih lancar,
          matematika dasar, dan pengetahuan umum. Nantikan pembaruan berikutnya!
        </p>
      </section>
    </main>
  );
}
