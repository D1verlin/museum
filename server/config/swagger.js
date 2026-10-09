import swaggerUi from 'swagger-ui-express';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Национальный художественный музей Республики Беларусь — REST API',
    version: '1.0.0',
    description: 'Интерактивная спецификация REST API для серверной части веб-приложения постоянной экспозиции Национального художественного музея РБ (г. Минск, ул. Ленина, 20).'
  },
  servers: [
    {
      url: '/api',
      description: 'Текущий хост (относительный путь)'
    },
    {
      url: 'https://museum.diverlin.ru/api',
      description: 'Продакшн сервер (VDS museum.diverlin.ru)'
    },
    {
      url: 'http://localhost:3017/api',
      description: 'Локальный сервер разработки (порт 3017)'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Введите JWT-токен, полученный при входе или регистрации (/api/auth/login)'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          email: { type: 'string', format: 'email', example: 'visitor@artmuseum.by' },
          fullName: { type: 'string', example: 'Алексей Смирнов' },
          phone: { type: 'string', example: '+375 (29) 123-45-67' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Exhibit: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'exhibit-001' },
          title: { type: 'string', example: 'Богоматерь Умиление (из Малориты)' },
          artist: { type: 'string', example: 'Неизвестный мастер полесской школы' },
          period: { type: 'string', example: 'Около 1648–1650 гг.' },
          periodKey: { type: 'string', example: 'xvii' },
          periodLabel: { type: 'string', example: 'XVII век' },
          category: { type: 'string', example: 'Сакральное искусство' },
          categoryKey: { type: 'string', example: 'sacred' },
          categoryLabel: { type: 'string', example: 'Сакральное искусство' },
          technique: { type: 'string', example: 'Дерево, левкас, темпера, серебрение, резьба' },
          dimensions: { type: 'string', example: '114 × 78 см' },
          hallId: { type: 'integer', example: 1 },
          hallName: { type: 'string', example: 'Зал древнебелорусского сакрального искусства' },
          durationMinutes: { type: 'integer', example: 12 },
          description: { type: 'string', example: 'Памятник полесской школы иконописи XVII века.' },
          imageUrl: { type: 'string', example: './images/exhibits/exhibit-001.jpg' },
          isAvailable: { type: 'boolean', example: true }
        }
      },
      Hall: {
        type: 'object',
        properties: {
          hallId: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Зал древнебелорусского сакрального искусства' },
          shortName: { type: 'string', example: 'Сакральное искусство' },
          floor: { type: 'string', example: '1 этаж' },
          theme: { type: 'string', example: 'Иконопись полесской школы, деревянная резьба XVII века' },
          exhibitsCount: { type: 'integer', example: 2 }
        }
      },
      Visit: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          ticketNumber: { type: 'string', example: 'AURA-774102' },
          userId: { type: 'integer', example: 2 },
          visitorName: { type: 'string', example: 'Алексей Смирнов' },
          email: { type: 'string', format: 'email', example: 'visitor@artmuseum.by' },
          phone: { type: 'string', example: '+375 (29) 123-45-67' },
          visitDate: { type: 'string', example: '2026-10-15' },
          timeSlot: { type: 'string', example: '14:00' },
          pace: { type: 'string', enum: ['express', 'standard', 'inDepth'], example: 'standard' },
          availableTime: { type: 'integer', example: 90 },
          exhibitIds: {
            type: 'array',
            items: { type: 'string' },
            example: ['exhibit-001', 'exhibit-003', 'exhibit-011']
          },
          hallsSequence: {
            type: 'array',
            items: { type: 'string' }
          },
          exhibitsTime: { type: 'integer', example: 41 },
          transitTime: { type: 'integer', example: 10 },
          totalEstimatedTime: { type: 'integer', example: 51 },
          isOverLimit: { type: 'boolean', example: false },
          overLimitDelta: { type: 'integer', example: 0 },
          status: { type: 'string', enum: ['confirmed', 'completed', 'cancelled'], example: 'confirmed' },
          notes: { type: 'string', example: 'Аудиогид на белорусском языке' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: 'Ошибка валидации' }
            }
          }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Проверка состояния сервера и базы данных',
        responses: {
          200: { description: 'Сервер работает нормально' }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Регистрация нового посетителя',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'fullName'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'newvisitor@artmuseum.by' },
                  password: { type: 'string', example: 'VisitorPass123!' },
                  fullName: { type: 'string', example: 'Ольга Николаева' },
                  phone: { type: 'string', example: '+375 (29) 555-44-33' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Пользователь успешно зарегистрирован' },
          400: { description: 'Ошибка валидации полей', schema: { $ref: '#/components/schemas/ErrorResponse' } },
          409: { description: 'Email уже зарегистрирован' }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Аутентификация пользователя или администратора',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'admin@artmuseum.by' },
                  password: { type: 'string', example: 'AdminPass123!' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Успешный вход, возвращен JWT-токен' },
          401: { description: 'Неверный email или пароль' }
        }
      }
    },
    '/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Получение профиля текущего авторизованного пользователя',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Данные профиля' },
          401: { description: 'Требуется токен авторизации' }
        }
      },
      put: {
        tags: ['Authentication'],
        summary: 'Обновление данных профиля',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fullName: { type: 'string', example: 'Алексей Смирнов' },
                  phone: { type: 'string', example: '+375 (29) 123-45-67' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Профиль обновлен' },
          401: { description: 'Требуется токен авторизации' }
        }
      }
    },
    '/halls': {
      get: {
        tags: ['Halls'],
        summary: 'Список всех экспозиционных залов музея',
        responses: {
          200: { description: 'Список 5 залов' }
        }
      },
      post: {
        tags: ['Halls'],
        summary: 'Создание зала (только администратор)',
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Зал создан' },
          403: { description: 'Доступно только администраторам' }
        }
      }
    },
    '/halls/{id}': {
      get: {
        tags: ['Halls'],
        summary: 'Детали зала с перечнем экспонатов',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Детали зала' },
          404: { description: 'Зал не найден' }
        }
      }
    },
    '/exhibits': {
      get: {
        tags: ['Exhibits'],
        summary: 'Каталог экспонатов с фильтрами, поиском и сортировкой',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Поиск по названию, автору или технике' },
          { name: 'hallId', in: 'query', schema: { type: 'string' }, description: 'Фильтр по номеру зала (1-5)' },
          { name: 'categoryKey', in: 'query', schema: { type: 'string' }, description: 'Фильтр по категории' },
          { name: 'periodKey', in: 'query', schema: { type: 'string' }, description: 'Фильтр по эпохе' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } }
        ],
        responses: {
          200: { description: 'Каталог экспонатов' }
        }
      },
      post: {
        tags: ['Exhibits'],
        summary: 'Создание нового экспоната (только администратор)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Exhibit' }
            }
          }
        },
        responses: {
          201: { description: 'Экспонат создан' },
          403: { description: 'Недостаточно прав' }
        }
      }
    },
    '/exhibits/{id}': {
      get: {
        tags: ['Exhibits'],
        summary: 'Получение деталей экспоната',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Данные экспоната' },
          404: { description: 'Экспонат не найден' }
        }
      },
      put: {
        tags: ['Exhibits'],
        summary: 'Обновление данных экспоната (только администратор)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Экспонат обновлен' },
          403: { description: 'Недостаточно прав' }
        }
      },
      delete: {
        tags: ['Exhibits'],
        summary: 'Удаление экспоната (только администратор)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Экспонат удален' },
          403: { description: 'Недостаточно прав' }
        }
      }
    },
    '/routes/calculate': {
      post: {
        tags: ['Routes'],
        summary: 'Серверный расчет хронометража маршрута и времени переходов',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['exhibitIds'],
                properties: {
                  exhibitIds: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['exhibit-001', 'exhibit-003', 'exhibit-011']
                  },
                  pace: { type: 'string', enum: ['express', 'standard', 'inDepth'], example: 'standard' },
                  availableTime: { type: 'integer', example: 90 }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Результаты расчета хронометража' },
          400: { description: 'Массив exhibitIds пуст' }
        }
      }
    },
    '/routes/presets': {
      get: {
        tags: ['Routes'],
        summary: 'Получение кураторских маршрутов музея',
        responses: {
          200: { description: 'Список кураторских маршрутов' }
        }
      }
    },
    '/visits': {
      post: {
        tags: ['Visits'],
        summary: 'Оформление персонального визита и генерация билета (требуется авторизация)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['visitorName', 'email', 'visitDate', 'timeSlot', 'exhibitIds'],
                properties: {
                  visitorName: { type: 'string', example: 'Алексей Смирнов' },
                  email: { type: 'string', format: 'email', example: 'visitor@artmuseum.by' },
                  phone: { type: 'string', example: '+375 (29) 123-45-67' },
                  visitDate: { type: 'string', example: '2026-10-15' },
                  timeSlot: { type: 'string', example: '14:00' },
                  pace: { type: 'string', enum: ['express', 'standard', 'inDepth'], default: 'standard' },
                  availableTime: { type: 'integer', default: 90 },
                  exhibitIds: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['exhibit-001', 'exhibit-003', 'exhibit-011']
                  },
                  notes: { type: 'string', example: 'Визит с аудиогидом' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Визит оформлен, возвращен билет AURA-XXXXXX' },
          401: { description: 'Требуется авторизация для оформления визита' },
          422: { description: 'Санитарный день (вторник) или время вне рабочих часов (10:00-18:00)' }
        }
      },
      get: {
        tags: ['Visits'],
        summary: 'Получение списка визитов (пользователь видит свои, администратор — все)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['confirmed', 'completed', 'cancelled'] } },
          { name: 'ticket', in: 'query', schema: { type: 'string' } },
          { name: 'date', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Список визитов' },
          401: { description: 'Требуется токен авторизации' }
        }
      }
    },
    '/visits/{ticketOrId}': {
      get: {
        tags: ['Visits'],
        summary: 'Получение деталей визита по номеру билета (AURA-XXXXXX) или ID',
        parameters: [
          { name: 'ticketOrId', in: 'path', required: true, schema: { type: 'string' }, example: 'AURA-774102' }
        ],
        responses: {
          200: { description: 'Детали визита' },
          404: { description: 'Визит не найден' }
        }
      }
    },
    '/visits/{id}/status': {
      patch: {
        tags: ['Visits'],
        summary: 'Смена статуса визита (пользователь может отменить, администратор — подтвердить/завершить)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['confirmed', 'completed', 'cancelled'], example: 'completed' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Статус обновлен' },
          403: { description: 'Нет прав на изменение чужого визита' },
          422: { description: 'Недопустимый переход состояния (например, отмененный визит нельзя восстановить)' }
        }
      }
    }
  }
};

export const setupSwagger = (app) => {
  app.get('/api/docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Документация REST API — НХМ РБ'
    })
  );
};
