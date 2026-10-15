import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MENU } from './data.js';
import { OFF } from './config.js';

const KEY = 'abha-cart-v2';
const Ctx = createContext(null);

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
};

export function CartProvider({ children }) {
  const [init] = useState(load);
  const [qty, setQty] = useState(init.qty || {});
  const [coupon, setCoupon] = useState(!!init.coupon);
  const [losses, setLosses] = useState(init.losses || 0);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ qty, coupon, losses })); } catch { /* ignore */ }
  }, [qty, coupon, losses]);

  // quantity moves in 0.5 kg steps
  const change = (id, d) =>
    setQty((p) => {
      const v = Math.min(50, Math.max(0, (p[id] || 0) + d * 0.5));
      const n = { ...p };
      if (v) n[id] = v; else delete n[id];
      return n;
    });

  const totals = useMemo(() => {
    const items = MENU.filter((m) => qty[m.id]).map((m) => ({ ...m, kg: qty[m.id], amt: qty[m.id] * m.rate }));
    const sub = items.reduce((s, i) => s + i.amt, 0);
    const kg = items.reduce((s, i) => s + i.kg, 0);
    const disc = coupon ? Math.round((sub * OFF) / 100) : 0;
    return { items, count: items.length, kg, sub, disc, total: sub - disc };
  }, [qty, coupon]);

  return (
    <Ctx.Provider value={{ ...totals, qty, coupon, change, losses, addLoss: () => setLosses((l) => l + 1), unlock: () => setCoupon(true), clear: () => setQty({}) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => useContext(Ctx);
