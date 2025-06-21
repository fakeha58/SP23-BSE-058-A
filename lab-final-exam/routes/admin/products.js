const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const requireAdmin = require('../../middleware/admin');

// List all products
router.get('/', requireAdmin, async (req, res) => {
  const products = await Product.find();
  res.render('admin/products/index', { products });
});

// Show add product form
router.get('/add', requireAdmin, (req, res) => {
  res.render('admin/products/add');
});

// Handle add product
router.post('/add', requireAdmin, async (req, res) => {
  const { name, price, description, image } = req.body;
  try {
    await Product.create({ name, price, description, image });
    req.flash('success_msg', 'Product added successfully');
    res.redirect('/admin/products');
  } catch (err) {
    req.flash('error_msg', 'Error adding product');
    res.redirect('/admin/products/add');
  }
});

// Show edit product form
router.get('/edit/:id', requireAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.redirect('/admin/products');
  res.render('admin/products/edit', { product });
});

// Handle edit product
router.post('/edit/:id', requireAdmin, async (req, res) => {
  const { name, price, description, image } = req.body;
  try {
    await Product.findByIdAndUpdate(req.params.id, { name, price, description, image });
    req.flash('success_msg', 'Product updated successfully');
    res.redirect('/admin/products');
  } catch (err) {
    req.flash('error_msg', 'Error updating product');
    res.redirect('/admin/products/edit/' + req.params.id);
  }
});

// Handle delete product
router.post('/delete/:id', requireAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Product deleted successfully');
  } catch (err) {
    req.flash('error_msg', 'Error deleting product');
  }
  res.redirect('/admin/products');
});

module.exports = router;
