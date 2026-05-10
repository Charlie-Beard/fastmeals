import { lazy, Suspense, useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { PlanProvider } from './context/PlanContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import recipesData from './data/recipes.json';

const RecipePage = lazy(() => import('./pages/RecipePage'));
const PlanPage   = lazy(() => import('./pages/PlanPage'));

// Take over scroll restoration so the browser never animates it
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// In-memory store: pathname → scrollY
const scrollPositions = new Map();

function preloadRecipeImages() {
  const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 200));
  recipesData.forEach(recipe => {
    if (!recipe.image) return;
    idle(() => { new Image().src = recipe.image; }, { timeout: 5000 });
  });
}

function ScrollRestorer() {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useLayoutEffect(() => {
    if (navType === 'POP') {
      // Back/forward navigation — restore the saved position instantly
      window.scrollTo({ top: scrollPositions.get(pathname) ?? 0, left: 0, behavior: 'instant' });
    } else {
      // Forward navigation — always start at the top
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    return () => {
      // Save position when leaving this route
      scrollPositions.set(pathname, window.scrollY);
    };
  }, [pathname]);

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
        <ScrollRestorer />
        <Header />
        <AnimatedRoutes />
      </PlanProvider>
    </BrowserRouter>
  );
}
