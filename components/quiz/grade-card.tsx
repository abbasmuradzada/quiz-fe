import type { GradeInfo } from '@/lib/types';

interface GradeCardProps {
  grade: GradeInfo;
  score: number;
  correct: number;
  total: number;
  percentage: number;
}

export function GradeCard({ grade, score, correct, total, percentage }: GradeCardProps) {
  const emoji =
    correct === total ? '🎯' :
    percentage >= 65  ? '🎉' :
    percentage >= 35  ? '👍' :
    '😅';

  return (
    <div className="bg-white rounded-3xl p-8 text-center shadow-xl mb-5">
      <div className="text-5xl mb-2">{emoji}</div>
      <div className="text-7xl font-black leading-none" style={{ color: grade.color }}>
        {grade.letter}
      </div>
      <div className="text-xl font-extrabold text-gray-900 mt-1.5">{grade.label}</div>
      <div className="text-gray-500 mt-1 text-sm">
        {correct} / {total} correct · {percentage}%
      </div>
      <div
        className="rounded-2xl px-6 py-3 mt-5 inline-block"
        style={{ background: `${grade.color}22` }}
      >
        <span className="font-black text-2xl" style={{ color: grade.color }}>
          {score.toLocaleString()}
        </span>
        <span className="text-gray-400 text-sm ml-1.5">points</span>
      </div>
    </div>
  );
}
