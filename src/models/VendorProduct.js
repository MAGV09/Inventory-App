const pool = require('../config/database');

//getVendorProduct
async function findByVendorAndProduct(vendor_id, product_id) {
  const { rows } = await pool.query(
    `SELECT * FROM vendor_products
         WHERE vendor_id = $1 AND product_id = $2`,
    [vendor_id, product_id],
  );

  // if (rows.length === 0) {
  //   throw createError(404, 'Vendor product not found');
  // }

  return rows[0];
}

//getVendorProducts
async function findByVendor(vendor_id) {
  const { rows } = await pool.query(
    `SELECT products.id, products.name, vendor_products.unit_cost
         FROM products
         JOIN vendor_products ON products.id = vendor_products.product_id
         WHERE vendor_products.vendor_id = $1`,
    [vendor_id],
  );

  return rows;
}

//getVendorsByProduct
async function findByProduct(product_id) {
  const { rows } = await pool.query(
    `SELECT vendors.id, vendors.name, vendors.location, vendor_products.unit_cost
         FROM vendors
         JOIN vendor_products ON vendors.id = vendor_products.vendor_id
         WHERE vendor_products.product_id = $1`,
    [product_id],
  );
  return rows;
}

//getProductsNotInVendor
async function findExcludingVendor(vendor_id) {
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

async function create({ product_id, vendor_id, unit_cost }) {
  const { rows } = await pool.query(
    `INSERT INTO vendor_products (product_id, vendor_id, unit_cost)
         VALUES ($1, $2, $3)
         RETURNING *`,
    [product_id, vendor_id, unit_cost],
  );
  return rows[0];
}

async function deleteByVendor(vendor_id) {
  await pool.query(`DELETE FROM vendor_products WHERE vendor_id = $1`, [vendor_id]);
}

async function deleteByProduct(product_id) {
  await pool.query(`DELETE FROM vendor_products WHERE product_id = $1`, [product_id]);
}

module.exports = {
  findByVendorAndProduct,
  findByVendor,
  findByProduct,
  findExcludingVendor,
  create,
  deleteByVendor,
  deleteByProduct,
};
