import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { TRANSIT_TIME_MINUTES } from '../constants/museumConstants';

const RouteContext = createContext(null);

export const RouteProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('home');

  const [exhibits, setExhibits] = useState([]);
  const [halls, setHalls] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('aura_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('aura_token') || '';
    } catch {
      return '';
    }
  });

  const [userVisits, setUserVisits] = useState([]);
  const [visitsLoading, setVisitsLoading] = useState(false);

  const [selectedVisitDetail, setSelectedVisitDetail] = useState(null);

  const [routeExhibitIds, setRouteExhibitIds] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_route_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [availableTime, setAvailableTime] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_available_time');
      return saved ? Number(saved) : 90;
    } catch {
      return 90;
    }
  });

  const [pace, setPace] = useState('standard');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedHall, setSelectedHall] = useState('all');

  const [activeModalExhibit, setActiveModalExhibit] = useState(null);
  const [confirmedVisit, setConfirmedVisit] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? '' : prev));
    }, 2800);
  };

  const fetchExhibits = useCallback(async () => {
    try {
      const res = await fetch('/api/exhibits?limit=100');
      const data = await res.json();
      if (data.success && data.data?.exhibits) {
        setExhibits(data.data.exhibits);
      }
    } catch (err) {
      console.warn('Failed to load exhibits from API:', err);
    }
  }, []);

  const fetchHalls = useCallback(async () => {
    try {
      const res = await fetch('/api/halls');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setHalls(data.data);
      }
    } catch (err) {
      console.warn('Failed to load halls from API:', err);
    }
  }, []);

  useEffect(() => {
    setDataLoading(true);
    Promise.all([fetchExhibits(), fetchHalls()]).finally(() => {
      setDataLoading(false);
    });
  }, [fetchExhibits, fetchHalls]);

  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem('aura_token', token);
      } else {
        localStorage.removeItem('aura_token');
      }
    } catch (e) {
      console.warn('Storage error token:', e);
    }
  }, [token]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('aura_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('aura_user');
      }
    } catch (e) {
      console.warn('Storage error user:', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('aura_route_ids', JSON.stringify(routeExhibitIds));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [routeExhibitIds]);

  useEffect(() => {
    try {
      localStorage.setItem('aura_available_time', String(availableTime));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [availableTime]);

  const fetchUserVisits = useCallback(async () => {
    if (!token) {
      setUserVisits([]);
      return;
    }
    setVisitsLoading(true);
    try {
      const res = await fetch('/api/visits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setUserVisits(data.data);
      }
    } catch (err) {
      console.warn('Could not fetch visits from API:', err);
    } finally {
      setVisitsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUserVisits();
    } else {
      setUserVisits([]);
    }
  }, [token, fetchUserVisits]);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error?.message || 'Неверный логин или пароль');
      }
      setToken(result.data.token);
      setUser(result.data.user);
      showToast(`Добро пожаловать, ${result.data.user.fullName}!`);
      if (routeExhibitIds.length > 0) {
        setCurrentView('checkout');
      } else if (result.data.user.role === 'admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('profile');
      }
      return { success: true };
    } catch (err) {
      showToast(err.message);
      return { success: false, message: err.message };
    }
  };

  const register = async ({ email, password, fullName, phone }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, phone })
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error?.message || 'Ошибка регистрации');
      }
      setToken(result.data.token);
      setUser(result.data.user);
      showToast(`Регистрация успешна! Добро пожаловать, ${result.data.user.fullName}!`);
      if (routeExhibitIds.length > 0) {
        setCurrentView('checkout');
      } else {
        setCurrentView('profile');
      }
      return { success: true };
    } catch (err) {
      showToast(err.message);
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    setUserVisits([]);
    showToast('Вы вышли из учетной записи');
    setCurrentView('home');
  };

  const cancelUserVisit = async (visitId) => {
    try {
      const res = await fetch(`/api/visits/${visitId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error?.message || 'Не удалось отменить визит');
      }
      showToast('Визит успешно отменен');
      fetchUserVisits();
      return { success: true };
    } catch (err) {
      showToast(err.message);
      return { success: false, message: err.message };
    }
  };

  const selectedExhibits = useMemo(() => {
    return routeExhibitIds
      .map((id) => exhibits.find((ex) => ex.id === id))
      .filter(Boolean);
  }, [routeExhibitIds, exhibits]);

  const paceMultiplier = useMemo(() => {
    switch (pace) {
      case 'express': return 0.8;
      case 'inDepth': return 1.3;
      default: return 1.0;
    }
  }, [pace]);

  const { exhibitsTime, transitTime, totalEstimatedTime, hallsSequence, isOverLimit, overLimitDelta, remainingTime } = useMemo(() => {
    if (selectedExhibits.length === 0) {
      return {
        exhibitsTime: 0,
        transitTime: 0,
        totalEstimatedTime: 0,
        hallsSequence: [],
        isOverLimit: false,
        overLimitDelta: 0,
        remainingTime: availableTime
      };
    }

    const totalRawMinutes = selectedExhibits.reduce(
      (sum, ex) => sum + (ex.durationMinutes * paceMultiplier),
      0
    );
    const exhibitsTime = Math.round(totalRawMinutes);

    const hallsSequence = [];
    let transitsCount = 0;
    selectedExhibits.forEach((ex, idx) => {
      const currentHallName = ex.hallName || (ex.hall && ex.hall.name) || `Зал ${ex.hallId}`;
      if (idx === 0) {
        hallsSequence.push(currentHallName);
      } else {
        const prevHallId = selectedExhibits[idx - 1].hallId;
        if (ex.hallId !== prevHallId) {
          transitsCount += 1;
          if (!hallsSequence.includes(currentHallName)) {
            hallsSequence.push(currentHallName);
          }
        }
      }
    });

    const transitTime = transitsCount * TRANSIT_TIME_MINUTES;
    const totalEstimatedTime = exhibitsTime + transitTime;
    const isOverLimit = totalEstimatedTime > availableTime;
    const overLimitDelta = isOverLimit ? totalEstimatedTime - availableTime : 0;
    const remainingTime = !isOverLimit ? availableTime - totalEstimatedTime : 0;

    return {
      exhibitsTime,
      transitTime,
      totalEstimatedTime,
      hallsSequence,
      isOverLimit,
      overLimitDelta,
      remainingTime
    };
  }, [selectedExhibits, paceMultiplier, availableTime]);

  const toggleExhibit = (exhibit) => {
    if (routeExhibitIds.includes(exhibit.id)) {
      setRouteExhibitIds((prev) => prev.filter((id) => id !== exhibit.id));
      showToast(`«${exhibit.title}» удален из маршрута`);
    } else {
      setRouteExhibitIds((prev) => [...prev, exhibit.id]);
      showToast(`«${exhibit.title}» добавлен в маршрут`);
    }
  };

  const isInRoute = (exhibitId) => routeExhibitIds.includes(exhibitId);

  const removeExhibit = (exhibitId) => {
    const ex = exhibits.find((e) => e.id === exhibitId);
    setRouteExhibitIds((prev) => prev.filter((id) => id !== exhibitId));
    if (ex) {
      showToast(`«${ex.title}» удален из маршрута`);
    }
  };

  const moveExhibit = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= routeExhibitIds.length) return;
    const updated = [...routeExhibitIds];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    setRouteExhibitIds(updated);
  };

  const clearRoute = () => {
    setRouteExhibitIds([]);
    showToast('Маршрут очищен');
  };

  const loadCuratedRoute = (presetName) => {
    if (presetName === 'highlights') {
      setRouteExhibitIds(['exhibit-001', 'exhibit-003', 'exhibit-009', 'exhibit-011']);
      showToast('Загружен маршрут главных шедевров музея');
    } else if (presetName === 'classical') {
      setRouteExhibitIds(['exhibit-001', 'exhibit-002', 'exhibit-003', 'exhibit-004', 'exhibit-005', 'exhibit-007']);
      showToast('Загружен маршрут шляхетского наследия');
    } else if (presetName === 'modern') {
      setRouteExhibitIds(['exhibit-009', 'exhibit-010', 'exhibit-011', 'exhibit-012', 'exhibit-013', 'exhibit-014']);
      showToast('Загружен маршрут искусства рубежа веков и XX века');
    }
  };

  const navigateToCatalogWithFilter = ({ hallId = 'all', category = 'all', period = 'all', search = '' } = {}) => {
    setSelectedHall(String(hallId));
    setSelectedCategory(category);
    setSelectedPeriod(period);
    setSearchQuery(search);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouteContext.Provider
      value={{
        currentView,
        setCurrentView,

        exhibits,
        halls,
        dataLoading,
        fetchExhibits,
        fetchHalls,
        navigateToCatalogWithFilter,
        routeExhibitIds,
        selectedExhibits,
        toggleExhibit,
        isInRoute,
        removeExhibit,
        moveExhibit,
        clearRoute,
        loadCuratedRoute,
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
        searchQuery,
        setSearchQuery,
        selectedPeriod,
        setSelectedPeriod,
        selectedCategory,
        setSelectedCategory,
        selectedHall,
        setSelectedHall,
        activeModalExhibit,
        setActiveModalExhibit,
        selectedVisitDetail,
        setSelectedVisitDetail,
        openVisitDetail: (v) => setSelectedVisitDetail(v),
        closeVisitDetail: () => setSelectedVisitDetail(null),
        confirmedVisit,
        setConfirmedVisit,
        toastMessage,
        showToast,

        user,
        token,
        login,
        register,
        logout,
        userVisits,
        visitsLoading,
        fetchUserVisits,
        cancelUserVisit
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within RouteProvider');
  }
  return context;
};
