const express = require('express');
const app = express();
const path = require('node:path');
const morgan = require('morgan');
require('dotenv').config({ quiet: true });

const errorHandler = require('./middleware/errorHandler');
const indexRouter = require('./routes/indexRouter');

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

const assetsPath = path.join(__dirname, '../public');
app.use(express.static(assetsPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/', indexRouter);

//err handling
app.use(errorHandler);

const port = process.env.APP_PORT || 3000;
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`listening on ${port} `);
});
