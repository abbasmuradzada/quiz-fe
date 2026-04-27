'use client';

const RADIUS      = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface CircleTimerProps {
  timeLeft: number;
  maxTime?: number;
}

export function CircleTimer({ timeLeft, maxTime = 10 }: CircleTimerProps) {
  const offset = CIRCUMFERENCE * (1 - timeLeft / maxTime);
  const color  =
    timeLeft >= 7 ? '#16A34A' :
    timeLeft >= 4 ? '#D97706' :
    '#DC2626';

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg width="96" height="96" className="absolute inset-0 -rotate-90">
        <circle cx="48" cy="48" r={RADIUS} fill="none" stroke="#E5E7EB" strokeWidth="7" />
        <circle
          cx="48" cy="48" r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.95s linear, stroke 0.3s' }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center text-3xl font-black"
        style={{
          color,
          animation: timeLeft <= 3 && timeLeft > 0
            ? 'timerPulse 0.4s ease-in-out infinite alternate'
            : 'none',
        }}
      >
        {timeLeft}
      </div>
    </div>
  );
}
