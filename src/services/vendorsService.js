const pool = require('../config/database');
const createError = require('http-errors');
const stock_movements = require('./stockMovementsService');

async function getAllVendors() {
  const result = await pool.query(
    `SELECT * FROM vendors
     ORDER BY name ASC`,
  );
  return result.rows;
}

async function getVendor(id) {
  const result = await pool.query(
    `SELECT * FROM vendors
     WHERE id=$1`,
    [id],
  );
  return result.rows[0];
}

async function addVendor({ name, location }) {
  const result = await pool.query(
    `INSERT INTO vendors (name,location)
     VALUES ($1,$2)
     RETURNING *`,
    [name, location],
  );
  return result.rows[0];
}

async function updateVendor(id, { name, location }) {
  const result = await pool.query(
    `UPDATE vendors
     SET name = $1,
     location = $2
     WHERE id = $3
     RETURNING *`,
    [name, location, id],
  );
  return result.rows[0];
}

async function deleteVendor(id) {
  const vendor = await getVendor(id);
  if (!vendor) throw createError(404, 'Vendor not found');

  await pool.query(`DELETE FROM vendor_products WHERE vendor_id = $1`, [id]);
  await pool.query(`UPDATE stock_movements SET vendor_id = NULL WHERE vendor_id = $1`, [id]);
  const { rows } = await pool.query(`DELETE FROM vendors WHERE id = $1 RETURNING *`, [id]);
  return rows[0];
}

async function getVendorProduct(vendor_id, product_id) {
  const { rows } = await pool.query(
    `SELECT * FROM vendor_products
         WHERE vendor_id = $1 AND product_id = $2`,
    [vendor_id, product_id],
  );

  if (rows.length === 0) {
    throw createError(404, 'Vendor product not found');
  }

  return rows[0];
}

async function getVendorProducts(vendor_id) {
  const { rows } = await pool.query(
    `SELECT products.id, products.name, vendor_products.unit_cost
         FROM products
         JOIN vendor_products ON products.id = vendor_products.product_id
         WHERE vendor_products.vendor_id = $1`,
    [vendor_id],
  );

  return rows;
}

async function getProductsNotInVendor(vendor_id) {
  const { rows } = await pool.query(
    `SELECT products.id, products.name
         FROM products
         WHERE products.id NOT IN (
             SELECT product_id FROM vendor_products WHERE vendor_id = $1
         )`,
    [vendor_id],
  );

  return rows;
}

async function adjustStock(vendor_id, { product_id, unit_cost, type, quantity, note }) {
  await getVendorProduct(vendor_id, product_id);
  const result = await stock_movements.addStock_movement({
    vendor_id,
    product_id,
    type,
    quantity,
    note,
  });

  return result;
}
async function addProductToVendor(vendor_id, { product_id, unit_cost }) {
  const existing = await pool.query(
    `SELECT * FROM vendor_products WHERE vendor_id = $1 AND product_id = $2`,
    [vendor_id, product_id],
  );

  if (existing.rows.length > 0) {
    throw createError(400, 'Vendor already sells this product');
  }

  const { rows } = await pool.query(
    `INSERT INTO vendor_products (product_id, vendor_id, unit_cost)
         VALUES ($1, $2, $3)
         RETURNING *`,
    [product_id, vendor_id, unit_cost],
  );

  return rows[0];
}

async function getVendorsByProduct(product_id) {
  const { rows } = await pool.query(
    `SELECT vendors.id, vendors.name, vendors.location, vendor_products.unit_cost
         FROM vendors
         JOIN vendor_products ON vendors.id = vendor_products.vendor_id
         WHERE vendor_products.product_id = $1`,
    [product_id],
  );
  return rows;
}
module.exports = {
  getAllVendors,
  getVendor,
  addVendor,
  updateVendor,
  deleteVendor,
  addProductToVendor,
  adjustStock,
  getVendorProduct,
  getProductsNotInVendor,
  getVendorProducts,
  getVendorsByProduct,
};
