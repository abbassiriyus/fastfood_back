const express = require('express');
const router = express.Router();
const pool =require('../db')
// Zakazni yangilash
const zakazRouter1 = (io) => {
    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { user_id, status, number_stol } = req.body;

        try {
            const result = await pool.query(
                'UPDATE zakaz SET user_id = $1, status = $2, number_stol = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
                [user_id, status, number_stol, id]
            );

            const updatedZakaz = result.rows[0];

            if (!updatedZakaz) {
                return res.status(404).json({ error: 'Zakaz topilmadi' });
            }

            // Socket orqali yangilangan zakazni yuborish
            io.emit('zakazUpdated', updatedZakaz);

            res.status(200).json(updatedZakaz);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });
    // Yangi zakaz yaratish
    router.post('/', async (req, res) => {
        const { user_id,status,number_stol } = req.body;
        
        try {
            const result = await pool.query(
                'INSERT INTO zakaz (user_id,status,number_stol) VALUES ($1,$2,$3) RETURNING *',
                [user_id, status,number_stol]
            );
            io.emit('zakazUpdated', result.rows[0]);
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });
    

    return router;
};

module.exports = zakazRouter1;