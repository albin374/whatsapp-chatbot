const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// GET /api/categories - Fetch all categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/categories - Create a new category
router.post('/categories', async (req, res) => {
  const { mainCategory, subCategory } = req.body;
  if (!mainCategory || !subCategory) {
    return res.status(400).json({ error: 'mainCategory and subCategory are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO categories (mainCategory, subCategory) VALUES (?, ?)',
      [mainCategory, subCategory]
    );
    
    // Return the inserted row
    const [newRow] = await db.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    res.status(201).json(newRow[0]);
  } catch (err) {
    console.error('Failed to insert category:', err);
    res.status(500).json({ error: 'Failed to save category' });
  }
});

// GET /api/products - Fetch all products with category info
router.get('/products', async (req, res) => {
  try {
    const query = `
      SELECT p.*, c.mainCategory, c.subCategory 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/products - Create a new product with file uploads
router.post('/products', upload.fields([
  { name: 'dataSheet', maxCount: 1 },
  { name: 'productImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      sku, category_id, name, screen_size, weight_capacity, max_vesa, tags, youtube_url
    } = req.body;

    // Get file paths if they exist
    const dataSheetFile = req.files['dataSheet'] ? req.files['dataSheet'][0].path : null;
    const productImageFile = req.files['productImage'] ? req.files['productImage'][0].path : null;

    // Insert into DB
    const [result] = await db.query(
      `INSERT INTO products 
      (sku, category_id, name, data_sheet_url, image_url, screen_size, weight_capacity, max_vesa, tags, youtube_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sku || null, 
        category_id, 
        name, 
        dataSheetFile ? dataSheetFile.replace(/\\/g, '/') : null, 
        productImageFile ? productImageFile.replace(/\\/g, '/') : null, 
        screen_size || null, 
        weight_capacity || null, 
        max_vesa || null, 
        tags || null,
        youtube_url || null
      ]
    );

    const [newProduct] = await db.query(
      `SELECT p.*, c.mainCategory, c.subCategory 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`, 
      [result.insertId]
    );

    res.status(201).json(newProduct[0]);
  } catch (err) {
    console.error('Failed to insert product:', err);
    res.status(500).json({ error: 'Failed to save product' });
  }
});

// PUT /api/products/:id - Update an existing product
router.put('/products/:id', upload.fields([
  { name: 'dataSheet', maxCount: 1 },
  { name: 'productImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      sku, category_id, name, screen_size, weight_capacity, max_vesa, tags, youtube_url
    } = req.body;

    // Get file paths if new ones are uploaded
    const dataSheetFile = req.files['dataSheet'] ? req.files['dataSheet'][0].path : null;
    const productImageFile = req.files['productImage'] ? req.files['productImage'][0].path : null;

    // Build the dynamic UPDATE query
    let updateFields = 'sku = ?, category_id = ?, name = ?, screen_size = ?, weight_capacity = ?, max_vesa = ?, tags = ?, youtube_url = ?';
    let queryParams = [
        sku || null, 
        category_id, 
        name, 
        screen_size || null, 
        weight_capacity || null, 
        max_vesa || null, 
        tags || null,
        youtube_url || null
    ];

    if (dataSheetFile) {
        updateFields += ', data_sheet_url = ?';
        queryParams.push(dataSheetFile.replace(/\\/g, '/'));
    }
    
    if (productImageFile) {
        updateFields += ', image_url = ?';
        queryParams.push(productImageFile.replace(/\\/g, '/'));
    }

    queryParams.push(productId); // For the WHERE clause

    await db.query(`UPDATE products SET ${updateFields} WHERE id = ?`, queryParams);

    // Fetch and return the updated product
    const [updatedProduct] = await db.query(
      `SELECT p.*, c.mainCategory, c.subCategory 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`, 
      [productId]
    );

    if (updatedProduct.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct[0]);
  } catch (err) {
    console.error('Failed to update product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

module.exports = router;
