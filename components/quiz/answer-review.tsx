import type { Question, AnswerRecord } from '@/lib/types';

interface AnswerReviewProps {
  questions: Question[];
  answers: AnswerRecord[];
}

export function AnswerReview({ questions, answers }: AnswerReviewProps) {
  return (
    <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto pr-1">
      {questions.map((q, i) => {
        const a         = answers[i];
        const isCorrect = a?.correct;

        return (
          <div
            key={i}
            className="bg-white rounded-2xl p-3.5 shadow-sm"
            style={{ borderLeft: `4px solid ${isCorrect ? '#16A34A' : '#DC2626'}` }}
          >
            <p className="font-bold text-gray-900 text-sm mb-1.5 m-0">
              {i + 1}. {q.q}
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-green-50 text-green-600 rounded-md px-2.5 py-0.5 text-xs font-bold">
                ✓ {q.options[q.answer]}
              </span>
              {a && !isCorrect && a.selected !== null && (
                <span className="bg-red-50 text-red-600 rounded-md px-2.5 py-0.5 text-xs font-bold">
                  ✗ {q.options[a.selected]}
                </span>
              )}
              {a && !isCorrect && a.selected === null && (
                <span className="bg-amber-50 text-amber-700 rounded-md px-2.5 py-0.5 text-xs font-bold">
                  ⏰ Timed out
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
