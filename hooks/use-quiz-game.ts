import { useState, useEffect, useRef, useCallback } from 'react';
import type { Question, AnswerRecord, GameFinishData } from '@/lib/types';
import { speedBonus } from '@/lib/scoring';
import { OPPONENT_ACCURACY } from '@/lib/constants';

interface UseQuizGameOptions {
  questions: Question[];
  mode: 'solo' | 'online';
  onFinish: (data: GameFinishData) => void;
}

interface QuizGameState {
  currentQ: number;
  timeLeft: number;
  phase: 'answering' | 'feedback';
  selected: number | null;
  score: number;
  oppScore: number;
  oppAnswered: boolean;
  q: Question;
  handleAnswer: (idx: number | null) => void;
}

export function useQuizGame({ questions, mode, onFinish }: UseQuizGameOptions): QuizGameState {
  const [currentQ,    setCurrentQ]    = useState(0);
  const [timeLeft,    setTimeLeft]    = useState(10);
  const [phase,       setPhase]       = useState<'answering' | 'feedback'>('answering');
  const [selected,    setSelected]    = useState<number | null>(null);
  const [score,       setScore]       = useState(0);
  const [oppScore,    setOppScore]    = useState(0);
  const [oppAnswered, setOppAnswered] = useState(false);

  // Refs let callbacks read current values without stale closures
  const phaseRef     = useRef<'answering' | 'feedback'>('answering');
  const timeRef      = useRef(10);
  const scoreRef     = useRef(0);
  const answersRef   = useRef<AnswerRecord[]>([]);
  const oppScoreRef  = useRef(0);

  const q = questions[currentQ];

  const advanceQuestion = useCallback((record: AnswerRecord) => {
    answersRef.current = [...answersRef.current, record];
    scoreRef.current   = record.runningScore;

    setTimeout(() => {
      const next = currentQ + 1;
      if (next >= questions.length) {
        onFinish({
          score:   record.runningScore,
          results: answersRef.current,
          oppScore: oppScoreRef.current,
        });
      } else {
        setCurrentQ(next);
      }
    }, 1500);
  }, [currentQ, questions.length, onFinish]);

  const handleAnswer = useCallback((idx: number | null) => {
    if (phaseRef.current !== 'answering') return;
    phaseRef.current = 'feedback';
    setPhase('feedback');
    setSelected(idx);

    const tl        = timeRef.current;
    const isCorrect = idx !== null && idx === q.answer;
    const pts       = isCorrect ? 100 + speedBonus(tl) : 0;
    const newScore  = scoreRef.current + pts;

    setScore(newScore);
    advanceQuestion({ selected: idx, correct: isCorrect, timeLeft: tl, points: pts, runningScore: newScore });
  }, [q, advanceQuestion]);

  // Reset per-question state when question index changes
  useEffect(() => {
    phaseRef.current = 'answering';
    timeRef.current  = 10;
    setTimeLeft(10);
    setPhase('answering');
    setSelected(null);
    setOppAnswered(false);
  }, [currentQ]);

  // Countdown timer
  useEffect(() => {
    if (phase !== 'answering') return;
    const iv = setInterval(() => {
      timeRef.current -= 1;
      setTimeLeft(timeRef.current);
      if (timeRef.current <= 0) {
        clearInterval(iv);
        if (phaseRef.current === 'answering') handleAnswer(null);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [phase, currentQ, handleAnswer]);

  // Opponent simulation (online mode only)
  useEffect(() => {
    if (mode !== 'online' || !q) return;
    const accuracy = OPPONENT_ACCURACY[q.difficulty] ?? 0.58;
    const delay    = 2000 + Math.random() * 7000;
    const timer    = setTimeout(() => {
      setOppAnswered(true);
      if (Math.random() < accuracy) {
        oppScoreRef.current += 100 + Math.floor(Math.random() * 50);
        setOppScore(oppScoreRef.current);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [currentQ, mode, q]);

  return { currentQ, timeLeft, phase, selected, score, oppScore, oppAnswered, q, handleAnswer };
}
