import { sequelize, User, Hall, Exhibit, PresetRoute, Visit } from '../models/index.js';
import { calculateRouteMetrics } from '../services/routeCalculator.js';

export const initialHalls = [
  {
    hallId: 1,
    name: 'Зал древнебелорусского сакрального искусства',
    shortName: 'Сакральное искусство',
    floor: '1 этаж',
    theme: 'Иконопись полесской школы, деревянная резьба и храмовая пластика XVII века',
    exhibitsCount: 2
  },
  {
    hallId: 2,
    name: 'Зал сарматского портрета и Речи Посполитой',
    shortName: 'Сарматский портрет и пояса',
    floor: '1 этаж',
    theme: 'Слуцкие пояса, несвижская портретная галерея и шляхетское наследие XVI–XVIII веков',
    exhibitsCount: 3
  },
  {
    hallId: 3,
    name: 'Зал классического искусства и романтизма XIX века',
    shortName: 'Искусство XIX века',
    floor: '2 этаж',
    theme: 'Городские пейзажи Дамеля, натюрморты Хруцкого и романтические портреты Ваньковича',
    exhibitsCount: 3
  },
  {
    hallId: 4,
    name: 'Зал пейзажа, модерна и символизма рубежа XIX–XX вв.',
    shortName: 'Модерн и пейзаж',
    floor: '2 этаж',
    theme: 'Тонкая тональная живопись Бялыницкого-Бирули и драматические полотна Рущица',
    exhibitsCount: 2
  },
  {
    hallId: 5,
    name: 'Зал монументального и современного искусства XX века',
    shortName: 'XX век и современность',
    floor: '3 этаж',
    theme: 'Суровый стиль Савицкого, монументализм Данцига, бронзовая пластика и графика Аксельрода',
    exhibitsCount: 5
  }
];

