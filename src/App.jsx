import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { PlanProvider } from './context/PlanContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import PlanPage from './pages/PlanPage';

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
  return (
    <HashRouter>
      <PlanProvider>
        <Header />
        <AnimatedRoutes />
      </PlanProvider>
    </HashRouter>
  );
}
