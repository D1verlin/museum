import React from 'react';
import { motion } from 'framer-motion';
import { useRoute } from '../context/RouteContext';
import { halls } from '../data/hallsData';
import { ArrowRight, Layers } from 'lucide-react';

export const HomeView = () => {
  const {
    setCurrentView,
    loadCuratedRoute,
    navigateToCatalogWithFilter
  } = useRoute();

  const reviews = [
    {
      quote: '«Слуцкие пояса и малоритская икона в оригинальной экспозиции производят ошеломляющее впечатление подлинности».',
      author: 'Алеся Корбут',
      role: 'Искусствовед, исследователь сакрального искусства'
    },
    {
      quote: '«Гид рассчитал оптимальный маршрут по залам Ленина, 20 без суеты. Удалось вдумчиво увидеть и Радзивиллов, и Бялыницкого-Бирулю».',
      author: 'Михаил Горохов',
      role: 'Архитектор, Минск'
    },
    {
      quote: '«Партизанская мадонна Михаила Савицкого вживую потрясает монументальной силой сурового стиля».',
      author: 'Вероника Вольская',
      role: 'Куратор выставочных проектов'
    }
  ];

  return (
    <div style={{ width: '100%' }}>
      <section className="hero-section">
        <div className="hero-bg-layer" aria-hidden="true">
          <div className="hero-bg-images-grid">
            <img
              src="./images/museum/building_main.jpg"
              alt="Главный фасад Национального художественного музея Беларуси, ул. Ленина, 20"
              className="hero-bg-photo main-photo"
            />
            <img
              src="./images/museum/building_side.jpg"
              alt="Экспозиционный корпус музея"
              className="hero-bg-photo side-photo"
            />
          </div>
          <div className="hero-bg-overlay" />
        </div>

        <div className="aura-container hero-container-rel">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hero-content"
          >
            <span className="section-eyebrow">
              Минск, ул. Ленина, 20 / Основан в 1939 году
            </span>

            <h1 className="hero-title">
              Национальный художественный музей
            </h1>

            <p className="hero-desc">
              Интерактивный гид по главной сокровищнице искусства Беларуси. Древняя иконопись,
              золотные слуцкие пояса, сарматские портреты Радзивиллов и монументальная живопись XX века.
            </p>

            <div className="hero-actions">
              <button
                onClick={() => navigateToCatalogWithFilter({ hallId: 'all', category: 'all', period: 'all', search: '' })}
                className="btn-primary"
              >
                <span>Исследовать коллекцию</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-secondary"
              >
                <span>Мой маршрут</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="presets-section">
        <div className="aura-container">
          <div className="section-head-split">
            <div>
              <span className="section-eyebrow">Тематические маршруты</span>
              <h2 className="section-title">Кураторские планы визита</h2>
            </div>
            <p className="section-desc">
              Выберите готовый сценарий под ваше свободное время или сформируйте собственный список шедевров.
            </p>
          </div>

          <div className="presets-grid">
            <div className="preset-card">
              <div>
                <div className="preset-meta-top">
                  <span className="font-display">~50 минут</span>
                  <span style={{ color: 'var(--text-graphite)', fontWeight: 500 }}>4 шедевра</span>
                </div>
                <h3 className="preset-title">Главные шедевры музея</h3>
                <p className="preset-text">
                  Малоритская Богоматерь, золотой Слуцкий пояс, весенний пейзаж Бялыницкого-Бирули и Партизанская мадонна.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
                <button
                  type="button"
                  onClick={() => {
                    loadCuratedRoute('highlights');
                    setCurrentView('dashboard');
                  }}
                  className="preset-btn-primary"
                >
                  <span>Загрузить маршрут</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => navigateToCatalogWithFilter({ hallId: 'all', category: 'all', period: 'all', search: '' })}
                  className="preset-btn-ghost"
                >
                  <Layers size={13} />
                  <span>В каталог</span>
                </button>
              </div>
            </div>

            <div className="preset-card">
              <div>
                <div className="preset-meta-top">
                  <span className="font-display">~1 час 15 мин</span>
                  <span style={{ color: 'var(--text-graphite)', fontWeight: 500 }}>6 экспонатов</span>
                </div>
                <h3 className="preset-title">Шляхетское наследие</h3>
                <p className="preset-text">
                  Барочная резьба, слуцкие мануфактуры, портреты Радзивиллов, натюрморты Хруцкого и романтизм Ваньковича.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
                <button
                  type="button"
                  onClick={() => {
                    loadCuratedRoute('classical');
                    setCurrentView('dashboard');
                  }}
                  className="preset-btn-primary"
                >
                  <span>Загрузить маршрут</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => navigateToCatalogWithFilter({ hallId: 2, category: 'all', period: 'all', search: '' })}
                  className="preset-btn-ghost"
                >
                  <Layers size={13} />
                  <span>Зал портрета</span>
                </button>
              </div>
            </div>

            <div className="preset-card">
              <div>
                <div className="preset-meta-top">
                  <span className="font-display">~1 час 35 мин</span>
                  <span style={{ color: 'var(--text-graphite)', fontWeight: 500 }}>6 экспонатов</span>
                </div>
                <h3 className="preset-title">Модерн и искусство XX века</h3>
                <p className="preset-text">
                  Символизм Рущица, суровый стиль Савицкого, экспрессия Мая Данцига и бронзовая пластика Гумилевского.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
                <button
                  type="button"
                  onClick={() => {
                    loadCuratedRoute('modern');
                    setCurrentView('dashboard');
                  }}
                  className="preset-btn-primary"
                >
                  <span>Загрузить маршрут</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => navigateToCatalogWithFilter({ hallId: 5, category: 'all', period: 'all', search: '' })}
                  className="preset-btn-ghost"
                >
                  <Layers size={13} />
                  <span>Зал XX века</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="halls-section">
        <div className="aura-container">
          <div style={{ maxWidth: 640 }}>
            <span className="section-eyebrow">Экспозиционные залы</span>
            <h2 className="section-title">Постоянная экспозиция</h2>
            <p style={{ fontSize: 15, color: 'var(--text-charcoal)', marginTop: 8 }}>
              Пять постоянных галерейных пространств Национального художественного музея Республики Беларусь.
            </p>
          </div>

          <div className="halls-grid">
            {halls.map((hall, idx) => (
              <motion.div
                key={hall.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => navigateToCatalogWithFilter({ hallId: hall.id, category: 'all', period: 'all', search: '' })}
                className="hall-card"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-smoke)' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--text-graphite)' }}>
                      {hall.floor}
                    </span>
                    <span>{hall.exhibitsCount} шедевра в каталоге</span>
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 400, color: 'var(--text-graphite)' }}>
                    {hall.name}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-charcoal)', lineHeight: 1.6 }}>
                    {hall.theme}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16 }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToCatalogWithFilter({ hallId: hall.id, category: 'all', period: 'all', search: '' });
                    }}
                    className="hall-card-btn"
                  >
                    <span>Экспонаты зала</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="reviews-section">
        <div className="aura-container">
          <div>
            <span className="section-eyebrow">Отзывы посетителей</span>
            <h2 className="section-title">Опыт созерцания</h2>
          </div>

          <div className="reviews-grid">
            {reviews.map((rev, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p className="review-quote">{rev.quote}</p>
                <div>
                  <p className="review-author">{rev.author}</p>
                  <p className="review-role">{rev.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