export const initialExhibits = [
  {
    id: 'exhibit-001',
    title: 'Богоматерь Умиление (из Малориты)',
    artist: 'Неизвестный мастер полесской школы',
    author: 'Неизвестный мастер полесской школы',
    period: 'Около 1648–1650 гг.',
    periodKey: 'xvii',
    periodLabel: 'XVII век',
    category: 'Сакральное искусство',
    categoryKey: 'sacred',
    categoryLabel: 'Сакральное искусство',
    technique: 'Дерево, левкас, темпера, серебрение, резьба',
    dimensions: '114 × 78 см',
    hallId: 1,
    hallName: 'Зал древнебелорусского сакрального искусства',
    durationMinutes: 12,
    description: 'Памятник полесской школы иконописи XVII века. Сочетает глубокую византийскую каноничность с мягким психологизмом ренессансного направления.',
    imageUrl: './images/exhibits/exhibit-001.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Bogomater-Umilenie.jpg',
    isAvailable: true
  },
  {
    id: 'exhibit-002',
    title: 'Царские врата',
    artist: 'Белорусские резчики (белорусская резь)',
    author: 'Белорусские резчики (белорусская резь)',
    period: 'Конец XVII века',
    periodKey: 'xvii',
    periodLabel: 'XVII век',
    category: 'Сакральное искусство / Резьба',
    categoryKey: 'sacred',
    categoryLabel: 'Сакральное искусство',
    technique: 'Дерево, резьба, золочение, темпера',
    dimensions: '180 × 110 см',
    hallId: 1,
    hallName: 'Зал древнебелорусского сакрального искусства',
    durationMinutes: 10,
    description: 'Образец так называемой «белорусской рези» эпохи барокко — сложный растительный орнамент, оплетающий медальоны с изображениями евангелистов.',
    imageUrl: './images/exhibits/exhibit-002.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/%D0%A6%D0%B0%D1%80%D1%81%D0%BA%D0%B0%D1%8F_%D0%B1%D1%80%D0%B0%D0%BC%D0%B0%2C_XVI_%D1%81%D1%82..jpg',
    isAvailable: true
  },
  {
    id: 'exhibit-003',
    title: 'Слуцкий пояс (четырехлицевой)',
    artist: 'Мануфактура слуцких поясов (персиарня)',
    author: 'Мануфактура слуцких поясов (персиарня)',
    period: '1780–1807 гг.',
    periodKey: 'xviii',
    periodLabel: 'XVIII век',
    category: 'Декоративно-прикладное искусство',
    categoryKey: 'applied',
    categoryLabel: 'Декоративно-прикладное',
    technique: 'Шелк, золотая и серебряная нить (пряденое золотное волокно)',
    dimensions: '358 × 34 см',
    hallId: 2,
    hallName: 'Зал сарматского портрета и Речи Посполитой',
    durationMinutes: 15,
    description: 'Элитный атрибут кунтушового строя шляхты ВКЛ. Техника двухстороннего ткачества с золотой каймой («головы» пояса украшены букетами с васильками и гвоздиками).',
    imageUrl: './images/exhibits/exhibit-003.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Sash_MET_10726B.jpg',
    isAvailable: true
  },
  {
    id: 'exhibit-004',
    title: 'Портрет Юрия Радзивилла «Геркулеса Литовского»',
    artist: 'Неизвестный мастер несвижской портретной галереи',
    author: 'Неизвестный мастер несвижской портретной галереи',
    period: 'XVII век',
    periodKey: 'xvii',
    periodLabel: 'XVII век',
    category: 'Сарматский портрет',
    categoryKey: 'portrait',
    categoryLabel: 'Сарматский портрет',
    technique: 'Холст, масло',
    dimensions: '198 × 112 см',
    hallId: 2,
    hallName: 'Зал сарматского портрета и Речи Посполитой',
    durationMinutes: 8,
    description: 'Парадный ростовой портрет гетмана великого литовского Юрия Радзивилла из родового Несвижского собрания. Иконография подчеркивает воинскую славу и статус рода.',
    imageUrl: './images/exhibits/exhibit-004.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Jury_Radzivi%C5%82._%D0%AE%D1%80%D1%8B_%D0%A0%D0%B0%D0%B4%D0%B7%D1%96%D0%B2%D1%96%D0%BB_%28XVII%29_%282%29.jpg',
    isAvailable: true
  },
  {
    id: 'exhibit-005',
    title: 'Портрет Екатерины Слуцкой (Радзивилл)',
    artist: 'Неизвестный художник ВКЛ',
    author: 'Неизвестный художник ВКЛ',
    period: 'Конец XVI — начало XVII века',
    periodKey: 'xvi-xvii',
    periodLabel: 'XVI–XVII века',
    category: 'Сарматский портрет',
    categoryKey: 'portrait',
    categoryLabel: 'Сарматский портрет',
    technique: 'Холст, масло',
    dimensions: '95 × 73 см',
    hallId: 2,
    hallName: 'Зал сарматского портрета и Речи Посполитой',
    durationMinutes: 8,
    description: 'Образец раннего шляхетского портрета с акцентом на геральдику, статусное убранство платья, кружевной воротник и драгоценные ювелирные изделия.',
    imageUrl: './images/exhibits/exhibit-005.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Kaciaryna_Radzivi%C5%82_%28Sabieskaja%29._%D0%9A%D0%B0%D1%86%D1%8F%D1%80%D1%8B%D0%BD%D0%B0_%D0%A0%D0%B0%D0%B4%D0%B7%D1%96%D0%B2%D1%96%D0%BB_%28%D0%A1%D0%B0%D0%B1%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%29_%28XVIII%29.jpg',
    isAvailable: true
  },
  {
    id: 'exhibit-006',
    title: 'Вид Вильно с Замковой горы',
    artist: 'Ян Дамель',
    author: 'Ян Дамель',
    period: '1815–1820 гг.',
    periodKey: 'xix',
    periodLabel: 'XIX век',
    category: 'Классицизм и романтизм',
    categoryKey: 'painting',
    categoryLabel: 'Живопись и пейзаж',
    technique: 'Холст, масло',
    dimensions: '65 × 84 см',
    hallId: 3,
    hallName: 'Зал классического искусства и романтизма XIX века',
    durationMinutes: 10,
    description: 'Городской пейзаж Вильно эпохи романтизма, выполненный профессором живописи Виленского университета Яном Дамелем.',
    imageUrl: './images/exhibits/exhibit-006.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Vilnia%2C_Vialla-Zamkavaja_hara._%D0%92%D1%96%D0%BB%D1%8C%D0%BD%D1%8F%2C_%D0%92%D1%8F%D0%BB%D1%8C%D0%BB%D1%8F-%D0%97%D0%B0%D0%BC%D0%BA%D0%B0%D0%B2%D0%B0%D1%8F_%D0%B3%D0%B0%D1%80%D0%B0_%28J._Damiel%2C_1815-16%29.jpg',
    isAvailable: true
  },
  {
    id: 'exhibit-007',
    title: 'Брестская крепость. Ночной штурм',
    artist: 'Иван Хруцкий',
    author: 'Иван Хруцкий',
    period: '1839 г.',
    periodKey: 'xix',
    periodLabel: 'XIX век',
    category: 'Натюрморт и классицизм',
    categoryKey: 'painting',
    categoryLabel: 'Живопись и натюрморт',
    technique: 'Холст, масло',
    dimensions: '86 × 115 см',
    hallId: 3,
    hallName: 'Зал классического искусства и романтизма XIX века',
    durationMinutes: 12,
    description: 'Шедевр мастера натюрморта Ивана Хруцкого («Цветы и плоды»). Тончайшая фламандская иллюзионистская проработка фактуры персиков, винограда, фарфора и воды.',
    imageUrl: './images/exhibits/exhibit-007.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Khrutsky-Flowers_and_fruits.jpg',
    isAvailable: true
  },
  {
    id: 'exhibit-008',
    title: 'Портрет Адама Мицкевича',
    artist: 'Валентий Ванькович',
    author: 'Валентий Ванькович',
    period: '1828 г.',
    periodKey: 'xix',
    periodLabel: 'XIX век',
    category: 'Романтизм',
    categoryKey: 'portrait',
    categoryLabel: 'Романтический портрет',
    technique: 'Холст, масло',
    dimensions: '62 × 48 см',
    hallId: 3,
    hallName: 'Зал классического искусства и романтизма XIX века',
    durationMinutes: 9,
    description: 'Знаменитый романтический портрет поэта на фоне скалы Аю-Даг («Мицкевич на скале Джудар-Кая»). Романтическое воплощение поэтического вдохновения.',
    imageUrl: './images/exhibits/exhibit-008.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Wa%C5%84kowicz_Adam_Mickiewicz.jpg',
    isAvailable: true
  },
  {
    id: 'exhibit-009',
    title: 'Март. Тающий снег',
    artist: 'Витольд Бялыницкий-Бируля',
    author: 'Витольд Бялыницкий-Бируля',
    period: '1914 г.',
    periodKey: 'turn-xx',
    periodLabel: 'Рубеж XIX–XX веков',
    category: 'Импрессионизм / Пейзаж',
    categoryKey: 'painting',
    categoryLabel: 'Живопись и пейзаж',
    technique: 'Холст, масло',
    dimensions: '82 × 108 см',
    hallId: 4,
    hallName: 'Зал пейзажа, модерна и символизма рубежа XIX–XX вв.',
    durationMinutes: 11,
    description: 'Тонкая тональная живопись настроения. Мастер передачи ранней весны, тишины и первого таяния лесного снега в серебристо-серых полутонах.',
    imageUrl: './images/exhibits/exhibit-009.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/6/65/%D0%91%D1%8F%D0%BB%D1%8B%D0%BD%D0%B8%D1%86%D0%BA%D0%B8%D0%B9-%D0%91%D0%B8%D1%80%D1%83%D0%BB%D1%8F._%D0%A0%D0%B0%D0%BD%D0%BD%D1%8F%D1%8F_%D0%B2%D0%B5%D1%81%D0%BD%D0%B0._1902.jpg',
    isAvailable: true
  },
  {
    id: 'exhibit-010',
    title: 'Сумерки на Немане',
    artist: 'Фердинанд Рущиц',
    author: 'Фердинанд Рущиц',
    period: '1902 г.',
    periodKey: 'turn-xx',
    periodLabel: 'Рубеж XIX–XX веков',
    category: 'Символизм / Модерн',
    categoryKey: 'painting',
    categoryLabel: 'Символизм и модерн',
    technique: 'Холст, масло',
    dimensions: '78 × 102 см',
    hallId: 4,
    hallName: 'Зал пейзажа, модерна и символизма рубежа XIX–XX вв.',
    durationMinutes: 11,
    description: 'Символистский эмоциональный пейзаж уроженца Минщины Фердинанда Рущица с мощным драматическим небом и плотными контрастными мазками.',
    imageUrl: './images/exhibits/exhibit-010.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Ferdynand_Ruszczyc%2C_Ziemia.jpg',
    isAvailable: true
  },
  {
    id: 'exhibit-011',
    title: 'Партизанская мадонна (Минская)',
    artist: 'Михаил Савицкий',
    author: 'Михаил Савицкий',
    period: '1967 г.',
    periodKey: 'xx',
    periodLabel: 'XX век',
    category: 'Суровый стиль / Монументальное искусство',
    categoryKey: 'monumental',
    categoryLabel: 'Монументальное искусство',
    technique: 'Холст, масло',
    dimensions: '190 × 160 см',
    hallId: 5,
    hallName: 'Зал монументального и современного искусства XX века',
    durationMinutes: 14,
    description: 'Центральное произведение белорусской живописи советского периода. Интерпретация ренессансного образа мадонны в контексте партизанской трагедии и стойкости Беларуси.',
    imageUrl: './images/exhibits/exhibit-011.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Mikhail_Savitski_Partisan_Madonna_1978.jpg',
    isAvailable: true
  },
  {
    id: 'exhibit-012',
    title: 'Полесье. Сбор урожая',
    artist: 'Май Данциг',
    author: 'Май Данциг',
    period: '1972 г.',
    periodKey: 'xx',
    periodLabel: 'XX век',
    category: 'Монументальный экспрессионизм',
    categoryKey: 'monumental',
    categoryLabel: 'Монументальное искусство',
    technique: 'Холст, масло',
    dimensions: '205 × 240 см',
    hallId: 5,
    hallName: 'Зал монументального и современного искусства XX века',
    durationMinutes: 12,
    description: 'Эпическое экспрессивное полотно Мая Данцига с характерной динамичной композицией, широкой плотной фактурой краски и оптимистичным ритмом труда.',
    imageUrl: './images/exhibits/exhibit-012.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Mai_Dantsig_2008_by_Sergei_Ignatenko_2024_stamp_of_Belarus.jpg',
    isAvailable: true
  },
  {
    id: 'exhibit-013',
    title: 'Ковчег памяти',
    artist: 'Владимир Товстик',
    author: 'Владимир Товстик',
    period: '1995 г.',
    periodKey: 'contemporary',
    periodLabel: 'Конец XX века',
    category: 'Современное искусство',
    categoryKey: 'contemporary',
    categoryLabel: 'Современное искусство',
    technique: 'Холст, масло',
    dimensions: '140 × 170 см',
    hallId: 5,
    hallName: 'Зал монументального и современного искусства XX века',
    durationMinutes: 10,
    description: 'Философско-аллегорическая композиция с многослойной фактурой, исследующая историческую преемственность поколений и метафизику национальной памяти.',
    imageUrl: './images/exhibits/exhibit-013.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/2015.12.03_Vernissage_Roman_Zaslonov_in_Minsk%2C_National_Art_Museum_of_Belarus_13.jpg',
    isAvailable: true
  },
  {
    id: 'exhibit-014',
    title: 'Уроборос (Скульптура)',
    artist: 'Лев Гумилевский',
    author: 'Лев Гумилевский',
    period: '1988 г.',
    periodKey: 'xx',
    periodLabel: 'XX век',
    category: 'Скульптура',
    categoryKey: 'sculpture',
    categoryLabel: 'Скульптура',
    technique: 'Бронза, литье, патинирование',
    dimensions: '65 × 45 × 38 см',
    hallId: 5,
    hallName: 'Зал монументального и современного искусства XX века',
    durationMinutes: 8,
    description: 'Камерная станковая скульптурная композиция лауреата Государственной премии Беларуси, пластически интерпретирующая архаические мифологемы.',
    imageUrl: './images/exhibits/exhibit-014.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Kauka.jpg',
    isAvailable: true
  },
  {
    id: 'exhibit-015',
    title: 'Весенний день в местечке',
    artist: 'Меер Аксельрод',
    author: 'Меер Аксельрод',
    period: '1936 г.',
    periodKey: 'xx',
    periodLabel: 'XX век',
    category: 'Графика / Живопись',
    categoryKey: 'graphics',
    categoryLabel: 'Графика',
    technique: 'Бумага, гуашь, темпера',
    dimensions: '52 × 68 см',
    hallId: 5,
    hallName: 'Зал монументального и современного искусства XX века',
    durationMinutes: 9,
    description: 'Тонкая графическая фиксация быта еврейского местечка Беларуси первой половины XX века с характерной мягкой пластикой и лиризмом силуэтов.',
    imageUrl: './images/exhibits/exhibit-015.jpg',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/%C5%81ahojsk._%D0%9B%D0%B0%D0%B3%D0%BE%D0%B9%D1%81%D0%BA_%28M._Akselrod%2C_1938%29.jpg',
    isAvailable: true
  }
];

