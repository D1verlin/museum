import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Hall extends Model {}

Hall.init(
  {
    hallId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Название зала обязательно' }
      }
    },
    shortName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    floor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    theme: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    exhibitsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: 'Hall',
    tableName: 'halls'
  }
);
