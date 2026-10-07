import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRoute } from '../context/RouteContext';
import { Check, AlertCircle, Download } from 'lucide-react';

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
    setCurrentView
  } = useRoute();

  const [formData, setFormData] = useState({
    visitorName: '',
    email: '',
    phone: '',
    visitDate: '2026-10-09',
    timeSlot: '12:00',
    notes: ''
  });

  const [touched, setTouched] = useState({
    visitorName: false,
    email: false,
    phone: false
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.visitorName.trim()) {
      errs.visitorName = 'Укажите имя посетителя';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Укажите корректный e-mail для получения билета';
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
    if (touched[field]) {
      const updated = { ...formData, [field]: value };
      const errs = {};
      if (!updated.visitorName.trim()) errs.visitorName = 'Укажите имя посетителя';
      if (!updated.email.trim() || !updated.email.includes('@')) errs.email = 'Укажите корректный e-mail';
      setErrors(errs);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setTouched({ visitorName: true, email: true, phone: true });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const ticketNumber = `AURA-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedVisit({
      ticketNumber,
      createdAt: new Date().toLocaleDateString('ru-RU'),
      ...formData,
      totalEstimatedTime,
      exhibitsCount: selectedExhibits.length,
      hallsSequence,
      exhibits: selectedExhibits
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div className="aura-container" style={{ padding: '64px 24px', maxWidth: 960 }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="ticket-container-box"
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <span className="section-eyebrow">Электронный маршрутный лист</span>
              <h1 className="section-title" style={{ fontSize: 32 }}>Визит успешно оформлен</h1>
              <p style={{ fontSize: 14, color: 'var(--text-charcoal)', marginTop: 6 }}>
                Копия путеводителя отправлена на {confirmedVisit.email}
              </p>
            </div>
            <div>
              <div className="font-display" style={{ fontSize: 22, fontWeight: 500, color: 'var(--text-graphite)' }}>
                {confirmedVisit.ticketNumber}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-smoke)' }}>Номер регистрации</div>
            </div>
          </div>

          <div className="ticket-data-metrics-grid">
            <div>
              <span className="metric-label" style={{ display: 'block' }}>Дата</span>
              <span className="font-display" style={{ fontSize: 16 }}>{confirmedVisit.visitDate}</span>
            </div>
            <div>
              <span className="metric-label" style={{ display: 'block' }}>Слот</span>
              <span className="font-display" style={{ fontSize: 16 }}>{confirmedVisit.timeSlot}</span>
            </div>
            <div>
              <span className="metric-label" style={{ display: 'block' }}>Время</span>
              <span className="font-display" style={{ fontSize: 16 }}>{formatHoursMinutes(confirmedVisit.totalEstimatedTime)}</span>
            </div>
            <div>
              <span className="metric-label" style={{ display: 'block' }}>Экспонатов</span>
              <span className="font-display" style={{ fontSize: 16 }}>{confirmedVisit.exhibitsCount}</span>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-graphite)', marginBottom: 12 }}>
              Последовательность вашего маршрута
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {confirmedVisit.exhibits.map((item, idx) => (
                <div
                  key={item.id}
                  style={{ padding: 16, borderRadius: 8, backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="font-display" style={{ color: 'var(--text-smoke)', width: 20 }}>{idx + 1}.</span>
                    <span style={{ fontWeight: 500, color: 'var(--text-graphite)' }}>{item.title}</span>
                    <span style={{ color: 'var(--text-smoke)' }}>/ {item.hallName}</span>
                  </div>
                  <span className="font-display" style={{ color: 'var(--text-charcoal)' }}>~{item.durationMinutes} мин</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <button
              onClick={() => window.print()}
              className="btn-primary"
              style={{ fontSize: 13 }}
            >
              <Download size={15} />
              <span>Сохранить маршрутный лист</span>
            </button>
            <button
              onClick={() => {
                setConfirmedVisit(null);
                setCurrentView('catalog');
              }}
              className="btn-secondary"
              style={{ fontSize: 13 }}
            >
              Вернуться в каталог
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="aura-container">
      <div style={{ padding: '64px 0 96px 0', display: 'flex', flexDirection: 'column', gap: 48 }}>
        <div style={{ maxWidth: 640 }}>
          <span className="section-eyebrow">Шаг 2 из 2</span>
          <h1 className="section-title" style={{ fontSize: 44 }}>Параметры визита и регистрация</h1>
          <p style={{ fontSize: 15, color: 'var(--text-charcoal)', marginTop: 8 }}>
            Укажите доступный бюджет времени и контактные данные. Персональный маршрутный лист
            будет сформирован для комфортного посещения.
          </p>
        </div>

        <div className="checkout-grid-layout">
          <form onSubmit={handleSubmit}>
            <div className="form-block-card">
              <h2 style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-graphite)' }}>
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
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-label-text">Интервал входа</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => handleChange('timeSlot', e.target.value)}
                    className="form-input-control"
                    style={{ cursor: 'pointer' }}
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

            <div className="form-block-card">
              <h2 style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-graphite)' }}>
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
                  placeholder="Например, Александр Серов"
                  className="form-input-control"
                />
                {touched.visitorName && errors.visitorName && (
                  <p className="error-hint-text">{errors.visitorName}</p>
                )}
              </div>

              <div className="form-field-group">
                <label className={`form-label-text ${touched.email && errors.email ? 'has-error' : ''}`}>
                  Электронная почта (для отправки путеводителя)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onBlur={() => handleBlur('email')}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="name@example.com"
                  className="form-input-control"
                />
                {touched.email && errors.email && (
                  <p className="error-hint-text">{errors.email}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: 8 }}
            >
              Подтвердить персональный маршрут
            </button>
          </form>

          <div className="sidebar-sticky-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="section-eyebrow" style={{ margin: 0 }}>Сводка маршрута</span>
              <span className="font-display" style={{ fontSize: 13, fontWeight: 500 }}>
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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 12 }}>
                <span style={{ fontWeight: 500, color: 'var(--text-graphite)' }}>Итоговое время</span>
                <span className="font-display" style={{ fontSize: 24, fontWeight: 400, color: 'var(--text-graphite)' }}>
                  {formatHoursMinutes(totalEstimatedTime)}
                </span>
              </div>
            </div>

            {isOverLimit ? (
              <div className="alert-gentle-box" style={{ padding: 16, fontSize: 13 }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <div>
                  Превышение на {overLimitDelta} мин. Вы сможете продолжить с текущим планом.
                </div>
              </div>
            ) : (
              <div style={{ padding: 16, borderRadius: 8, backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-charcoal)' }}>
                <Check size={16} style={{ color: 'var(--text-graphite)' }} />
                <span>Маршрут укладывается в отведенное время.</span>
              </div>
            )}

            {hallsSequence.length > 0 && (
              <div>
                <span className="filter-group-title">Залы визита:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {hallsSequence.map((h, i) => (
                    <span
                      key={i}
                      style={{ padding: '4px 10px', borderRadius: 8, backgroundColor: '#FFFFFF', fontSize: 12, color: 'var(--text-charcoal)' }}
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
