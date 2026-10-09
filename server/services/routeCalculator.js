import { Exhibit } from '../models/index.js';

export const TRANSIT_TIME_MINUTES = 5;

export const PACE_MULTIPLIERS = {
  express: 0.8,
  standard: 1.0,
  inDepth: 1.3
};

export async function calculateRouteMetrics(exhibitIds = [], pace = 'standard', availableTime = 90) {
  if (!Array.isArray(exhibitIds) || exhibitIds.length === 0) {
    return {
      exhibitsCount: 0,
      exhibits: [],
      exhibitsTime: 0,
      transitTime: 0,
      transitsCount: 0,
      totalEstimatedTime: 0,
      hallsSequence: [],
      isOverLimit: false,
      overLimitDelta: 0,
      remainingTime: Number(availableTime) || 90,
      pace,
      availableTime: Number(availableTime) || 90,
      recommendations: []
    };
  }

  const exhibitsFromDb = await Exhibit.findAll({
    where: { id: exhibitIds }
  });

  const exhibitMap = new Map();
  exhibitsFromDb.forEach((ex) => exhibitMap.set(ex.id, ex));

  const orderedExhibits = exhibitIds
    .map((id) => exhibitMap.get(id))
    .filter(Boolean);

  if (orderedExhibits.length === 0) {
    throw new Error('Ни один из указанных экспонатов не найден в каталоге музея');
  }

  const multiplier = PACE_MULTIPLIERS[pace] || 1.0;

  const totalRawExhibitMinutes = orderedExhibits.reduce((sum, ex) => {
    return sum + (Number(ex.durationMinutes) || 10) * multiplier;
  }, 0);

  const exhibitsTime = Math.round(totalRawExhibitMinutes);

  const hallsSequence = [];
  let transitsCount = 0;

  orderedExhibits.forEach((ex, idx) => {
    if (idx === 0) {
      hallsSequence.push(ex.hallName);
    } else {
      const prevHallId = orderedExhibits[idx - 1].hallId;
      if (ex.hallId !== prevHallId) {
        transitsCount += 1;
        if (!hallsSequence.includes(ex.hallName)) {
          hallsSequence.push(ex.hallName);
        }
      }
    }
  });

  const transitTime = transitsCount * TRANSIT_TIME_MINUTES;
  const totalEstimatedTime = exhibitsTime + transitTime;
  const numericAvailableTime = Number(availableTime) || 90;

  const isOverLimit = totalEstimatedTime > numericAvailableTime;
  const overLimitDelta = isOverLimit ? totalEstimatedTime - numericAvailableTime : 0;
  const remainingTime = !isOverLimit ? numericAvailableTime - totalEstimatedTime : 0;

  const recommendations = [];
  if (isOverLimit) {
    if (pace !== 'express') {
      recommendations.push('Рекомендуем переключить темп на «Экспресс» для сокращения времени осмотра.');
    }
    recommendations.push(`Время маршрута превышает лимит на ${overLimitDelta} мин. Рекомендуется удалить 1-2 экспоната или увеличить запас времени.`);
  } else if (remainingTime >= 20) {
    recommendations.push(`У вас остается запас ${remainingTime} мин. Можно добавить еще шедевры или провести больше времени в залах.`);
  }

  return {
    exhibitsCount: orderedExhibits.length,
    exhibits: orderedExhibits.map((e) => ({
      id: e.id,
      title: e.title,
      artist: e.artist,
      hallId: e.hallId,
      hallName: e.hallName,
      durationMinutes: e.durationMinutes
    })),
    exhibitsTime,
    transitTime,
    transitsCount,
    totalEstimatedTime,
    hallsSequence,
    isOverLimit,
    overLimitDelta,
    remainingTime,
    pace,
    availableTime: numericAvailableTime,
    recommendations
  };
}
