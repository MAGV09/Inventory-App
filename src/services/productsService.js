const Product = require('../models/Product');
const VendorProduct = require('../models/VendorProduct');
const StockMovement = require('../models/StockMovement');
const createError = require('http-errors');

async function getAllProducts(searchText) {
  const products = searchText ? await Product.find(searchText) : await Product.findAll();
  return products;
}

async function deleteProduct(id) {
  const product = await Product.findById(id);
  if (!product) {
    throw createError(404, 'Product not found');
  }
  //remove foreign keys constrain
  await VendorProduct.deleteByProduct(id);
  await StockMovement.deleteByProduct(id);

  //delete product
  await Product.deleteById(id);
}

async function addProduct({ name, category_id, brand_id, vendor_id, unit_cost }) {
  const product = await Product.create({ name, category_id, brand_id });
  const product_id = product.id;

  await VendorProduct.create({ product_id, vendor_id, unit_cost });
  return product;
}

module.exports = {
  getAllProducts,
  addProduct,
  deleteProduct,
};
