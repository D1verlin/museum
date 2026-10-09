import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRoute } from '../context/RouteContext';
import { Calendar, Clock, Ticket, LogOut, XCircle, ArrowRight, Shield, Eye } from 'lucide-react';

export const ProfileView = () => {
  const {
    user,
    userVisits,
    visitsLoading,
    fetchUserVisits,
    cancelUserVisit,
    openVisitDetail,
    logout,
    setCurrentView
  } = useRoute();

  useEffect(() => {
    fetchUserVisits();
  }, [fetchUserVisits]);

  if (!user) {
    return (
      <div className="aura-container" style={{ padding: '80px 24px', textAlign: 'center', maxWidth: 480 }}>
        <div
          className="card-surface"
          style={{
            padding: '40px 32px',
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)'
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-graphite)', margin: '0 0 10px' }}>
            Требуется авторизация
          </h2>
          <p style={{ color: 'var(--text-charcoal)', fontSize: 14, margin: '0 0 24px' }}>
            Пожалуйста, войдите в аккаунт, чтобы просмотреть свой профиль и электронные билеты.
          </p>
          <button
            onClick={() => setCurrentView('auth')}
            className="btn-primary"
            style={{ padding: '12px 24px', fontSize: 14 }}
          >
            Войти в аккаунт
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="aura-container" style={{ padding: '48px 24px 80px', maxWidth: 760, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--text-graphite)', margin: 0 }}>
              Личный кабинет
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-charcoal)', margin: '4px 0 0' }}>
              Данные учетной записи и сохраненные маршруты
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {user.role === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className="btn-secondary"
                style={{
                  padding: '8px 14px',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'var(--text-graphite)'
                }}
              >
                <Shield size={14} />
                <span>Админ-панель</span>
              </button>
            )}
            <button
              onClick={logout}
              className="btn-secondary"
              style={{
                padding: '8px 14px',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: 'var(--text-charcoal)'
              }}
            >
              <LogOut size={14} />
              <span>Выйти</span>
            </button>
          </div>
        </div>

        <div
          className="card-surface"
          style={{
            padding: '24px 28px',
            borderRadius: 16,
            border: '1px solid rgba(0, 0, 0, 0.08)',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            marginBottom: 32
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-graphite)',
                fontSize: 20,
                fontWeight: 600
              }}
            >
              {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-graphite)', margin: 0 }}>
                  {user.fullName}
                </h3>
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 6,
                    backgroundColor: user.role === 'admin' ? 'rgba(0, 0, 0, 0.08)' : 'var(--bg-surface)',
                    color: 'var(--text-graphite)',
                    fontWeight: 600
                  }}
                >
                  {user.role === 'admin' ? 'Администратор' : 'Посетитель'}
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-charcoal)', marginTop: 4, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span>{user.email}</span>
                {user.phone && <span>{user.phone}</span>}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-graphite)', margin: 0 }}>
              Мои билеты и маршруты ({userVisits.length})
            </h2>
            <button
              onClick={() => setCurrentView('catalog')}
              className="nav-link"
              style={{ fontSize: 13, color: 'var(--text-graphite)', padding: 0, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}
            >
              <span>Составить новый маршрут</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {visitsLoading ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-smoke)' }}>Загрузка билетов...</div>
          ) : userVisits.length === 0 ? (
            <div
              className="card-surface"
              style={{
                padding: '40px 24px',
                textAlign: 'center',
                borderRadius: 16,
                border: '1px dashed rgba(0, 0, 0, 0.15)',
                backgroundColor: '#FFFFFF'
              }}
            >
              <Ticket size={32} style={{ color: 'var(--text-smoke)', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-graphite)', margin: '0 0 6px' }}>
                У вас пока нет оформленных билетов
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-charcoal)', margin: '0 0 20px' }}>
                Выберите шедевры в каталоге, рассчитайте время и получите цифровой пропуск.
              </p>
              <button
                onClick={() => setCurrentView('catalog')}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: 13 }}
              >
                Перейти в каталог
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {userVisits.map((visit) => {
                const isConfirmed = visit.status === 'confirmed';
                const isCancelled = visit.status === 'cancelled';

                return (
                  <div
                    key={visit.id || visit.ticketNumber}
                    className="card-surface"
                    style={{
                      padding: '20px 24px',
                      borderRadius: 14,
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 16
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-graphite)', letterSpacing: 0.5 }}>
                          {visit.ticketNumber}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            padding: '3px 8px',
                            borderRadius: 6,
                            backgroundColor: isConfirmed
                              ? 'rgba(34, 197, 94, 0.12)'
                              : isCancelled
                              ? 'rgba(239, 68, 68, 0.12)'
                              : 'rgba(59, 130, 246, 0.12)',
                            color: isConfirmed ? '#15803d' : isCancelled ? '#b91c1c' : '#1d4ed8',
                            fontWeight: 600
                          }}
                        >
                          {isConfirmed ? 'Подтвержден' : isCancelled ? 'Отменен' : 'Завершен'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: 'var(--text-charcoal)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Calendar size={14} style={{ color: 'var(--text-smoke)' }} />
                          {visit.visitDate} в {visit.timeSlot}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Clock size={14} style={{ color: 'var(--text-smoke)' }} />
                          {visit.totalEstimatedTime} мин
                        </span>
                        <span>
                          {Array.isArray(visit.exhibitIds) ? visit.exhibitIds.length : (visit.exhibitsSnapshot?.length || 0)} шедевров
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => openVisitDetail(visit)}
                        className="btn-secondary"
                        style={{
                          padding: '8px 14px',
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          color: 'var(--text-graphite)'
                        }}
                      >
                        <Eye size={14} />
                        <span>Подробнее о маршруте</span>
                      </button>

                      {isConfirmed && (
                        <button
                          onClick={() => cancelUserVisit(visit.id)}
                          className="btn-secondary"
                          style={{
                            padding: '8px 14px',
                            fontSize: 12,
                            color: '#b91c1c',
                            borderColor: 'rgba(239, 68, 68, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <XCircle size={14} />
                          <span>Отменить</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
