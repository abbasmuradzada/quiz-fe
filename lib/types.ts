export type QuestionType = 'mcq' | 'tf';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'solo' | 'online';

export interface Question {
  q: string;
  type: QuestionType;
  options: string[];
  answer: number;
  difficulty: Difficulty;
}

export interface SubQuiz {
  id: string;
  name: string;
  questions: Question[];
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
  subquizzes: SubQuiz[];
}

export interface AnswerRecord {
  selected: number | null;
  correct: boolean;
  timeLeft: number;
  points: number;
  runningScore: number;
}

export interface GameFinishData {
  score: number;
  results: AnswerRecord[];
  oppScore: number;
}

export interface GradeInfo {
  letter: string;
  color: string;
  label: string;
}
