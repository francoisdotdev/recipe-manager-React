// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Catalog from "./pages/Catalog";
import Recipe from "./pages/RecipeDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Catalog />} />
      <Route path="/recipe/:name" element={<Recipe />} />
      <Route path="*" element={<p>Page introuvable</p>} />
    </Routes>
  );
}