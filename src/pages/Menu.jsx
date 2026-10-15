import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MENU, CATS } from '../data.js';
import { useCart } from '../store.jsx';
import { BRAND, TAG1, TAG2, LIST_TITLE, CODE, OFF } from '../config.js';

export default function Menu() {
  const [cat, setCat] = useState('mithai');
  const { qty, change, coupon, count, kg, sub, total } = useCart();

  return (
    <div className="pg">
      <div className="w">
        <div className="brand"><b>{BRAND}</b><p>{TAG1}</p><p>{TAG2}</p></div>
        <h1 className="lt">{LIST_TITLE}</h1>
        <p className="sub">All rates are per kg. Choose your quantity in kg.</p>
        {coupon ? (
          <div className="tk"><small>Coupon applied: {OFF}% off</small><b>{CODE}</b></div>
        ) : (
          <Link className="promo" to="/game">🎁 Play Tic Tac Toe and win {OFF}% off</Link>
        )}
        <div className="tabs" role="tablist">
          {CATS.map((c) => (
            <button key={c.id} role="tab" aria-selected={cat === c.id} className={cat === c.id ? 'on' : ''} onClick={() => setCat(c.id)}>
              {c.label} ({MENU.filter((m) => m.cat === c.id).length})
            </button>
          ))}
        </div>
        {MENU.filter((m) => m.cat === cat).map((m) => {
          const v = qty[m.id] || 0;
          return (
            <div key={m.id} className={`r${v ? ' on' : ''}`}>
              <div className="n">
                <b>{m.mr}</b>
                <small>{m.en}</small>
                <div className="pp">₹{m.rate} <small>per kg</small></div>
              </div>
              <div className="s">
                <button onClick={() => change(m.id, -1)} disabled={!v} aria-label={`Less ${m.en}`}>−</button>
                <span>{v} kg</span>
                <button className="add" onClick={() => change(m.id, 1)} aria-label={`Add ${m.en}`}>+</button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bar">
        <div className="tl">
          <small>{count ? `${count} item${count > 1 ? 's' : ''}, ${kg} kg` : 'No items yet'}</small>
          <b>{coupon && sub !== total && <s>₹{sub}</s>} ₹{total}</b>
        </div>
        <Link className="btn" to="/order">View Order</Link>
      </div>
    </div>
  );
}
