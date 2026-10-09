import { Op } from 'sequelize';
import { Exhibit, Hall } from '../models/index.js';

export const getAllExhibits = async (req, res, next) => {
  try {
    const {
      hallId,
      categoryKey,
      periodKey,
      search,
      sort = 'title',
      order = 'ASC',
      page = 1,
      limit = 50
    } = req.query;

    const where = {};

    if (hallId && hallId !== 'all') {
      where.hallId = Number(hallId);
    }

    if (categoryKey && categoryKey !== 'all') {
      where.categoryKey = categoryKey;
    }

    if (periodKey && periodKey !== 'all') {
      where.periodKey = periodKey;
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      where[Op.or] = [
        { title: { [Op.like]: term } },
        { artist: { [Op.like]: term } },
        { description: { [Op.like]: term } },
        { technique: { [Op.like]: term } }
      ];
    }

    const offset = (Number(page) - 1) * Number(limit);
    const validSortFields = ['title', 'durationMinutes', 'hallId', 'createdAt'];
    const sortField = validSortFields.includes(sort) ? sort : 'title';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const { count, rows } = await Exhibit.findAndCountAll({
      where,
      order: [[sortField, sortOrder]],
      limit: Number(limit),
      offset: Number(offset)
    });

    res.json({
      success: true,
      data: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
        exhibits: rows
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getExhibitById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exhibit = await Exhibit.findByPk(id, {
      include: [{ model: Hall, as: 'hall', attributes: ['hallId', 'name', 'shortName', 'floor', 'theme'] }]
    });

    if (!exhibit) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EXHIBIT_NOT_FOUND',
          message: `Экспонат с идентификатором ${id} не найден`
        }
      });
    }

    res.json({
      success: true,
      data: exhibit
    });
  } catch (error) {
    next(error);
  }
};

export const createExhibit = async (req, res, next) => {
  try {
    const exhibitData = req.body;
    if (!exhibitData.id) {

      const count = await Exhibit.count();
      exhibitData.id = `exhibit-${String(count + 1).padStart(3, '0')}`;
    }

    const existing = await Exhibit.findByPk(exhibitData.id);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EXHIBIT_EXISTS',
          message: `Экспонат с кодом ${exhibitData.id} уже существует`
        }
      });
    }

    const created = await Exhibit.create(exhibitData);

    if (created.hallId) {
      const exhibitsInHall = await Exhibit.count({ where: { hallId: created.hallId } });
      await Hall.update({ exhibitsCount: exhibitsInHall }, { where: { hallId: created.hallId } });
    }

    res.status(201).json({
      success: true,
      data: created,
      message: 'Экспонат успешно добавлен в каталог музея'
    });
  } catch (error) {
    next(error);
  }
};

export const updateExhibit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exhibit = await Exhibit.findByPk(id);

    if (!exhibit) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EXHIBIT_NOT_FOUND',
          message: `Экспонат с идентификатором ${id} не найден`
        }
      });
    }

    await exhibit.update(req.body);

    res.json({
      success: true,
      data: exhibit,
      message: 'Информация об экспонате успешно обновлена'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExhibit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exhibit = await Exhibit.findByPk(id);

    if (!exhibit) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EXHIBIT_NOT_FOUND',
          message: `Экспонат с идентификатором ${id} не найден`
        }
      });
    }

    const hallId = exhibit.hallId;
    await exhibit.destroy();

    if (hallId) {
      const exhibitsInHall = await Exhibit.count({ where: { hallId } });
      await Hall.update({ exhibitsCount: exhibitsInHall }, { where: { hallId } });
    }

    res.json({
      success: true,
      message: `Экспонат «${exhibit.title}» успешно удален`
    });
  } catch (error) {
    next(error);
  }
};
