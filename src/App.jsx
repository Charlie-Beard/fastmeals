import { lazy, Suspense, useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { PlanProvider } from './context/PlanContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import recipesData from './data/recipes.json';

const RecipePage = lazy(() => import('./pages/RecipePage'));
const PlanPage   = lazy(() => import('./pages/PlanPage'));

function preloadRecipeImages() {
  const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 200));
  recipesData.forEach(recipe => {
    if (!recipe.image) return;
    idle(() => { new Image().src = recipe.image; }, { timeout: 5000 });
  });
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter">
      <Suspense fallback={<div style={{ minHeight: '100dvh' }} />}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
          <Route path="/plan" element={<PlanPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    preloadRecipeImages();
    import('./pages/RecipePage');
    import('./pages/PlanPage');
  }, []);

  return (
    <BrowserRouter basename="/fastmeals">
      <PlanProvider>
        <ScrollToTop />
        <Header />
        <AnimatedRoutes />
      </PlanProvider>
    </BrowserRouter>
  );
}
