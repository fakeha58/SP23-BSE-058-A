const express = require('express');
const router = express.Router();

// Hardcoded admin credentials
const ADMIN_EMAIL = 'admin@fashion.com';
const ADMIN_PASSWORD = 'admin123';

// Show admin login form
router.get('/login', (req, res) => {
  res.render('admin/login', {
    title: 'Admin Login',
    layout: 'layouts/auth',
    error_msg: req.flash('error_msg')
  });
});

// Handle admin login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    req.session.user = {
      id: 'admin-id',
      name: 'Admin',
      email: ADMIN_EMAIL,
      isAdmin: true
    };
    return res.redirect('/admin/products');
  } else {
    req.flash('error_msg', 'Invalid admin credentials');
    return res.redirect('/admin/login');
  }
});

// Handle admin logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

module.exports = router; 