const express = require('express');
const pool = require('../db'); // db.js faylidan poolni import qilish

const router = express.Router();

// Yangi zakaz yaratish
router.post('/', async (req, res) => {
    const { user_id,status } = req.body;
    
    try {
        const result = await pool.query(
            'INSERT INTO zakaz (user_id,status) VALUES ($1,$2) RETURNING *',
            [user_id, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Zakaz yaratishda xato' });
    }
});

// Zakaz ma'lumotlarini olish
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query('SELECT * FROM zakaz WHERE id = $1', [id]);
        const zakaz = result.rows[0];

        if (!zakaz) {
            return res.status(404).json({ error: 'Zakaz topilmadi' });
        }
        res.status(200).json(zakaz);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Zakazni olishda xato' });
    }
});

// Zakazni yangilash
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id,status } = req.body;

    try {
        const result = await pool.query(
            'UPDATE zakaz SET user_id = $1,status=$2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
            [user_id,status, id]
        );
        const updatedZakaz = result.rows[0];

        if (!updatedZakaz) {
            return res.status(404).json({ error: 'Zakaz topilmadi' });
        }
        res.status(200).json(updatedZakaz);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Zakazni yangilashda xato' });
    }
});

// Zakazni o'chirish
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM zakaz WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Zakazni o\'chirishda xato' });
    }
});

// Barcha zakazlarni olish
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM zakaz');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Barcha zakazlarni olishda xato' });
    }
});

module.exports = router;