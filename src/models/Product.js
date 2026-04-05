const pool = require('../config/database');
// const createError = require('http-errors');
async function findAll() {
  const { rows } = await pool.query(`
    SELECT 
        products.id,   
        products.name,
        categories.name  AS category,
        brands.name      AS brand,
        products.stock_qty,
        MIN(vendor_products.unit_cost) AS starting_price
    FROM products
    JOIN categories     ON products.category_id = categories.id
    JOIN brands         ON products.brand_id = brands.id
    JOIN vendor_products ON products.id = vendor_products.product_id
    GROUP BY products.name, categories.name, brands.name, products.stock_qty,products.id
`);

  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT 
        products.id,
        products.name,
        categories.name  AS category,
        brands.name      AS brand,
        products.stock_qty,
        MIN(vendor_products.unit_cost) AS starting_price
     FROM products
     JOIN categories      ON products.category_id = categories.id
     JOIN brands          ON products.brand_id = brands.id
     JOIN vendor_products ON products.id = vendor_products.product_id
     WHERE products.id = $1
     GROUP BY products.id, products.name, categories.name, brands.name, products.stock_qty`,
    [id],
  );
  return rows[0];
}

async function find(searchText) {
  const { rows } = await pool.query(
    `SELECT 
        products.id,
        products.name,
        categories.name  AS category,
        brands.name      AS brand,
        products.stock_qty,
        MIN(vendor_products.unit_cost) AS starting_price
     FROM products
     JOIN categories      ON products.category_id = categories.id
     JOIN brands          ON products.brand_id = brands.id
     JOIN vendor_products ON products.id = vendor_products.product_id
     WHERE products.id::text = $1
        OR products.name   ILIKE $2
        OR brands.name     ILIKE $2
        OR categories.name ILIKE $2
     GROUP BY products.id, products.name, categories.name, brands.name, products.stock_qty`,
    [searchText, `%${searchText}%`],
  );

  if (rows.length === 0) {
    return null;
  }

  return rows;
}

async function create({ name, category_id, brand_id }) {
  const { rows } = await pool.query(
    `INSERT INTO products (name, category_id, brand_id, stock_qty)
         VALUES ($1, $2, $3, 0)
         RETURNING *`,
    [name, category_id, brand_id],
  );

  return rows[0];
}

async function update(id, { name, category_id, brand_id }) {
  const { rows } = await pool.query(
    `UPDATE products
         SET name        = $1,
             category_id = $2,
             brand_id    = $3
         WHERE id = $4
         RETURNING *`,
    [name, category_id, brand_id, id],
  );

  // if (result.rows.length === 0) {
  //   throw createError(404, 'Product not found');
  // }

  return rows[0];
}

async function deleteById(id) {
  const { rows } = await pool.query(`DELETE FROM products WHERE id = $1 RETURNING *`, [id]);
  return rows[0];
}
async function adjustStock(product_id, amount) {
  await pool.query(`UPDATE products SET stock_qty = stock_qty + $1 WHERE id = $2`, [
    amount,
    product_id,
  ]);
}

async function updateBrand(oldBrandId, newBrandId) {
  await pool.query(`UPDATE products SET brand_id = $1 WHERE brand_id = $2`, [
    newBrandId,
    oldBrandId,
  ]);
}

async function updateCategory(oldCategoryId, newCategoryId) {
  await pool.query(`UPDATE products SET category_id = $1 WHERE category_id = $2`, [
    newCategoryId,
    oldCategoryId,
  ]);
}

module.exports = {
  findAll,
  findById,
  find,
  create,
  update,
  deleteById,
  adjustStock,
  updateBrand,
  updateCategory,
};
