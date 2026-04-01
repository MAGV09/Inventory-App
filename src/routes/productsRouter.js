const { Router } = require('express');
const productsRouter = Router();

productsRouter.get('/');
productsRouter.get('/create');
productsRouter.post('/create');
productsRouter.patch('/update/:id');
productsRouter.delete('/delete/:id');

module.exports = productsRouter;
