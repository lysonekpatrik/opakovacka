import { Link } from 'react-router-dom';

export function NotFoundQuiz() {
  return (
    <main className="wrap screen">
      <h1 className="page-title">Tohle téma tu není</h1>
      <p className="lead">Odkaz je možná starý nebo neúplný. Všechna témata najdeš na úvodní stránce.</p>
      <Link className="primary as-link" to="/">
        Zpět na úvod
      </Link>
    </main>
  );
}
