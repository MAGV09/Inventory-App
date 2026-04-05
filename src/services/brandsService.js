const pool = require('../config/database');
const Brand = require('../models/Brand');
const createError = require('http-errors');

async function deleteBrand(id) {
  const brand = await Brand.findById(id);

  if (!brand) {
    throw createError(404, 'Brand not found');
  }

  if (brand.name.toLowerCase() === 'generic') {
    throw createError(400, 'Cannot delete generic');
  }

  let generic = await Brand.find('Generic');

  if (!generic) {
    generic = await Brand.create({ name: 'Generic' });
  }

  const genericId = generic.id;

  await pool.query(`UPDATE products SET brand_id = $1 WHERE brand_id = $2`, [genericId, id]);

  const deletedBrand = await Brand.deleteById(id);

  return deletedBrand;
}

module.exports = {
  deleteBrand,
};
