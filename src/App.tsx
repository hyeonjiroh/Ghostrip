import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/home";
import PhotoGeneratePage from "./pages/photo-generate";
import SpotDetailPage from "./pages/spot-detail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/photo-generate"
          element={<PhotoGeneratePage />}
        />

        <Route
          path="/spots/:spotId"
          element={<SpotDetailPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;