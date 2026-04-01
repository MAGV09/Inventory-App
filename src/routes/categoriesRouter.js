const { Router } = require('express');
const categoriesRouter = Router();

categoriesRouter.get('/');
categoriesRouter.get('/create');
categoriesRouter.post('/create');
categoriesRouter.patch('/update/:id');
categoriesRouter.delete('/delete/:id');

module.exports = categoriesRouter;
