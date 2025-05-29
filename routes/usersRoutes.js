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

        const token = jwt.sign({ id: user.id, username: user.username }, secretKey);
        res.status(200).json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error:err.message });
    }
});

router.get('/api/fastfood-revenue', async (req, res) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const query = `
            SELECT 
                fastfood_id,
                SUM(price * count) AS revenue,
                DATE_TRUNC('day', created_at) AS day
            FROM 
                zakaz_products
            JOIN 
                zakaz ON zakaz.id = zakaz_products.zakaz_id
            JOIN 
                users ON zakaz.user_id = users.id
            WHERE 
                users.type = 2 AND
                created_at >= $1
            GROUP BY 
                fastfood_id, day
            ORDER BY 
                day;
        `;

        const result = await pool.query(query, [startOfMonth]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching revenue:', error);
        res.status(500).send('Server error');
    }
});
router.post('/reset-password', async (req, res) => {
    const { token, oldPassword, newPassword } = req.body;

    if (!token || !oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Token, old password, and new password are required' });
    }

    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const userId = decoded.id;

        try {
            const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
            const user = userResult.rows[0];

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Eski parolni tekshirish
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Old password is incorrect' });
            }

            // Yangi parolni shaхlash
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);

            res.status(200).json({ message: 'Password has been reset successfully' });
        } catch (dbErr) {
            console.error(dbErr);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
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

// Foydalanuvchini yangilash
router.put('/fastfood/:id', async (req, res) => {
    const { id } = req.params;
    const { username,description,phone_number} = req.body;

    try {
        const result1 = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = result1.rows[0];
        var image=put_file(user.image,req)
        const result = await pool.query(
            'UPDATE users SET username = $1, image = $2, phone_number=$3, description=$4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [username,image,phone_number,description,id]
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