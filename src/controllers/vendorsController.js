const vendors = require('../services/vendorsService');

async function getVendorsPage(req, res) {
  const vendorsList = await vendors.getAllVendors();
  res.render('vendors/vendors', { title: 'Vendors Page', vendorsList });
}

async function getVendorsForm(req, res) {
  res.render('vendors/createVendor', { title: 'Create Vendor' });
}

async function createVendor(req, res) {
  await vendors.addVendor(req.body);
  res.redirect('/vendors');
}

async function getVendorsUpdateForm(req, res) {
  const vendor = await vendors.getVendor(req.params.id);
  res.render('vendors/updateVendor', { title: 'Update Vendor', vendor });
}

async function updateVendor(req, res) {
  await vendors.updateVendor(req.params.id, req.body);
  res.json({ redirect: '/vendors' });
}

async function deleteVendor(req, res) {
  await vendors.deleteVendor(req.params.id);
  res.json({ redirect: '/vendors' });
}

async function getAddProductForm(req, res) {
  const vendor = await vendors.getVendor(req.params.id);
  const products = await vendors.getProductsNotInVendor(req.params.id);
  res.render('vendors/addProduct', { title: 'Add Product to Vendor', vendor, products });
}

async function addProductToVendor(req, res) {
  await vendors.addProductToVendor(req.params.id, req.body);
  res.redirect(`/vendors`);
}

async function getAdjustStockForm(req, res) {
  const vendor = await vendors.getVendor(req.params.id);
  const products = await vendors.getVendorProducts(req.params.id);
  res.render('vendors/adjustStock', { title: 'Adjust Stock', vendor, products });
}

async function adjustStock(req, res) {
  await vendors.adjustStock(req.params.id, req.body);
  res.redirect(`/vendors`);
}

module.exports = {
  getVendorsPage,
  getVendorsForm,
  createVendor,
  getVendorsUpdateForm,
  updateVendor,
  deleteVendor,
  getAddProductForm,
  addProductToVendor,
  getAdjustStockForm,
  adjustStock,
};
