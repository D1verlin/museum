import React from 'react';
import { motion } from 'framer-motion';
import { useRoute } from '../context/RouteContext';
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  AlertCircle,
  MapPin,
  ArrowRight
} from 'lucide-react';

export const DashboardView = () => {
  const {
    selectedExhibits,
    moveExhibit,
    removeExhibit,
    clearRoute,
    availableTime,
    setAvailableTime,
    pace,
    setPace,
    exhibitsTime,
    transitTime,
    totalEstimatedTime,
    hallsSequence,
    isOverLimit,
    overLimitDelta,
    remainingTime,
    setCurrentView,
    setActiveModalExhibit,
    navigateToCatalogWithFilter
  } = useRoute();

  const timePresets = [45, 60, 90, 120, 150];

  const formatHoursMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours === 0) return `${mins} мин`;
    if (mins === 0) return `${hours} ч`;
    return `${hours} ч ${mins} мин`;
  };

  return (
    <div className="aura-container">
      <div className="dashboard-layout">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
          <div style={{ maxWidth: 640 }}>
            <span className="section-eyebrow">Индивидуальный маршрут</span>
            <h1 className="section-title" style={{ fontSize: 44 }}>Панель управления визитом</h1>
            <p style={{ fontSize: 15, color: 'var(--text-charcoal)', marginTop: 8 }}>
              Автоматический расчет продолжительности осмотра с учетом времени переходов между залами.
              Настройте комфортный темп и очередность залов.
            </p>
          </div>

          {selectedExhibits.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => setCurrentView('catalog')}
                className="btn-secondary"
                style={{ padding: '12px 20px', fontSize: 13 }}
              >
                Добавить еще
              </button>
              <button
                onClick={clearRoute}
                className="btn-secondary"
                style={{ padding: '12px 20px', fontSize: 13, color: 'var(--text-smoke)', backgroundColor: 'transparent' }}
              >
                Очистить
              </button>
            </div>
          )}
        </div>

        <div className="metrics-plate-grid">
          <div>
            <div className="metric-label">Расчетное время</div>
            <div className="metric-num-big">{formatHoursMinutes(totalEstimatedTime)}</div>
            <div className="metric-sub">{exhibitsTime} мин осмотр / {transitTime} мин залы</div>
          </div>

          <div>
            <div className="metric-label">Лимит времени</div>
            <div className="metric-num-big">{formatHoursMinutes(availableTime)}</div>
            <div className="metric-sub">
              {isOverLimit ? (
                <span style={{ color: 'var(--color-clay)' }}>Превышение на {overLimitDelta} мин</span>
              ) : (
                <span>Запас времени: {remainingTime} мин</span>
              )}
            </div>
          </div>

          <div>
            <div className="metric-label">Экспонатов в плане</div>
            <div className="metric-num-big">{selectedExhibits.length}</div>
            <div className="metric-sub">Из 15 экспонатов коллекции</div>
          </div>

          <div>
            <div className="metric-label">Задействовано залов</div>
            <div className="metric-num-big">{hallsSequence.length}</div>
            <div className="metric-sub">
              {hallsSequence.length > 0 ? `${hallsSequence.length} из 5 залов музея` : 'Маршрут не выбран'}
            </div>
          </div>
        </div>

        {isOverLimit && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert-gentle-box"
          >
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <strong style={{ color: 'var(--text-charcoal)' }}>
                Время маршрута ({formatHoursMinutes(totalEstimatedTime)}) превышает ваш лимит на {overLimitDelta} минут.
              </strong>{' '}
              <span>
                Вы можете переключить темп на «Экспресс», оптимизировать список или увеличить лимит доступного времени.
              </span>
            </div>
            <button
              onClick={() => setAvailableTime(totalEstimatedTime)}
              style={{ padding: '8px 16px', borderRadius: 10, background: '#FFFFFF', color: 'var(--text-graphite)', fontSize: 12, fontWeight: 500 }}
            >
              Скорректировать лимит
            </button>
          </motion.div>
        )}

        <div className="controls-two-col">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-graphite)' }}>
              Ваше доступное время визита:
            </label>
            <div className="preset-pills-row">
              {timePresets.map((t) => {
                const active = availableTime === t;
                return (
                  <button
                    key={t}
                    onClick={() => setAvailableTime(t)}
                    className={`time-pill-btn ${active ? 'active' : ''}`}
                  >
                    {t} минут
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--text-smoke)' }}>Или точное количество минут:</span>
              <input
                type="number"
                min="15"
                max="480"
                value={availableTime}
                onChange={(e) => setAvailableTime(Math.max(15, Number(e.target.value) || 15))}
                style={{ width: 90, padding: '8px 12px', borderRadius: 8, backgroundColor: 'var(--bg-surface)', fontFamily: 'var(--font-display)', fontSize: 13 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-graphite)' }}>
              Темп созерцания:
            </label>
            <div className="pace-cards-grid">
              {[
                { id: 'express', label: 'Экспресс', sub: '0.8x (~6-8 мин)' },
                { id: 'standard', label: 'Стандарт', sub: '1.0x (~10-12 мин)' },
                { id: 'inDepth', label: 'Вдумчивый', sub: '1.3x (~14-18 мин)' }
              ].map((p) => {
                const active = pace === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPace(p.id)}
                    className={`pace-card-btn ${active ? 'active' : ''}`}
                  >
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.label}</div>
                    <div style={{ fontSize: 11, color: active ? 'rgba(255,255,255,0.75)' : 'var(--text-smoke)', marginTop: 2 }}>
                      {p.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 22, fontWeight: 400, color: 'var(--text-graphite)' }}>
              Последовательность обхода экспонатов
            </h2>
            <span style={{ fontSize: 13, color: 'var(--text-smoke)' }}>
              Используйте стрелки для изменения порядка
            </span>
          </div>

          {selectedExhibits.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 16 }}>
              <p style={{ fontSize: 16, color: 'var(--text-charcoal)', marginBottom: 16 }}>
                В вашем персональном маршруте пока нет экспонатов.
              </p>
              <button
                onClick={() => navigateToCatalogWithFilter({ hallId: 'all', category: 'all', period: 'all', search: '' })}
                className="btn-primary"
              >
                <span>Перейти в каталог экспонатов</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="route-sequence-list">
              {selectedExhibits.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === selectedExhibits.length - 1;
                const prevItem = index > 0 ? selectedExhibits[index - 1] : null;
                const isHallChange = prevItem && prevItem.hallId !== item.hallId;

                return (
                  <React.Fragment key={item.id}>
                    {isHallChange && (
                      <div className="transit-divider-box">
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <MapPin size={13} style={{ color: 'var(--text-smoke)' }} />
                          <span>Переход: {prevItem.hall || prevItem.hallName} → {item.hall || item.hallName}</span>
                        </span>
                        <span className="font-display" style={{ color: 'var(--text-charcoal)' }}>+5 минут в пути</span>
                      </div>
                    )}

                    <div className={`route-row-item ${index % 2 === 0 ? 'alternate' : ''}`}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                        <span className="font-display" style={{ fontSize: 15, color: 'var(--text-smoke)', width: 24, textAlign: 'center' }}>
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <div
                          onClick={() => setActiveModalExhibit(item)}
                          className="row-thumb"
                        >
                          <img
                            src={item.imageUrl || (item.image && item.image.url)}
                            alt={item.title}
                            onError={(e) => {
                              if (item.fallbackImage && e.currentTarget.src !== item.fallbackImage) {
                                e.currentTarget.src = item.fallbackImage;
                              }
                            }}
                          />
                        </div>

                        <div>
                          <h3
                            onClick={() => setActiveModalExhibit(item)}
                            style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-graphite)', cursor: 'pointer' }}
                          >
                            {item.title}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-charcoal)', marginTop: 2, flexWrap: 'wrap' }}>
                            <span>{item.artist || item.author}</span>
                            <span style={{ color: 'var(--text-smoke)' }}>/</span>
                            <button
                              type="button"
                              onClick={() => navigateToCatalogWithFilter({ hallId: item.hallId, category: 'all', period: 'all', search: '' })}
                              className="dash-hall-link-btn"
                              title="Показать все экспонаты этого зала"
                            >
                              {item.hall || item.hallName}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between' }}>
                        <span className="font-display" style={{ fontSize: 13, backgroundColor: 'var(--bg-surface)', padding: '6px 12px', borderRadius: 8 }}>
                          ~{Math.round(item.durationMinutes * (pace === 'express' ? 0.8 : pace === 'inDepth' ? 1.3 : 1))} мин
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <button
                            onClick={() => moveExhibit(index, 'up')}
                            disabled={isFirst}
                            style={{ padding: 8, opacity: isFirst ? 0.2 : 0.8 }}
                            aria-label="Вверх"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            onClick={() => moveExhibit(index, 'down')}
                            disabled={isLast}
                            style={{ padding: 8, opacity: isLast ? 0.2 : 0.8 }}
                            aria-label="Вниз"
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeExhibit(item.id)}
                          style={{ padding: 8, color: 'var(--text-smoke)' }}
                          aria-label="Удалить"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        {selectedExhibits.length > 0 && (
          <div style={{ padding: '36px', borderRadius: 16, backgroundColor: 'var(--bg-secondary)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 400, color: 'var(--text-graphite)' }}>Маршрут сформирован</h3>
              <p style={{ fontSize: 13, color: 'var(--text-charcoal)', marginTop: 4 }}>
                Итого {selectedExhibits.length} шедевров, ориентировочно {formatHoursMinutes(totalEstimatedTime)} в музее.
              </p>
            </div>

            <button
              onClick={() => {
                setCurrentView('checkout');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-primary"
            >
              <span>Оформить визит и сохранить план</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
