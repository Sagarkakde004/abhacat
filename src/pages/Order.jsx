import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../store.jsx';
import { BRAND, CODE, OFF, PHONE, WA } from '../config.js';

export default function Order() {
  const { items, count, kg, sub, disc, total, coupon, clear } = useCart();
  const [name, setName] = useState('');
  const [note, setNote] = useState('');

  if (!count) {
    return (
      <div className="pg">
        <div className="w em">
          <h1>Your order is empty</h1>
          <p className="sub">Pick your favourites by the kg from the menu.</p>
          <Link className="btn" to="/menu">Go to Menu</Link>
        </div>
      </div>
    );
  }

  const msg =
    `Namaste ${BRAND}! Diwali faral order${name ? ` from ${name}` : ''}:\n` +
    items.map((i) => `• ${i.en}: ${i.kg} kg = ₹${i.amt}`).join('\n') +
    `\nTotal weight: ${kg} kg\nSubtotal: ₹${sub}` +
    (coupon ? `\nCoupon ${CODE} (${OFF}% off): -₹${disc}` : '') +
    `\nPayable: ₹${total}` +
    (note ? `\nNote: ${note}` : '');

  return (
    <div className="pg">
      <div className="w">
        <h1>Your order</h1>
        <p className="sub">Review your items, then send the order on WhatsApp.</p>
        <div className="card">
          {items.map((i) => (
            <div className="ln" key={i.id}>
              <div>{i.en}<small>{i.kg} kg × ₹{i.rate} per kg</small></div>
              <b>₹{i.amt}</b>
            </div>
          ))}
          <div className="ln"><span>Total weight</span><b>{kg} kg</b></div>
          <div className="ln"><span>Subtotal</span><b>₹{sub}</b></div>
          {coupon && <div className="ln"><span>Coupon {CODE} ({OFF}% off)</span><b>−₹{disc}</b></div>}
          <div className="ln tt"><span>Payable</span><span>₹{total}</span></div>
        </div>
        {!coupon && <Link className="btn ghost" to="/game">🎁 Play a game to unlock {OFF}% off</Link>}
        <input className="in" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" autoComplete="name" />
        <textarea className="in" rows="2" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note: pickup time, packing, etc. (optional)" />
        <a className="btn wa" href={`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer">Send Order on WhatsApp</a>
        <a className="btn ghost" href={`tel:+${WA}`}>📞 Call {PHONE}</a>
        <button className="link" onClick={clear}>Clear order</button>
      </div>
    </div>
  );
}
