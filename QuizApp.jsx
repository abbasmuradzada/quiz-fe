const { useState, useEffect, useRef, useCallback } = React;

const TOPICS = window.QUIZ_DATA.topics;
const OPPONENT_NAMES = ['Alex','Jordan','Sam','Taylor','Morgan','Riley','Casey','Quinn','Drew','Avery'];

// ─── helpers ─────────────────────────────────────────────────
function getGrade(pct) {
  if (pct >= 95) return { letter: 'S', color: '#F59E0B', label: 'Legendary! 🏆' };
  if (pct >= 80) return { letter: 'A', color: '#10B981', label: 'Excellent! 🎉' };
  if (pct >= 65) return { letter: 'B', color: '#3B82F6', label: 'Great job! 👏' };
  if (pct >= 50) return { letter: 'C', color: '#F59E0B', label: 'Not bad! 👍' };
  if (pct >= 35) return { letter: 'D', color: '#F97316', label: 'Keep trying! 💪' };
  return { letter: 'F', color: '#DC2626', label: 'Study more! 📚' };
}
function speedBonus(t) { return t >= 8 ? 50 : t >= 6 ? 30 : t >= 4 ? 15 : 5; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function prepareQuestions(subquiz, difficulty) {
  const primary = subquiz.questions.filter(q => q.difficulty === difficulty);
  const other = subquiz.questions.filter(q => q.difficulty !== difficulty);
  return shuffle([...primary, ...other]).slice(0, 30);
}
function genRoom() { return Math.random().toString(36).substring(2, 8).toUpperCase(); }
function randName() { return OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)]; }

// ─── CircleTimer ─────────────────────────────────────────────
function CircleTimer({ timeLeft, maxTime = 10 }) {
  const r = 38, circ = 2 * Math.PI * r;
  const offset = circ * (1 - timeLeft / maxTime);
  const color = timeLeft >= 7 ? '#16A34A' : timeLeft >= 4 ? '#D97706' : '#DC2626';
  return (
    <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
      <svg width="96" height="96" style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}>
        <circle cx="48" cy="48" r={r} fill="none" stroke="#E5E7EB" strokeWidth="7" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.95s linear, stroke 0.3s' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, fontWeight: 900, color,
        animation: timeLeft <= 3 && timeLeft > 0 ? 'timerPulse 0.4s ease-in-out infinite alternate' : 'none'
      }}>{timeLeft}</div>
    </div>
  );
}

