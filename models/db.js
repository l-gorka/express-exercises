import { Sequelize } from 'sequelize'
import dotenv from 'dotenv';

dotenv.config();
const isTestEnv = process.env.NODE_ENV === 'test';

import userModel from './userModel.js';
import exerciseModel from './exerciseModel.js';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: isTestEnv ? 'test.sqlite' : 'db.sqlite',
  logging: !isTestEnv
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = userModel(sequelize, Sequelize);
db.Exercise = exerciseModel(sequelize, Sequelize);

sequelize.sync();

export default db;