'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/quiz-context';

export default function WelcomePage() {
  const [name, setName] = useState('');
  const { setPlayer }   = useQuiz();
  const router          = useRouter();

  function handleStart() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPlayer(trimmed);
    router.push('/home');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 to-pink-500 flex flex-col items-center justify-center p-6">
      <div className="text-7xl mb-2">🧠</div>
      <h1 className="text-white text-5xl font-black tracking-tight m-0">QuizHub</h1>
      <p className="text-white/80 text-lg mt-2 mb-12">Challenge yourself. Challenge friends.</p>

      <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          Your Name
        </label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleStart()}
          placeholder="Enter your name..."
          autoFocus
          className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 text-lg font-semibold outline-none focus:border-violet-600 transition-colors"
        />
        <button
          onClick={handleStart}
          disabled={!name.trim()}
          className="mt-5 w-full py-4 rounded-2xl font-extrabold text-lg transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-default enabled:bg-gradient-to-r enabled:from-violet-600 enabled:to-pink-500 enabled:text-white enabled:hover:scale-[1.02] enabled:active:scale-100"
        >
          Let&apos;s Play →
        </button>
      </div>
    </div>
  );
}
