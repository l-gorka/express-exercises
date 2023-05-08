import { object, string, number } from 'yup';

const dateValidator = string().matches(/^[0-9]{4}-[0-9]{2}-[0-9]/, 'Date must be in the format YYYY-MM-DD');

export const createUserSchema = object({
  username: string()
    .min(2)
    .max(32)
    .matches(/^[a-zA-Z]+$/, 'Only letters and digits are allowed for the username')
    .required(),
  id: string().length(32).required(),
});

export const createExerciseSchema = object({
  userId: string().length(32).required(),
  description: string().min(2).max(255).required(),
  duration: number().positive().required(),
  date: dateValidator.required(),
});

export const getExerciseListSchema = object({
  userId: string().length(32).required('Please provide a valid user id'),
  from: dateValidator,
  to: dateValidator,
  limit: number().positive().max(100),
});
