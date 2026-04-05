const createError = require('http-errors');
const ProductService = require('../services/productsService');
const Product = require('../models/Product');
const categories = require('../services/categoriesService');
const brands = require('../services/brandsService');
const vendors = require('../services/vendorsService');

async function getProductsPage(req, res) {
  const searchText = req.query.search;
  const products = await ProductService.getAllProducts(searchText);
  res.render('products/products', { title: 'Products Page', products, searchText });
}

async function getCreateProductForm(req, res) {
  const [categoriesList, brandsList, vendorsList] = await Promise.all([
    categories.getAllCategories(),
    brands.getAllBrands(),
    vendors.getAllVendors(),
  ]);
  res.render('products/createProduct', {
    title: 'Add Product',
    categoriesList,
    brandsList,
    vendorsList,
  });
}

async function createProduct(req, res) {
  await ProductService.addProduct(req.body);
  res.redirect('/products');
}

async function getUpdateProductForm(req, res) {
  const [product, categoriesList, brandsList] = await Promise.all([
    Product.findById(req.params.id),
    categories.getAllCategories(),
    brands.getAllBrands(),
  ]);
  res.render('products/updateProduct', {
    title: 'Update Product',
    product,
    categoriesList,
    brandsList,
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
  await ProductService.deleteProduct(req.params.id);
  res.json({ redirect: '/products' });
}

async function getProductDetails(req, res) {
  const [product, productVendors] = await Promise.all([
    Product.findById(req.params.id),
    vendors.getVendorsByProduct(req.params.id),
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
