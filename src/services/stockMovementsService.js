const pool = require('../config/database');
const StockMovment = require('../models/StockMovement');

async function addStock_movement({ product_id, vendor_id, type, quantity, note }) {
  const stockMovement = await StockMovment.create({ product_id, vendor_id, type, quantity, note });

  //update product stock quantity based on stock movement
  await pool.query(
    `UPDATE products
         SET stock_qty = stock_qty + $1
         WHERE id = $2`,
    [type === 'restock' ? quantity : -quantity, product_id],
  );

  return stockMovement;
}

module.exports = {
  addStock_movement,
};
