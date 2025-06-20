const express = require('express');
const router = express.Router();
const { getProductById } = require('../data/products');

// Initialize cart in session if it doesn't exist
const initializeCart = (req) => {
  if (!req.session.cart) {
    req.session.cart = {
      items: [],
      total: 0
    };
  }
};

// Calculate cart total
const calculateCartTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Add to cart
router.post('/add', (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;
    
    if (!productId || !quantity) {
      req.flash('error_msg', 'Product ID and quantity are required');
      return res.redirect('back');
    }
    
    // Get product details
    const product = getProductById(parseInt(productId));
    if (!product) {
      req.flash('error_msg', 'Product not found');
      return res.redirect('back');
    }
    
    // Initialize cart
    initializeCart(req);
    
    // Check if product already exists in cart
    const existingItemIndex = req.session.cart.items.findIndex(
      item => item.productId === parseInt(productId) && 
              item.size === size && 
              item.color === color
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if product already exists
      req.session.cart.items[existingItemIndex].quantity += parseInt(quantity);
    } else {
      // Add new item to cart
      req.session.cart.items.push({
        productId: parseInt(productId),
        name: product.name,
        price: product.price,
        quantity: parseInt(quantity),
        size: size || null,
        color: color || null,
        image: product.image
      });
    }
    
    // Recalculate total
    req.session.cart.total = calculateCartTotal(req.session.cart.items);
    
    req.flash('success_msg', `${product.name} added to cart!`);
    res.redirect('/cart');
    
  } catch (error) {
    console.error('Add to cart error:', error);
    req.flash('error_msg', 'Error adding product to cart');
    res.redirect('back');
  }
});

// View cart
router.get('/', (req, res) => {
  initializeCart(req);
  
  res.render('cart/index', {
    title: 'Shopping Cart - Fashion Store',
    layout: 'layouts/main',
    cart: req.session.cart
  });
});

// Update cart item quantity
router.post('/update', (req, res) => {
  try {
    const { itemIndex, quantity } = req.body;
    
    if (itemIndex === undefined || !quantity) {
      req.flash('error_msg', 'Invalid request');
      return res.redirect('/cart');
    }
    
    const index = parseInt(itemIndex);
    const newQuantity = parseInt(quantity);
    
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or negative
      req.session.cart.items.splice(index, 1);
    } else {
      // Update quantity
      req.session.cart.items[index].quantity = newQuantity;
    }
    
    // Recalculate total
    req.session.cart.total = calculateCartTotal(req.session.cart.items);
    
    req.flash('success_msg', 'Cart updated successfully');
    res.redirect('/cart');
    
  } catch (error) {
    console.error('Update cart error:', error);
    req.flash('error_msg', 'Error updating cart');
    res.redirect('/cart');
  }
});

// Remove item from cart
router.post('/remove', (req, res) => {
  try {
    const { itemIndex } = req.body;
    
    if (itemIndex === undefined) {
      req.flash('error_msg', 'Invalid request');
      return res.redirect('/cart');
    }
    
    const index = parseInt(itemIndex);
    
    if (index >= 0 && index < req.session.cart.items.length) {
      const removedItem = req.session.cart.items.splice(index, 1)[0];
      req.session.cart.total = calculateCartTotal(req.session.cart.items);
      req.flash('success_msg', `${removedItem.name} removed from cart`);
    }
    
    res.redirect('/cart');
    
  } catch (error) {
    console.error('Remove from cart error:', error);
    req.flash('error_msg', 'Error removing item from cart');
    res.redirect('/cart');
  }
});

// Clear cart
router.post('/clear', (req, res) => {
  req.session.cart = {
    items: [],
    total: 0
  };
  
  req.flash('success_msg', 'Cart cleared successfully');
  res.redirect('/cart');
});

module.exports = router; 