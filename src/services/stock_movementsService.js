const pool = require('../db/pool');

async function getAllStock_movements() {
  const result = await pool.query(
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

  return result.rows;
}

async function addStock_movement({ product_id, vendor_id, type, quantity, note }) {
  const result = await pool.query(
    `INSERT INTO stock_movements (product_id, vendor_id, type, quantity, note)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
    [product_id, vendor_id, type, quantity, note],
  );

  await pool.query(
    `UPDATE products
         SET stock_qty = stock_qty + $1
         WHERE id = $2`,
    [type === 'restock' ? quantity : -quantity, product_id],
  );

  return result.rows[0];
}

module.exports = {
  getAllStock_movements,
  addStock_movement,
};
