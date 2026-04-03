const products = require('../services/productsService');
// const customError = require('http-errors');

async function getProductsPage(req, res) {
  let productsList;
  const searchParam = req.query.search;

  if (searchParam) {
    productsList = await products.getProduct(searchParam);
  } else {
    productsList = await products.getAllProducts();
  }

  res.render('products/products', { title: 'Products Page', productsList, searchParam });
}

async function deleteProduct(req, res) {
  const deletedProduct = await products.deleteProduct(req.params.id);
  res.json({ redirect: '/products' });
}
module.exports = { getProductsPage, deleteProduct };
