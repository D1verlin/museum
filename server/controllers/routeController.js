import { calculateRouteMetrics } from '../services/routeCalculator.js';
import { PresetRoute } from '../models/index.js';

export const calculateRoute = async (req, res, next) => {
  try {
    const { exhibitIds, pace = 'standard', availableTime = 90 } = req.body;

    if (!Array.isArray(exhibitIds) || exhibitIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'EMPTY_EXHIBITS',
          message: 'Для расчета необходимо передать массив идентификаторов экспонатов (exhibitIds)'
        }
      });
    }

    const metrics = await calculateRouteMetrics(exhibitIds, pace, availableTime);

    res.json({
      success: true,
      data: metrics,
      message: 'Расчет параметров маршрута успешно выполнен'
    });
  } catch (error) {
    next(error);
  }
};

export const getPresets = async (req, res, next) => {
  try {
    const presets = await PresetRoute.findAll();
    res.json({
      success: true,
      data: presets
    });
  } catch (error) {
    next(error);
  }
};

export const getPresetByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const preset = await PresetRoute.findByPk(key);

    if (!preset) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRESET_NOT_FOUND',
          message: `Маршрут ${key} не найден`
        }
      });
    }

    res.json({
      success: true,
      data: preset
    });
  } catch (error) {
    next(error);
  }
};

export const createPreset = async (req, res, next) => {
  try {
    const { presetKey, title, description, exhibitIds, targetPace, recommendedTime } = req.body;

    const existing = await PresetRoute.findByPk(presetKey);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'PRESET_EXISTS',
          message: `Маршрут с ключом ${presetKey} уже существует`
        }
      });
    }

    const created = await PresetRoute.create({
      presetKey,
      title,
      description,
      exhibitIds: exhibitIds || [],
      targetPace: targetPace || 'standard',
      recommendedTime: recommendedTime || 90
    });

    res.status(201).json({
      success: true,
      data: created,
      message: 'Кураторский маршрут успешно сохранен'
    });
  } catch (error) {
    next(error);
  }
};
