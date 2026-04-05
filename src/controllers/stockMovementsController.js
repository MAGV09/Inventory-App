const StockMovementService = require('../services/stockMovementsService');
const StockMovement = require('../models/StockMovement');
const Product = require('../models/Product');
const vendors = require('../services/vendorsService');

async function getStockMovementsPage(req, res) {
  const stockMovements = await StockMovement.findAll();
  res.render('stockMovements/stockMovements', { title: 'Stock Movements', stockMovements });
}

async function getStockMovementsForm(req, res) {
  const [products, vendorsList] = await Promise.all([Product.findAll(), vendors.getAllVendors()]);
  res.render('stockMovements/createStockMovement', {
    title: 'Create Stock Movement',
    products,
    vendorsList,
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
