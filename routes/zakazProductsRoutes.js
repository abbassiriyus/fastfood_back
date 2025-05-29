const express = require('express');
const pool = require('../db'); // db.js faylidan poolni import qilish

const router = express.Router();

// Yangi zakaz mahsulotini yaratish
router.post('/', async (req, res) => {
    const products = Array.isArray(req.body['products[]']) 
        ? req.body['products[]'].map(product => JSON.parse(product)) 
        : [JSON.parse(req.body['products[]'])]; // Agar bitta mahsulot bo'lsa, uni massivga aylantiring

    try {
        const promises = products.map(product => {
            const { product_id, zakaz_id, count, price, fastfood_id } = product;
            return pool.query(
                'INSERT INTO zakaz_products (product_id, zakaz_id, count, price, fastfood_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [product_id, zakaz_id, count, price, fastfood_id]
            );
        });

        const results = await Promise.all(promises);
        res.status(201).json(results.map(result => result.rows[0]));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error:err.message });
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
        res.status(500).json({ error:err.message });
    }
});

// Zakaz mahsulotini yangilash
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { product_id, zakaz_id, count,price,fastfood_id } = req.body;

    try {
        const result = await pool.query(
            'UPDATE zakaz_products SET product_id = $1, zakaz_id = $2, count = $3,price=$4,fastfood_id=$5 updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
            [product_id, zakaz_id, count,,price,fastfood_id, id]
        );
        const updatedZakazProduct = result.rows[0];

        if (!updatedZakazProduct) {
            return res.status(404).json({ error: 'Zakaz mahsuloti topilmadi' });
        }
        res.status(200).json(updatedZakazProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Zakaz mahsulotlarini zakaz_id bo'yicha o'chirish
        await pool.query('DELETE FROM zakaz_products WHERE zakaz_id = $1', [id]);
        
        // Zakazni o'chirish (agar kerak bo'lsa)
        await pool.query('DELETE FROM zakaz WHERE id = $1', [id]);
        
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Barcha zakaz mahsulotlarini olish
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM zakaz_products');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error:err.message});
    }
});

module.exports = router;