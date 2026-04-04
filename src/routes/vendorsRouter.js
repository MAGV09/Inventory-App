const { Router } = require('express');
const vendorsRouter = Router();
const {
  getVendorsPage,
  getVendorsForm,
  createVendor,
  getVendorsUpdateForm,
  updateVendor,
  deleteVendor,
  getAddProductForm,
  addProductToVendor,
  getAdjustStockForm,
  adjustStock,
} = require('../controllers/vendorsController');

vendorsRouter.get('/', getVendorsPage);
vendorsRouter.get('/create', getVendorsForm);
vendorsRouter.post('/create', createVendor);
vendorsRouter.get('/:id/update', getVendorsUpdateForm);
vendorsRouter.patch('/:id/update', updateVendor);
vendorsRouter.delete('/:id/delete', deleteVendor);
vendorsRouter.get('/:id/add-product', getAddProductForm);
vendorsRouter.post('/:id/add-product', addProductToVendor);
vendorsRouter.get('/:id/adjust-stock', getAdjustStockForm);
vendorsRouter.post('/:id/adjust-stock', adjustStock);

module.exports = vendorsRouter;
