const BrandService = require('../services/BrandService');
const Brand = require('../models/Brand');
const createError = require('http-errors');

async function getBrandsPage(req, res) {
  const brands = await Brand.findAll();
  res.render('brands/brands', { title: 'Brands Page', brands });
}

async function getBrandsForm(req, res) {
  res.render('brands/createBrand', { title: 'Create Brand' });
}

async function createBrand(req, res) {
  await Brand.create(req.body);
  res.redirect('/brands');
}

async function getBrandsUpdateForm(req, res) {
  const id = req.params.id;
  const brand = await Brand.findById(id);
  res.render('brands/updateBrand', { title: 'update Brand', brand });
}

async function updateBrand(req, res) {
  const id = req.params.id;
  const brand = await Brand.findById(id);
  if (!brand) {
    throw createError(404, 'Brand not Found');
  }
  await Brand.update(id, req.body);
  res.json({ redirect: '/brands' });
}
async function deleteBrand(req, res) {
  const id = req.params.id;
  await BrandService.deleteBrand(id);
  res.json({ redirect: '/brands' });
}
module.exports = {
  getBrandsPage,
  getBrandsForm,
  deleteBrand,
  createBrand,
  updateBrand,
  getBrandsUpdateForm,
};
