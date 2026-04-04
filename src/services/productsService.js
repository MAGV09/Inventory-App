const pool = require('../db/pool');
const createError = require('http-errors');

async function getAllProducts() {
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
async function getProduct(searchParam) {
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
    [searchParam, `%${searchParam}%`],
  );

  if (rows.length === 0) {
    return null;
  }

  return rows;
}

async function getProductDetails(id) {
  const { rows } = await pool.query(
    `
    SELECT 
        products.name,
        categories.name  AS category,
        brands.name      AS brand,
        products.stock_qty,
        MIN(vendor_products.unit_cost) AS starting_price
    FROM products
    JOIN categories     ON products.category_id = categories.id
    JOIN brands         ON products.brand_id = brands.id
    JOIN vendor_products ON products.id = vendor_products.product_id
    WHERE products.id=$1
    GROUP BY products.name, categories.name, brands.name, products.stock_qty
`,
    [id],
  );

  if (rows.length === 0) {
    throw createError(404, 'Failed to get Product details');
  }
  return rows[0];
}

async function updateProduct(id, { name, category_id, brand_id, vendor_id, unit_cost }) {
  const result = await pool.query(
    `UPDATE products
         SET name        = $1,
             category_id = $2,
             brand_id    = $3
         WHERE id = $4
         RETURNING *`,
    [name, category_id, brand_id, id],
  );

  if (result.rows.length === 0) {
    throw createError(404, 'Update Failed');
  }
  // update the vendor cost if provided
  if (vendor_id && unit_cost) {
    await pool.query(
      `UPDATE vendor_products
             SET unit_cost = $1
             WHERE product_id = $2 AND vendor_id = $3`,
      [unit_cost, id, vendor_id],
    );
  }

  return result.rows[0];
}

async function deleteProduct(id) {
  const product = await pool.query(`SELECT id FROM products WHERE id = $1`, [id]); //check if the product exists first
  if (product.rows.length === 0) {
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

async function addProduct({ name, category_id, brand_id }) {
  const result = await pool.query(
    `INSERT INTO products (name, category_id, brand_id, stock_qty)
         VALUES ($1, $2, $3, 0)
         RETURNING *`,
    [name, category_id, brand_id],
  );

  const product = result.rows[0];

  return product;
}

module.exports = {
  getAllProducts,
  getProduct,
  getProductDetails,
  addProduct,
  updateProduct,
  deleteProduct,
};
