import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoute } from '../context/RouteContext';
import { X, Check, Plus, MapPin, ArrowRight } from 'lucide-react';

export const DetailModal = () => {
  const {
    activeModalExhibit,
    setActiveModalExhibit,
    isInRoute,
    toggleExhibit,
    navigateToCatalogWithFilter
  } = useRoute();

  if (!activeModalExhibit) return null;

  const inRoute = isInRoute(activeModalExhibit.id);

  return (
    <AnimatePresence>
      <div className="modal-backdrop-root">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setActiveModalExhibit(null)}
          className="modal-glass-bg"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="modal-dialog-box"
        >
          <button
            onClick={() => setActiveModalExhibit(null)}
            className="modal-close-round"
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>

          <div className="modal-media-col">
            <img
              src={activeModalExhibit.imageUrl || (activeModalExhibit.image && activeModalExhibit.image.url)}
              alt={(activeModalExhibit.image && activeModalExhibit.image.alt) || activeModalExhibit.title}
              loading="lazy"
              onError={(e) => {
                if (activeModalExhibit.fallbackImage && e.currentTarget.src !== activeModalExhibit.fallbackImage) {
                  e.currentTarget.src = activeModalExhibit.fallbackImage;
                }
              }}
            />
          </div>

          <div className="modal-info-col">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="modal-meta-crumbs">
                <button
                  type="button"
                  onClick={() => {
                    navigateToCatalogWithFilter({ category: activeModalExhibit.categoryKey, hallId: 'all', period: 'all', search: '' });
                    setActiveModalExhibit(null);
                  }}
                  className="modal-meta-chip"
                  title="Показать все экспонаты этой категории"
                >
                  {activeModalExhibit.category}
                </button>
                <span style={{ color: 'var(--text-smoke)' }}>/</span>
                <button
                  type="button"
                  onClick={() => {
                    navigateToCatalogWithFilter({ period: activeModalExhibit.periodKey, hallId: 'all', category: 'all', search: '' });
                    setActiveModalExhibit(null);
                  }}
                  className="modal-meta-chip"
                  title="Показать все экспонаты этой эпохи"
                >
                  {activeModalExhibit.period}
                </button>
              </div>

              <div>
                <h2 style={{ fontSize: 26, fontWeight: 400, color: 'var(--text-graphite)', lineHeight: 1.25 }}>
                  {activeModalExhibit.title}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text-charcoal)', marginTop: 6 }}>
                  {activeModalExhibit.artist || activeModalExhibit.author}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    navigateToCatalogWithFilter({ hallId: activeModalExhibit.hallId, category: 'all', period: 'all', search: '' });
                    setActiveModalExhibit(null);
                  }}
                  className="modal-hall-link-btn"
                  title="Показать все экспонаты этого зала"
                >
                  <MapPin size={14} style={{ color: 'var(--text-smoke)' }} />
                  <span>{activeModalExhibit.hall || activeModalExhibit.hallName}</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: 'var(--text-charcoal)', lineHeight: 1.6 }}>
                <p>{activeModalExhibit.description}</p>
              </div>

              <div className="modal-spec-plate">
                <div className="modal-spec-row">
                  <span style={{ color: 'var(--text-smoke)' }}>Техника и материалы</span>
                  <span>{activeModalExhibit.technique}</span>
                </div>
                <div className="modal-spec-row">
                  <span style={{ color: 'var(--text-smoke)' }}>Размеры</span>
                  <span>{activeModalExhibit.dimensions}</span>
                </div>
                <div className="modal-spec-row">
                  <span style={{ color: 'var(--text-smoke)' }}>Период создания</span>
                  <span>{activeModalExhibit.period}</span>
                </div>
                <div className="modal-spec-row">
                  <span style={{ color: 'var(--text-smoke)' }}>Время осмотра</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--text-graphite)' }}>
                    ~{activeModalExhibit.durationMinutes} мин
                  </span>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 20 }}>
              <button
                onClick={() => toggleExhibit(activeModalExhibit)}
                className={`btn-primary ${inRoute ? 'btn-secondary' : ''}`}
                style={{ width: '100%', padding: '16px 24px' }}
              >
                {inRoute ? (
                  <>
                    <Check size={16} />
                    <span>В вашем персональном маршруте</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Добавить в маршрут (~{activeModalExhibit.durationMinutes} мин)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
