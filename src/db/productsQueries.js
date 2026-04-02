const pool = require('../db/pool');

async function getAllProducts() {
  const { rows } = await pool.query(`
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
    GROUP BY products.name, categories.name, brands.name, products.stock_qty
`);
  return rows;
}

async function addProduct(name, category_id, brand_id) {
  const result = await pool.query(
    `INSERT INTO products (name, category_id, brand_id, stock_qty)
     VALUES ($1, $2, $3, 0)
     RETURNING id`,
    [name, category_id, brand_id],
  );
  const productId = result.rows[0].id;
  return productId; //needed for the vendor_product table.
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
  await pool.query(`DELETE FROM vendor_products WHERE product_id = $1`, [id]);

  await pool.query(`DELETE FROM stock_movements WHERE product_id = $1`, [id]);

  const result = await pool.query(`DELETE FROM products WHERE id = $1 RETURNING *`, [id]);

  return result.rows[0];
}

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
