const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create a new protsent
router.post('/', async (req, res) => {
  const { foiz } = req.body;
  try {
    const result = await pool.query('INSERT INTO protsent (foiz) VALUES ($1) RETURNING *', [foiz]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Read all protsents
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM protsent');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Read a single protsent
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM protsent WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Protsent not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a protsent
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { foiz } = req.body;
  try {
    const result = await pool.query('UPDATE protsent SET foiz = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [foiz, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Protsent not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a protsent
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM protsent WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Protsent not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;