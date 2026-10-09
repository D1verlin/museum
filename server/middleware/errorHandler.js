
export const errorHandler = (err, req, res, _next) => {
  console.error('[Error Handler]', err);

  if (err.name === 'SequelizeUniqueConstraintError') {
    const fields = err.errors ? err.errors.map((e) => e.path) : [];
    return res.status(409).json({
      success: false,
      error: {
        code: 'CONFLICT',
        message: 'Запись с такими данными уже существует',
        details: fields
      }
    });
  }

  if (err.name === 'SequelizeValidationError') {
    const details = err.errors ? err.errors.map((e) => ({ field: e.path, issue: e.message })) : [];
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Ошибка валидации базы данных',
        details
      }
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Внутренняя ошибка сервера';

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message
    }
  });
};
