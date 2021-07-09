const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// eslint-disable-next-line no-unused-vars
const db = require('./database');
const routes = require('./routes');

const app = express();

app.use(express.static(path.join(__dirname, '/../client/dist')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/images', routes.images.router);
app.use('/api/cards', routes.cards.router);

const port = 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on port ${port}`);
});
