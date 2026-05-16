import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/home';
import SpotDetailPage from './pages/spot-detail';
import PhotoGeneratePage from './pages/photo-generate';
import NotFoundPage from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/spots/:spotId" element={<SpotDetailPage />} />
        <Route path="/photo-generate" element={<PhotoGeneratePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
