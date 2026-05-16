import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/home";
import PhotoGeneratePage from "./pages/photo-generate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/photo-generate"
          element={<PhotoGeneratePage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;