const StockMovement = require('../models/StockMovement');
const Product = require('../models/Product');

async function addStock_movement({ product_id, vendor_id, type, quantity, note }) {
  const stockMovement = await StockMovement.create({ product_id, vendor_id, type, quantity, note });

  //update product stock quantity based on stock movement
  const amount = type === 'restock' ? quantity : -quantity;
  await Product.adjustStock(product_id, amount);

  return stockMovement;
}

module.exports = {
  addStock_movement,
};
