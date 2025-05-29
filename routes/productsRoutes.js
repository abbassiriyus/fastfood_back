// product.js
const express = require('express');
const pool = require('../db');
const { upload_file, delete_file, put_file } = require('../middleware/file_upload');

const router = express.Router();

// Create product
router.post('/', async (req, res) => {
  const { name, category_id,description,price,is_active } = req.body;
  var image=upload_file(req)
  const result = await pool.query('INSERT INTO products(name, category_id,image,description,price,is_active) VALUES($1, $2,$3,$4,$5,$6) RETURNING *', [name, category_id,image,description,price,is_active]);
  res.json(result.rows[0]);
});

// Read products
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM products');
  res.json(result.rows);
});
router.put('/fastfood/:id', async (req, res) => {
    try{
       const { id } = req.params;
  const { name, category_id,description,price,is_active } = req.body;
  const result1 = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  const product = result1.rows[0];
  var image=put_file(product.image,req)
  const result = await pool.query('UPDATE products SET name = $1, category_id = $2,image=$3,description=$4,price=$5 WHERE id = $6 RETURNING *', [name, category_id,image,description,price,id]);
  res.json(result.rows[0]);   
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message});
    }

});
// Update product
router.put('/:id', async (req, res) => {
    try{
       const { id } = req.params;
  const { name, category_id,description,price,is_active } = req.body;
  const result1 = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  const product = result1.rows[0];
  var image=put_file(product.image,req)
  const result = await pool.query('UPDATE products SET name = $1, category_id = $2,image=$3,description=$4,price=$5,is_active=$6 WHERE id = $7 RETURNING *', [name, category_id,image,description,price,is_active,id]);
  res.json(result.rows[0]);   
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message});
    }

});

// Delete product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
          const product = result.rows[0];
          delete_file(product.image)
  await pool.query('DELETE FROM products WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = router;