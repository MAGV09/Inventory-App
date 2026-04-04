const products = require('../services/productsService');
const categories = require('../services/categoriesService');
const brands = require('../services/brandsService');
const vendors = require('../services/vendorsService');

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
  await products.addProduct(req.body);
  res.redirect('/products');
}

async function getUpdateProductForm(req, res) {
  const [product, categoriesList, brandsList] = await Promise.all([
    products.getProductById(req.params.id),
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
  await products.updateProduct(req.params.id, req.body);
  res.json({ redirect: '/products' });
}

async function deleteProduct(req, res) {
  await products.deleteProduct(req.params.id);
  res.json({ redirect: '/products' });
}
async function getProductDetails(req, res) {
  const [product, productVendors] = await Promise.all([
    products.getProductById(req.params.id),
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
