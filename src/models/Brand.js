const pool = require('../config/database');

async function findAll() {
  const { rows } = await pool.query(
    `SELECT * FROM brands
         ORDER BY name ASC`,
  );

  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM brands
         WHERE id=$1`,
    [id],
  );

  return rows[0];
}

async function find(searchText) {
  const { rows } = await pool.query(
    `SELECT * FROM brands
     WHERE id::text = $1 OR name ILIKE $2`,
    [searchText, `%${searchText}%`],
  );

  return rows[0];
}

async function create({ name }) {
  const { rows } = await pool.query(
    `INSERT INTO brands (name)
         VALUES ($1)
         RETURNING *`,
    [name],
  );

  return rows[0];
}

async function update(id, { name }) {
  const { rows } = await pool.query(
    `UPDATE brands
         SET name = $1
         WHERE id = $2
         RETURNING *`,
    [name, id],
  );

  return rows[0];
}

async function deleteById(id) {
  const { rows } = await pool.query(`DELETE FROM brands WHERE id = $1 RETURNING *`, [id]);
  return rows[0];
}

module.exports = {
  findAll,
  findById,
  find,
  create,
  update,
  deleteById,
};
