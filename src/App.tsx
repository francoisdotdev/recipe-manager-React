// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Catalog from "./pages/Catalog";
import Recipe from "./pages/Recettes";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Catalog />} />
      <Route path="/recipe/:name" element={<Recipe />} />
    </Routes>
  );
}