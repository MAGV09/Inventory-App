const pool = require('../config/database');

async function findAll() {
  const { rows } = await pool.query(
    `SELECT * FROM vendors
     ORDER BY name ASC`,
  );
  return rows;
}

//getVendor
async function findById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM vendors
     WHERE id=$1`,
    [id],
  );
  return rows[0];
}

//addVendor
async function create({ name, location }) {
  const { rows } = await pool.query(
    `INSERT INTO vendors (name,location)
     VALUES ($1,$2)
     RETURNING *`,
    [name, location],
  );
  return rows[0];
}

//update vendor
async function update(id, { name, location }) {
  const { rows } = await pool.query(
    `UPDATE vendors
     SET name = $1,
     location = $2
     WHERE id = $3
     RETURNING *`,
    [name, location, id],
  );
  return rows[0];
}

//deleteVendor
async function deleteById(id) {
  const { rows } = await pool.query(`DELETE FROM vendors WHERE id = $1 RETURNING *`, [id]);
  return rows[0];
}

//moved getVendorProduct to VendorProduct model

//moved getVendorProducts to VendorProduct model

//moved getProductsNotInVendor to VendorProduct model

//adjustStock belongs in service

//addProductToVendor belongs in service

//getVendorsByProduct moved to VendorProduct

module.exports = {
  findAll,
  findById,
  create,
  update,
  deleteById,
};