export const initialPresets = [
  {
    presetKey: 'highlights',
    title: 'Главные шедевры Национального художественного музея',
    description: 'Ключевые раритеты от полесской иконы XVII века и слуцких поясов до монументальных полотен XX века.',
    exhibitIds: ['exhibit-001', 'exhibit-003', 'exhibit-009', 'exhibit-011'],
    targetPace: 'standard',
    recommendedTime: 90
  },
  {
    presetKey: 'classical',
    title: 'Шляхетское наследие и классическое искусство',
    description: 'Погружение в культуру шляхты ВКЛ, сарматские портреты, пояса и романтическую живопись XIX века.',
    exhibitIds: ['exhibit-001', 'exhibit-002', 'exhibit-003', 'exhibit-004', 'exhibit-005', 'exhibit-007'],
    targetPace: 'standard',
    recommendedTime: 100
  },
  {
    presetKey: 'modern',
    title: 'Искусство рубежа веков и XX век',
    description: 'Драматический модерн Рущица, тонкая лирика Бялыницкого-Бирули и экспрессивный монументализм Савицкого и Данцига.',
    exhibitIds: ['exhibit-009', 'exhibit-010', 'exhibit-011', 'exhibit-012', 'exhibit-013', 'exhibit-014'],
    targetPace: 'standard',
    recommendedTime: 110
  }
];

