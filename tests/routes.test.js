import app from '../index.js';
import request from 'supertest';
import fs from 'fs';
import db from '../models/db'
import md5 from'md5';

beforeAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
})

afterAll(async () => {
  app.close();
  fs.rmSync('test.sqlite', {
    force: true,
  });
});

describe('listener', () => {
  test('should return list of users', async () => {
   await db.User.create({
      username: 'admin',
      id: md5('admin'),
    });
    const resp = await request(app).get('/api/users');

    expect(resp.body.data[0].username).toBe('admin');
  });
});
