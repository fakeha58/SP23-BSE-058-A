const express = require('express');
const router = express.Router();
const { getFeaturedProducts, getAllCategories } = require('../data/products');

// Home page
router.get('/', (req, res) => {
  const featuredProducts = getFeaturedProducts();
  const categories = getAllCategories();
  
  res.render('index', {
    title: 'Fashion Store - Premium Fashion Collection',
    featuredProducts,
    categories,
    layout: 'layouts/main'
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us - Fashion Store',
    layout: 'layouts/main'
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us - Fashion Store',
    layout: 'layouts/main'
  });
});

// Handle contact form submission
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  // Here you would typically save to database or send email
  console.log('Contact form submission:', { name, email, message });
  
  req.flash('success_msg', 'Thank you for your message! We\'ll get back to you soon.');
  res.redirect('/contact');
});

// Handle newsletter signup
router.post('/newsletter', (req, res) => {
  const { email } = req.body;
  
  // Here you would typically save to database or send to email service
  console.log('Newsletter signup:', { email });
  
  req.flash('success_msg', 'Thank you for subscribing to our newsletter!');
  res.redirect('/');
});

module.exports = router;