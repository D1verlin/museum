import React from 'react';
import { useRoute } from '../context/RouteContext';

export const Footer = () => {
  const { setCurrentView } = useRoute();

  return (
    <footer className="site-footer">
      <div className="aura-container">
        <div className="footer-inner-split">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--text-graphite)' }}>
              НХМ РБ
            </span>
            <span>Минск, ул. Ленина, 20</span>
            <span>С 1939 года</span>
            <span>Среда — Понедельник 11:00 — 19:00</span>
          </div>

          <div className="footer-links-row">
            <button
              onClick={() => {
                setCurrentView('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="footer-link-item"
            >
              Коллекция
            </button>
            <button
              onClick={() => {
                setCurrentView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="footer-link-item"
            >
              Маршрут
            </button>
            <button
              onClick={() => {
                setCurrentView('checkout');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="footer-link-item"
            >
              Визит
            </button>
            <a
              href="https://artmuseum.by"
              target="_blank"
              rel="noreferrer"
              className="footer-link-item"
            >
              artmuseum.by
            </a>
          </div>

          <div style={{ fontSize: 12, opacity: 0.8 }}>
            © {new Date().getFullYear()} Национальный художественный музей Республики Беларусь.
          </div>
        </div>
      </div>
    </footer>
  );
};
