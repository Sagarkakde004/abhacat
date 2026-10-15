import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../store.jsx';
import { OFF } from '../config.js';

const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

const winner = (b) => {
  for (const l of LINES) {
    const [a, c, d] = l;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { p: b[a], l };
  }
  return null;
};

// The computer gets weaker after every round the player fails to win,
// so everyone gets a fair chance to win the discount within a few tries.
function aiMove(b, losses) {
  const k = Math.max(0.02, 0.55 - 0.18 * losses);
  const free = b.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
  const find = (p) => free.find((i) => { const t = [...b]; t[i] = p; return winner(t); });
  let m;
  if (Math.random() < k) m = find('O');
  if (m == null && Math.random() < k) m = find('X');
  return m == null ? free[Math.floor(Math.random() * free.length)] : m;
}

function Confetti() {
  const bits = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    l: Math.random() * 100, d: Math.random() * 0.8, t: 2 + Math.random() * 1.8,
    c: ['#ffc928', '#f26a1b', '#ffffff', '#ff4d4d'][i % 4],
  })), []);
  return (
    <div className="cf" aria-hidden="true">
      {bits.map((b, i) => <i key={i} style={{ left: `${b.l}%`, background: b.c, animationDelay: `${b.d}s`, animationDuration: `${b.t}s` }} />)}
    </div>
  );
}

export default function Game() {
  const { unlock, losses, addLoss } = useCart();
  const navigate = useNavigate();
  const [mode, setMode] = useState('ai'); // 'ai' | 'friends'
  const [b, setB] = useState(Array(9).fill(''));
  const [turn, setTurn] = useState('X');
  const [showWin, setShowWin] = useState(false);

  const res = winner(b);
  const draw = !res && b.every(Boolean);
  const over = !!res || draw;
  const aiTurn = mode === 'ai' && turn === 'O' && !over;
  const won = !!res && (mode === 'friends' || res.p === 'X');
  const canPlay = !over && !aiTurn;
  const fresh = b.every((v) => !v);

  const play = (i) => {
    setB((p) => { const n = [...p]; n[i] = turn; return n; });
    setTurn((t) => (t === 'X' ? 'O' : 'X'));
  };

  // computer's move
  useEffect(() => {
    if (!aiTurn) return;
    const id = setTimeout(() => play(aiMove(b, losses)), 550);
    return () => clearTimeout(id);
  }, [aiTurn, b]); // eslint-disable-line react-hooks/exhaustive-deps

  // count a failed round (lost or drawn vs computer) to ease the next one
  useEffect(() => { if (over && mode === 'ai' && !won) addLoss(); }, [over]); // eslint-disable-line react-hooks/exhaustive-deps

  // let the winning line glow for a moment, then take over the whole screen
  useEffect(() => {
    if (!won) { setShowWin(false); return; }
    const id = setTimeout(() => setShowWin(true), 900);
    return () => clearTimeout(id);
  }, [won]);

  // lock page scroll while the win screen is open
  useEffect(() => {
    if (!showWin) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [showWin]);

  const reset = () => { setB(Array(9).fill('')); setTurn('X'); };
  const changeMode = (m) => { setMode(m); reset(); };
  const click = (i) => { if (canPlay && !b[i]) play(i); };
  const grab = () => { unlock(); navigate('/menu'); };

  const status = over ? '' : mode === 'ai' ? (turn === 'X' ? 'Your turn (X)' : 'Computer is thinking…') : `Player ${turn}'s turn`;

  return (
    <div className="pg">
      <div className="w">
        <h1>Tap a box. Win. Get {OFF}% off 🎁</h1>
        <p className="sub">Tap any box to place your X. Make 3 in a row to win!</p>
        <div className="tabs">
          <button className={mode === 'ai' ? 'on' : ''} onClick={() => changeMode('ai')}>Vs computer</button>
          <button className={mode === 'friends' ? 'on' : ''} onClick={() => changeMode('friends')}>With friends</button>
        </div>
        <p className="st" aria-live="polite">{status}</p>
        {fresh && canPlay && <div className="tip" aria-hidden="true"><span className="down">👇</span> Tap any box to start</div>}
        <div className="bd">
          {b.map((v, i) => (
            <button
              key={i}
              className={`c ${v}${res && res.l.includes(i) ? ' w' : ''}${fresh && canPlay && i === 4 ? ' pulse' : ''}`}
              onClick={() => click(i)}
              aria-label={`Cell ${i + 1}${v ? `, ${v}` : ''}`}
            >
              {v || (canPlay ? <span className={`gh ${turn}`}>{turn}</span> : null)}
            </button>
          ))}
        </div>
        {over && !won && (
          <section className="res">
            <h2>{draw ? "It's a draw!" : 'Computer won this round'}</h2>
            <p>Try again, you can win this!</p>
            <button className="btn" onClick={reset}>🔁 Play Again</button>
            <button className="btn ghost" onClick={() => changeMode(mode === 'ai' ? 'friends' : 'ai')}>
              {mode === 'ai' ? '👫 Play With Friends' : '🤖 Play vs Computer'}
            </button>
          </section>
        )}
        <Link className="skip" to="/menu">Skip to menu</Link>
      </div>

      {showWin && (
        <div className="win" role="dialog" aria-modal="true" aria-label="You won">
          <Confetti />
          <div className="wbox">
            <div className="trophy">🏆</div>
            <h2>{mode === 'ai' ? '🎉 You won!' : `🎉 Player ${res.p} wins!`}</h2>
            <button className="btn big" autoFocus onClick={grab}>🎁 Grab Discount</button>
          </div>
        </div>
      )}
    </div>
  );
}
