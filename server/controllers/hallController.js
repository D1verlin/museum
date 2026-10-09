import { Hall, Exhibit } from '../models/index.js';

export const getAllHalls = async (req, res, next) => {
  try {
    const halls = await Hall.findAll({
      order: [['hallId', 'ASC']]
    });

    res.json({
      success: true,
      data: halls
    });
  } catch (error) {
    next(error);
  }
};

export const getHallById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hall = await Hall.findByPk(Number(id), {
      include: [{ model: Exhibit, as: 'exhibits', attributes: ['id', 'title', 'artist', 'imageUrl', 'durationMinutes'] }]
    });

    if (!hall) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'HALL_NOT_FOUND',
          message: `Зал №${id} не найден`
        }
      });
    }

    res.json({
      success: true,
      data: hall
    });
  } catch (error) {
    next(error);
  }
};

export const createHall = async (req, res, next) => {
  try {
    const { hallId, name, shortName, floor, theme } = req.body;

    const existing = await Hall.findByPk(Number(hallId));
    if (existing) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'HALL_EXISTS',
          message: `Зал с номером ${hallId} уже существует`
        }
      });
    }

    const created = await Hall.create({
      hallId: Number(hallId),
      name,
      shortName,
      floor,
      theme,
      exhibitsCount: 0
    });

    res.status(201).json({
      success: true,
      data: created,
      message: 'Зал успешно создан'
    });
  } catch (error) {
    next(error);
  }
};

export const updateHall = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hall = await Hall.findByPk(Number(id));

    if (!hall) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'HALL_NOT_FOUND',
          message: `Зал №${id} не найден`
        }
      });
    }

    await hall.update(req.body);

    res.json({
      success: true,
      data: hall,
      message: 'Информация о зале обновлена'
    });
  } catch (error) {
    next(error);
  }
};
