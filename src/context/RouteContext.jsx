import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { exhibits } from '../data/exhibitsData';
import { TRANSIT_TIME_MINUTES } from '../data/hallsData';

const RouteContext = createContext(null);

export const RouteProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('home');

  const [routeExhibitIds, setRouteExhibitIds] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_route_ids');
      return saved ? JSON.parse(saved) : ['exhibit-001', 'exhibit-003', 'exhibit-011'];
    } catch {
      return ['exhibit-001', 'exhibit-003', 'exhibit-011'];
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
    }, 2400);
  };

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

  const selectedExhibits = useMemo(() => {
    return routeExhibitIds
      .map((id) => exhibits.find((ex) => ex.id === id))
      .filter(Boolean);
  }, [routeExhibitIds]);

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
      if (idx === 0) {
        hallsSequence.push(ex.hallName);
      } else {
        const prevHall = selectedExhibits[idx - 1].hallId;
        if (ex.hallId !== prevHall) {
          transitsCount += 1;
          if (!hallsSequence.includes(ex.hallName)) {
            hallsSequence.push(ex.hallName);
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
        confirmedVisit,
        setConfirmedVisit,
        toastMessage,
        showToast
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
