const { Router } = require('express');
const stock_movementsRouter = Router();

stock_movementsRouter.get('/');
stock_movementsRouter.get('/:id');
stock_movementsRouter.get('/create');
stock_movementsRouter.post('/create');
stock_movementsRouter.patch('/update/:id');
stock_movementsRouter.delete('/delete/:id');

module.exports = stock_movementsRouter;
