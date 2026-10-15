import { Link } from 'react-router-dom';
import { BRAND, TAG1 } from '../config.js';

export default function Home() {
  return (
    <main className="hm">
      <div className="md" /><div className="md m2" /><div className="tor" />
      <div className="hc">
        <div className="bn">{BRAND}</div>
        <div className="gr">शुभ नवरात्रि</div>
        <div className="orn" aria-hidden="true">✦ ✦ ✦</div>
        <p>{TAG1}</p>
        <Link className="btn big" to="/game">▶ Play &amp; Grab Your Discount</Link>
        <div className="tap" aria-hidden="true">
          <span className="hand">👆</span>
          <span className="tx">Tap here to play</span>
        </div>
      </div>
      <div className="dy" aria-hidden="true">🪔 🪔 🪔</div>
    </main>
  );
}
