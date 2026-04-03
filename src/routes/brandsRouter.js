const { Router } = require('express');
const brandsRouter = Router();
const {
  getBrandsPage,
  deleteBrand,
  getBrandsForm,
  createBrand,
  updateBrand,
  getBrandsUpdateForm,
} = require('../controllers/brandController');
brandsRouter.get('/', getBrandsPage);
brandsRouter.get('/create', getBrandsForm);
brandsRouter.post('/create', createBrand);
brandsRouter.get('/:id/update', getBrandsUpdateForm);
brandsRouter.patch('/:id/update', updateBrand);
brandsRouter.delete('/:id/delete', deleteBrand);

module.exports = brandsRouter;
