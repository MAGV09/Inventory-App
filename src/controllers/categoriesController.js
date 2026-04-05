const CategoryService = require('../services/CategoryService');
const Category = require('../models/Category');

async function getCategoriesPage(req, res) {
  const categories = await Category.findAll();
  res.render('categories/categories', { title: 'Categories Page', categories });
}

async function getCategoriesForm(req, res) {
  res.render('categories/createCategory', { title: 'Create Category' });
}

async function createCategory(req, res) {
  await Category.create(req.body);
  res.redirect('/categories');
}

async function getCategoriesUpdateForm(req, res) {
  const id = req.params.id;
  const category = await Category.findById(id);
  res.render('categories/updateCategory', { title: 'Update Category', category });
}

async function updateCategory(req, res) {
  const id = req.params.id;
  await Category.update(id, req.body);
  res.json({ redirect: '/categories' });
}

async function deleteCategory(req, res) {
  const id = req.params.id;
  await CategoryService.deleteCategory(id);
  res.json({ redirect: '/categories' });
}

module.exports = {
  getCategoriesPage,
  getCategoriesForm,
  createCategory,
  getCategoriesUpdateForm,
  updateCategory,
  deleteCategory,
};
