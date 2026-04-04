const { Router } = require('express');
const stockMovementsRouter = Router();
const {
  getStockMovementsPage,
  getStockMovementsForm,
  createStockMovement,
} = require('../controllers/stockMovementsController');

stockMovementsRouter.get('/', getStockMovementsPage);
stockMovementsRouter.get('/create', getStockMovementsForm);
stockMovementsRouter.post('/create', createStockMovement);

module.exports = stockMovementsRouter;