// ─── WelcomeScreen ────────────────────────────────────────────
function WelcomeScreen({ onStart }) {
  const [name, setName] = useState('');
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#7C3AED 0%,#EC4899 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ fontSize: 72, marginBottom: 8 }}>🧠</div>
      <h1 style={{ color: '#fff', fontSize: 52, fontWeight: 900, margin: 0, letterSpacing: -2 }}>QuizHub</h1>
      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, marginTop: 8, marginBottom: 48 }}>Challenge yourself. Challenge friends.</p>
      <div style={{ background: '#fff', borderRadius: 24, padding: 40, width: '100%', maxWidth: 400, boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
        <label style={{ fontSize: 14, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 }}>Your Name</label>
        <input
          value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && name.trim() && onStart(name.trim())}
          placeholder="Enter your name..."
          style={{ width: '100%', marginTop: 8, padding: '14px 18px', borderRadius: 14, border: '2px solid #E5E7EB', fontSize: 18, fontWeight: 600, fontFamily: 'Poppins', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = '#7C3AED'}
          onBlur={e => e.target.style.borderColor = '#E5E7EB'}
        />
        <button
          onClick={() => name.trim() && onStart(name.trim())}
          style={{ marginTop: 20, width: '100%', padding: '16px', borderRadius: 14, border: 'none', background: name.trim() ? 'linear-gradient(135deg,#7C3AED,#EC4899)' : '#E5E7EB', color: name.trim() ? '#fff' : '#9CA3AF', fontSize: 17, fontWeight: 800, cursor: name.trim() ? 'pointer' : 'default', fontFamily: 'Poppins', transition: 'all 0.2s', transform: 'scale(1)' }}
          onMouseEnter={e => name.trim() && (e.target.style.transform = 'scale(1.02)')}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        >Let's Play →</button>
      </div>
    </div>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────
function HomeScreen({ player, mode, setMode, onSelectTopic }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #F5F0FF 0%, #FFF0F9 100%)' }}>
      <div style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', padding: '20px 24px 28px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>🧠 QuizHub</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 2 }}>Hey, {player}! 👋</div>
          </div>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 4, gap: 4 }}>
            {['Solo', 'Online'].map(m => (
              <button key={m} onClick={() => setMode(m.toLowerCase())}
                style={{ padding: '8px 20px', borderRadius: 9, border: 'none', fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s', background: mode === m.toLowerCase() ? '#fff' : 'transparent', color: mode === m.toLowerCase() ? '#7C3AED' : 'rgba(255,255,255,0.9)' }}>
                {m === 'Online' ? '🌐 ' : '👤 '}{m}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '28px 20px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#1F2937' }}>Choose a Topic</h2>
        <p style={{ margin: '0 0 24px', color: '#6B7280', fontSize: 15 }}>{mode === 'online' ? '🌐 Playing online — share link with a friend after selecting' : '👤 Solo mode — play at your own pace'}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {TOPICS.map(topic => (
            <button key={topic.id} onClick={() => onSelectTopic(topic)}
              style={{ background: topic.color, border: 'none', borderRadius: 20, padding: '24px 20px', cursor: 'pointer', textAlign: 'left', fontFamily: 'Poppins', transition: 'transform 0.15s, box-shadow 0.15s', boxShadow: `0 4px 20px ${topic.color}55` }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; e.currentTarget.style.boxShadow = `0 12px 32px ${topic.color}88`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 4px 20px ${topic.color}55`; }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>{topic.icon}</div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>{topic.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 }}>{topic.subquizzes.length} quiz{topic.subquizzes.length > 1 ? 'zes' : ''}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TopicDetailScreen ────────────────────────────────────────
function TopicDetailScreen({ topic, mode, onSelectSubquiz, onBack }) {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #F5F0FF 0%, #FFF0F9 100%)' }}>
      <div style={{ background: topic.color, padding: '20px 24px 32px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 10, padding: '8px 16px', fontFamily: 'Poppins', fontWeight: 700, cursor: 'pointer', fontSize: 14, marginBottom: 16 }}>← Back</button>
          <div style={{ fontSize: 52 }}>{topic.icon}</div>
          <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 900, margin: '8px 0 4px' }}>{topic.name}</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>Select a quiz to play {mode === 'online' ? 'online' : 'solo'}</p>
        </div>
      </div>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '28px 20px' }}>
        {topic.subquizzes.map(sq => (
          <button key={sq.id} onClick={() => onSelectSubquiz(sq)}
            style={{ width: '100%', background: '#fff', border: `2px solid ${topic.color}33`, borderRadius: 20, padding: '22px 24px', marginBottom: 16, cursor: 'pointer', textAlign: 'left', fontFamily: 'Poppins', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = topic.color; e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${topic.color}33`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${topic.color}33`; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'none'; }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: '#1F2937' }}>{sq.name}</div>
              <div style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>{sq.questions.length} questions available</div>
            </div>
            <div style={{ background: topic.color, color: '#fff', borderRadius: 12, padding: '8px 16px', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>Play →</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── DifficultyScreen ─────────────────────────────────────────
function DifficultyScreen({ topic, subquiz, mode, onStart, onBack }) {
  const diffs = [
    { id: 'easy', label: 'Easy', icon: '😊', desc: 'Warm up — great for beginners', color: '#16A34A', bg: '#F0FDF4' },
    { id: 'medium', label: 'Medium', icon: '🔥', desc: 'A real challenge', color: '#D97706', bg: '#FFFBEB' },
    { id: 'hard', label: 'Hard', icon: '💀', desc: 'Expert level only', color: '#DC2626', bg: '#FEF2F2' },
  ];
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #F5F0FF 0%, #FFF0F9 100%)' }}>
      <div style={{ background: topic.color, padding: '20px 24px 32px' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 10, padding: '8px 16px', fontFamily: 'Poppins', fontWeight: 700, cursor: 'pointer', fontSize: 14, marginBottom: 16 }}>← Back</button>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: '0 0 4px' }}>{subquiz.name}</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: 15 }}>Pick your difficulty • {mode === 'online' ? '🌐 Online' : '👤 Solo'}</p>
        </div>
      </div>
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '28px 20px' }}>
        {diffs.map(d => (
          <button key={d.id} onClick={() => onStart(d.id)}
            style={{ width: '100%', background: d.bg, border: `2px solid ${d.color}44`, borderRadius: 20, padding: '22px 24px', marginBottom: 16, cursor: 'pointer', textAlign: 'left', fontFamily: 'Poppins', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 20 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = d.color; e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = `0 8px 24px ${d.color}33`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${d.color}44`; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ fontSize: 44, flexShrink: 0 }}>{d.icon}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: d.color }}>{d.label}</div>
              <div style={{ color: '#6B7280', fontSize: 14, marginTop: 3 }}>{d.desc}</div>
            </div>
          </button>
        ))}
        <div style={{ background: '#F3F4F6', borderRadius: 14, padding: '14px 18px', marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>⏱️</span>
          <span style={{ fontSize: 14, color: '#6B7280' }}><strong style={{ color: '#374151' }}>10 seconds</strong> per question · Score up to <strong style={{ color: '#374151' }}>150 pts</strong> per correct answer</span>
        </div>
      </div>
    </div>
  );
}

