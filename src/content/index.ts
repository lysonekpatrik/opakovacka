import type { Quiz, Subject, SubjectId } from '../lib/types';
import { nezivaPriroda } from './prirodoveda/neziva-priroda';
import { slovesoCan } from './anglictina/sloveso-can';

/**
 * Seznam všech kvízů.
 * Nový kvíz = nový soubor ve složce předmětu + jeden řádek sem.
 */
export const QUIZZES: Quiz[] = [nezivaPriroda, slovesoCan];

/** Předměty v pořadí, v jakém se zobrazí na úvodní obrazovce. */
export const SUBJECTS: Subject[] = [
  { id: 'cestina', name: 'Čeština' },
  { id: 'matematika', name: 'Matematika' },
  { id: 'anglictina', name: 'Angličtina' },
  { id: 'prirodoveda', name: 'Přírodověda' },
  { id: 'vlastiveda', name: 'Vlastivěda' },
];

export const subjectById = (id: string) => SUBJECTS.find((s) => s.id === id);
export const quizzesIn = (subject: SubjectId) => QUIZZES.filter((q) => q.subject === subject);
export const quizById = (id: string) => QUIZZES.find((q) => q.id === id);

/** Jen předměty, které už mají nějaký kvíz. */
export const activeSubjects = () => SUBJECTS.filter((s) => quizzesIn(s.id).length > 0);
