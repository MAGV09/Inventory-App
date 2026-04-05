const Category = require('../models/Category');
const Product = require('../models/Product');
const createError = require('http-errors');

async function deleteCategory(id) {
  const category = await Category.findById(id);
  if (!category) {
    throw createError(404, 'Category not found');
  }

  if (category.name.toLowerCase() === 'uncategorized') {
    throw createError(400, 'Cannot delete Uncategorized');
  }

  let uncategorized = await Category.find('Uncategorized');

  if (!uncategorized) {
    uncategorized = await Category.create({ name: 'Uncategorized' });
  }

  await Product.updateCategory(id, uncategorized.id);
  const deletedCategory = Category.deleteById(id);
  return deletedCategory;
}

module.exports = { deleteCategory };
