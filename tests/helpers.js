import db from '../models/db.js';
import md5 from 'md5';

export const createRecords = async () => {
  db.User.create({
    username: 'admin',
    id: md5('admin'),
  });
};
