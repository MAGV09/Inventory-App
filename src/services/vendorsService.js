const pool = require('../db/pool');
const createError = require('http-errors');
const products = require('./productsService');
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
  const { rows } = await pool.query(`DELETE FROM vendors WHERE id = $1 RETURNING *`, [id]);
  return rows[0];
}

async function addProductToVendor(vendor_id, { product_id, unit_cost, type, quantity, note }) {
  const product = await products.getProduct(product_id);
  if (!product) {
    throw createError(404, `Couldn't find product`);
  }
  const stock_movement = await stock_movements.addStock_movement({
    vendor_id,
    product_id,
    type,
    quantity,
    note,
  });
  const result = await pool.query(
    `INSERT INTO vendor_products (product_id, vendor_id, unit_cost)
         VALUES ($1, $2, $3)`,
    [product_id, vendor_id, unit_cost],
  );

  return result.rows[0];
}

module.exports = {
  getAllVendors,
  getVendor,
  addVendor,
  updateVendor,
  deleteVendor,
};
