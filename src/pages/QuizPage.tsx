import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { quizById, subjectById } from '../content';
import { bestScore } from '../lib/progress';
import { Icon } from '../components/Icon';
import { Cheatsheet } from '../components/Cheatsheet';
import { NotFoundQuiz } from '../components/NotFoundQuiz';

export function QuizPage() {
  const { subjectId = '', quizId = '' } = useParams();
  const quiz = quizById(quizId);
  const subject = subjectById(subjectId);
  const [toast, setToast] = useState<string | null>(null);

  if (!quiz || !subject || quiz.subject !== subject.id) return <NotFoundQuiz />;

  const share = async () => {
    const url = window.location.href;
    const data = { title: `Opakovačka: ${quiz.title}`, text: `Procvič si ${quiz.title} v Opakovačce.`, url };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast('Odkaz je zkopírovaný. Pošli ho kamarádům.');
    } catch (e) {
      if ((e as DOMException)?.name === 'AbortError') return;
      setToast(`Zkopíruj si odkaz: ${url}`);
    }
    window.setTimeout(() => setToast(null), 5000);
  };

  return (
    <main className="wrap screen" data-subject={subject.id}>
      <nav className="topnav">
        <Link className="ghost back" to="/">
          <Icon name="back" size={18} />
          Všechna témata
        </Link>
      </nav>

      <header className="page">
        <p className="subject-name">{subject.name}, {quiz.grade}. ročník</p>
        <h1 className="page-title">{quiz.title}</h1>
        <p className="lead">{quiz.description} Vyber si, jak chceš trénovat.</p>
        <div className="row">
          <button type="button" className="ghost" onClick={share}>
            <Icon name="share" size={18} />
            Poslat kamarádům
          </button>
        </div>
        {toast && (
          <p className="toast" role="status">
            {toast}
          </p>
        )}
      </header>

      <div className="modes">
        {quiz.modes.map((m) => {
          const best = bestScore(quiz.id, m.id);
          return (
            <Link key={m.id} className={`mode${m.featured ? ' featured' : ''}`} to={`/${subject.id}/${quiz.id}/${m.id}`}>
              <span className="mode-icon">
                <Icon name={m.icon} size={26} />
              </span>
              <span className="mode-text">
                <span className="mode-name">{m.name}</span>
                <span className="mode-desc">{m.description}</span>
                {best !== null && <span className="mode-best">Nejlepší výsledek: {best} %</span>}
              </span>
            </Link>
          );
        })}
      </div>

      {quiz.cheatsheet && <Cheatsheet blocks={quiz.cheatsheet} />}
    </main>
  );
}
