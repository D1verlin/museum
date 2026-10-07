import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRoute } from '../context/RouteContext';
import { exhibits, PERIODS, CATEGORIES } from '../data/exhibitsData';
import { halls } from '../data/hallsData';
import { Search, Plus, Check } from 'lucide-react';

export const CatalogView = () => {
  const {
    isInRoute,
    toggleExhibit,
    setActiveModalExhibit,
    searchQuery,
    setSearchQuery,
    selectedPeriod,
    setSelectedPeriod,
    selectedCategory,
    setSelectedCategory,
    selectedHall,
    setSelectedHall
  } = useRoute();

  const [visibleCount, setVisibleCount] = useState(9);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filteredExhibits = useMemo(() => {
    return exhibits.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesArtist = (item.artist || item.author || '').toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesHall = (item.hall || item.hallName || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesArtist && !matchesDesc && !matchesHall) {
          return false;
        }
      }

      if (selectedPeriod !== 'all' && item.periodKey !== selectedPeriod) {
        return false;
      }

      if (selectedCategory !== 'all' && item.categoryKey !== selectedCategory) {
        return false;
      }

      if (selectedHall !== 'all' && String(item.hallId) !== String(selectedHall)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedPeriod, selectedCategory, selectedHall]);

  const displayedExhibits = filteredExhibits.slice(0, visibleCount);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setIsLoadingMore(false);
    }, 200);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedPeriod('all');
    setSelectedCategory('all');
    setSelectedHall('all');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedPeriod !== 'all' ||
    selectedCategory !== 'all' ||
    selectedHall !== 'all';

  return (
    <div className="aura-container">
      <div className="catalog-wrapper">
        <div className="catalog-header-block">
          <span className="section-eyebrow">Собрание Национального художественного музея РБ</span>
          <h1 className="catalog-main-title">Каталог экспонатов</h1>
          <p className="catalog-header-desc">
            Шедевры постоянной экспозиции музея в Минске (ул. Ленина, 20). Добавляйте экспонаты
            в персональный маршрут для автоматического расчета времени осмотра.
          </p>
        </div>

        <div className="catalog-filter-bar">
          <div className="search-plate-box">
            <Search size={18} className="search-plate-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию, автору или залу..."
              className="search-plate-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="search-plate-clear"
              >
                Очистить
              </button>
            )}
          </div>

          <div className="filter-lines-group">
            <div className="filter-line">
              <span className="filter-line-label">Категория:</span>
              <div className="filter-tags-flex">
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`pure-tag-btn ${active ? 'active' : ''}`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="filter-line">
              <span className="filter-line-label">Эпоха:</span>
              <div className="filter-tags-flex">
                {PERIODS.map((period) => {
                  const active = selectedPeriod === period.id;
                  return (
                    <button
                      key={period.id}
                      onClick={() => setSelectedPeriod(period.id)}
                      className={`pure-tag-btn ${active ? 'active' : ''}`}
                    >
                      {period.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="filter-line">
              <span className="filter-line-label">Зал:</span>
              <div className="filter-tags-flex">
                <button
                  onClick={() => setSelectedHall('all')}
                  className={`pure-tag-btn ${selectedHall === 'all' ? 'active' : ''}`}
                >
                  Все залы
                </button>
                {halls.map((hall) => {
                  const active = String(selectedHall) === String(hall.id);
                  return (
                    <button
                      key={hall.id}
                      onClick={() => setSelectedHall(String(hall.id))}
                      className={`pure-tag-btn ${active ? 'active' : ''}`}
                    >
                      {hall.shortName}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="catalog-status-line">
            <div className="catalog-count-text">
              Экспонатов найдено: <span className="font-display">{filteredExhibits.length}</span> из 15
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="catalog-reset-link"
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        </div>

        {filteredExhibits.length === 0 ? (
          <div className="catalog-empty-state">
            <p className="catalog-empty-title">Экспонатов по выбранным параметрам не найдено</p>
            <button
              onClick={resetFilters}
              className="catalog-reset-link"
            >
              Показать всю коллекцию музея
            </button>
          </div>
        ) : (
          <div className="gallery-card-grid">
            {displayedExhibits.map((item, idx) => {
              const inRoute = isInRoute(item.id);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: (idx % 3) * 0.05 }}
                  className="gallery-card-unit"
                >
                  <div
                    onClick={() => setActiveModalExhibit(item)}
                    className="gallery-image-frame"
                  >
                    <img
                      src={item.imageUrl || (item.image && item.image.url)}
                      alt={(item.image && item.image.alt) || item.title}
                      loading="lazy"
                      onError={(e) => {
                        if (item.fallbackImage && e.currentTarget.src !== item.fallbackImage) {
                          e.currentTarget.src = item.fallbackImage;
                        }
                      }}
                    />
                  </div>

                  <div className="gallery-card-content">
                    <div className="gallery-card-meta">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(item.categoryKey);
                        }}
                        className="gallery-meta-tag-btn"
                        title="Фильтровать по этой категории"
                      >
                        {item.category}
                      </button>
                      <span className="font-display">~{item.durationMinutes} мин</span>
                    </div>

                    <h3
                      onClick={() => setActiveModalExhibit(item)}
                      className="gallery-card-title"
                    >
                      {item.title}
                    </h3>

                    <div className="gallery-card-creator">
                      {item.artist || item.author}, {item.period}
                    </div>

                    <div className="gallery-card-hall">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHall(String(item.hallId));
                        }}
                        className="gallery-hall-filter-btn"
                        title="Фильтровать по этому залу"
                      >
                        {item.hall || item.hallName}
                      </button>
                    </div>

                    <p className="gallery-card-brief">
                      {item.description}
                    </p>
                  </div>

                  <div className="gallery-card-buttons">
                    <button
                      onClick={() => setActiveModalExhibit(item)}
                      className="gallery-btn-more"
                    >
                      Подробнее
                    </button>

                    <button
                      onClick={() => toggleExhibit(item)}
                      className={`gallery-btn-action ${inRoute ? 'in-route' : ''}`}
                    >
                      {inRoute ? (
                        <>
                          <Check size={14} />
                          <span>В маршруте</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} />
                          <span>В маршрут</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {visibleCount < filteredExhibits.length && (
          <div className="catalog-pagination-wrap">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="btn-secondary"
            >
              <span>{isLoadingMore ? 'Обновление коллекции...' : 'Показать еще экспонаты'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
