'use client';

import type { CSSProperties } from 'react';
import type { Question } from '@/lib/types';

interface AnswerOptionsProps {
  question: Question;
  phase: 'answering' | 'feedback';
  selected: number | null;
  topicColor: string;
  onAnswer: (idx: number) => void;
}

export function AnswerOptions({ question, phase, selected, topicColor, onAnswer }: AnswerOptionsProps) {
  return (
    <div className="w-full grid grid-cols-2 gap-3">
      {question.options.map((opt, i) => {
        const isSelected = selected === i;
        const isCorrect  = i === question.answer;

        let style: CSSProperties = { background: '#fff', border: '2px solid #E5E7EB', color: '#1F2937' };
        let icon = '';

        if (phase === 'feedback') {
          if (isCorrect)       { style = { background: '#F0FDF4', border: '2px solid #16A34A', color: '#166534' }; icon = ' ✓'; }
          else if (isSelected) { style = { background: '#FEF2F2', border: '2px solid #DC2626', color: '#991B1B' }; icon = ' ✗'; }
        } else if (isSelected) {
          style = { background: '#F5F0FF', border: `2px solid ${topicColor}` };
        }

        return (
          <button
            key={i}
            onClick={() => phase === 'answering' && onAnswer(i)}
            className="rounded-2xl p-4 font-semibold text-sm text-left flex items-center gap-2.5 transition-all duration-200 font-poppins"
            style={{ ...style, cursor: phase === 'answering' ? 'pointer' : 'default' }}
          >
            <span className="bg-gray-100 text-gray-500 rounded-lg px-2 py-0.5 text-xs font-extrabold flex-shrink-0">
              {String.fromCharCode(65 + i)}
            </span>
            {opt}{icon}
          </button>
        );
      })}
    </div>
  );
}