export async function seedDatabase(force = false) {
  try {
    await sequelize.sync({ force });

    const usersCount = await User.count();
    let visitorUser;
    if (usersCount === 0) {
      await User.create({
        email: 'admin@artmuseum.by',
        password: 'AdminPass123!',
        fullName: 'Администратор музея',
        role: 'admin',
        phone: '+375 (17) 327-71-63'
      });

      visitorUser = await User.create({
        email: 'visitor@artmuseum.by',
        password: 'VisitorPass123!',
        fullName: 'Алексей Смирнов',
        role: 'user',
        phone: '+375 (29) 123-45-67'
      });
      console.log('[Seed] Created default users: admin@artmuseum.by and visitor@artmuseum.by');
    } else {
      visitorUser = await User.findOne({ where: { role: 'user' } });
    }

    const hallsCount = await Hall.count();
    if (hallsCount === 0) {
      await Hall.bulkCreate(initialHalls);
      console.log(`[Seed] Created ${initialHalls.length} museum halls`);
    }

    const exhibitsCount = await Exhibit.count();
    if (exhibitsCount === 0) {
      await Exhibit.bulkCreate(initialExhibits);
      console.log(`[Seed] Created ${initialExhibits.length} authentic exhibits`);
    }

    const presetsCount = await PresetRoute.count();
    if (presetsCount === 0) {
      await PresetRoute.bulkCreate(initialPresets);
      console.log(`[Seed] Created ${initialPresets.length} curated preset routes`);
    }

    const visitsCount = await Visit.count();
    if (visitsCount === 0 && visitorUser) {
      const demoExhibitIds = ['exhibit-001', 'exhibit-003', 'exhibit-011'];
      const metrics = await calculateRouteMetrics(demoExhibitIds, 'standard', 90);

      await Visit.create({
        ticketNumber: 'AURA-774102',
        userId: visitorUser.id,
        visitorName: visitorUser.fullName,
        email: visitorUser.email,
        phone: visitorUser.phone,
        visitDate: '2026-10-15',
        timeSlot: '14:00',
        pace: 'standard',
        availableTime: 90,
        exhibitIds: demoExhibitIds,
        exhibitsSnapshot: metrics.exhibits,
        hallsSequence: metrics.hallsSequence,
        exhibitsTime: metrics.exhibitsTime,
        transitTime: metrics.transitTime,
        totalEstimatedTime: metrics.totalEstimatedTime,
        isOverLimit: metrics.isOverLimit,
        overLimitDelta: metrics.overLimitDelta,
        status: 'confirmed',
        notes: 'Желателен аудиогид на белорусском языке'
      });
      console.log('[Seed] Created sample visit with ticket AURA-774102');
    }

    console.log('[Seed] Database initialization and verification completed.');
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    throw error;
  }
}
