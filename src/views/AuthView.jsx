import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRoute } from '../context/RouteContext';
import { User, Lock, Mail, Phone, LogIn, UserPlus, AlertCircle } from 'lucide-react';

export const AuthView = () => {
  const { login, register } = useRoute();
  const [mode, setMode] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'login') {
      if (!formData.email || !formData.password) {
        setError('Пожалуйста, укажите адрес электронной почты и пароль');
        setLoading(false);
        return;
      }
      const res = await login(formData.email, formData.password);
      if (!res.success) {
        setError(res.message);
      }
    } else {
      if (!formData.fullName || !formData.email || !formData.password) {
        setError('Заполните все обязательные поля');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Пароль должен содержать минимум 6 символов');
        setLoading(false);
        return;
      }
      const res = await register(formData);
      if (!res.success) {
        setError(res.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="aura-container" style={{ padding: '64px 24px 96px', maxWidth: 480, margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="card-surface"
        style={{
          padding: '36px 32px',
          borderRadius: 20,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)'
        }}
      >

        <div
          style={{
            display: 'flex',
            background: 'var(--bg-surface)',
            padding: 4,
            borderRadius: 12,
            marginBottom: 28
          }}
        >
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '10px 16px',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              background: mode === 'login' ? 'var(--text-graphite)' : 'transparent',
              color: mode === 'login' ? '#FFFFFF' : 'var(--text-charcoal)'
            }}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '10px 16px',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              background: mode === 'register' ? 'var(--text-graphite)' : 'transparent',
              color: mode === 'register' ? '#FFFFFF' : 'var(--text-charcoal)'
            }}
          >
            Регистрация
          </button>
        </div>

        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-graphite)', margin: 0 }}>
            {mode === 'login' ? 'Вход в аккаунт' : 'Создание аккаунта'}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-charcoal)', marginTop: 8, margin: '8px 0 0' }}>
            {mode === 'login'
              ? 'Войдите для доступа к сохраненным билетам и персональным маршрутам'
              : 'Зарегистрируйтесь для оформления именного пропуска в музей'}
          </p>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 14px',
              borderRadius: 10,
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#b91c1c',
              fontSize: 13,
              marginBottom: 20
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-charcoal)', marginBottom: 6 }}>
                Ваше имя и фамилия
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-smoke)' }} />
                <input
                  type="text"
                  required
                  placeholder="Алексей Смирнов"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 10,
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    background: '#FAFAFB',
                    color: 'var(--text-graphite)',
                    fontSize: 14,
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-charcoal)', marginBottom: 6 }}>
              Электронная почта
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-smoke)' }} />
              <input
                type="email"
                required
                placeholder="visitor@artmuseum.by"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: 10,
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  background: '#FAFAFB',
                  color: 'var(--text-graphite)',
                  fontSize: 14,
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-charcoal)', marginBottom: 6 }}>
                Телефон (необязательно)
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-smoke)' }} />
                <input
                  type="tel"
                  placeholder="+375 (29) 123-45-67"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 10,
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    background: '#FAFAFB',
                    color: 'var(--text-graphite)',
                    fontSize: 14,
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-charcoal)', marginBottom: 6 }}>
              Пароль
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-smoke)' }} />
              <input
                type="password"
                required
                placeholder="Минимум 6 символов"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: 10,
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  background: '#FAFAFB',
                  color: 'var(--text-graphite)',
                  fontSize: 14,
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              marginTop: 10,
              padding: '14px 20px',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {mode === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />}
            <span>{loading ? 'Обработка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
