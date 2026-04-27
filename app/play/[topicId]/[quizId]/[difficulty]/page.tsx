'use client';

import { useState, useMemo, use, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuiz } from '@/context/quiz-context';
import { getTopic, getSubquiz } from '@/lib/data/quiz-data';
import { prepareQuestions } from '@/lib/utils';
import { getGrade } from '@/lib/scoring';
import { useQuizGame } from '@/hooks/use-quiz-game';
import { CircleTimer } from '@/components/quiz/circle-timer';
import { AnswerOptions } from '@/components/quiz/answer-options';
import { GradeCard } from '@/components/quiz/grade-card';
import { AnswerReview } from '@/components/quiz/answer-review';
import { Leaderboard } from '@/components/quiz/leaderboard';
import type { Difficulty, GameFinishData, Question } from '@/lib/types';

// ─── Inner game component ─────────────────────────────────────
// Keyed externally so it fully remounts on "Play Again"

interface QuizGameProps {
  questions: Question[];
  mode: 'solo' | 'online';
  opponent: string;
  topicId: string;
  quizId: string;
  difficulty: Difficulty;
  player: string;
  topicColor: string;
  topicIcon: string;
  onReplay: () => void;
  onRematch: () => void;
  onHome: () => void;
}

function QuizGame({
  questions, mode, opponent, topicId, quizId, difficulty,
  player, topicColor, topicIcon, onReplay, onRematch, onHome,
}: QuizGameProps) {
  const [finishData, setFinishData] = useState<GameFinishData | null>(null);
  const [tab, setTab]               = useState<'score' | 'review'>('score');

  const game = useQuizGame({ questions, mode, onFinish: setFinishData });

  // ── Results screen ────────────────────────────────────────────
  if (finishData) {
    const correct    = finishData.results.filter(a => a.correct).length;
    const percentage = Math.round((correct / questions.length) * 100);
    const grade      = getGrade(percentage);

    const leaderboard = mode === 'online'
      ? [
          { name: player,   score: finishData.score,    isPlayer: true  },
          { name: opponent, score: finishData.oppScore, isPlayer: false },
        ].sort((a, b) => b.score - a.score)
      : [{ name: player, score: finishData.score, isPlayer: true }];

    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50 flex flex-col items-center px-5 py-6">
        <div className="w-full max-w-lg">
          <GradeCard
            grade={grade}
            score={finishData.score}
            correct={correct}
            total={questions.length}
            percentage={percentage}
          />

          {/* Tabs */}
          <div className="flex bg-white rounded-2xl p-1 gap-1 mb-4 shadow-sm">
            {([['score', mode === 'online' ? 'Scores' : 'Summary'], ['review', 'Review']] as const).map(
              ([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border-none cursor-pointer font-poppins"
                  style={{
                    background: tab === id ? '#7C3AED' : 'transparent',
                    color:      tab === id ? '#fff'    : '#6B7280',
                  }}
                >
                  {label}
                </button>
              ),
            )}
          </div>

          {tab === 'score'  && <Leaderboard entries={leaderboard} correct={correct} total={questions.length} />}
          {tab === 'review' && <AnswerReview questions={questions} answers={finishData.results} />}

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-5">
            {mode === 'online' && (
              <button
                onClick={onRematch}
                className="w-full py-4 rounded-2xl font-extrabold text-lg bg-gradient-to-r from-violet-600 to-pink-500 text-white border-none cursor-pointer font-poppins"
              >
                🔁 Rematch with {opponent}
              </button>
            )}
            <button
              onClick={onReplay}
              className="w-full py-4 rounded-2xl font-extrabold text-lg border-2 border-violet-600 bg-white text-violet-600 cursor-pointer font-poppins"
            >
              ↩ Play Again
            </button>
            <button
              onClick={onHome}
              className="w-full py-3.5 rounded-2xl font-bold text-base bg-gray-100 text-gray-500 border-none cursor-pointer font-poppins"
            >
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz screen ───────────────────────────────────────────────
  const progress = (game.currentQ / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50 flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 flex items-center justify-between" style={{ background: topicColor }}>
        <div className="text-white font-bold text-sm">
          {topicIcon} Q {game.currentQ + 1} / {questions.length}
        </div>
        <div className="flex gap-3 items-center">
          {mode === 'online' && (
            <div className="bg-white/20 rounded-xl px-3 py-1 text-white text-xs font-bold">
              {opponent}: {game.oppScore}{game.oppAnswered ? ' ✓' : ' ⏳'}
            </div>
          )}
          <div
            className="bg-white/95 rounded-xl px-3.5 py-1 font-black text-base"
            style={{ color: topicColor }}
          >
            {game.score}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-pink-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-5 py-6 max-w-xl mx-auto w-full">
        <CircleTimer timeLeft={game.timeLeft} />

        {/* Question */}
        <div className="bg-white rounded-3xl p-7 mt-5 w-full shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="rounded-lg px-2.5 py-0.5 text-xs font-bold capitalize"
              style={{ background: `${topicColor}22`, color: topicColor }}
            >
              {game.q.difficulty}
            </span>
            <span className="bg-gray-100 text-gray-500 rounded-lg px-2.5 py-0.5 text-xs font-bold">
              {game.q.type === 'tf' ? 'True / False' : 'Multiple Choice'}
            </span>
          </div>
          <p className="m-0 text-xl font-bold text-gray-900 leading-relaxed">{game.q.q}</p>
        </div>

        {/* Answers */}
        <div className="mt-4 w-full">
          <AnswerOptions
            question={game.q}
            phase={game.phase}
            selected={game.selected}
            topicColor={topicColor}
            onAnswer={game.handleAnswer}
          />
        </div>

        {/* Timeout notice */}
        {game.phase === 'feedback' && game.selected === null && (
          <div className="mt-4 bg-amber-50 rounded-2xl px-4 py-3 text-amber-800 font-bold text-sm w-full text-center">
            ⏰ Time&apos;s up! The correct answer was highlighted.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page wrapper (handles URL params + replay key) ────────────

interface PageProps {
  params: Promise<{ topicId: string; quizId: string; difficulty: string }>;
}

function PlayContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const { topicId, quizId, difficulty } = resolvedParams;

  const { player }   = useQuiz();
  const router       = useRouter();
  const searchParams = useSearchParams();

  const mode     = (searchParams.get('mode')     ?? 'solo') as 'solo' | 'online';
  const opponent =  searchParams.get('opponent') ?? '';

  const topic   = getTopic(topicId);
  const subquiz = getSubquiz(topicId, quizId);

  // gameKey increments on "Play Again" to force QuizGame remount + fresh questions
  const [gameKey, setGameKey] = useState(0);

  const questions = useMemo(
    () => (subquiz ? prepareQuestions(subquiz, difficulty as Difficulty) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameKey, topicId, quizId, difficulty],
  );

  useEffect(() => {
    if (!player) router.replace('/');
  }, [player, router]);

  if (!player || !topic || !subquiz) return null;

  return (
    <QuizGame
      key={gameKey}
      questions={questions}
      mode={mode}
      opponent={opponent}
      topicId={topicId}
      quizId={quizId}
      difficulty={difficulty as Difficulty}
      player={player}
      topicColor={topic.color}
      topicIcon={topic.icon}
      onReplay={() => setGameKey(k => k + 1)}
      onRematch={() =>
        router.push(`/lobby?topicId=${topicId}&quizId=${quizId}&difficulty=${difficulty}`)
      }
      onHome={() => router.push('/home')}
    />
  );
}

export default function PlayPage(props: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50" />}>
      <PlayContent {...props} />
    </Suspense>
  );
}
