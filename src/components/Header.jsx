import React, { useState, useEffect } from 'react';
import { useRoute } from '../context/RouteContext';
import { Clock, Compass, Layers, CalendarCheck, AlertCircle, Menu, X } from 'lucide-react';

export const Header = () => {
  const {
    currentView,
    setCurrentView,
    selectedExhibits,
    totalEstimatedTime,
    isOverLimit,
    overLimitDelta
  } = useRoute();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Главная', icon: Compass },
    { id: 'catalog', label: 'Каталог', icon: Layers },
    {
      id: 'dashboard',
      label: 'Маршрут',
      icon: Clock,
      count: selectedExhibits.length
    },
    { id: 'checkout', label: 'Оформление визита', icon: CalendarCheck }
  ];

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="aura-container">
        <div className="header-inner">
          <button
            onClick={() => handleNavClick('home')}
            className="header-brand"
          >
            <span className="brand-title">НХМ РБ</span>
          </button>

          <nav className="header-nav">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="nav-counter">
                      ({item.count})
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="header-actions">
            {selectedExhibits.length > 0 && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`time-widget-btn ${isOverLimit ? 'over-limit' : ''}`}
              >
                {isOverLimit ? (
                  <AlertCircle size={13} style={{ color: 'var(--color-clay)' }} />
                ) : (
                  <Clock size={13} style={{ color: 'var(--text-smoke)' }} />
                )}
                <span>
                  {Math.floor(totalEstimatedTime / 60) > 0
                    ? `${Math.floor(totalEstimatedTime / 60)} ч ${totalEstimatedTime % 60} мин`
                    : `${totalEstimatedTime} мин`}
                </span>
                {isOverLimit && (
                  <span style={{ fontSize: 11, opacity: 0.9 }}>
                    (+{overLimitDelta} м)
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-drawer">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`mobile-nav-link ${isActive ? 'active' : ''}`}
              >
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="font-display">
                    ({item.count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
