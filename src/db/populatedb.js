#! /usr/bin/env node
const { Client } = require('pg');

const SQL = `
-- Categories
INSERT INTO categories (name) VALUES
    ('CPU'),
    ('GPU'),
    ('RAM'),
    ('Storage'),
    ('Motherboard'),
    ('Power Supply'),
    ('Uncategorized');


-- Brands
INSERT INTO brands (name) VALUES
    ('Intel'),
    ('AMD'),
    ('Nvidia'),
    ('Corsair'),
    ('Samsung'),
    ('ASUS'),
    ('Generic');


-- Vendors
INSERT INTO vendors (name, location) VALUES
    ('TechSupply Co.', 'New York, USA'),
    ('MicroParts Ltd.', 'London, UK'),
    ('GlobalChips Inc.', 'Tokyo, Japan');


-- Products
INSERT INTO products (name, category_id, brand_id, stock_qty) VALUES
    ('Core i9-13900K',       1, 1, 0),   -- Intel CPU
    ('Ryzen 9 7950X',        1, 2, 0),   -- AMD CPU
    ('RTX 4090',             2, 3, 0),   -- Nvidia GPU
    ('RX 7900 XTX',          2, 2, 0),   -- AMD GPU
    ('Vengeance 32GB DDR5',  3, 4, 0),   -- Corsair RAM
    ('990 Pro 2TB SSD',      4, 5, 0),   -- Samsung Storage
    ('ROG Strix Z790-E',     5, 6, 0),   -- ASUS Motherboard
    ('RM1000x 1000W',        6, 4, 0);   -- Corsair PSU


-- Vendor Products (unit_cost per vendor per product)
INSERT INTO vendor_products (product_id, vendor_id, unit_cost) VALUES
    (1, 1, 520.00),   -- i9-13900K   from TechSupply
    (1, 2, 510.00),   -- i9-13900K   from MicroParts
    (2, 1, 680.00),   -- Ryzen 9     from TechSupply
    (2, 3, 665.00),   -- Ryzen 9     from GlobalChips
    (3, 1, 850.00),   -- RTX 4090    from TechSupply
    (3, 3, 890.00),   -- RTX 4090    from GlobalChips
    (4, 2, 750.00),   -- RX 7900 XTX from MicroParts
    (4, 3, 730.00),   -- RX 7900 XTX from GlobalChips
    (5, 1, 120.00),   -- Corsair RAM from TechSupply
    (6, 2, 140.00),   -- Samsung SSD from MicroParts
    (7, 1, 380.00),   -- ASUS Mobo   from TechSupply
    (8, 2,  95.00);   -- Corsair PSU from MicroParts


-- Stock Movements (these will drive stock_qty updates in the app)
INSERT INTO stock_movements (product_id, vendor_id, type, quantity, note) VALUES
    (1, 1, 'restock',    50, 'Initial stock from TechSupply'),
    (2, 1, 'restock',    40, 'Initial stock from TechSupply'),
    (3, 1, 'restock',    30, 'Initial stock from TechSupply'),
    (4, 3, 'restock',    25, 'Initial stock from GlobalChips'),
    (5, 1, 'restock',   100, 'Initial stock from TechSupply'),
    (6, 2, 'restock',    60, 'Initial stock from MicroParts'),
    (7, 1, 'restock',    20, 'Initial stock from TechSupply'),
    (8, 2, 'restock',    45, 'Initial stock from MicroParts'),
    (3, 1, 'damage',      2, 'Damaged during delivery'),
    (1, NULL, 'adjustment', 5, 'Stock count correction');


-- Update stock_qty on products to match movements above
UPDATE products SET stock_qty = 55  WHERE id = 1;  -- 50 restock + 5 adjustment
UPDATE products SET stock_qty = 40  WHERE id = 2;
UPDATE products SET stock_qty = 28  WHERE id = 3;  -- 30 restock - 2 damage
UPDATE products SET stock_qty = 25  WHERE id = 4;
UPDATE products SET stock_qty = 100 WHERE id = 5;
UPDATE products SET stock_qty = 60  WHERE id = 6;
UPDATE products SET stock_qty = 20  WHERE id = 7;
UPDATE products SET stock_qty = 45  WHERE id = 8;
`;

async function main() {
  console.log('seeding...');
  const client = new Client({
    connectionString: process.argv[2],
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done');
}

main();
