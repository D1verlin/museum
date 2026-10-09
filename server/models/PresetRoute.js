import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class PresetRoute extends Model {}

PresetRoute.init(
  {
    presetKey: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    exhibitIds: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    targetPace: {
      type: DataTypes.STRING,
      defaultValue: 'standard'
    },
    recommendedTime: {
      type: DataTypes.INTEGER,
      defaultValue: 90
    }
  },
  {
    sequelize,
    modelName: 'PresetRoute',
    tableName: 'preset_routes'
  }
);
