// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/usersRoutes.js'); // Foydalanuvchilar uchun router
const zakazRoutes = require('./routes/zakazRoutes.js'); // Zakazlar uchun router
const zakazProductsRoutes = require('./routes/zakazProductsRoutes.js'); // Zakaz mahsulotlari uchun router
const categoriesRoutes = require('./routes/categoriesRoutes.js'); // Kategoriyalar uchun router
const carouselRoutes=require("./routes/carouselRoutes.js")
const productsRoutes=require("./routes/productsRoutes.js")

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Routerlarni qo'shish
app.use('/users', userRoutes); // Foydalanuvchilar uchun endpoint
app.use('/zakaz', zakazRoutes); // Zakazlar uchun endpoint
app.use('/zakaz_products', zakazProductsRoutes); // Zakaz mahsulotlari uchun endpoint
app.use('/categories', categoriesRoutes); // Kategoriyalar uchun endpoint
app.use('/carousel', carouselRoutes); // Kategoriyalar uchun endpoint
app.use('/products', productsRoutes); // Kategoriyalar uchun endpoint


// Serverni ishga tushirish
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});