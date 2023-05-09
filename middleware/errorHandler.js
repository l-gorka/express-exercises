export const errorHandler = (errors, req, res, next) => {
  switch (true) {
    case errors[0]?.type === 'typeError' || errors[0]?.origin === 'DB':
      res.status(400).json({ error: `Validation error: ${errors[0].message}` });
      break;
    case !errors[0].origin:
      res.status(400).json({ error: errors[0] });
      break;
    default:
      res.status(500).json({ error: 'Something went wrong. Try again or contact support' });
      break;
  }
};
