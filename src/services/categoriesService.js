const pool = require('../config/database');
const createError = require('http-errors');
async function getAllCategories() {
  const result = await pool.query(
    `SELECT * FROM categories
         ORDER BY name ASC`,
  );

  return result.rows;
}

async function getCategory(id) {
  const result = await pool.query(
    `SELECT * FROM categories
     WHERE id=$1`,
    [id],
  );
  return result.rows[0];
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

async function deleteCategory(id) {
  const category = await getCategory(id);

  if (!category) {
    throw createError(404, 'Category not found');
  }

  if (category.name.toLowerCase() === 'uncategorized') {
    throw createError(400, 'Cannot delete Uncategorized');
  }

  let uncategorized = await pool.query(`SELECT id FROM categories WHERE name = 'Uncategorized'`);

  if (uncategorized.rows.length === 0) {
    uncategorized = await pool.query(
      `INSERT INTO categories (name) VALUES ('Uncategorized') RETURNING id`,
    );
  }

  const uncategorizedId = uncategorized.rows[0].id;

  await pool.query(`UPDATE products SET category_id = $1 WHERE category_id = $2`, [
    uncategorizedId,
    id,
  ]);

  const result = await pool.query(`DELETE FROM categories WHERE id = $1 RETURNING *`, [id]);

  return result.rows[0];
}

module.exports = {
  getAllCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
};
