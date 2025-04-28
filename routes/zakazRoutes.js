const express = require('express');
const pool = require('../db'); // db.js faylidan poolni import qilish

const router = express.Router();


// Zakaz ma'lumotlarini olish
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query('SELECT * FROM zakaz WHERE id = $1', [id]);
        const zakaz = result.rows[0];

        if (!zakaz) {
            return res.status(404).json({ error:err.message });
        }
        res.status(200).json(zakaz);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message});
    }
});

// Zakazni yangilash
// router.put('/:id', async (req, res) => {
//     const { id } = req.params;
//     const { user_id,status,number_stol } = req.body;

//     try {
//         const result = await pool.query(
//             'UPDATE zakaz SET user_id = $1,status=$2,number_stol=$3 updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
//             [user_id,status,number_stol, id]
//         );
//         const updatedZakaz = result.rows[0];

//         if (!updatedZakaz) {
//             return res.status(404).json({ error: 'Zakaz topilmadi' });
//         }
//         res.status(200).json(updatedZakaz);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Zakazni yangilashda xato' });
//     }
// });

// Zakazni o'chirish
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM zakaz WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message});
    }
});

// Barcha zakazlarni olish
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM zakaz');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error:err.message});
    }
});

module.exports = router;