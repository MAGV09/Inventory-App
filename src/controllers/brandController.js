const brands = require('../services/brandsService');

async function getBrandsPage(req, res) {
  const brandsList = await brands.getAllBrands();
  res.render('brands/brands', { title: 'Brands Page', brandsList });
}

async function getBrandsForm(req, res) {
  res.render('brands/createBrand', { title: 'Create Brand' });
}

async function createBrand(req, res) {
  await brands.addBrand(req.body);
  res.redirect('/brands');
}

async function getBrandsUpdateForm(req, res) {
  const brand = await brands.getBrand(req.params.id);
  res.render('brands/updateBrand', { title: 'update Brand', brand });
}

async function updateBrand(req, res) {
  await brands.updateBrand(req.params.id, req.body);
  res.json({ redirect: '/brands' });
}
async function deleteBrand(req, res) {
  await brands.deleteBrand(req.params.id);
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
