import express  from 'express';
const router = express.Router();

import { createUser, getUserList, createEercise, getExerciseList } from '../middleware/userController.js';

router.post('/', (req, res, next) => {
  createUser(req, res, next);
});

router.get('/', (req, res, next) => {
  getUserList(req, res, next);
})

router.post('/:id/exercises', (req, res, next) => {
  createEercise(req, res, next);
})

router.get('/:id/logs', (req, res, next) => {
  getExerciseList(req, res, next);
})



export default router;