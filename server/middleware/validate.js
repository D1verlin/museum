
export const validateRegister = (req, res, next) => {
  const { email, password, fullName } = req.body || {};
  const details = [];

  if (!email || typeof email !== 'string' || !email.trim()) {
    details.push({ field: 'email', issue: 'Адрес электронной почты обязателен' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    details.push({ field: 'email', issue: 'Некорректный формат адреса электронной почты' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    details.push({ field: 'password', issue: 'Пароль должен содержать не менее 6 символов' });
  }

  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    details.push({ field: 'fullName', issue: 'Имя пользователя обязательно для заполнения' });
  }

  if (details.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Ошибка валидации при регистрации',
        details
      }
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};
  const details = [];

  if (!email || !email.trim()) {
    details.push({ field: 'email', issue: 'Укажите email' });
  }
  if (!password) {
    details.push({ field: 'password', issue: 'Укажите пароль' });
  }

  if (details.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Необходимо указать email и пароль',
        details
      }
    });
  }

  next();
};

export const validateVisitBooking = (req, res, next) => {
  const { visitorName, email, visitDate, timeSlot, exhibitIds } = req.body || {};
  const details = [];

  if (!visitorName || !visitorName.trim()) {
    details.push({ field: 'visitorName', issue: 'Укажите имя посетителя' });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
    details.push({ field: 'email', issue: 'Укажите корректный e-mail для получения билета' });
  }

  if (!visitDate) {
    details.push({ field: 'visitDate', issue: 'Укажите дату визита' });
  } else {

    const parsedDate = new Date(visitDate);
    if (isNaN(parsedDate.getTime())) {
      details.push({ field: 'visitDate', issue: 'Некорректный формат даты (ожидается YYYY-MM-DD)' });
    } else {

      const dayOfWeek = parsedDate.getDay();
      if (dayOfWeek === 2) {
        return res.status(422).json({
          success: false,
          error: {
            code: 'MUSEUM_CLOSED_TUESDAY',
            message: 'По вторникам музей закрыт для посетителей (санитарный и экспозиционный день). Пожалуйста, выберите другой день недели.'
          }
        });
      }
    }
  }

  if (!timeSlot) {
    details.push({ field: 'timeSlot', issue: 'Укажите время визита' });
  } else {

    const [hour] = timeSlot.split(':').map(Number);
    if (isNaN(hour) || hour < 10 || hour > 18) {
      return res.status(422).json({
        success: false,
        error: {
          code: 'OUT_OF_OPENING_HOURS',
          message: 'Часы работы музея для входа посетителей: с 10:00 до 18:00'
        }
      });
    }
  }

  if (!Array.isArray(exhibitIds) || exhibitIds.length === 0) {
    details.push({ field: 'exhibitIds', issue: 'Маршрут должен содержать как минимум один экспонат' });
  } else if (exhibitIds.length > 25) {
    details.push({ field: 'exhibitIds', issue: 'Максимальное количество экспонатов в одном маршруте — 25' });
  }

  if (details.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Ошибка валидации данных визита',
        details
      }
    });
  }

  next();
};
