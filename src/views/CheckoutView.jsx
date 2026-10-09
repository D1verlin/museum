import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRoute } from '../context/RouteContext';
import { Check, AlertCircle, Download, UserCheck, ArrowRight, Layers, Lock } from 'lucide-react';

export const CheckoutView = () => {
  const {
    selectedExhibits,
    availableTime,
    setAvailableTime,
    totalEstimatedTime,
    exhibitsTime,
    transitTime,
    hallsSequence,
    isOverLimit,
    overLimitDelta,
    confirmedVisit,
    setConfirmedVisit,
    setCurrentView,
    user,
    token,
    pace,
    fetchUserVisits
  } = useRoute();

  const [formData, setFormData] = useState({
    visitorName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    visitDate: '2026-10-15',
    timeSlot: '12:00',
    notes: ''
  });

  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        visitorName: prev.visitorName || user.fullName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  const [touched, setTouched] = useState({
    visitorName: false,
    email: false,
    phone: false
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.visitorName.trim()) {
      errs.visitorName = 'Укажите имя и фамилию посетителя';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Укажите корректный адрес электронной почты';
    }
    return errs;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const currentErrors = validate();
    setErrors(currentErrors);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setServerError('');
    if (touched[field]) {
      const updated = { ...formData, [field]: value };
      const errs = {};
      if (!updated.visitorName.trim()) errs.visitorName = 'Укажите имя и фамилию';
      if (!updated.email.trim() || !updated.email.includes('@')) errs.email = 'Укажите корректный e-mail';
      setErrors(errs);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!user || !token) {
      setServerError('Для регистрации маршрута необходимо войти в аккаунт');
      return;
    }

    if (selectedExhibits.length === 0) {
      setServerError('В маршруте нет выбранных шедевров');
      return;
    }

    const validationErrors = validate();
    setTouched({ visitorName: true, email: true, phone: true });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          pace,
          availableTime,
          exhibitIds: selectedExhibits.map((ex) => ex.id)
        })
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        const errorMsg = result.error?.message || result.message || 'Ошибка оформления визита';
        setServerError(errorMsg);
        setIsSubmitting(false);
        return;
      }

      setConfirmedVisit({
        ticketNumber: result.data.ticketNumber,
        createdAt: new Date().toLocaleDateString('ru-RU'),
        ...formData,
        totalEstimatedTime: result.data.totalEstimatedTime,
        exhibitsCount: selectedExhibits.length,
        hallsSequence: result.data.hallsSequence,
        exhibits: selectedExhibits
      });

      if (fetchUserVisits) {
        fetchUserVisits();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setServerError('Сетевая ошибка при отправке запроса к серверу. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatHoursMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours === 0) return `${mins} мин`;
    if (mins === 0) return `${hours} ч`;
    return `${hours} ч ${mins} мин`;
  };

  if (confirmedVisit) {
    return (
      <div className="aura-container" style={{ padding: '64px 24px 96px', maxWidth: 960 }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface"
          style={{
            padding: '40px 36px',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: 20,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 36
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <span className="section-eyebrow">Электронный маршрутный лист</span>
              <h1 className="section-title" style={{ fontSize: 32, margin: '6px 0 0' }}>Визит успешно оформлен</h1>
              <p style={{ fontSize: 14, color: 'var(--text-charcoal)', marginTop: 8 }}>
                Именной пропуск сохранен в вашем профиле и отправлен на {confirmedVisit.email}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-graphite)' }}>
                {confirmedVisit.ticketNumber}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-smoke)', marginTop: 2 }}>Номер электронного пропуска</div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 16,
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              padding: '20px 24px',
              borderRadius: 14
            }}
          >
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-smoke)', display: 'block' }}>Дата посещения</span>
              <span className="font-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-graphite)' }}>{confirmedVisit.visitDate}</span>
            </div>
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-smoke)', display: 'block' }}>Интервал входа</span>
              <span className="font-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-graphite)' }}>{confirmedVisit.timeSlot}</span>
            </div>
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-smoke)', display: 'block' }}>Расчетное время</span>
              <span className="font-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-graphite)' }}>{formatHoursMinutes(confirmedVisit.totalEstimatedTime)}</span>
            </div>
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-smoke)', display: 'block' }}>Число шедевров</span>
              <span className="font-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-graphite)' }}>{confirmedVisit.exhibitsCount}</span>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-graphite)', marginBottom: 14 }}>
              Последовательность вашего маршрута
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {confirmedVisit.exhibits.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    padding: '14px 18px',
                    borderRadius: 10,
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 13
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="font-display" style={{ color: 'var(--text-smoke)', width: 22, fontWeight: 600 }}>{idx + 1}.</span>
                    <span style={{ fontWeight: 500, color: 'var(--text-graphite)' }}>{item.title}</span>
                    <span style={{ color: 'var(--text-smoke)' }}>/ {item.hallName}</span>
                  </div>
                  <span className="font-display" style={{ color: 'var(--text-charcoal)' }}>~{item.durationMinutes} мин</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <button
              onClick={() => window.print()}
              className="btn-primary"
              style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Download size={15} />
              <span>Печать / Сохранить маршрутный лист</span>
            </button>
            <button
              onClick={() => {
                setConfirmedVisit(null);
                setCurrentView('profile');
              }}
              className="btn-secondary"
              style={{ fontSize: 13 }}
            >
              Перейти в личный кабинет
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (selectedExhibits.length === 0) {
    return (
      <div className="aura-container" style={{ padding: '80px 24px', maxWidth: 640, textAlign: 'center' }}>
        <div
          className="card-surface"
          style={{
            padding: '48px 36px',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: 20,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)'
          }}
        >
          <Layers size={44} style={{ color: 'var(--text-smoke)', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-graphite)' }}>
            Маршрут пока не сформирован
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-charcoal)', margin: '12px 0 28px', lineHeight: 1.6 }}>
            Для оформления электронного пропуска выберите интересующие шедевры в каталоге или загрузите готовый тематический сценарий на главной странице.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentView('catalog')}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: 14 }}
            >
              Перейти в каталог
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="btn-secondary"
              style={{ padding: '12px 24px', fontSize: 14 }}
            >
              Тематические маршруты
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="aura-container" style={{ padding: '64px 24px 96px', maxWidth: 840 }}>
        <div style={{ marginBottom: 32 }}>
          <span className="section-eyebrow">Шаг 2 из 2: Идентификация посетителя</span>
          <h1 className="section-title" style={{ fontSize: 36, margin: '6px 0 0' }}>
            Требуется авторизация
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-charcoal)', marginTop: 8 }}>
            Для выпуска персонального пропуска и сохранения маршрута необходимо войти в систему.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          <div
            className="card-surface"
            style={{
              padding: '36px 32px',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 20,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Lock size={20} style={{ color: 'var(--text-graphite)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-graphite)', margin: 0 }}>
                  Ваш маршрут сохранен ({selectedExhibits.length} шедевров, ~{totalEstimatedTime} мин)
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-charcoal)', margin: '10px 0 20px', lineHeight: 1.6 }}>
                  Вы уже собрали коллекцию для визита. Чтобы закрепить цифровой билет за вами и получить доступ к маршрутному листу в любой момент, выполните вход или создайте учетную запись.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setCurrentView('auth')}
                    className="btn-primary"
                    style={{ padding: '12px 24px', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  >
                    <UserCheck size={16} />
                    <span>Войти или зарегистрироваться</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="btn-secondary"
                    style={{ padding: '12px 20px', fontSize: 14 }}
                  >
                    Редактировать маршрут
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="card-surface"
            style={{
              padding: '24px 28px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: 16
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-graphite)' }}>
                Выбранные экспонаты:
              </span>
              <span className="font-display" style={{ fontSize: 13, color: 'var(--text-charcoal)' }}>
                {selectedExhibits.length} объектов • ~{formatHoursMinutes(totalEstimatedTime)}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {selectedExhibits.map((ex, idx) => (
                <div
                  key={ex.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 13,
                    padding: '8px 12px',
                    borderRadius: 8,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <span style={{ color: 'var(--text-graphite)' }}>{idx + 1}. {ex.title}</span>
                  <span style={{ color: 'var(--text-smoke)' }}>{ex.hallName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aura-container">
      <div style={{ padding: '64px 0 96px 0', display: 'flex', flexDirection: 'column', gap: 48 }}>
        <div style={{ maxWidth: 640 }}>
          <span className="section-eyebrow">Шаг 2 из 2</span>
          <h1 className="section-title" style={{ fontSize: 40, margin: '6px 0 0' }}>Параметры визита и регистрация</h1>
          <p style={{ fontSize: 15, color: 'var(--text-charcoal)', marginTop: 8 }}>
            Укажите удобную дату, интервал входа и контактные данные. Персональный маршрутный лист
            будет привязан к вашей учетной записи.
          </p>
        </div>

        <div className="checkout-grid-layout">
          <form onSubmit={handleSubmit}>
            <div
              className="card-surface"
              style={{
                padding: '36px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                marginBottom: 24
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-graphite)', margin: 0 }}>
                Время и дата посещения
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={{ fontSize: 13, color: 'var(--text-charcoal)' }}>
                  Доступный лимит времени (минуты)
                </label>
                <div className="preset-pills-row">
                  {[45, 60, 90, 120, 150].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAvailableTime(t)}
                      className={`time-pill-btn ${availableTime === t ? 'active' : ''}`}
                    >
                      {t} мин
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-field-group">
                  <label className="form-label-text">Дата</label>
                  <input
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => handleChange('visitDate', e.target.value)}
                    className="form-input-control"
                    style={{
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-graphite)'
                    }}
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-label-text">Интервал входа</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => handleChange('timeSlot', e.target.value)}
                    className="form-input-control"
                    style={{
                      cursor: 'pointer',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-graphite)'
                    }}
                  >
                    <option value="10:30">10:30 — 11:30</option>
                    <option value="12:00">12:00 — 13:00</option>
                    <option value="14:30">14:30 — 15:30</option>
                    <option value="16:30">16:30 — 17:30</option>
                    <option value="18:30">18:30 — 19:30</option>
                  </select>
                </div>
              </div>
            </div>

            <div
              className="card-surface"
              style={{
                padding: '36px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 20
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-graphite)', margin: 0 }}>
                Данные посетителя
              </h2>

              <div className="form-field-group">
                <label className={`form-label-text ${touched.visitorName && errors.visitorName ? 'has-error' : ''}`}>
                  Имя и фамилия
                </label>
                <input
                  type="text"
                  value={formData.visitorName}
                  onBlur={() => handleBlur('visitorName')}
                  onChange={(e) => handleChange('visitorName', e.target.value)}
                  placeholder="Алексей Смирнов"
                  className="form-input-control"
                  style={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-graphite)'
                  }}
                />
                {touched.visitorName && errors.visitorName && (
                  <p className="error-hint-text">{errors.visitorName}</p>
                )}
              </div>

              <div className="form-field-group">
                <label className={`form-label-text ${touched.email && errors.email ? 'has-error' : ''}`}>
                  Электронная почта
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onBlur={() => handleBlur('email')}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="name@example.com"
                  className="form-input-control"
                  style={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-graphite)'
                  }}
                />
                {touched.email && errors.email && (
                  <p className="error-hint-text">{errors.email}</p>
                )}
              </div>

              <div className="form-field-group">
                <label className="form-label-text">
                  Контактный телефон (необязательно)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+375 (29) 123-45-67"
                  className="form-input-control"
                  style={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-graphite)'
                  }}
                />
              </div>
            </div>

            {serverError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#b91c1c',
                  fontSize: 13,
                  marginTop: 16
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{serverError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ width: '100%', marginTop: 20, opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Оформление пропуска...' : 'Подтвердить персональный маршрут'}
            </button>
          </form>

          <div
            className="sidebar-sticky-box card-surface"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 16,
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="section-eyebrow" style={{ margin: 0 }}>Сводка маршрута</span>
              <span className="font-display" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-graphite)' }}>
                {selectedExhibits.length} шедевров
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-charcoal)' }}>
                <span>Осмотр экспонатов</span>
                <span className="font-display" style={{ fontWeight: 500, color: 'var(--text-graphite)' }}>
                  ~{exhibitsTime} мин
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-charcoal)' }}>
                <span>Переходы между залами</span>
                <span className="font-display" style={{ fontWeight: 500, color: 'var(--text-graphite)' }}>
                  +{transitTime} мин
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-charcoal)' }}>
                <span>Доступный лимит времени</span>
                <span className="font-display" style={{ fontWeight: 500, color: 'var(--text-graphite)' }}>
                  {availableTime} мин
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 12, borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-graphite)' }}>Итоговое время</span>
                <span className="font-display" style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-graphite)' }}>
                  {formatHoursMinutes(totalEstimatedTime)}
                </span>
              </div>
            </div>

            {isOverLimit ? (
              <div className="alert-gentle-box" style={{ padding: 14, fontSize: 13 }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <div>
                  Превышение на {overLimitDelta} мин. Вы сможете продолжить с текущим планом.
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  color: 'var(--text-charcoal)'
                }}
              >
                <Check size={16} style={{ color: 'var(--text-graphite)' }} />
                <span>Маршрут укладывается в отведенное время.</span>
              </div>
            )}

            {hallsSequence.length > 0 && (
              <div>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-smoke)', display: 'block', marginBottom: 8 }}>
                  Последовательность залов:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {hallsSequence.map((h, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 8,
                        backgroundColor: 'var(--bg-secondary)',
                        fontSize: 12,
                        color: 'var(--text-charcoal)',
                        border: '1px solid rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
