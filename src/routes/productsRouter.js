const { Router } = require('express');
const productsRouter = Router();
const { getProductsPage } = require('../controllers/productsController');
productsRouter.get('/', getProductsPage);
// productsRouter.get('/create');
// productsRouter.post('/create');
// productsRouter.patch('/update/:id');
// productsRouter.delete('/delete/:id');

module.exports = productsRouter;
