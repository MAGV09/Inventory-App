const { Router } = require('express');
const indexRouter = Router();
const { getHomepage } = require('../controllers/indexController');

indexRouter.get('/', getHomepage);

module.exports = indexRouter;
