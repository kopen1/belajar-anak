import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import TkHome from './pages/tk/TkHome';
import MiHome from './pages/mi/MiHome';
import SdHome from './pages/sd/SdHome';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tk/*" element={<TkHome />} />
      <Route path="/mi" element={<MiHome />} />
      <Route path="/sd" element={<SdHome />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
