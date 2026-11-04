import { useEffect } from 'react';
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { QuizPage } from './pages/QuizPage';
import { Play } from './pages/Play';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <main className="wrap screen">
      <h1 className="page-title">Tahle stránka tu není</h1>
      <p className="lead">Odkaz je možná starý nebo neúplný.</p>
      <Link className="primary as-link" to="/">
        Zpět na úvod
      </Link>
    </main>
  );
}

export function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:subjectId/:quizId" element={<QuizPage />} />
        <Route path="/:subjectId/:quizId/:modeId" element={<Play />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}
