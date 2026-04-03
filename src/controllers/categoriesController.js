const categories = require('../services/productsService');
const customError = require('http-errors');

async function getCategories(req, res) {
  const categoriesList = await categories.getAllcategories();
  if (!categoriesList) {
    throw customError(404, `Couldn't find categories`);
  }
  res.render('category', { title: 'Categories', categoriesList });
}

module.exports = { getCategories };
