const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db'); // db.js faylidan poolni import qilish

const router = express.Router();
const secretKey = 'your_secret_key'; // Maxfiy kalit

// Foydalanuvchini ro'yxatdan o'tkazish
router.post('/register', async (req, res) => {
    const { username, phone_number, password, type } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const result = await pool.query(
            'INSERT INTO users (username, phone_number, password, type) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, phone_number, hashedPassword, type]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'User registration failed' });
    }
});

// Foydalanuvchini autentifikatsiya qilish
router.post('/login', async (req, res) => {
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
        res.status(500).json({ error: 'Internal Server Error' });
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Foydalanuvchini yangilash
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, phone_number, type, is_active } = req.body;

    try {
        const result = await pool.query(
            'UPDATE users SET username = $1, phone_number = $2, type = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [username, phone_number, type, is_active, id]
        );
        const updatedUser = result.rows[0];

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Foydalanuvchini o'chirish
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Barcha foydalanuvchilarni olish
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;