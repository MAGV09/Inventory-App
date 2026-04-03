const products = require('../services/productsService');
const customError = require('http-errors');

async function getHomepage(req, res) {
  const productsList = await products.getAllProducts();
  if (!productsList) {
    throw customError(404, `Couldn't find Products`);
  }
  res.render('index', { title: 'Homepage', productsList });
}

module.exports = { getHomepage };
