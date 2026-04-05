const pool = require('../config/database');

async function findAll() {
  const { rows } = await pool.query(
    `SELECT
            stock_movements.id,
            stock_movements.type,
            stock_movements.quantity,
            stock_movements.note,
            stock_movements.created_at,
            products.name  AS product,
            vendors.name   AS vendor
         FROM stock_movements
         JOIN products ON stock_movements.product_id = products.id
         LEFT JOIN vendors ON stock_movements.vendor_id = vendors.id
         ORDER BY stock_movements.created_at DESC`,
  );

  return rows;
}

async function find(searchText) {
  const { rows } = await pool.query(
    `SELECT
        stock_movements.id,
        stock_movements.type,
        stock_movements.quantity,
        stock_movements.note,
        stock_movements.created_at,
        products.name AS product,
        vendors.name  AS vendor
     FROM stock_movements
     JOIN products ON stock_movements.product_id = products.id
     LEFT JOIN vendors ON stock_movements.vendor_id = vendors.id
     WHERE stock_movements.type::text ILIKE $1
        OR products.name ILIKE $1
        OR vendors.name  ILIKE $1
        OR stock_movements.id::text = $2
     ORDER BY stock_movements.created_at DESC`,
    [`%${searchText}%`, searchText],
  );

  return rows;
}

async function create({ product_id, vendor_id, type, quantity, note }) {
  const { rows } = await pool.query(
    `INSERT INTO stock_movements (product_id, vendor_id, type, quantity, note)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
    [product_id, vendor_id, type, quantity, note],
  );
  return rows[0];
}

module.exports = {
  findAll,
  find,
  create,
};
