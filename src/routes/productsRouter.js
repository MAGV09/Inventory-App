const { Router } = require('express');
const productsRouter = Router();
const {
  getProductsPage,
  getCreateProductForm,
  createProduct,
  getUpdateProductForm,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require('../controllers/productsController');

productsRouter.get('/', getProductsPage);
productsRouter.get('/create', getCreateProductForm);
productsRouter.post('/create', createProduct);
productsRouter.get('/update/:id', getUpdateProductForm);
productsRouter.patch('/update/:id', updateProduct);
productsRouter.delete('/delete/:id', deleteProduct);
productsRouter.get('/details/:id', getProductDetails);
module.exports = productsRouter;
