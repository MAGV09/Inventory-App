const StockMovementService = require('./StockMovementService');
const Vendor = require('../models/Vendor');
const VendorProduct = require('../models/VendorProduct');
const StockMovement = require('../models/StockMovement');
const createError = require('http-errors');

async function deleteVendor(id) {
  const vendor = await Vendor.findById(id);
  if (!vendor) {
    throw createError(404, 'Vendor not found');
  }
  //remove foreign key constrain
  await VendorProduct.deleteByVendor(id);
  await StockMovement.nullifyVendor(id);

  //delete vendor
  const deletedVendor = await Vendor.deleteById(id);
  return deletedVendor;
}

async function adjustStock(vendor_id, { product_id, type, quantity, note }) {
  const vendorProduct = await VendorProduct.findByVendorAndProduct(vendor_id, product_id);
  if (!vendorProduct) {
    throw createError(404, 'Vendor does not sell this product');
  }
  const adjustedStock = await StockMovementService.addStock_movement({
    vendor_id,
    product_id,
    type,
    quantity,
    note,
  });

  return adjustedStock;
}

async function addProductToVendor(vendor_id, { product_id, unit_cost }) {
  const existingProduct = await VendorProduct.findByVendorAndProduct(vendor_id, product_id);

  if (existingProduct) {
    throw createError(400, 'Vendor already sells this product');
  }
  const product = await VendorProduct.create({ vendor_id, product_id, unit_cost });
  return product;
}

module.exports = {
  deleteVendor,
  addProductToVendor,
  adjustStock,
};
