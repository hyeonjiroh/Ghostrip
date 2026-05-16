import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/home';
import SpotDetail from '@/pages/spot-detail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spot/:id" element={<SpotDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
