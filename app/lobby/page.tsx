'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuiz } from '@/context/quiz-context';
import { getTopic, getSubquiz } from '@/lib/data/quiz-data';
import { genRoom, randName } from '@/lib/utils';

function LobbyContent() {
  const { player }     = useQuiz();
  const router         = useRouter();
  const searchParams   = useSearchParams();

  const topicId    = searchParams.get('topicId')    ?? '';
  const quizId     = searchParams.get('quizId')     ?? '';
  const difficulty = searchParams.get('difficulty') ?? 'medium';

  const topic   = getTopic(topicId);
  const subquiz = getSubquiz(topicId, quizId);

  const [room]                   = useState(genRoom);
  const [opponent, setOpponent]  = useState<string | null>(null);
  const [status, setStatus]      = useState<'waiting' | 'joined' | 'starting'>('waiting');

  useEffect(() => {
    if (!player) router.replace('/');
  }, [player, router]);

  // Simulate opponent joining after ~3 s
  useEffect(() => {
    const t = setTimeout(() => {
      setOpponent(randName());
      setStatus('joined');
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  // Countdown to game start after opponent joins
  useEffect(() => {
    if (status !== 'joined') return;
    const t = setTimeout(() => {
      setStatus('starting');
      setTimeout(() => {
        router.push(`/play/${topicId}/${quizId}/${difficulty}?mode=online&opponent=${opponent}`);
      }, 800);
    }, 1500);
    return () => clearTimeout(t);
  }, [status, topicId, quizId, difficulty, opponent, router]);

  if (!player || !topic || !subquiz) return null;

  const diffLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl text-center">
        {/* Back button */}
        <div className="flex mb-2">
          <button
            onClick={() => router.back()}
            className="bg-transparent border-none text-violet-600 font-bold cursor-pointer text-sm font-poppins"
          >
            ← Back
          </button>
        </div>

        <div className="text-5xl mt-1 mb-2">🌐</div>
        <h2 className="m-0 mb-1.5 text-2xl font-black text-gray-900">Online Room</h2>
        <p className="m-0 mb-7 text-gray-500 text-sm">
          {topic.name} · {subquiz.name} · {diffLabel}
        </p>

        {/* Room code */}
        <div className="bg-violet-50 rounded-2xl px-5 py-4 mb-5">
          <div className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-1.5">
            Room Code
          </div>
          <div className="text-3xl font-black text-gray-900 tracking-widest">{room}</div>
          <div className="text-xs text-gray-400 mt-1.5">quizhub.app/room/{room}</div>
        </div>

        {/* Status */}
        {status === 'waiting' && (
          <div className="flex items-center justify-center gap-2.5 text-gray-500 text-sm">
            <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
            Waiting for opponent...
          </div>
        )}
        {status === 'joined' && (
          <div className="bg-green-50 border-2 border-green-500 rounded-2xl px-5 py-3.5 flex items-center gap-3">
            <div className="text-3xl">🎉</div>
            <div className="text-left">
              <div className="font-extrabold text-green-600">{opponent} joined!</div>
              <div className="text-gray-500 text-xs">Starting the game…</div>
            </div>
          </div>
        )}
        {status === 'starting' && (
          <div className="bg-gradient-to-r from-violet-600 to-pink-500 rounded-2xl px-5 py-4">
            <div className="text-white font-extrabold text-xl">🚀 Starting!</div>
          </div>
        )}

        {/* Player vs opponent */}
        <div className="flex gap-2.5 justify-center mt-6">
          <div className="bg-violet-50 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
            <span className="font-bold text-violet-600 text-sm">{player}</span>
          </div>
          <div className="text-gray-300 text-xl font-bold self-center">VS</div>
          <div
            className="rounded-xl px-4 py-2.5 flex items-center gap-2"
            style={{ background: opponent ? '#F0FDF4' : '#F9FAFB' }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: opponent ? '#16A34A' : '#D1D5DB' }}
            />
            <span
              className="font-bold text-sm"
              style={{ color: opponent ? '#16A34A' : '#9CA3AF' }}
            >
              {opponent ?? '???'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LobbyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-violet-50 to-fuchsia-50" />}>
      <LobbyContent />
    </Suspense>
  );
}
