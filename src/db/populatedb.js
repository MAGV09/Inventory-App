#! /usr/bin/env node
const { Client } = require('pg');

const SQL = `
-- 1. DROP EVERYTHING (Clean Slate)
DROP TABLE IF EXISTS stock_movements CASCADE;
DROP TABLE IF EXISTS vendor_products CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TYPE IF EXISTS movement_type;

-- 2. CREATE SCHEMA
CREATE TYPE movement_type AS ENUM ('restock', 'removal', 'adjustment', 'damage');

CREATE TABLE categories (
    id      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name    VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE brands (
    id      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name    VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE vendors (
    id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    location    VARCHAR(255)
);

CREATE TABLE products (
    id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    category_id     INT NOT NULL REFERENCES categories(id),
    brand_id        INT NOT NULL REFERENCES brands(id),
    stock_qty       INT NOT NULL DEFAULT 0,
    CHECK (stock_qty >= 0)
);

CREATE TABLE vendor_products (
    product_id      INT NOT NULL REFERENCES products(id),
    vendor_id       INT NOT NULL REFERENCES vendors(id),
    unit_cost       NUMERIC(10, 2) NOT NULL,
    PRIMARY KEY (product_id, vendor_id)
);

CREATE TABLE stock_movements (
    id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id      INT NOT NULL REFERENCES products(id),
    vendor_id       INT REFERENCES vendors(id),
    type            movement_type NOT NULL,
    quantity        INT NOT NULL,
    note            TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    CHECK (quantity > 0)
);

-- 3. INSERT DATA
INSERT INTO categories (name) VALUES
    ('CPU'), ('GPU'), ('RAM'), ('Storage'), ('Motherboard'), ('Power Supply'), ('Uncategorized');

INSERT INTO brands (name) VALUES
    ('Intel'), ('AMD'), ('Nvidia'), ('Corsair'), ('Samsung'), ('ASUS'), ('Generic');

INSERT INTO vendors (name, location) VALUES
    ('TechSupply Co.', 'New York, USA'),
    ('MicroParts Ltd.', 'London, UK'),
    ('GlobalChips Inc.', 'Tokyo, Japan');

INSERT INTO products (name, category_id, brand_id, stock_qty) VALUES
    ('Core i9-13900K',       1, 1, 55),
    ('Ryzen 9 7950X',        1, 2, 40),
    ('RTX 4090',             2, 3, 28),
    ('RX 7900 XTX',          2, 2, 25),
    ('Vengeance 32GB DDR5',  3, 4, 100),
    ('990 Pro 2TB SSD',      4, 5, 60),
    ('ROG Strix Z790-E',     5, 6, 20),
    ('RM1000x 1000W',        6, 4, 45);

INSERT INTO vendor_products (product_id, vendor_id, unit_cost) VALUES
    (1, 1, 520.00), (1, 2, 510.00),
    (2, 1, 680.00), (2, 3, 665.00),
    (3, 1, 850.00), (3, 3, 890.00),
    (4, 2, 750.00), (4, 3, 730.00),
    (5, 1, 120.00), (6, 2, 140.00),
    (7, 1, 380.00), (8, 2,  95.00);

INSERT INTO stock_movements (product_id, vendor_id, type, quantity, note) VALUES
    (1, 1, 'restock',    50, 'Initial stock'),
    (2, 1, 'restock',    40, 'Initial stock'),
    (3, 1, 'restock',    30, 'Initial stock'),
    (4, 3, 'restock',    25, 'Initial stock'),
    (5, 1, 'restock',   100, 'Initial stock'),
    (6, 2, 'restock',    60, 'Initial stock'),
    (7, 1, 'restock',    20, 'Initial stock'),
    (8, 2, 'restock',    45, 'Initial stock'),
    (3, 1, 'damage',      2, 'Damaged during delivery'),
    (1, NULL, 'adjustment', 5, 'Stock count correction');
`;

async function main() {
  console.log('seeding...');
  const client = new Client({
    connectionString: process.argv[2],
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done');
}

main();
