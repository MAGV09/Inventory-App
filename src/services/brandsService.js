const pool = require('../db/pool');
const createError = require('http-errors');

async function getAllBrands() {
  const result = await pool.query(
    `SELECT * FROM brands
         ORDER BY name ASC`,
  );

  return result.rows;
}
async function getBrand(id) {
  const result = await pool.query(
    `SELECT * FROM brands
         WHERE id=$1`,
    [id],
  );

  return result.rows[0];
}

async function addBrand({ name }) {
  const result = await pool.query(
    `INSERT INTO brands (name)
         VALUES ($1)
         RETURNING *`,
    [name],
  );

  return result.rows[0];
}

async function updateBrand(id, { name }) {
  const result = await pool.query(
    `UPDATE brands
         SET name = $1
         WHERE id = $2
         RETURNING *`,
    [name, id],
  );

  return result.rows[0];
}

async function deleteBrand(id) {
  const brand = await getBrand(id);

  if (!brand) {
    throw createError(404, 'Brand not found');
  }

  if (brand.name.toLowerCase() === 'generic') {
    throw createError(400, 'Cannot delete generic');
  }

  let generic = await pool.query(`SELECT id FROM brands WHERE name = 'Generic'`);

  if (generic.rows.length === 0) {
    generic = await pool.query(`INSERT INTO brands (name) VALUES ('Generic') RETURNING id`);
  }

  const genericId = generic.rows[0].id;

  await pool.query(`UPDATE products SET brand_id = $1 WHERE brand_id = $2`, [genericId, id]);

  const result = await pool.query(`DELETE FROM brands WHERE id = $1 RETURNING *`, [id]);

  return result.rows[0];
}

module.exports = {
  getAllBrands,
  getBrand,
  addBrand,
  updateBrand,
  deleteBrand,
};