// ─── OnlineLobbyScreen ────────────────────────────────────────
function OnlineLobbyScreen({ player, topic, subquiz, difficulty, onReady, onBack }) {
  const [room] = useState(genRoom);
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState('waiting'); // waiting | joined | starting

  useEffect(() => {
    const t1 = setTimeout(() => {
      const opp = randName();
      setOpponent(opp);
      setStatus('joined');
    }, 3000);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (status === 'joined') {
      const t2 = setTimeout(() => {
        setStatus('starting');
        setTimeout(() => onReady(opponent), 1000);
      }, 1500);
      return () => clearTimeout(t2);
    }
  }, [status]);

  const shareUrl = `quizhub.app/room/${room}`;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #F5F0FF 0%, #FFF0F9 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 28, padding: 40, width: '100%', maxWidth: 440, boxShadow: '0 24px 60px rgba(124,58,237,0.15)', textAlign: 'center' }}>
        <button onClick={onBack} style={{ float: 'left', background: 'none', border: 'none', color: '#7C3AED', fontFamily: 'Poppins', fontWeight: 700, cursor: 'pointer', fontSize: 14, padding: 0 }}>← Back</button>
        <div style={{ clear: 'both' }}></div>
        <div style={{ fontSize: 48, margin: '8px 0' }}>🌐</div>
        <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 900, color: '#1F2937' }}>Online Room</h2>
        <p style={{ margin: '0 0 28px', color: '#6B7280', fontSize: 15 }}>{topic.name} · {subquiz.name} · {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</p>

        <div style={{ background: '#F5F0FF', borderRadius: 16, padding: '16px 20px', marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Room Code</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#1F2937', letterSpacing: 4 }}>{room}</div>
          <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 6 }}>{shareUrl}</div>
        </div>

        {status === 'waiting' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#6B7280', fontSize: 15 }}>
            <div style={{ width: 20, height: 20, border: '3px solid #7C3AED', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            Waiting for opponent...
          </div>
        )}
        {status === 'joined' && (
          <div style={{ background: '#F0FDF4', border: '2px solid #16A34A', borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 28 }}>🎉</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, color: '#16A34A', fontSize: 16 }}>{opponent} joined!</div>
              <div style={{ color: '#4B5563', fontSize: 13 }}>Starting the game...</div>
            </div>
          </div>
        )}
        {status === 'starting' && (
          <div style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>🚀 Starting!</div>
          </div>
        )}

        <div style={{ marginTop: 24, display: 'flex', gap: 10, justifyContent: 'center' }}>
          <div style={{ background: '#F5F0FF', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#7C3AED' }}></div>
            <span style={{ fontWeight: 700, color: '#7C3AED', fontSize: 14 }}>{player}</span>
          </div>
          <div style={{ color: '#D1D5DB', fontSize: 20, fontWeight: 700, alignSelf: 'center' }}>VS</div>
          <div style={{ background: opponent ? '#F0FDF4' : '#F9FAFB', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: opponent ? '#16A34A' : '#D1D5DB' }}></div>
            <span style={{ fontWeight: 700, color: opponent ? '#16A34A' : '#9CA3AF', fontSize: 14 }}>{opponent || '???'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── QuizScreen ───────────────────────────────────────────────
function QuizScreen({ player, questions, mode, opponent, topic, onFinish }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [phase, setPhase] = useState('answering'); // answering | feedback
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [oppScore, setOppScore] = useState(0);
  const [oppAnswered, setOppAnswered] = useState(false);

  const phaseRef = useRef('answering');
  const timeRef = useRef(10);
  const oppTimerRef = useRef(null);

  const q = questions[currentQ];

  const advanceQ = useCallback((res) => {
    setResults(prev => [...prev, res]);
    setTimeout(() => {
      const next = currentQ + 1;
      if (next >= questions.length) {
        onFinish({ score: res.runningScore, results: [...results, res], oppScore });
      } else {
        setCurrentQ(next);
        setSelected(null);
        setPhase('answering');
        phaseRef.current = 'answering';
        setTimeLeft(10);
        timeRef.current = 10;
        setOppAnswered(false);
      }
    }, 1500);
  }, [currentQ, questions.length, results, oppScore, onFinish]);

  const handleAnswer = useCallback((idx) => {
    if (phaseRef.current !== 'answering') return;
    phaseRef.current = 'feedback';
    setPhase('feedback');
    setSelected(idx);
    const tl = timeRef.current;
    const isCorrect = idx === q.answer;
    const pts = isCorrect ? (100 + speedBonus(tl)) : 0;
    const newScore = score + pts;
    setScore(newScore);
    advanceQ({ selected: idx, correct: isCorrect, timeLeft: tl, points: pts, runningScore: newScore });
  }, [q, score, advanceQ]);

  // Timer
  useEffect(() => {
    phaseRef.current = 'answering';
    timeRef.current = 10;
    setTimeLeft(10);
    setPhase('answering');
    setSelected(null);
    setOppAnswered(false);
  }, [currentQ]);

  useEffect(() => {
    if (phase !== 'answering') return;
    const iv = setInterval(() => {
      timeRef.current -= 1;
      setTimeLeft(timeRef.current);
      if (timeRef.current <= 0) {
        clearInterval(iv);
        if (phaseRef.current === 'answering') handleAnswer(null);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [phase, currentQ]);

  // Opponent simulation
  useEffect(() => {
    if (mode !== 'online') return;
    const accuracy = q.difficulty === 'easy' ? 0.78 : q.difficulty === 'medium' ? 0.58 : 0.38;
    const delay = 2000 + Math.random() * 7000;
    oppTimerRef.current = setTimeout(() => {
      setOppAnswered(true);
      if (Math.random() < accuracy) {
        setOppScore(prev => prev + 100 + Math.floor(Math.random() * 50));
      }
    }, delay);
    return () => clearTimeout(oppTimerRef.current);
  }, [currentQ, mode]);

  const progress = (currentQ / questions.length) * 100;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #F5F0FF 0%, #FFF0F9 100%)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: topic.color, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
          {topic.icon} Q {currentQ + 1} / {questions.length}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {mode === 'online' && (
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '4px 12px', color: '#fff', fontSize: 13, fontWeight: 700 }}>
              {opponent}: {oppScore}
              {oppAnswered ? ' ✓' : ' ⏳'}
            </div>
          )}
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 10, padding: '4px 14px', color: topic.color, fontSize: 16, fontWeight: 900 }}>
            {score}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 5, background: '#E5E7EB' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, #7C3AED, #EC4899)`, transition: 'width 0.4s' }}></div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', maxWidth: 600, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <CircleTimer timeLeft={timeLeft} />

        <div style={{ background: '#fff', borderRadius: 24, padding: '28px 28px', marginTop: 20, width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ background: topic.color + '22', color: topic.color, borderRadius: 8, padding: '3px 10px', fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>{q.difficulty}</span>
            <span style={{ background: '#F3F4F6', color: '#6B7280', borderRadius: 8, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>{q.type === 'tf' ? 'True / False' : 'Multiple Choice'}</span>
          </div>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1F2937', lineHeight: 1.4, textWrap: 'pretty' }}>{q.q}</p>
        </div>

        <div style={{ marginTop: 18, width: '100%', display: 'grid', gridTemplateColumns: q.type === 'tf' ? '1fr 1fr' : '1fr 1fr', gap: 12 }}>
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = i === q.answer;
            let bg = '#fff', border = '2px solid #E5E7EB', color = '#1F2937', icon = '';
            if (phase === 'feedback') {
              if (isCorrect) { bg = '#F0FDF4'; border = '2px solid #16A34A'; color = '#166534'; icon = ' ✓'; }
              else if (isSelected) { bg = '#FEF2F2'; border = '2px solid #DC2626'; color = '#991B1B'; icon = ' ✗'; }
            } else if (isSelected) {
              bg = '#F5F0FF'; border = `2px solid ${topic.color}`;
            }
            return (
              <button key={i} onClick={() => phase === 'answering' && handleAnswer(i)}
                style={{ background: bg, border, borderRadius: 16, padding: '16px 14px', fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, color, cursor: phase === 'answering' ? 'pointer' : 'default', transition: 'all 0.2s', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ background: '#F3F4F6', color: '#6B7280', borderRadius: 8, padding: '2px 9px', fontSize: 13, fontWeight: 800, flexShrink: 0, fontVariant: 'normal' }}>{String.fromCharCode(65 + i)}</span>
                {opt}{icon}
              </button>
            );
          })}
        </div>
        {phase === 'feedback' && selected === null && (
          <div style={{ marginTop: 16, background: '#FEF3C7', borderRadius: 14, padding: '12px 18px', color: '#92400E', fontWeight: 700, fontSize: 15 }}>⏰ Time's up! The correct answer was highlighted.</div>
        )}
      </div>
    </div>
  );
}

// ─── ResultsScreen ────────────────────────────────────────────
function ResultsScreen({ player, score, answers, questions, mode, oppScore, opponent, topic, subquiz, difficulty, onReplay, onRematch, onHome }) {
  const correct = answers.filter(a => a.correct).length;
  const pct = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
  const grade = getGrade(pct);
  const [tab, setTab] = useState(mode === 'online' ? 'score' : 'score');

  const leaderboard = mode === 'online'
    ? [{ name: player, score }, { name: opponent, score: oppScore }].sort((a, b) => b.score - a.score)
    : [{ name: player, score }];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #F5F0FF 0%, #FFF0F9 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        {/* Grade card */}
        <div style={{ background: '#fff', borderRadius: 28, padding: '36px 32px', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', marginBottom: 20 }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>{correct === questions.length ? '🎯' : pct >= 65 ? '🎉' : pct >= 35 ? '👍' : '😅'}</div>
          <div style={{ fontSize: 80, fontWeight: 900, color: grade.color, lineHeight: 1 }}>{grade.letter}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1F2937', marginTop: 6 }}>{grade.label}</div>
          <div style={{ color: '#6B7280', marginTop: 4, fontSize: 15 }}>{correct} / {questions.length} correct · {pct}%</div>
          <div style={{ background: `${grade.color}22`, borderRadius: 20, padding: '12px 24px', marginTop: 20, display: 'inline-block' }}>
            <span style={{ fontWeight: 900, fontSize: 28, color: grade.color }}>{score.toLocaleString()}</span>
            <span style={{ color: '#9CA3AF', fontSize: 15, marginLeft: 6 }}>points</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: '#fff', borderRadius: 14, padding: 4, gap: 4, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {[['score', mode === 'online' ? 'Scores' : 'Summary'], ['review', 'Review']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, cursor: 'pointer', background: tab === id ? '#7C3AED' : 'transparent', color: tab === id ? '#fff' : '#6B7280', transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'score' && (
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            {leaderboard.map((p, i) => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: i < leaderboard.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                <div style={{ fontSize: 24 }}>{i === 0 ? '🥇' : '🥈'}</div>
                <div style={{ flex: 1, fontWeight: 700, color: '#1F2937', fontSize: 16 }}>{p.name} {p.name === player ? '(you)' : ''}</div>
                <div style={{ fontWeight: 900, fontSize: 20, color: i === 0 ? '#F59E0B' : '#6B7280' }}>{p.score.toLocaleString()}</div>
              </div>
            ))}
            <div style={{ padding: '14px 20px', background: '#F9FAFB', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 900, fontSize: 24, color: '#16A34A' }}>{correct}</div>
                <div style={{ color: '#6B7280', fontSize: 13 }}>Correct</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 900, fontSize: 24, color: '#DC2626' }}>{questions.length - correct}</div>
                <div style={{ color: '#6B7280', fontSize: 13 }}>Wrong</div>
              </div>
            </div>
          </div>
        )}

        {tab === 'review' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 360, overflowY: 'auto', paddingRight: 4 }}>
            {questions.map((q, i) => {
              const a = answers[i];
              const isCorrect = a && a.correct;
              return (
                <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '14px 18px', borderLeft: `4px solid ${isCorrect ? '#16A34A' : '#DC2626'}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontWeight: 700, color: '#1F2937', fontSize: 14, marginBottom: 6 }}>{i + 1}. {q.q}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ background: '#F0FDF4', color: '#16A34A', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>✓ {q.options[q.answer]}</span>
                    {a && !isCorrect && a.selected !== null && (
                      <span style={{ background: '#FEF2F2', color: '#DC2626', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>✗ {q.options[a.selected]}</span>
                    )}
                    {a && !isCorrect && a.selected === null && (
                      <span style={{ background: '#FEF3C7', color: '#92400E', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>⏰ Timed out</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
          {mode === 'online' && (
            <button onClick={onRematch} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', color: '#fff', fontSize: 17, fontWeight: 800, cursor: 'pointer', fontFamily: 'Poppins' }}>
              🔁 Rematch with {opponent}
            </button>
          )}
          <button onClick={onReplay} style={{ width: '100%', padding: '16px', borderRadius: 16, border: '2px solid #7C3AED', background: '#fff', color: '#7C3AED', fontSize: 17, fontWeight: 800, cursor: 'pointer', fontFamily: 'Poppins' }}>
            ↩ Play Again
          </button>
          <button onClick={onHome} style={{ width: '100%', padding: '14px', borderRadius: 16, border: 'none', background: '#F3F4F6', color: '#6B7280', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins' }}>
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────
function App() {
  const [screen, setScreen] = useState('welcome');
  const [player, setPlayer] = useState('');
  const [mode, setMode] = useState('solo');
  const [topic, setTopic] = useState(null);
  const [subquiz, setSubquiz] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [opponent, setOpponent] = useState(null);
  const [finishData, setFinishData] = useState(null);

  const startQuiz = (diff) => {
    const qs = prepareQuestions(subquiz, diff);
    setDifficulty(diff);
    setQuestions(qs);
    if (mode === 'online') {
      setScreen('lobby');
    } else {
      setScreen('quiz');
    }
  };

  const handleFinish = (data) => {
    setFinishData(data);
    setScreen('results');
  };

  const handleReplay = () => {
    const qs = prepareQuestions(subquiz, difficulty);
    setQuestions(qs);
    setFinishData(null);
    if (mode === 'online') setScreen('lobby');
    else setScreen('quiz');
  };

  const handleRematch = () => {
    const qs = prepareQuestions(subquiz, difficulty);
    setQuestions(qs);
    setFinishData(null);
    setScreen('lobby');
  };

  if (screen === 'welcome') return <WelcomeScreen onStart={n => { setPlayer(n); setScreen('home'); }} />;
  if (screen === 'home') return <HomeScreen player={player} mode={mode} setMode={setMode} onSelectTopic={t => { setTopic(t); setScreen('topic'); }} />;
  if (screen === 'topic') return <TopicDetailScreen topic={topic} mode={mode} onSelectSubquiz={sq => { setSubquiz(sq); setScreen('difficulty'); }} onBack={() => setScreen('home')} />;
  if (screen === 'difficulty') return <DifficultyScreen topic={topic} subquiz={subquiz} mode={mode} onStart={startQuiz} onBack={() => setScreen('topic')} />;
  if (screen === 'lobby') return <OnlineLobbyScreen player={player} topic={topic} subquiz={subquiz} difficulty={difficulty} onReady={opp => { setOpponent(opp); setScreen('quiz'); }} onBack={() => setScreen('difficulty')} />;
  if (screen === 'quiz') return <QuizScreen player={player} questions={questions} mode={mode} opponent={opponent} topic={topic} onFinish={handleFinish} />;
  if (screen === 'results') return <ResultsScreen player={player} score={finishData?.score || 0} answers={finishData?.results || []} questions={questions} mode={mode} oppScore={finishData?.oppScore || 0} opponent={opponent} topic={topic} subquiz={subquiz} difficulty={difficulty} onReplay={handleReplay} onRematch={handleRematch} onHome={() => setScreen('home')} />;
  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
