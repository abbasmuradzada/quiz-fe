'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/quiz-context';
import { getTopic, getSubquiz } from '@/lib/data/quiz-data';
import { DIFFICULTY_CONFIG } from '@/lib/constants';
import type { Difficulty } from '@/lib/types';

interface PageProps {
  params: Promise<{ topicId: string; quizId: string }>;
}

export default function DifficultyPage({ params }: PageProps) {
  const { topicId, quizId } = use(params);
  const { player, mode }    = useQuiz();
  const router              = useRouter();
  const topic               = getTopic(topicId);
  const subquiz             = getSubquiz(topicId, quizId);

  useEffect(() => {
    if (!player) router.replace('/');
  }, [player, router]);

  if (!player || !topic || !subquiz) return null;

  function handleStart(diff: Difficulty) {
    if (mode === 'online') {
      router.push(`/lobby?topicId=${topicId}&quizId=${quizId}&difficulty=${diff}`);
    } else {
      router.push(`/play/${topicId}/${quizId}/${diff}`);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50">
      <div className="px-6 py-5 pb-8" style={{ background: topic.color }}>
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => router.back()}
            className="bg-white/20 border-none text-white rounded-xl px-4 py-2 font-bold cursor-pointer text-sm mb-4 font-poppins"
          >
            ← Back
          </button>
          <h1 className="text-white text-2xl font-black mb-1">{subquiz.name}</h1>
          <p className="text-white/80 m-0 text-sm">
            Pick your difficulty · {mode === 'online' ? '🌐 Online' : '👤 Solo'}
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-7">
        {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG[Difficulty]][]).map(([id, d]) => (
          <button
            key={id}
            onClick={() => handleStart(id)}
            className="w-full border-2 rounded-2xl p-5 mb-4 cursor-pointer text-left font-poppins flex items-center gap-5 transition-all duration-150"
            style={{ background: d.bg, borderColor: `${d.color}44` }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.borderColor = d.color;
              el.style.transform   = 'scale(1.02)';
              el.style.boxShadow   = `0 8px 24px ${d.color}33`;
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.borderColor = `${d.color}44`;
              el.style.transform   = '';
              el.style.boxShadow   = 'none';
            }}
          >
            <div className="text-5xl flex-shrink-0">{d.icon}</div>
            <div>
              <div className="font-extrabold text-xl" style={{ color: d.color }}>{d.label}</div>
              <div className="text-gray-500 text-sm mt-0.5">{d.desc}</div>
            </div>
          </button>
        ))}

        <div className="bg-gray-100 rounded-2xl px-4 py-3.5 mt-2 flex items-center gap-2.5">
          <span className="text-xl">⏱️</span>
          <span className="text-sm text-gray-500">
            <strong className="text-gray-700">10 seconds</strong> per question ·
            Score up to <strong className="text-gray-700">150 pts</strong> per correct answer
          </span>
        </div>
      </div>
    </div>
  );
}
