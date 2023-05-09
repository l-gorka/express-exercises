import fs from 'fs';
import db from '../models/db'

afterAll(async () => {
  await db.sequelize.sync()
  fs.rmSync('test.sqlite', {
    force: true,
  });
});
