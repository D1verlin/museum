import React, { useState, useEffect } from 'react';
import { useRoute } from '../context/RouteContext';
import { Clock, Compass, Layers, CalendarCheck, AlertCircle, Menu, X, User, Shield } from 'lucide-react';

export const Header = () => {
  const {
    currentView,
    setCurrentView,
    selectedExhibits,
    totalEstimatedTime,
    isOverLimit,
    overLimitDelta,
    user
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

            {user?.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 20,
                  background: currentView === 'admin' ? 'var(--text-graphite)' : 'var(--bg-surface)',
                  color: currentView === 'admin' ? '#FFFFFF' : 'var(--text-graphite)',
                  border: '1px solid rgba(0, 0, 0, 0.08)'
                }}
              >
                <Shield size={14} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>Админ</span>
              </button>
            )}

            {user ? (
              <button
                onClick={() => handleNavClick('profile')}
                className={`nav-link ${currentView === 'profile' ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 20,
                  background: currentView === 'profile' ? 'var(--text-graphite)' : 'var(--bg-surface)',
                  color: currentView === 'profile' ? '#FFFFFF' : 'var(--text-graphite)',
                  border: '1px solid rgba(0, 0, 0, 0.08)'
                }}
              >
                <User size={14} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>
                  {user.fullName ? user.fullName.split(' ')[0] : 'Профиль'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('auth')}
                className={`nav-link ${currentView === 'auth' ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  fontSize: 13,
                  color: 'var(--text-graphite)',
                  background: 'var(--bg-surface)'
                }}
              >
                <User size={14} />
                <span>Войти</span>
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

          {user?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`mobile-nav-link ${currentView === 'admin' ? 'active' : ''}`}
              style={{ borderTop: '1px solid var(--border-soft)', marginTop: 8, paddingTop: 12 }}
            >
              <Shield size={16} />
              <span>Админ-панель музея</span>
            </button>
          )}

          <button
            onClick={() => handleNavClick(user ? 'profile' : 'auth')}
            className={`mobile-nav-link ${currentView === 'profile' || currentView === 'auth' ? 'active' : ''}`}
            style={{ borderTop: user?.role === 'admin' ? 'none' : '1px solid var(--border-soft)', marginTop: user?.role === 'admin' ? 0 : 8, paddingTop: user?.role === 'admin' ? 6 : 12 }}
          >
            <User size={16} />
            <span>{user ? `Профиль (${user.fullName.split(' ')[0]})` : 'Войти в аккаунт'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
