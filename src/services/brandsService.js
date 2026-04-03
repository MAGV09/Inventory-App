const pool = require('../db/pool');

async function getAllBrands() {
  const result = await pool.query(
    `SELECT * FROM brands
         ORDER BY name ASC`,
  );

  return result.rows;
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

module.exports = {
  getAllBrands,
  addBrand,
  updateBrand,
};
