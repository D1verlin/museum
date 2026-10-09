import { startServer } from './server.js';

const PORT = process.env.PORT || 3017;
const BASE_URL = `http://localhost:${PORT}/api`;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${message}`);
  }
}

async function runTests() {
  console.log('[START] Запуск сквозного автоматического тестирования API...\n');

  const server = await startServer();

  try {

    console.log('--- 1. Проверка системного эндпоинта /health и Swagger UI ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'Статус ответа health check равен 200');
    assert(healthData.success === true, 'Health check возвращает success: true');
    assert(healthData.data.stats.exhibits >= 15, 'В базе загружено не менее 15 экспонатов');
    assert(healthData.data.stats.halls === 5, 'В базе загружено ровно 5 залов');

    const swaggerRes = await fetch(`${BASE_URL}/docs/swagger.json`);
    const swaggerData = await swaggerRes.json();
    assert(swaggerRes.status === 200, 'Спецификация Swagger JSON доступна по /api/docs/swagger.json');
    assert(swaggerData.openapi === '3.0.0', 'Спецификация соответствует стандарту OpenAPI 3.0.0');
    assert(Boolean(swaggerData.paths['/visits']), 'В спецификации Swagger задокументирован путь /visits');

    console.log('\n--- 2. Аутентификация: Регистрация пользователя ---');
    const uniqueEmail = `test_${Date.now()}@test.by`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'Password123!',
        fullName: 'Тестовый Посетитель',
        phone: '+375 (29) 999-88-77'
      })
    });
    const regData = await regRes.json();
    assert(regRes.status === 201, 'Регистрация возвращает HTTP 201 Created');
    assert(regData.success === true, 'Успешный флаг регистрации');
    assert(Boolean(regData.data.token), 'Возвращен JWT-токен');
    assert(regData.data.user.password === undefined, 'Хеш пароля скрыт из ответа');

    const userToken = regData.data.token;
    const testUserId = regData.data.user.id;

    console.log('\n--- 2.1 Попытка повторной регистрации (409 Conflict) ---');
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'Password123!',
        fullName: 'Дубликат'
      })
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 409, 'Повторная регистрация возвращает 409 Conflict');
    assert(dupData.error.code === 'EMAIL_ALREADY_REGISTERED', 'Код ошибки EMAIL_ALREADY_REGISTERED');

    console.log('\n--- 3. Вход пользователя и администратора ---');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'Password123!'
      })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'Вход пользователя возвращает 200 OK');
    assert(Boolean(loginData.data.token), 'Пользователь получил токен');

    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@artmuseum.by',
        password: 'AdminPass123!'
      })
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200, 'Вход администратора возвращает 200 OK');
    assert(adminLoginData.data.user.role === 'admin', 'Роль администратора подтверждена');
    const adminToken = adminLoginData.data.token;

    const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@artmuseum.by',
        password: 'WrongPassword'
      })
    });
    assert(badLoginRes.status === 401, 'Неверный пароль возвращает 401 Unauthorized');

    console.log('\n--- 4. Защита маршрутов токенами авторизации ---');
    const meWithoutToken = await fetch(`${BASE_URL}/auth/me`);
    assert(meWithoutToken.status === 401, 'Запрос без токена отклоняется со статусом 401');

    const meWithToken = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const meData = await meWithToken.json();
    assert(meWithToken.status === 200, 'Запрос с валидным токеном возвращает 200 OK');
    assert(meData.data.user.email === uniqueEmail, 'Профиль совпадает с авторизованным пользователем');

    console.log('\n--- 5. Каталог залов (/halls) ---');
    const hallsRes = await fetch(`${BASE_URL}/halls`);
    const hallsData = await hallsRes.json();
    assert(hallsRes.status === 200, 'Получение залов возвращает 200 OK');
    assert(hallsData.data.length === 5, 'Возвращено ровно 5 залов');

    console.log('\n--- 6. Каталог экспонатов (/exhibits) с фильтрацией и поиском ---');
    const exhibitsRes = await fetch(`${BASE_URL}/exhibits`);
    const exhibitsData = await exhibitsRes.json();
    assert(exhibitsRes.status === 200, 'Каталог экспонатов возвращает 200 OK');
    assert(exhibitsData.data.total >= 15, 'Всего экспонатов в базе >= 15');

    const hall1Exhibits = await fetch(`${BASE_URL}/exhibits?hallId=1`);
    const hall1Data = await hall1Exhibits.json();
    assert(hall1Data.data.exhibits.every((e) => e.hallId === 1), 'Все отфильтрованные экспонаты принадлежат залу 1');

    const searchRes = await fetch(`${BASE_URL}/exhibits?search=${encodeURIComponent('Слуцкий')}`);
    const searchData = await searchRes.json();
    assert(searchData.data.exhibits.length >= 1, 'Поиск по слову "Слуцкий" нашел экспонаты');

    console.log('\n--- 7. Серверная бизнес-логика: Расчет хронометража маршрута ---');
    const calcRes = await fetch(`${BASE_URL}/routes/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exhibitIds: ['exhibit-001', 'exhibit-003', 'exhibit-011'],
        pace: 'standard',
        availableTime: 90
      })
    });
    const calcData = await calcRes.json();
    assert(calcRes.status === 200, 'Расчет маршрута возвращает 200 OK');
    assert(calcData.data.exhibitsCount === 3, 'Количество экспонатов равно 3');
    assert(calcData.data.transitTime === 10, 'Время переходов между залами = 10 мин (2 перехода x 5 мин)');
    assert(calcData.data.totalEstimatedTime === 51, 'Общее время осмотра = 51 мин');
    assert(calcData.data.isOverLimit === false, 'Лимит времени не превышен (51 <= 90)');

    const calcOverRes = await fetch(`${BASE_URL}/routes/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exhibitIds: ['exhibit-001', 'exhibit-003', 'exhibit-011'],
        pace: 'standard',
        availableTime: 40 
      })
    });
    const calcOverData = await calcOverRes.json();
    assert(calcOverData.data.isOverLimit === true, 'Флаг isOverLimit установлен в true');
    assert(calcOverData.data.overLimitDelta === 11, 'Дельта превышения лимита равна 11 мин (51 - 40)');

    console.log('\n--- 8. Бизнес-логика оформления визита и запрет гостевых бронирований ---');
    const guestBookingRes = await fetch(`${BASE_URL}/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorName: 'Аноним',
        email: 'anon@example.com',
        visitDate: '2026-10-14',
        timeSlot: '14:00',
        exhibitIds: ['exhibit-001']
      })
    });
    assert(guestBookingRes.status === 401, 'Бронирование без авторизации отклоняется со статусом 401 Unauthorized');

    const visitRes = await fetch(`${BASE_URL}/visits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({
        visitorName: 'Тестовый Посетитель',
        email: uniqueEmail,
        phone: '+375 (29) 111-22-33',
        visitDate: '2026-10-14', 
        timeSlot: '14:00',
        pace: 'standard',
        availableTime: 90,
        exhibitIds: ['exhibit-001', 'exhibit-003', 'exhibit-011'],
        notes: 'Первый визит в музей'
      })
    });
    const visitData = await visitRes.json();
    assert(visitRes.status === 201, 'Оформление визита авторизованным пользователем возвращает 201 Created');
    assert(/^AURA-\d+$/.test(visitData.data.ticketNumber), `Сгенерирован корректный билет: ${visitData.data.ticketNumber}`);
    assert(visitData.data.status === 'confirmed', 'Начальный статус визита = confirmed');
    assert(visitData.data.userId === testUserId, 'Визит привязан к авторизованному пользователю');

    const createdVisitId = visitData.data.id;
    const createdTicketNumber = visitData.data.ticketNumber;

    console.log('\n--- 8.1 Валидация санитарного дня (вторник) ---');
    const tuesdayRes = await fetch(`${BASE_URL}/visits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({
        visitorName: 'Посетитель Вторника',
        email: uniqueEmail,
        visitDate: '2026-10-13', 
        timeSlot: '12:00',
        exhibitIds: ['exhibit-001']
      })
    });
    const tuesdayData = await tuesdayRes.json();
    assert(tuesdayRes.status === 422, 'Бронирование на вторник отклоняется со статусом 422');
    assert(tuesdayData.error.code === 'MUSEUM_CLOSED_TUESDAY', 'Код ошибки MUSEUM_CLOSED_TUESDAY');

    const outHoursRes = await fetch(`${BASE_URL}/visits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({
        visitorName: 'Посетитель',
        email: uniqueEmail,
        visitDate: '2026-10-14',
        timeSlot: '08:00', 
        exhibitIds: ['exhibit-001']
      })
    });
    assert(outHoursRes.status === 422, 'Бронирование до открытия отклоняется со статусом 422');

    console.log('\n--- 9. Изоляция пользовательских данных и смена статусов ---');
    const userVisitsRes = await fetch(`${BASE_URL}/visits`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const userVisitsData = await userVisitsRes.json();
    assert(userVisitsRes.status === 200, 'Получение списка визитов возвращает 200 OK');
    assert(userVisitsData.data.length >= 1, 'Пользователь видит свои визиты');
    assert(userVisitsData.data.every((v) => v.userId === testUserId), 'Все полученные визиты принадлежат именно этому пользователю');

    const adminSearchVisitsRes = await fetch(`${BASE_URL}/visits?ticket=${createdTicketNumber}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminSearchVisitsData = await adminSearchVisitsRes.json();
    assert(adminSearchVisitsRes.status === 200, 'Администратор успешно выполнил поиск визита по билету');
    assert(adminSearchVisitsData.data.length >= 1, 'Найден билет при поиске администратора');

    const ticketLookupRes = await fetch(`${BASE_URL}/visits/${createdTicketNumber}`);
    const ticketLookupData = await ticketLookupRes.json();
    assert(ticketLookupRes.status === 200, 'Поиск по номеру билета AURA-XXXXXX успешен');
    assert(ticketLookupData.data.ticketNumber === createdTicketNumber, 'Найден корректный билет');

    const cancelRes = await fetch(`${BASE_URL}/visits/${createdVisitId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({ status: 'cancelled' })
    });
    const cancelData = await cancelRes.json();
    assert(cancelRes.status === 200, 'Пользователь успешно отменил свой визит');
    assert(cancelData.data.status === 'cancelled', 'Статус изменился на cancelled');

    const invalidTransRes = await fetch(`${BASE_URL}/visits/${createdVisitId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({ status: 'completed' })
    });
    assert(invalidTransRes.status === 422, 'Попытка восстановить отмененный визит отклоняется со статусом 422');

    console.log('\n--- 10. Разграничение прав доступа к CRUD операциям (Admin vs User) ---');
    const forbiddenCreateRes = await fetch(`${BASE_URL}/exhibits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}` 
      },
      body: JSON.stringify({
        id: 'exhibit-test',
        title: 'Тест',
        artist: 'Тест',
        hallId: 1
      })
    });
    assert(forbiddenCreateRes.status === 403, 'Обычному пользователю запрещено создание экспонатов (403 Forbidden)');

    const adminCreateRes = await fetch(`${BASE_URL}/exhibits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}` 
      },
      body: JSON.stringify({
        id: 'exhibit-999',
        title: 'Тестовый шедевр для проверки API',
        artist: 'Мастер XXI века',
        period: '2026 г.',
        periodKey: 'xx',
        periodLabel: 'XXI век',
        category: 'Живопись',
        categoryKey: 'painting',
        categoryLabel: 'Живопись',
        hallId: 1,
        hallName: 'Зал древнебелорусского сакрального искусства',
        durationMinutes: 10,
        imageUrl: './images/exhibits/exhibit-001.jpg',
        description: 'Тестовое описание экспоната'
      })
    });
    assert(adminCreateRes.status === 201, 'Администратор успешно создал экспонат (201 Created)');

    const adminDeleteRes = await fetch(`${BASE_URL}/exhibits/exhibit-999`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(adminDeleteRes.status === 200, 'Администратор успешно удалил тестовый экспонат (200 OK)');

    console.log('\n====================================================');
    console.log('[SUMMARY] Результаты автоматического тестирования API:');
    console.log(`Всего тестов: ${totalTests}`);
    console.log(`Успешно:     ${passedTests}`);
    console.log(`Ошибок:      ${failedTests}`);
    console.log('====================================================\n');

    if (failedTests > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Ошибка во время выполнения тестов:', err);
    process.exit(1);
  } finally {
    server.close();
  }
}

runTests();
