const { Pool } = require('pg');
require('dotenv').config({ quiet: true });

module.exports = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});
