// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const categoryRoutes = require('./category');
const productRoutes = require('./product');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// API marshrutlarini qo'shish
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// Serverni ishga tushirish
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});