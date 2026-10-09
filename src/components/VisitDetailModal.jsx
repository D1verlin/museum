import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoute } from '../context/RouteContext';
import { X, Calendar, Clock, Printer, MapPin, Compass } from 'lucide-react';

export const VisitDetailModal = () => {
  const { selectedVisitDetail, closeVisitDetail, exhibits } = useRoute();

  if (!selectedVisitDetail) return null;

  const visit = selectedVisitDetail;
  const isConfirmed = visit.status === 'confirmed';
  const isCancelled = visit.status === 'cancelled';

  let visitExhibits = [];
  if (Array.isArray(visit.exhibitsSnapshot) && visit.exhibitsSnapshot.length > 0) {
    visitExhibits = visit.exhibitsSnapshot;
  } else if (typeof visit.exhibitsSnapshot === 'string') {
    try {
      visitExhibits = JSON.parse(visit.exhibitsSnapshot);
    } catch {
      visitExhibits = [];
    }
  }

  if (visitExhibits.length === 0 && Array.isArray(visit.exhibitIds)) {
    visitExhibits = visit.exhibitIds
      .map((id) => exhibits.find((ex) => ex.id === id))
      .filter(Boolean);
  }

  let hallsList = [];
  if (Array.isArray(visit.hallsSequence)) {
    hallsList = visit.hallsSequence;
  } else if (typeof visit.hallsSequence === 'string') {
    try {
      hallsList = JSON.parse(visit.hallsSequence);
    } catch {
      hallsList = [];
    }
  }

  const paceLabel = {
    express: 'Экспресс (~80% времени)',
    standard: 'Стандартный',
    inDepth: 'Углубленный (~130% времени)'
  }[visit.pace] || 'Стандартный';

  return (
    <AnimatePresence>
      <div className="modal-backdrop-root">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={closeVisitDetail}
          className="modal-glass-bg"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="card-surface"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 720,
            maxHeight: '90vh',
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            zIndex: 100,
            overflowY: 'auto',
            padding: '36px 32px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >

          <button
            onClick={closeVisitDetail}
            className="modal-close-round"
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 36,
              height: 36,
              borderRadius: 10,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-graphite)'
            }}
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>

          <div style={{ marginBottom: 24, paddingRight: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
              <span className="font-display" style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-graphite)' }}>
                {visit.ticketNumber}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 8,
                  backgroundColor: isConfirmed
                    ? 'rgba(34, 197, 94, 0.12)'
                    : isCancelled
                    ? 'rgba(239, 68, 68, 0.12)'
                    : 'rgba(59, 130, 246, 0.12)',
                  color: isConfirmed ? '#15803d' : isCancelled ? '#b91c1c' : '#1d4ed8'
                }}
              >
                {isConfirmed ? 'Подтвержден' : isCancelled ? 'Отменен' : 'Завершен'}
              </span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-charcoal)', margin: 0 }}>
              Персональный маршрутный лист визита в Национальный художественный музей
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 12,
              backgroundColor: 'var(--bg-secondary)',
              padding: '18px 20px',
              borderRadius: 12,
              marginBottom: 24,
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}
          >
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-smoke)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Дата</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontWeight: 600, color: 'var(--text-graphite)', fontSize: 14 }}>
                <Calendar size={14} style={{ color: 'var(--text-charcoal)' }} />
                <span>{visit.visitDate}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: 11, color: 'var(--text-smoke)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Интервал</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontWeight: 600, color: 'var(--text-graphite)', fontSize: 14 }}>
                <Clock size={14} style={{ color: 'var(--text-charcoal)' }} />
                <span>{visit.timeSlot}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: 11, color: 'var(--text-smoke)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Хронометраж</span>
              <div style={{ marginTop: 4, fontWeight: 600, color: 'var(--text-graphite)', fontSize: 14 }}>
                {visit.totalEstimatedTime} мин
              </div>
            </div>

            <div>
              <span style={{ fontSize: 11, color: 'var(--text-smoke)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Экспонатов</span>
              <div style={{ marginTop: 4, fontWeight: 600, color: 'var(--text-graphite)', fontSize: 14 }}>
                {visitExhibits.length}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 24, padding: '14px 18px', borderRadius: 12, border: '1px solid rgba(0, 0, 0, 0.06)', backgroundColor: '#FAFAFB' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: 13, color: 'var(--text-charcoal)' }}>
              <div>
                <strong style={{ color: 'var(--text-graphite)' }}>Посетитель:</strong> {visit.visitorName}
              </div>
              <div>
                <strong style={{ color: 'var(--text-graphite)' }}>Email:</strong> {visit.email}
              </div>
              {visit.phone && (
                <div>
                  <strong style={{ color: 'var(--text-graphite)' }}>Телефон:</strong> {visit.phone}
                </div>
              )}
              <div>
                <strong style={{ color: 'var(--text-graphite)' }}>Темп:</strong> {paceLabel}
              </div>
            </div>
          </div>

          {hallsList.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-graphite)', marginBottom: 10 }}>
                <Compass size={15} />
                <span>Маршрут по залам музея ({hallsList.length})</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                {hallsList.map((hall, idx) => (
                  <React.Fragment key={idx}>
                    <span
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid rgba(0, 0, 0, 0.06)',
                        fontSize: 12,
                        fontWeight: 500,
                        color: 'var(--text-graphite)'
                      }}
                    >
                      {idx + 1}. {hall}
                    </span>
                    {idx < hallsList.length - 1 && (
                      <span style={{ color: 'var(--text-smoke)', fontSize: 12 }}>→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-graphite)', marginBottom: 12 }}>
              <MapPin size={15} />
              <span>Экспонаты в маршруте ({visitExhibits.length})</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {visitExhibits.map((item, idx) => (
                <div
                  key={item.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 10,
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid rgba(0, 0, 0, 0.04)',
                    fontSize: 13
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="font-display" style={{ color: 'var(--text-smoke)', width: 20, fontWeight: 600 }}>
                      {idx + 1}.
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-graphite)' }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-smoke)' }}>
                        {item.artist} {item.hallName && `• ${item.hallName}`}
                      </div>
                    </div>
                  </div>
                  <span className="font-display" style={{ fontSize: 12, color: 'var(--text-charcoal)', fontWeight: 500 }}>
                    ~{item.durationMinutes} мин
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
            <button
              onClick={() => window.print()}
              className="btn-primary"
              style={{ padding: '10px 18px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Printer size={15} />
              <span>Печать маршрута</span>
            </button>
            <button
              onClick={closeVisitDetail}
              className="btn-secondary"
              style={{ padding: '10px 20px', fontSize: 13 }}
            >
              Закрыть
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
