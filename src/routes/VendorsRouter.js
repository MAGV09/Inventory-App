const { Router } = require('express');
const vendorsRouter = Router();

vendorsRouter.get('/');
vendorsRouter.get('/:id');
vendorsRouter.get('/create');
vendorsRouter.post('/create');
vendorsRouter.patch('/update/:id');
vendorsRouter.delete('/delete/:id');

module.exports = vendorsRouter;
