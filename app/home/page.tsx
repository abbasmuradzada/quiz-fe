'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/quiz-context';
import { TOPICS } from '@/lib/data/quiz-data';
import type { GameMode } from '@/lib/types';

export default function HomePage() {
  const { player, mode, setMode } = useQuiz();
  const router = useRouter();

  useEffect(() => {
    if (!player) router.replace('/');
  }, [player, router]);

  if (!player) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-pink-500 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-xl font-black text-white tracking-tight">🧠 QuizHub</div>
            <div className="text-white/75 text-sm mt-0.5">Hey, {player}! 👋</div>
          </div>
          <div className="flex bg-white/20 rounded-xl p-1 gap-1">
            {(['solo', 'online'] as GameMode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-5 py-2 rounded-lg font-bold text-sm transition-all duration-200 border-none cursor-pointer font-poppins"
                style={{
                  background: mode === m ? '#fff' : 'transparent',
                  color: mode === m ? '#7C3AED' : 'rgba(255,255,255,0.9)',
                }}
              >
                {m === 'online' ? '🌐 ' : '👤 '}
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Topic grid */}
      <div className="max-w-2xl mx-auto px-5 py-7">
        <h2 className="m-0 mb-1.5 text-xl font-extrabold text-gray-900">Choose a Topic</h2>
        <p className="m-0 mb-6 text-gray-500 text-sm">
          {mode === 'online'
            ? '🌐 Online mode — compete against other players'
            : '👤 Solo mode — play at your own pace'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {TOPICS.map(topic => (
            <button
              key={topic.id}
              onClick={() => router.push(`/topics/${topic.id}`)}
              className="rounded-2xl p-6 text-left border-none cursor-pointer transition-all duration-150 font-poppins"
              style={{ background: topic.color, boxShadow: `0 4px 20px ${topic.color}55` }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.transform  = 'translateY(-4px) scale(1.02)';
                el.style.boxShadow  = `0 12px 32px ${topic.color}88`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.transform  = '';
                el.style.boxShadow  = `0 4px 20px ${topic.color}55`;
              }}
            >
              <div className="text-4xl mb-2.5">{topic.icon}</div>
              <div className="text-white font-extrabold text-base">{topic.name}</div>
              <div className="text-white/75 text-xs mt-1">
                {topic.subquizzes.length} quiz{topic.subquizzes.length > 1 ? 'zes' : ''}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
