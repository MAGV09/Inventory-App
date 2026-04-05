const pool = require('../config/database');
const Product = require('../models/Product');
const createError = require('http-errors');

async function getAllProducts(searchText) {
  const products = searchText ? await Product.find(searchText) : await Product.findAll();
  return products;
}

async function deleteProduct(id) {
  const product = await Product.findById(id);
  if (!product) {
    throw createError(404, 'Product not found');
  }
  //remove foreign keys constrain
  await pool.query(`DELETE FROM vendor_products WHERE product_id = $1`, [id]);

  await pool.query(`DELETE FROM stock_movements WHERE product_id = $1`, [id]);

  const result = await pool.query(`DELETE FROM products WHERE id = $1 RETURNING *`, [id]);

  if (result.rows.length === 0) {
    throw createError(404, 'Delete Failed');
  }
  return result.rows[0];
}

async function addProduct({ name, category_id, brand_id, vendor_id, unit_cost }) {
  const product = await Product.create({ name, category_id, brand_id });

  await pool.query(
    `INSERT INTO vendor_products (product_id, vendor_id, unit_cost)
         VALUES ($1, $2, $3)`,
    [product.id, vendor_id, unit_cost],
  );

  return product;
}

module.exports = {
  getAllProducts,
  addProduct,
  deleteProduct,
};
