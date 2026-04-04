const { Router } = require('express');
const vendorsRouter = Router();
const {
  getVendorsPage,
  getVendorsForm,
  createVendor,
  getVendorsUpdateForm,
  updateVendor,
  deleteVendor,
} = require('../controllers/vendorsController');

vendorsRouter.get('/', getVendorsPage);
vendorsRouter.get('/create', getVendorsForm);
vendorsRouter.post('/create', createVendor);
vendorsRouter.get('/:id/update', getVendorsUpdateForm);
vendorsRouter.patch('/:id/update', updateVendor);
vendorsRouter.delete('/:id/delete', deleteVendor);

module.exports = vendorsRouter;
