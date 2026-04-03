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

  res.render('products', { title: 'Products Page', productsList, searchParam });
}

module.exports = { getProductsPage };
