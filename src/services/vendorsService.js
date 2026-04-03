const pool = require('../db/pool');

async function getAllVendors() {
  const { rows } = await pool.query('SELECT name, address FROM vendors');
  return rows;
}

async function addVendor({ name, location }) {
  const result = await pool.query(
    `INSERT INTO vendors (name, location)
         VALUES ($1, $2)
         RETURNING *`,
    [name, location],
  );

  return result.rows[0];
}

async function updateVendor(id, { name, location }) {
  const result = await pool.query(
    `UPDATE vendors
         SET name     = $1,
             location = $2
         WHERE id = $3
         RETURNING *`,
    [name, location, id],
  );

  return result.rows[0];
}

async function deleteVendor(id) {
  await pool.query(`DELETE FROM vendor_products WHERE vendor_id = $1`, [id]);

  await pool.query(
    `UPDATE stock_movements
         SET vendor_id = NULL
         WHERE vendor_id = $1`,
    [id],
  );

  const result = await pool.query(`DELETE FROM vendors WHERE id = $1 RETURNING *`, [id]);

  return result.rows[0];
}

async function addProductToVendor(vendor_id, { product_id, unit_cost }) {
  const result = await pool.query(
    `INSERT INTO vendor_products (product_id, vendor_id, unit_cost)
         VALUES ($1, $2, $3)`,
    [product_id, vendor_id, unit_cost],
  );

  return result.rows[0];
}
module.exports = {
  getAllVendors,
  addVendor,
  updateVendor,
  deleteVendor,
};
