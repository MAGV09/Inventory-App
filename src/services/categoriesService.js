const pool = require('../db/pool');

async function getAllCategories() {
  const result = await pool.query(
    `SELECT * FROM categories
         ORDER BY name ASC`,
  );

  return result.rows;
}

async function addCategory({ name }) {
  const result = await pool.query(
    `INSERT INTO categories (name)
         VALUES ($1)
         RETURNING *`,
    [name],
  );

  return result.rows[0];
}

async function updateCategory(id, { name }) {
  const result = await pool.query(
    `UPDATE categories
         SET name = $1
         WHERE id = $2
         RETURNING *`,
    [name, id],
  );

  return result.rows[0];
}

module.exports = {
  getAllCategories,
  addCategory,
  updateCategory,
};
