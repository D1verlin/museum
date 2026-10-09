import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Exhibit extends Model {}

Exhibit.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Название экспоната обязательно' }
      }
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false
    },
    periodKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    periodLabel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoryKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoryLabel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    technique: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dimensions: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hallId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hallName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: {
        min: { args: [1], msg: 'Время осмотра должно быть не менее 1 минуты' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fallbackImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Exhibit',
    tableName: 'exhibits'
  }
);
