interface LeaderboardEntry {
  name: string;
  score: number;
  isPlayer: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  correct: number;
  total: number;
}

const MEDALS       = ['🥇', '🥈', '🥉'];
const MEDAL_COLORS = ['#F59E0B', '#9CA3AF', '#CD7F32'];

export function Leaderboard({ entries, correct, total }: LeaderboardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md">
      {entries.map((entry, i) => (
        <div
          key={entry.name}
          className="flex items-center gap-3.5 px-5 py-4"
          style={{ borderBottom: i < entries.length - 1 ? '1px solid #F3F4F6' : 'none' }}
        >
          <div className="text-2xl">{MEDALS[i] ?? '•'}</div>
          <div className="flex-1 font-bold text-gray-900 text-base">
            {entry.name}{' '}
            {entry.isPlayer && <span className="text-gray-400 font-normal text-sm">(you)</span>}
          </div>
          <div className="font-black text-xl" style={{ color: MEDAL_COLORS[i] ?? '#6B7280' }}>
            {entry.score.toLocaleString()}
          </div>
        </div>
      ))}
      <div className="px-5 py-3.5 bg-gray-50 grid grid-cols-2 gap-2.5">
        <div className="text-center">
          <div className="font-black text-2xl text-green-600">{correct}</div>
          <div className="text-gray-500 text-xs">Correct</div>
        </div>
        <div className="text-center">
          <div className="font-black text-2xl text-red-600">{total - correct}</div>
          <div className="text-gray-500 text-xs">Wrong</div>
        </div>
      </div>
    </div>
  );
}
