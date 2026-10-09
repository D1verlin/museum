import { sequelize } from '../config/database.js';
import { User } from './User.js';
import { Hall } from './Hall.js';
import { Exhibit } from './Exhibit.js';
import { Visit } from './Visit.js';
import { PresetRoute } from './PresetRoute.js';

User.hasMany(Visit, { foreignKey: 'userId', as: 'visits', onDelete: 'SET NULL' });
Visit.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Hall.hasMany(Exhibit, { foreignKey: 'hallId', as: 'exhibits' });
Exhibit.belongsTo(Hall, { foreignKey: 'hallId', as: 'hall' });

export { sequelize, User, Hall, Exhibit, Visit, PresetRoute };
