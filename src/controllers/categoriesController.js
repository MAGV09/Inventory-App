const categories = require('../services/categoriesService');

async function getCategoriesPage(req, res) {
  const categoriesList = await categories.getAllCategories();
  res.render('categories/categories', { title: 'Categories Page', categoriesList });
}

async function getCategoriesForm(req, res) {
  res.render('categories/createCategory', { title: 'Create Category' });
}

async function createCategory(req, res) {
  await categories.addCategory(req.body);
  res.redirect('/categories');
}

async function getCategoriesUpdateForm(req, res) {
  const category = await categories.getCategory(req.params.id);
  res.render('categories/updateCategory', { title: 'Update Category', category });
}

async function updateCategory(req, res) {
  await categories.updateCategory(req.params.id, req.body);
  res.json({ redirect: '/categories' });
}

async function deleteCategory(req, res) {
  await categories.deleteCategory(req.params.id);
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
