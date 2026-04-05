const VendorService = require('../services/VendorService');
const Vendor = require('../models/Vendor');
const VendorProduct = require('../models/VendorProduct');

async function getVendorsPage(req, res) {
  const vendors = await Vendor.findAll();
  res.render('vendors/vendors', { title: 'Vendors Page', vendors });
}

async function getVendorsForm(req, res) {
  res.render('vendors/createVendor', { title: 'Create Vendor' });
}

async function createVendor(req, res) {
  await Vendor.create(req.body);
  res.redirect('/vendors');
}

async function getVendorsUpdateForm(req, res) {
  const id = req.params.id;
  const vendor = await Vendor.findById(id);
  res.render('vendors/updateVendor', { title: 'Update Vendor', vendor });
}

async function updateVendor(req, res) {
  const id = req.params.id;
  await Vendor.update(id, req.body);
  res.json({ redirect: '/vendors' });
}

async function deleteVendor(req, res) {
  const id = req.params.id;
  await VendorService.deleteVendor(id);
  res.json({ redirect: '/vendors' });
}

async function getAddProductForm(req, res) {
  const id = req.params.id;
  const vendor = await Vendor.findById(id);
  const products = await VendorProduct.findExcludingVendor(id);
  res.render('vendors/addProduct', { title: 'Add Product to Vendor', vendor, products });
}

async function addProductToVendor(req, res) {
  const id = req.params.id;
  await VendorService.addProductToVendor(id, req.body);
  res.redirect(`/vendors`);
}

async function getAdjustStockForm(req, res) {
  const id = req.params.id;
  const vendor = await Vendor.findById(id);
  const products = await VendorProduct.findByVendor(id);
  res.render('vendors/adjustStock', { title: 'Adjust Stock', vendor, products });
}

async function adjustStock(req, res) {
  const id = req.params.id;
  await VendorService.adjustStock(id, req.body);
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
