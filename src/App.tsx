import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home';
import NotFoundPage from './pages/NotFound';
import SpotPage from './pages/spot-detail';
import PhotoGeneratePage from './pages/photo-generate';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/photo-generate" element={<PhotoGeneratePage />} />
        <Route path="/spots/:spotId" element={<SpotPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
