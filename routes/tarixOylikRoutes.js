const express = require('express');
const pool = require('../db'); // db.js faylidan poolni import qilish

const router = express.Router();

// Create a new category
router.post('/', async (req, res) => {
    const {user_id,price } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tarixoylik ( user_id,price) VALUES ($1, $2) RETURNING *',
            [ user_id,price]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all tarixoylik
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tarixoylik');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a category by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM tarixoylik WHERE id = $1', [id]);
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
    const {  user_id,price } = req.body;
    try {
        const result = await pool.query(
            'UPDATE tarixoylik SET user_id = $1, price = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
            [ user_id,price, id]
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
        const result = await pool.query('DELETE FROM tarixoylik WHERE id = $1 RETURNING *', [id]);
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