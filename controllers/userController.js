import db from '../models/db.js';
import md5 from 'md5';
import { createUserSchema, createExerciseSchema, getExerciseListSchema } from '../validators/schemas.js';
import { Op } from 'sequelize';

export const createUser = async (req, res, next) => {
  try {
    const params = {
      username: req.body.username,
      id: md5(req.body.username),
    };

    await createUserSchema.validate(params);

    const user = await db.User.create(params);

    res.status(201).json({ data: user });
  } catch (err) {
    console.error(err);
    next(err.errors);
  }
};

export const getUserList = async (req, res, next) => {
  try {
    const users = await db.User.findAll();

    res.status(200).json({ data: users });
  } catch (err) {
    console.error(err);
    next(err.errors);
  }
};

export const createEercise = async (req, res, next) => {
  const params = {
    ...req.body,
    userId: req.params.id,
  };

  try {
    await createExerciseSchema.validate(params);

    const userId = await db.User.findByPk(req.params.id);

    if (!userId) {
      throw { errors: ['user not found'] };
    }

    const exercise = await db.Exercise.create(params);

    res.status(201).json({ data: exercise });
  } catch (err) {
    console.error('CONTROLLER', err);
    next(err.errors);
  }
};

export const getExerciseList = async (req, res, next) => {
  const params = {
    ...req.query,
    userId: req.params.id,
  };

  Object.keys(params).forEach((key) => !params[key] && delete params[key]);

  try {
    await getExerciseListSchema.validate(params);

    const query = {
      where: {
        [Op.and]: [
          { userId: params.userId },
          (params.from && { date: { [Op.gte]: params.from } }) || null,
          (params.to && { date: { [Op.lte]: params.to } }) || null,
        ],
      },
      limit: params.limit || 100,
    };

    const exercises = await db.Exercise.findAll(query);

    res.status(200).json({ data: exercises, limit: params.limit || 100, entries: exercises.length });
  } catch (err) {
    console.error(err);
    next(err.errors);
  }
};
