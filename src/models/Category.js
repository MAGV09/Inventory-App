const pool = require('../config/database');

async function findAll() {
  const { rows } = await pool.query(`SELECT * FROM categories ORDER BY name ASC`);
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(`SELECT * FROM categories WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

async function find(searchText) {
  const { rows } = await pool.query(
    `SELECT * FROM categories WHERE id::text = $1 OR name ILIKE $2`,
    [searchText, `%${searchText}%`],
  );
  return rows[0];
}

async function create({ name }) {
  const { rows } = await pool.query(`INSERT INTO categories (name) VALUES ($1) RETURNING *`, [
    name,
  ]);
  return rows[0];
}

async function update(id, { name }) {
  const { rows } = await pool.query(`UPDATE categories SET name = $1 WHERE id = $2 RETURNING *`, [
    name,
    id,
  ]);
  return rows[0] ?? null;
}

async function deleteById(id) {
  const { rows } = await pool.query(`DELETE FROM categories WHERE id = $1 RETURNING *`, [id]);
  return rows[0] ?? null;
}

module.exports = { findAll, findById, find, create, update, deleteById };
