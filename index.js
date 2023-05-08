import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import userRoutes from './routes/userRoutes.js';

import db from './models/db.js';

import { errorHandler } from './controllers/errorHandler.js';

db.sequelize.sync();
const app = express();

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/api/users', userRoutes);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Not found. Check the URL and try again.' });
});
app.use(errorHandler);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

export default listener;