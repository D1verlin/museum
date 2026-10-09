import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRoute } from '../context/RouteContext';
import {
  Shield,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  ExternalLink,
  Calendar,
  Clock,
  Layers,
  AlertCircle
} from 'lucide-react';

export const AdminView = () => {
  const { user, token, exhibits, openVisitDetail, showToast, setCurrentView, fetchExhibits } = useRoute();
  const [activeTab, setActiveTab] = useState('visits'); 

  const [allVisits, setAllVisits] = useState([]);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [adminExhibits, setAdminExhibits] = useState(exhibits || []);
  const [exhibitsLoading, setExhibitsLoading] = useState(false);
  const [exhibitSearch, setExhibitSearch] = useState('');
  const [selectedHallFilter, setSelectedHallFilter] = useState('all');
  const [showAddExhibitModal, setShowAddExhibitModal] = useState(false);
  const [newExhibit, setNewExhibit] = useState({
    title: '',
    artist: '',
    hallId: 1,
    durationMinutes: 10,
    period: 'XVIII век',
    periodKey: '18th_century',
    category: 'Живопись',
    categoryKey: 'painting',
    description: '',
    imageUrl: './images/museum/building_main.jpg'
  });

  const fetchAdminVisits = useCallback(async () => {
    if (!token || user?.role !== 'admin') return;
    setVisitsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/visits?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAllVisits(data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch admin visits:', err);
    } finally {
      setVisitsLoading(false);
    }
  }, [token, user?.role, statusFilter, searchQuery]);

  const fetchAdminExhibits = useCallback(async () => {
    setExhibitsLoading(true);
    try {
      const res = await fetch('/api/exhibits?limit=100');
      const data = await res.json();
      if (data.success && data.data?.exhibits) {
        setAdminExhibits(data.data.exhibits);
      }
    } catch (err) {
      console.warn('Failed to fetch admin exhibits:', err);
    } finally {
      setExhibitsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminVisits();
  }, [fetchAdminVisits]);

  useEffect(() => {
    fetchAdminExhibits();
  }, [fetchAdminExhibits]);

  const handleUpdateVisitStatus = async (visitId, newStatus) => {
    try {
      const res = await fetch(`/api/visits/${visitId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await res.json();
      if (result.success) {
        showToast(`Статус визита обновлен: ${newStatus}`);
        fetchAdminVisits();
      } else {
        showToast(result.error?.message || 'Ошибка обновления статуса');
      }
    } catch {
      showToast('Ошибка соединения с сервером');
    }
  };

  const handleCreateExhibit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/exhibits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newExhibit,
          hallId: Number(newExhibit.hallId),
          durationMinutes: Number(newExhibit.durationMinutes)
        })
      });
      const result = await res.json();
      if (result.success) {
        showToast('Экспонат успешно добавлен в коллекцию музея');
        setShowAddExhibitModal(false);
        setNewExhibit({
          title: '',
          artist: '',
          hallId: 1,
          durationMinutes: 10,
          period: 'XVIII век',
          periodKey: '18th_century',
          category: 'Живопись',
          categoryKey: 'painting',
          description: '',
          imageUrl: './images/museum/building_main.jpg'
        });
        fetchAdminExhibits();
        if (fetchExhibits) fetchExhibits();
      } else {
        showToast(result.error?.message || 'Ошибка добавления');
      }
    } catch {
      showToast('Ошибка при отправке запроса');
    }
  };

  const handleDeleteExhibit = async (id, title) => {
    if (!window.confirm(`Вы уверены, что хотите удалить экспонат «${title}»?`)) return;
    try {
      const res = await fetch(`/api/exhibits/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        showToast(`Экспонат «${title}» удален`);
        fetchAdminExhibits();
        if (fetchExhibits) fetchExhibits();
      } else {
        showToast(result.error?.message || 'Ошибка удаления');
      }
    } catch {
      showToast('Ошибка при отправке запроса');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="aura-container" style={{ padding: '80px 24px', maxWidth: 520, textAlign: 'center' }}>
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
          <Shield size={44} style={{ color: '#b91c1c', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-graphite)', margin: '0 0 10px' }}>
            Доступ ограничен
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-charcoal)', margin: '0 0 24px', lineHeight: 1.6 }}>
            Панель управления доступна только сотрудникам музея с ролью администратора.
          </p>
          <button
            onClick={() => setCurrentView('auth')}
            className="btn-primary"
            style={{ padding: '12px 24px', fontSize: 14 }}
          >
            Войти как администратор
          </button>
        </div>
      </div>
    );
  }

  const totalVisitsCount = allVisits.length;
  const confirmedCount = allVisits.filter((v) => v.status === 'confirmed').length;
  const completedCount = allVisits.filter((v) => v.status === 'completed').length;
  const cancelledCount = allVisits.filter((v) => v.status === 'cancelled').length;

  const filteredAdminExhibits = adminExhibits.filter((ex) => {
    const matchesSearch =
      ex.title.toLowerCase().includes(exhibitSearch.toLowerCase()) ||
      ex.artist.toLowerCase().includes(exhibitSearch.toLowerCase());
    const matchesHall =
      selectedHallFilter === 'all' || String(ex.hallId) === String(selectedHallFilter);
    return matchesSearch && matchesHall;
  });

  return (
    <div className="aura-container" style={{ padding: '48px 24px 96px', maxWidth: 1140, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Shield size={24} style={{ color: 'var(--text-graphite)' }} />
              <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--text-graphite)', margin: 0 }}>
                Панель администратора музея
              </h1>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-charcoal)', margin: '6px 0 0' }}>
              Управление визитами, билетами и каталогом Национального художественного музея РБ
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <a
              href="/api/docs"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{
                padding: '8px 14px',
                fontSize: 13,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: 'var(--text-graphite)'
              }}
            >
              <ExternalLink size={14} />
              <span>Swagger API Docs</span>
            </a>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginBottom: 32
          }}
        >
          <div
            className="card-surface"
            style={{
              padding: '20px 24px',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 14
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--text-smoke)', display: 'block' }}>Всего оформлено визитов</span>
            <span className="font-display" style={{ fontSize: 28, fontWeight: 600, color: 'var(--text-graphite)' }}>
              {totalVisitsCount}
            </span>
          </div>

          <div
            className="card-surface"
            style={{
              padding: '20px 24px',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 14
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--text-smoke)', display: 'block' }}>Подтвержденные визиты</span>
            <span className="font-display" style={{ fontSize: 28, fontWeight: 600, color: '#15803d' }}>
              {confirmedCount}
            </span>
          </div>

          <div
            className="card-surface"
            style={{
              padding: '20px 24px',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 14
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--text-smoke)', display: 'block' }}>Завершенные визиты</span>
            <span className="font-display" style={{ fontSize: 28, fontWeight: 600, color: '#1d4ed8' }}>
              {completedCount}
            </span>
          </div>

          <div
            className="card-surface"
            style={{
              padding: '20px 24px',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 14
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--text-smoke)', display: 'block' }}>Экспонатов в коллекции</span>
            <span className="font-display" style={{ fontSize: 28, fontWeight: 600, color: 'var(--text-graphite)' }}>
              {adminExhibits.length}
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 24,
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            paddingBottom: 12
          }}
        >
          <button
            onClick={() => setActiveTab('visits')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 14,
              backgroundColor: activeTab === 'visits' ? 'var(--text-graphite)' : 'transparent',
              color: activeTab === 'visits' ? '#FFFFFF' : 'var(--text-charcoal)',
              transition: 'all 0.18s ease'
            }}
          >
            Управление визитами и билетами ({totalVisitsCount})
          </button>
          <button
            onClick={() => setActiveTab('exhibits')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 14,
              backgroundColor: activeTab === 'exhibits' ? 'var(--text-graphite)' : 'transparent',
              color: activeTab === 'exhibits' ? '#FFFFFF' : 'var(--text-charcoal)',
              transition: 'all 0.18s ease'
            }}
          >
            Экспонаты музея ({adminExhibits.length})
          </button>
        </div>

        {activeTab === 'visits' && (
          <div>

            <div
              className="card-surface"
              style={{
                padding: '16px 20px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: 14,
                marginBottom: 20,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 260, alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-smoke)' }} />
                  <input
                    type="text"
                    placeholder="Поиск по номеру AURA-, имени или email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') fetchAdminVisits(); }}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 8,
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-graphite)',
                      fontSize: 13,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <button
                  onClick={fetchAdminVisits}
                  className="btn-primary"
                  style={{ padding: '9px 14px', fontSize: 13, flexShrink: 0 }}
                >
                  Найти
                </button>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-graphite)',
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">Все статусы</option>
                  <option value="confirmed">Подтвержденные</option>
                  <option value="completed">Завершенные</option>
                  <option value="cancelled">Отмененные</option>
                </select>

                <button
                  onClick={fetchAdminVisits}
                  className="btn-secondary"
                  title="Обновить список"
                  style={{ padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <RefreshCw size={14} className={visitsLoading ? 'animate-spin' : ''} />
                  <span>Обновить</span>
                </button>
              </div>
            </div>

            {visitsLoading ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-smoke)' }}>Загрузка визитов...</div>
            ) : allVisits.length === 0 ? (
              <div
                className="card-surface"
                style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  borderRadius: 14,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(0, 0, 0, 0.08)'
                }}
              >
                <p style={{ color: 'var(--text-charcoal)', fontSize: 15, margin: 0 }}>
                  Визиты с выбранными параметрами фильтра не найдены
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {allVisits.map((visit) => {
                  const isConfirmed = visit.status === 'confirmed';
                  const isCancelled = visit.status === 'cancelled';

                  return (
                    <div
                      key={visit.id}
                      className="card-surface"
                      style={{
                        padding: '18px 22px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: 14,
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 16
                      }}
                    >
                      <div style={{ minWidth: 260 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-graphite)' }}>
                            {visit.ticketNumber}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              padding: '2px 8px',
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

                        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-graphite)' }}>
                          {visit.visitorName}
                          <span style={{ fontWeight: 400, color: 'var(--text-smoke)', marginLeft: 8 }}>
                            {visit.email}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-charcoal)', marginTop: 4 }}>
                          <span>{visit.visitDate} в {visit.timeSlot}</span>
                          <span>{visit.totalEstimatedTime} мин</span>
                          <span>
                            {Array.isArray(visit.exhibitIds) ? visit.exhibitIds.length : (visit.exhibitsSnapshot?.length || 0)} экспонатов
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <button
                          onClick={() => openVisitDetail(visit)}
                          className="btn-secondary"
                          style={{ padding: '8px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
                        >
                          <Eye size={13} />
                          <span>Маршрут</span>
                        </button>

                        {isConfirmed && (
                          <>
                            <button
                              onClick={() => handleUpdateVisitStatus(visit.id, 'completed')}
                              className="btn-secondary"
                              style={{
                                padding: '8px 12px',
                                fontSize: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                                color: '#15803d',
                                borderColor: 'rgba(34, 197, 94, 0.3)'
                              }}
                            >
                              <CheckCircle size={13} />
                              <span>Завершить</span>
                            </button>

                            <button
                              onClick={() => handleUpdateVisitStatus(visit.id, 'cancelled')}
                              className="btn-secondary"
                              style={{
                                padding: '8px 12px',
                                fontSize: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                                color: '#b91c1c',
                                borderColor: 'rgba(239, 68, 68, 0.3)'
                              }}
                            >
                              <XCircle size={13} />
                              <span>Отменить</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'exhibits' && (
          <div>

            <div
              className="card-surface"
              style={{
                padding: '16px 20px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: 14,
                marginBottom: 20,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 260 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-smoke)' }} />
                  <input
                    type="text"
                    placeholder="Поиск шедевра по названию или автору..."
                    value={exhibitSearch}
                    onChange={(e) => setExhibitSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 8,
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-graphite)',
                      fontSize: 13,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <select
                  value={selectedHallFilter}
                  onChange={(e) => setSelectedHallFilter(e.target.value)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-graphite)',
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">Все залы</option>
                  <option value="1">Зал 1: Древнебелорусское искусство</option>
                  <option value="2">Зал 2: Искусство XVI–XVIII веков</option>
                  <option value="3">Зал 3: Искусство XIX века</option>
                  <option value="4">Зал 4: Белорусское искусство нач. XX века</option>
                  <option value="5">Зал 5: Современное искусство XX–XXI веков</option>
                </select>
              </div>

              <button
                onClick={() => setShowAddExhibitModal(true)}
                className="btn-primary"
                style={{ padding: '9px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Plus size={15} />
                <span>Добавить экспонат</span>
              </button>
            </div>

            {exhibitsLoading ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-smoke)' }}>Загрузка каталога...</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                {filteredAdminExhibits.map((ex) => (
                  <div
                    key={ex.id}
                    className="card-surface"
                    style={{
                      padding: '16px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: 14,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 14
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 8,
                          backgroundColor: 'var(--bg-surface)',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={ex.imageUrl || (ex.image && ex.image.url) || './images/museum/building_main.jpg'}
                          alt={ex.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: 'var(--text-graphite)',
                            margin: 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {ex.title}
                        </h4>
                        <div style={{ fontSize: 13, color: 'var(--text-charcoal)', marginTop: 2 }}>{ex.artist}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-smoke)', marginTop: 2 }}>
                          {ex.hallName || `Зал ${ex.hallId}`} • ~{ex.durationMinutes} мин
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, backgroundColor: 'var(--bg-secondary)', color: 'var(--text-charcoal)' }}>
                        {ex.period}
                      </span>
                      <button
                        onClick={() => handleDeleteExhibit(ex.id, ex.title)}
                        className="btn-secondary"
                        style={{
                          padding: '6px 10px',
                          fontSize: 12,
                          color: '#b91c1c',
                          borderColor: 'rgba(239, 68, 68, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Trash2 size={13} />
                        <span>Удалить</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showAddExhibitModal && (
          <div className="modal-backdrop-root">
            <div
              className="modal-glass-bg"
              onClick={() => setShowAddExhibitModal(false)}
            />
            <div
              className="card-surface"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 540,
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                zIndex: 100,
                padding: '32px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(0, 0, 0, 0.08)'
              }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-graphite)', margin: '0 0 16px' }}>
                Добавить экспонат в коллекцию
              </h3>

              <form onSubmit={handleCreateExhibit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-charcoal)', marginBottom: 4 }}>
                    Название произведения
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Например, Портрет Барбары Радзивилл"
                    value={newExhibit.title}
                    onChange={(e) => setNewExhibit({ ...newExhibit, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      background: 'var(--bg-secondary)',
                      fontSize: 13,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-charcoal)', marginBottom: 4 }}>
                    Автор / Мастер
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Неизвестный художник XVII в. или Имя мастера"
                    value={newExhibit.artist}
                    onChange={(e) => setNewExhibit({ ...newExhibit, artist: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      background: 'var(--bg-secondary)',
                      fontSize: 13,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-charcoal)', marginBottom: 4 }}>
                      Экспозиционный зал
                    </label>
                    <select
                      value={newExhibit.hallId}
                      onChange={(e) => setNewExhibit({ ...newExhibit, hallId: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        background: 'var(--bg-secondary)',
                        fontSize: 13
                      }}
                    >
                      <option value="1">Зал 1: Древнебелорусское</option>
                      <option value="2">Зал 2: XVI–XVIII века</option>
                      <option value="3">Зал 3: XIX век</option>
                      <option value="4">Зал 4: Нач. XX века</option>
                      <option value="5">Зал 5: XX–XXI века</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-charcoal)', marginBottom: 4 }}>
                      Длительность осмотра (мин)
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="60"
                      required
                      value={newExhibit.durationMinutes}
                      onChange={(e) => setNewExhibit({ ...newExhibit, durationMinutes: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        background: 'var(--bg-secondary)',
                        fontSize: 13,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-charcoal)', marginBottom: 4 }}>
                    Краткое описание шедевра
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Исторический контекст, техника и особенности работы..."
                    value={newExhibit.description}
                    onChange={(e) => setNewExhibit({ ...newExhibit, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      background: 'var(--bg-secondary)',
                      fontSize: 13,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                  <button
                    type="button"
                    onClick={() => setShowAddExhibitModal(false)}
                    className="btn-secondary"
                    style={{ padding: '10px 18px', fontSize: 13 }}
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '10px 20px', fontSize: 13 }}
                  >
                    Сохранить в каталог
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
