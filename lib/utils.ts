 import type { SubQuiz, Question, Difficulty } from './types';
import { OPPONENT_NAMES } from './constants';

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function prepareQuestions(subquiz: SubQuiz, difficulty: Difficulty): Question[] {
  const primary = subquiz.questions.filter(q => q.difficulty === difficulty);
  const other   = subquiz.questions.filter(q => q.difficulty !== difficulty);
  return shuffle([...primary, ...other]).slice(0, 30);
}

export function genRoom(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function randName(): string {
  return OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)];
}
