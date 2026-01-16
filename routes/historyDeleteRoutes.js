const express = require('express');
const pool = require('../db'); // db.js faylidan poolni import qilish

const router = express.Router();

// Create a new category
router.post('/', async (req, res) => {
    const {food_id,stul } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO history_delete ( food_id,stul) VALUES ($1, $2) RETURNING *',
            [ food_id,stul]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        hd.id,
        hd.food_id,
        hd.stul,
        hd.created_at,
        hd.updated_at,
        p.name AS product_name,
        p.price AS product_price,
        p.image AS product_image
      FROM history_delete hd
      LEFT JOIN products p ON hd.food_id = p.id
      ORDER BY hd.created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Delete history fetch error:', err);
    res.status(500).json({ 
      error: 'Serverda xatolik yuz berdi',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get a category by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM history_delete WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a category
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {  food_id,stul } = req.body;
    try {
        const result = await pool.query(
            'UPDATE history_delete SET food_id = $1, stul = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
            [ food_id,stul, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Delete a category
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM history_delete WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;