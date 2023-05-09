import { jest } from '@jest/globals';

import { createEercise, createUser } from '../controllers/userController';

import md5 from 'md5';

const username = 'admin';
const adminHash = md5('admin');

import db from '../models/db.js';

jest.spyOn(console, 'error').mockImplementation(() => {});

const mockResponse = () => {
  const response = {};
  response.status = jest.fn().mockReturnValue(response);
  response.json = jest.fn().mockReturnValue(response);

  return response;
};

const nextMock = jest.fn();

describe('controllers tests', () => {
  test('should create a user', async () => {
    const req = {
      body: {
        username: username,
      },
    };
    jest.spyOn(db.User, 'create').mockImplementation(() => Promise.resolve({ username: username }));
    const res = mockResponse();

    await createUser(req, res, nextMock);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ data: { username: username } });
  });

  test('should not create a user if username is not passed', async () => {
    const req = {
      body: {},
    };
    const res = mockResponse();
    await createUser(req, res, nextMock);

    expect(nextMock).toHaveBeenCalledWith(['username is required']);
  });

  test('should create an exrecise', async () => {
    const req = {
      params: {
        id: adminHash,
      },
      body: {
        description: 'some description',
        duration: 10,
        date: '1990-01-01',
      },
    };
    const res = mockResponse();
    jest.spyOn(db.Exercise, 'create').mockImplementation(() => Promise.resolve('some exrecise'));
    jest.spyOn(db.User, 'findByPk').mockImplementation(() => Promise.resolve({ data: adminHash }));

    await createEercise(req, res, nextMock);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ data: 'some exrecise' });
  });
});
