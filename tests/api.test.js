import app from '../index.js';
import request from 'supertest';
import fs from 'fs';
import db from '../models/db';
import md5 from 'md5';
import { jest } from '@jest/globals';

const adminHash = md5('admin');

jest.spyOn(global.console, 'error').mockImplementation(() => {});

jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

beforeAll(async () => {
  await db.sequelize.sync();
});

afterAll(async () => {
  app.close();
  fs.rmSync('test.sqlite', {
    force: true,
  });
});

describe('user tests', () => {
  afterEach(async () => {
    await db.User.destroy({
      where: {},
      truncate: true,
    });
  });

  test('should return list of users', async () => {
    await db.User.create({
      username: 'admin',
      id: adminHash,
    });
    const resp = await request(app).get('/api/users');

    expect(resp.body.data).toStrictEqual([
      {
        createdAt: '2020-01-01T00:00:00.000Z',
        id: '21232f297a57a5a743894a0e4a801fc3',
        updatedAt: '2020-01-01T00:00:00.000Z',
        username: 'admin',
      },
    ]);
  });

  test('should create a new user', async () => {
    const resp = await request(app).post('/api/users').type('json').send({ username: 'admin' });

    expect(resp.status).toBe(201);
    expect(resp.body.data).toStrictEqual({
      createdAt: '2020-01-01T00:00:00.000Z',
      id: '21232f297a57a5a743894a0e4a801fc3',
      updatedAt: '2020-01-01T00:00:00.000Z',
      username: 'admin',
    });
  });

  test('should not create a new user if the username is not specified', async () => {
    const resp = await request(app).post('/api/users').type('json').send({ username: '' });

    expect(resp.status).toBe(400);
    expect(resp.body.error).toBe('username must be at least 2 characters');
  });

  test('should not create a new user if the username exceeds 32 characters', async () => {
    const resp = await request(app)
      .post('/api/users')
      .type('json')
      .send({ username: '1234'.repeat(10) });

    expect(resp.status).toBe(400);
    expect(resp.body.error).toBe('username must be at most 32 characters');
  });

  test('should not create a new user if illegal characters are used', async () => {
    const resp = await request(app).post('/api/users').type('json').send({ username: ')(*weff32)' });

    expect(resp.status).toBe(400);
    expect(resp.body.error).toBe('Only letters and digits are allowed for the username');
  });
});

describe('exercies tests', () => {
  beforeAll(async () => {
    await db.User.create({
      username: 'admin',
      id: adminHash,
    });
  });

  afterEach(async () => {
    await db.Exercise.destroy({
      where: {},
      truncate: true,
      restartIdentity: true, // not reseting auto increment of id, idk why?
    });
  });

  test('should return list of exercies', async () => {
    await db.Exercise.create({
      userId: adminHash,
      description: 'some description',
      duration: 10,
      date: new Date().getTime(),
    });

    const resp = await request(app).get(`/api/users/${adminHash}/logs`);

    expect(resp.status).toBe(200);
    expect(resp.body.data[0].description).toBe('some description');
  });

  test('should create a new exercise', async () => {
    const payload = {
      userId: adminHash,
      description: 'some description',
      duration: 10,
      date: '2000-12-12',
    };
    const resp = await request(app).post(`/api/users/${adminHash}/exercises`).type('json').send(payload);

    delete resp.body.data.id // temporary

    expect(resp.status).toBe(201);
    expect(resp.body.data).toStrictEqual({
      createdAt: '2020-01-01T00:00:00.000Z',
      date: '2000-12-12',
      description: 'some description',
      duration: 10,
      updatedAt: '2020-01-01T00:00:00.000Z',
      userId: '21232f297a57a5a743894a0e4a801fc3',
    });
  });
});
