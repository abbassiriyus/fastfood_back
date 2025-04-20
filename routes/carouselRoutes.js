// carouselRouter.js
const express = require('express');
const pool = require('../db'); // db.js faylidan poolni import qilish
const { upload_file, delete_file, put_file } = require('../middleware/file_upload');

const router = express.Router();

// Carousel qo'shish
router.post('/', async (req, res) => {
    const { fastfood_id } = req.body;
var image=upload_file(req)
    try {
        const result = await pool.query(
            'INSERT INTO carousel (fastfood_id, image) VALUES ($1, $2) RETURNING *',
            [fastfood_id, image]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add carousel item' });
    }
});

// Carousel ma'lumotlarini olish
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM carousel WHERE id = $1', [id]);
        const carouselItem = result.rows[0];

        if (!carouselItem) {
            return res.status(404).json({ error: 'Carousel item not found' });
        }
        res.status(200).json(carouselItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Carouselni yangilash
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { fastfood_id} = req.body;

    try {
        const result1 = await pool.query('SELECT * FROM carousel WHERE id = $1', [id]);
        const carouselItem = result1.rows[0];
       var image=put_file(carouselItem.image,req)
        const result = await pool.query(
            'UPDATE carousel SET fastfood_id = $1, image = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
            [fastfood_id, image, id]
        );
        const updatedCarouselItem = result.rows[0];

        if (!updatedCarouselItem) {
            return res.status(404).json({ error: 'Carousel item not found' });
        }
        res.status(200).json(updatedCarouselItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Carouselni o'chirish
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM carousel WHERE id = $1', [id]);
        const carouselItem = result.rows[0];
        delete_file(carouselItem.image)
        await pool.query('DELETE FROM carousel WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Barcha carousel itemlarini olish
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM carousel');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;