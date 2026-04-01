const { Router } = require('express');
const brandsRouter = Router();

brandsRouter.get('/');
brandsRouter.get('/:id');
brandsRouter.get('/create');
brandsRouter.post('/create');
brandsRouter.patch('/update/:id');
brandsRouter.delete('/delete/:id');

module.exports = brandsRouter;
