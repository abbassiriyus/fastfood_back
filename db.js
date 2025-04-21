// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'hayyatuz_menugo_user',
  host: 'localhost',
  database: 'hayyatuz_menugo',
  password: 'KwA31b_T];[r',
  port: 5432,
});

module.exports = pool;