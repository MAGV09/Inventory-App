const { Router } = require('express');
const productsRouter = Router();
const { getProductsPage, deleteProduct } = require('../controllers/productsController');
productsRouter.get('/', getProductsPage);
// productsRouter.get('/create');
// productsRouter.post('/create');
// productsRouter.get('/update/:id');
// productsRouter.patch('/update/:id');
productsRouter.delete('/delete/:id', deleteProduct);

module.exports = productsRouter;
