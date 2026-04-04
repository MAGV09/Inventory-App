const stockMovements = require('../services/stockMovementsService');
const products = require('../services/productsService');
const vendors = require('../services/vendorsService');

async function getStockMovementsPage(req, res) {
  const stockMovementsList = await stockMovements.getAllStock_movements();
  res.render('stockMovements/stockMovements', { title: 'Stock Movements', stockMovementsList });
}

async function getStockMovementsForm(req, res) {
  const [productsList, vendorsList] = await Promise.all([
    products.getAllProducts(),
    vendors.getAllVendors(),
  ]);
  res.render('stockMovements/createStockMovement', {
    title: 'Create Stock Movement',
    productsList,
    vendorsList,
  });
}

async function createStockMovement(req, res) {
  await stockMovements.addStock_movement(req.body);
  res.redirect('/stock-movements');
}

module.exports = {
  getStockMovementsPage,
  getStockMovementsForm,
  createStockMovement,
};
