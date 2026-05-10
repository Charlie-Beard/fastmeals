import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { PlanProvider } from './context/PlanContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import PlanPage from './pages/PlanPage';
import recipesData from './data/recipes.json';

function preloadRecipeImages() {
  const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 200));
  recipesData.forEach(recipe => {
    if (!recipe.image) return;
    idle(() => { new Image().src = recipe.image; }, { timeout: 5000 });
  });
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter">
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/plan" element={<PlanPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  useEffect(() => { preloadRecipeImages(); }, []);

  return (
    <BrowserRouter basename="/fastmeals">
      <PlanProvider>
        <Header />
        <AnimatedRoutes />
      </PlanProvider>
    </BrowserRouter>
  );
}
