// product.js
const express = require('express');
const pool = require('./db');

const router = express.Router();

// Create product
router.post('/', async (req, res) => {
  const { name, category_id } = req.body;
  const result = await pool.query('INSERT INTO product(name, category_id) VALUES($1, $2) RETURNING *', [name, category_id]);
  res.json(result.rows[0]);
});

// Read products
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM product');
  res.json(result.rows);
});

// Update product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category_id } = req.body;
  const result = await pool.query('UPDATE product SET name = $1, category_id = $2 WHERE id = $3 RETURNING *', [name, category_id, id]);
  res.json(result.rows[0]);
});

// Delete product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM product WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = router;