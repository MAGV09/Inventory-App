const { Router } = require('express');
const categoriesRouter = Router();
const {
  getCategoriesPage,
  getCategoriesForm,
  createCategory,
  getCategoriesUpdateForm,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoriesController');

categoriesRouter.get('/', getCategoriesPage);
categoriesRouter.get('/create', getCategoriesForm);
categoriesRouter.post('/create', createCategory);
categoriesRouter.get('/:id/update', getCategoriesUpdateForm);
categoriesRouter.patch('/:id/update', updateCategory);
categoriesRouter.delete('/:id/delete', deleteCategory);

module.exports = categoriesRouter;
