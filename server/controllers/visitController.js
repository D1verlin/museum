import { Op } from 'sequelize';
import { Visit, User } from '../models/index.js';
import { calculateRouteMetrics } from '../services/routeCalculator.js';
import { generateTicketNumber } from '../services/ticketGenerator.js';

export const createVisit = async (req, res, next) => {
  try {
    const {
      visitorName,
      email,
      phone,
      visitDate,
      timeSlot,
      pace = 'standard',
      availableTime = 90,
      exhibitIds = [],
      notes
    } = req.body;

    const calculation = await calculateRouteMetrics(exhibitIds, pace, availableTime);

    const exhibitsSnapshot = calculation.exhibits;

    const ticketNumber = await generateTicketNumber();

    const userId = req.user.id;

    const visit = await Visit.create({
      ticketNumber,
      userId,
      visitorName: visitorName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      visitDate,
      timeSlot,
      pace,
      availableTime: calculation.availableTime,
      exhibitIds,
      exhibitsSnapshot,
      hallsSequence: calculation.hallsSequence,
      exhibitsTime: calculation.exhibitsTime,
      transitTime: calculation.transitTime,
      totalEstimatedTime: calculation.totalEstimatedTime,
      isOverLimit: calculation.isOverLimit,
      overLimitDelta: calculation.overLimitDelta,
      status: 'confirmed',
      notes: notes ? notes.trim() : null
    });

    res.status(201).json({
      success: true,
      data: visit,
      message: `Электронный пропуск ${ticketNumber} успешно оформлен`
    });
  } catch (error) {
    next(error);
  }
};

export const getVisits = async (req, res, next) => {
  try {
    const { status, date, ticket, search } = req.query;
    const where = {};

    if (status && status !== 'all') where.status = status;
    if (date) where.visitDate = date;
    if (ticket) where.ticketNumber = { [Op.like]: `%${ticket.trim()}%` };
    if (search && search.trim()) {
      where[Op.or] = [
        { ticketNumber: { [Op.like]: `%${search.trim()}%` } },
        { visitorName: { [Op.like]: `%${search.trim()}%` } },
        { email: { [Op.like]: `%${search.trim()}%` } }
      ];
    }

    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }

    const visits = await Visit.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'fullName']
        }
      ]
    });

    res.json({
      success: true,
      data: visits
    });
  } catch (error) {
    next(error);
  }
};

export const getVisitByTicketOrId = async (req, res, next) => {
  try {
    const { ticketOrId } = req.params;

    let visit;
    if (/^AURA-\d+$/i.test(ticketOrId)) {
      visit = await Visit.findOne({ where: { ticketNumber: ticketOrId.toUpperCase() } });
    } else {
      visit = await Visit.findByPk(ticketOrId);
    }

    if (!visit) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'VISIT_NOT_FOUND',
          message: `Визит с номером или ID ${ticketOrId} не найден`
        }
      });
    }

    if (req.user && req.user.role !== 'admin' && visit.userId && visit.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Доступ к данному билету ограничен'
        }
      });
    }

    res.json({
      success: true,
      data: visit
    });
  } catch (error) {
    next(error);
  }
};

export const updateVisitStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['confirmed', 'completed', 'cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STATUS',
          message: `Недопустимый статус. Разрешены: ${allowedStatuses.join(', ')}`
        }
      });
    }

    const visit = await Visit.findByPk(id);
    if (!visit) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'VISIT_NOT_FOUND',
          message: `Визит с ID ${id} не найден`
        }
      });
    }

    if (req.user.role !== 'admin' && visit.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Вы можете управлять только своими визитами'
        }
      });
    }

    if (visit.status === 'cancelled') {
      return res.status(422).json({
        success: false,
        error: {
          code: 'INVALID_STATE_TRANSITION',
          message: 'Невозможно изменить статус уже отмененного визита'
        }
      });
    }

    if (visit.status === 'completed' && status !== 'completed') {
      return res.status(422).json({
        success: false,
        error: {
          code: 'INVALID_STATE_TRANSITION',
          message: 'Визит уже был завершен и зафиксирован в системе'
        }
      });
    }

    if (req.user.role !== 'admin' && status !== 'cancelled') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Пользователь может только отменить визит'
        }
      });
    }

    visit.status = status;
    await visit.save();

    res.json({
      success: true,
      data: visit,
      message: `Статус визита успешно изменен на «${status}»`
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVisit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const visit = await Visit.findByPk(id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'VISIT_NOT_FOUND',
          message: `Визит с ID ${id} не найден`
        }
      });
    }

    if (req.user.role !== 'admin' && visit.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Нет прав для удаления данного визита'
        }
      });
    }

    await visit.destroy();

    res.json({
      success: true,
      message: 'Запись визита успешно удалена'
    });
  } catch (error) {
    next(error);
  }
};
