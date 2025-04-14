// category.js
const express = require('express');
const pool = require('./db');

const router = express.Router();

// Create category
router.post('/', async (req, res) => {
  const { name } = req.body;
  const result = await pool.query('INSERT INTO category(name) VALUES($1) RETURNING *', [name]);
  res.json(result.rows[0]);
});

// Read categories
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM category');
  res.json(result.rows);
});

// Update category
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await pool.query('UPDATE category SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
  res.json(result.rows[0]);
});

// Delete category
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM category WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = router;