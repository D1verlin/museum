import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Visit extends Model {}

Visit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ticketNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    visitorName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Имя посетителя обязательно' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: 'Некорректный адрес электронной почты' }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    visitDate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Дата визита обязательна' }
      }
    },
    timeSlot: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Время визита обязательно' }
      }
    },
    pace: {
      type: DataTypes.ENUM('express', 'standard', 'inDepth'),
      defaultValue: 'standard',
      allowNull: false
    },
    availableTime: {
      type: DataTypes.INTEGER,
      defaultValue: 90,
      allowNull: false
    },
    exhibitIds: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    exhibitsSnapshot: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    hallsSequence: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    exhibitsTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    transitTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    totalEstimatedTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    isOverLimit: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    overLimitDelta: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('confirmed', 'completed', 'cancelled'),
      defaultValue: 'confirmed',
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Visit',
    tableName: 'visits'
  }
);
