'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/quiz-context';
import { getTopic } from '@/lib/data/quiz-data';

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default function TopicPage({ params }: PageProps) {
  const { topicId } = use(params);
  const { player, mode } = useQuiz();
  const router = useRouter();
  const topic  = getTopic(topicId);

  useEffect(() => {
    if (!player) router.replace('/');
  }, [player, router]);

  if (!player || !topic) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50">
      <div className="px-6 py-5 pb-8" style={{ background: topic.color }}>
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => router.back()}
            className="bg-white/20 border-none text-white rounded-xl px-4 py-2 font-bold cursor-pointer text-sm mb-4 font-poppins"
          >
            ← Back
          </button>
          <div className="text-5xl">{topic.icon}</div>
          <h1 className="text-white text-3xl font-black mt-2 mb-1">{topic.name}</h1>
          <p className="text-white/80 m-0">
            Select a quiz to play {mode === 'online' ? 'online' : 'solo'}
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-5 py-7">
        {topic.subquizzes.map(sq => (
          <button
            key={sq.id}
            onClick={() => router.push(`/difficulty/${topic.id}/${sq.id}`)}
            className="w-full bg-white border-2 rounded-2xl p-5 mb-4 cursor-pointer text-left font-poppins flex items-center justify-between transition-all duration-150"
            style={{ borderColor: `${topic.color}33` }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.borderColor = topic.color;
              el.style.transform   = 'translateX(4px)';
              el.style.boxShadow   = `0 8px 24px ${topic.color}33`;
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.borderColor = `${topic.color}33`;
              el.style.transform   = '';
              el.style.boxShadow   = 'none';
            }}
          >
            <div>
              <div className="font-extrabold text-lg text-gray-900">{sq.name}</div>
              <div className="text-gray-400 text-sm mt-1">{sq.questions.length} questions available</div>
            </div>
            <div
              className="text-white rounded-xl px-4 py-2 font-bold text-sm flex-shrink-0"
              style={{ background: topic.color }}
            >
              Play →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
