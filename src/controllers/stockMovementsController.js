const StockMovementService = require('../services/stockMovementsService');
const StockMovement = require('../models/StockMovement');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

async function getStockMovementsPage(req, res) {
  const stockMovements = await StockMovement.findAll();
  res.render('stockMovements/stockMovements', { title: 'Stock Movements', stockMovements });
}

async function getStockMovementsForm(req, res) {
  const [products, vendors] = await Promise.all([Product.findAll(), Vendor.findAll()]);
  res.render('stockMovements/createStockMovement', {
    title: 'Create Stock Movement',
    products,
    vendors,
  });
}

async function createStockMovement(req, res) {
  await StockMovementService.addStock_movement(req.body);
  res.redirect('/stock-movements');
}

module.exports = {
  getStockMovementsPage,
  getStockMovementsForm,
  createStockMovement,
};
