const express = require('express');
const fileUpload = require("express-fileupload");
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const userRoutes = require('./routes/usersRoutes.js'); // Foydalanuvchilar uchun router
const zakazRoutes1 = require('./routes/zakazRouter1.js'); // Zakazlar uchun router
const zakazRoutes = require('./routes/zakazRoutes.js'); // Zakazlar uchun router
const zakazProductsRoutes = require('./routes/zakazProductsRoutes.js'); // Zakaz mahsulotlari uchun router
const categoriesRoutes = require('./routes/categoriesRoutes.js'); // Kategoriyalar uchun router
const carouselRoutes = require("./routes/carouselRoutes.js");
const productsRoutes = require("./routes/productsRoutes.js");
const pool = require('./db.js');

const app = express();
const port = 4000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // CORS ni kerakli manzillarga ruxsat berish
        methods: ['GET', 'PUT','POST']
    }
});
// Middleware for error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Serverda xato yuz berdi', error: err.message });
});
app.use(cors({ origin: '*' }));
app.use(fileUpload());
app.use(express.json());
app.use(express.static('./uploads'));

// Routerlarni qo'shish
app.use('/users', userRoutes); // Foydalanuvchilar uchun endpoint
app.use('/zakaz', zakazRoutes); // Zakazlar uchun endpoint
app.use('/zakaz_products', zakazProductsRoutes); // Zakaz mahsulotlari uchun endpoint
app.use('/categories', categoriesRoutes); // Kategoriyalar uchun endpoint
app.use('/carousel', carouselRoutes); // Kategoriyalar uchun endpoint
app.use('/products', productsRoutes); // Kategoriyalar uchun endpoint

// Socket.io bilan bog'liq router
app.use('/zakaz', zakazRoutes1(io));

// Socket.io ulanishi
io.on('connection', (socket) => {
    console.log('Yangi foydalanuvchi ulandi');

    // Sizning boshqa hodisalarni qo'shishingiz mumkin
});
app.get('/offitsant', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM users WHERE type = $1', [1]);
      res.status(200).json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
  }
});
// Global error handler
app.use((err, req, res, next) => {
    if (err.message.includes('501')) {
        return res.status(501).json({ message: err.message });
    }
    res.status(500).json({ message: 'Umumiy xato', error: err.message });
});
// Serverni ishga tushirish
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});