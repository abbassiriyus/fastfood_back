// userRouter.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // db.js faylidan poolni import qilish
const { upload_file, delete_file, put_file } = require('../middleware/file_upload');

const router = express.Router();
const secretKey = 'your_secret_key'; // Maxfiy kalit

// Foydalanuvchini ro'yxatdan o'tkazish
router.post('/register', async (req, res) => {
    const { username, phone_number, password, type, description, prosent,is_active,orders} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    var image =upload_file(req)
    try {
        const result = await pool.query(
            'INSERT INTO users (username, phone_number, password, type,image, description, prosent,is_active,orders) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9) RETURNING *',
            [username, phone_number, hashedPassword, type,image, description, prosent,is_active,orders]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error:err.message });
    }
});

// Foydalanuvchini autentifikatsiya qilish
router.post('/login/', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = userResult.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error:err.message });
    }
});

// Foydalanuvchi ma'lumotlarini olish
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Foydalanuvchini yangilash
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, type, is_active,description,prosent,orders} = req.body;

    try {
        const result1 = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = result1.rows[0];
        var image=put_file(user.image,req)
        const result = await pool.query(
            'UPDATE users SET username = $1, type = $2, is_active = $3, image=$4, description=$5,prosent=$6, updated_at = CURRENT_TIMESTAMP,orders=$7 WHERE id = $8 RETURNING *',
            [username, type, is_active,image,description,prosent,orders,id]
        );
        const updatedUser = result.rows[0];

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Foydalanuvchini o'chirish
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = result.rows[0];
        delete_file(user.image)
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Barcha foydalanuvchilarni olish
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/offitsant', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users ',);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;