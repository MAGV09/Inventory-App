const ProductService = require('../services/ProductService');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const VendorProduct = require('../models/VendorProduct');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const createError = require('http-errors');

async function getProductsPage(req, res) {
  const searchText = req.query.search;
  const products = await ProductService.getAllProducts(searchText);
  res.render('products/products', { title: 'Products Page', products, searchText });
}

async function getCreateProductForm(req, res) {
  const [categories, brands, vendors] = await Promise.all([
    Category.findAll(),
    Brand.findAll(),
    Vendor.findAll(),
  ]);
  res.render('products/createProduct', {
    title: 'Add Product',
    categories,
    brands,
    vendors,
  });
}

async function createProduct(req, res) {
  await ProductService.addProduct(req.body);
  res.redirect('/products');
}

async function getUpdateProductForm(req, res) {
  const id = req.params.id;
  const [product, categories, brands] = await Promise.all([
    Product.findById(id),
    Category.findAll(),
    Brand.findAll(),
  ]);
  res.render('products/updateProduct', {
    title: 'Update Product',
    product,
    categories,
    brands,
  });
}

async function updateProduct(req, res) {
  const id = req.params.id;
  const product = await Product.findById(id);

  if (!product) {
    throw createError(404, 'Product not Found');
  }
  await Product.update(id, req.body);
  res.json({ redirect: '/products' });
}

async function deleteProduct(req, res) {
  const id = req.params.id;
  await ProductService.deleteProduct(id);
  res.json({ redirect: '/products' });
}

async function getProductDetails(req, res) {
  const id = req.params.id;
  const [product, productVendors] = await Promise.all([
    Product.findById(id),
    VendorProduct.findByProduct(id),
  ]);
  res.render('products/productDetails', { title: 'Product Details', product, productVendors });
}
module.exports = {
  getProductsPage,
  getCreateProductForm,
  createProduct,
  getUpdateProductForm,
  updateProduct,
  deleteProduct,
  getProductDetails,
};
