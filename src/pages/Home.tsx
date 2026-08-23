import { Link } from 'react-router-dom';

const jenjangList = [
  {
    path: '/tk',
    title: 'TK',
    subtitle: 'Usia 4–6 tahun',
    description: 'Membaca, berhitung, mewarnai, dan bermain sambil belajar.',
    icon: '🧸',
    color: '#ec4899',
    ready: true,
  },
  {
    path: '/mi',
    title: 'MI',
    subtitle: 'Madrasah Ibtidaiyah',
    description: 'Latihan pelajaran MI sedang disiapkan. Nantikan ya!',
    icon: '📚',
    color: '#2563eb',
    ready: false,
  },
  {
    path: '/sd',
    title: 'SD',
    subtitle: 'Sekolah Dasar',
    description: 'Materi SD sedang dibangun. Segera hadir!',
    icon: '✏️',
    color: '#059669',
    ready: false,
  },
];

export default function Home() {
  return (
    <main className="screen">
      <section className="hero">
        <div>
          <p className="eyebrow">Belajar Irkop</p>
          <h1>Pilih Jenjangmu! 🎒</h1>
          <p>Satu aplikasi untuk banyak jenjang. Ayo mulai petualangan belajarmu!</p>
        </div>
        <div className="hero-badge" aria-hidden="true">🎓</div>
      </section>

      <section className="module-grid">
        {jenjangList.map((item) =>
          item.ready ? (
            <Link key={item.path} className={`module-card ${item.title.toLowerCase()}`} to={item.path}>
              <span className="module-icon" style={{ backgroundColor: `${item.color}1a`, color: item.color }}>{item.icon}</span>
              <strong>{item.title}</strong>
              <small>{item.subtitle}</small>
              <span className="module-skill">Mulai Belajar →</span>
            </Link>
          ) : (
            <div key={item.path} className={`module-card jenjang-soon`} aria-disabled="true">
              <span className="module-icon" style={{ backgroundColor: `${item.color}1a`, color: item.color }}>{item.icon}</span>
              <strong>{item.title}</strong>
              <small>{item.subtitle}</small>
              <span className="module-skill" style={{ color: '#94a3b8' }}>Segera Hadir 🔒</span>
            </div>
          ),
        )}
        <div className="module-card jenjang-soon" aria-disabled="true">
          <span className="module-icon" style={{ backgroundColor: '#7c3aed1a', color: '#7c3aed' }}>🚀</span>
          <strong>SMP</strong>
          <small>Dalam pengembangan</small>
          <span className="module-skill" style={{ color: '#94a3b8' }}>Segera Hadir 🔒</span>
        </div>
      </section>

      <section className="parent-strip">
        <div>
          <h2>Ekosistem Irkop</h2>
          <p>Kenalan juga dengan konter.irkop.eu.org dan blog.irkop.eu.org.</p>
        </div>
      </section>
    </main>
  );
}
