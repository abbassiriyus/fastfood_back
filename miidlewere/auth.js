const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secretKey = 'menugo_token'; // Maxfiy kalit

// Foydalanuvchini tekshirish
const takeToken = async (username, password) => {
    // Foydalanuvchi ma'lumotlarini toping (masalan, ma'lumotlar bazasidan)
    const user = { username }; // Bu yerda haqiqiy foydalanuvchini olish kerak
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        throw new Error('Invalid credentials');
    }

    // Token yaratish
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
    return token;
};

// Middleware for JWT verification
const tokenReader = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = { tokenReader, takeToken };