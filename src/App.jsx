import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, Link, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './store.jsx';
import { BRAND } from './config.js';
import Home from './pages/Home.jsx';
import Game from './pages/Game.jsx';
import Menu from './pages/Menu.jsx';
import Order from './pages/Order.jsx';

function Nav() {
  const { count } = useCart();
  return (
    <header className="nav">
      <Link to="/" className="lg" aria-label={`${BRAND} home`}>🪔</Link>
      <nav>
        <NavLink to="/game">Play</NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/order">Order{count > 0 && <b className="bdg">{count}</b>}</NavLink>
      </nav>
    </header>
  );
}

function Shell() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <>
      {pathname !== '/' && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order" element={<Order />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Shell />
      </CartProvider>
    </BrowserRouter>
  );
}
