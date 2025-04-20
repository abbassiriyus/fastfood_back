const express = require('express');
const pool = require('../db'); // db.js faylidan poolni import qilish

const router = express.Router();

// Yangi zakaz mahsulotini yaratish
router.post('/', async (req, res) => {
    const { product_id, zakaz_id, count } = req.body;
    
    try {
        const result = await pool.query(
            'INSERT INTO zakaz_products (product_id, zakaz_id, count) VALUES ($1, $2, $3) RETURNING *',
            [product_id, zakaz_id, count]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Zakaz mahsulotini yaratishda xato' });
    }
});

// Zakaz mahsuloti ma'lumotlarini olish
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query('SELECT * FROM zakaz_products WHERE id = $1', [id]);
        const zakazProduct = result.rows[0];

        if (!zakazProduct) {
            return res.status(404).json({ error: 'Zakaz mahsuloti topilmadi' });
        }
        res.status(200).json(zakazProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Zakaz mahsulotini olishda xato' });
    }
});

// Zakaz mahsulotini yangilash
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { product_id, zakaz_id, count } = req.body;

    try {
        const result = await pool.query(
            'UPDATE zakaz_products SET product_id = $1, zakaz_id = $2, count = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
            [product_id, zakaz_id, count, id]
        );
        const updatedZakazProduct = result.rows[0];

        if (!updatedZakazProduct) {
            return res.status(404).json({ error: 'Zakaz mahsuloti topilmadi' });
        }
        res.status(200).json(updatedZakazProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Zakaz mahsulotini yangilashda xato' });
    }
});

// Zakaz mahsulotini o'chirish
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM zakaz_products WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Zakaz mahsulotini o\'chirishda xato' });
    }
});

// Barcha zakaz mahsulotlarini olish
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM zakaz_products');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Barcha zakaz mahsulotlarini olishda xato' });
    }
});

module.exports = router;