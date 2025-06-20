const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const { requireAuth } = require('../middleware/auth');

// Initialize cart in session if it doesn't exist
const initializeCart = (req) => {
  if (!req.session.cart) {
    req.session.cart = {
      items: [],
      total: 0
    };
  }
};

// Checkout page
router.get('/', requireAuth, (req, res) => {
  initializeCart(req);
  
  // Check if cart is empty
  if (!req.session.cart.items || req.session.cart.items.length === 0) {
    req.flash('error_msg', 'Your cart is empty. Please add some products first.');
    return res.redirect('/cart');
  }
  
  res.render('checkout/index', {
    title: 'Checkout - Fashion Store',
    layout: 'layouts/main',
    cart: req.session.cart,
    user: req.session.user
  });
});

// Place order (Pay Later with Cash)
router.post('/place-order', requireAuth, async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      street, 
      city, 
      state, 
      zipCode, 
      country 
    } = req.body;
    
    // Validate required fields
    if (!name || !phone || !street || !city || !state || !zipCode || !country) {
      req.flash('error_msg', 'Please fill in all required fields');
      return res.redirect('/checkout');
    }
    
    // Check if cart is empty
    if (!req.session.cart.items || req.session.cart.items.length === 0) {
      req.flash('error_msg', 'Your cart is empty');
      return res.redirect('/cart');
    }
    
    // Create order
    const order = new Order({
      userId: req.session.user.id,
      items: req.session.cart.items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      })),
      totalAmount: req.session.cart.total,
      status: 'Pending',
      shippingAddress: {
        street,
        city,
        state,
        zipCode,
        country
      },
      paymentMethod: 'Cash on Delivery'
    });
    
    // Save order to database
    await order.save();
    
    // Clear cart
    req.session.cart = {
      items: [],
      total: 0
    };
    
    req.flash('success_msg', `Order placed successfully! Order number: ${order.orderNumber}`);
    res.redirect(`/user/my-orders`);
    
  } catch (error) {
    console.error('Place order error:', error);
    req.flash('error_msg', 'Error placing order. Please try again.');
    res.redirect('/checkout');
  }
});

// Guest checkout (without authentication)
router.get('/guest', (req, res) => {
  initializeCart(req);
  
  // Check if cart is empty
  if (!req.session.cart.items || req.session.cart.items.length === 0) {
    req.flash('error_msg', 'Your cart is empty. Please add some products first.');
    return res.redirect('/cart');
  }
  
  res.render('checkout/guest', {
    title: 'Guest Checkout - Fashion Store',
    layout: 'layouts/main',
    cart: req.session.cart
  });
});

// Place guest order
router.post('/place-guest-order', async (req, res) => {
  try {
    const { 
      name, 
      email,
      phone, 
      street, 
      city, 
      state, 
      zipCode, 
      country 
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !street || !city || !state || !zipCode || !country) {
      req.flash('error_msg', 'Please fill in all required fields');
      return res.redirect('/checkout/guest');
    }
    
    // Check if cart is empty
    if (!req.session.cart.items || req.session.cart.items.length === 0) {
      req.flash('error_msg', 'Your cart is empty');
      return res.redirect('/cart');
    }
    
    // For guest orders, we'll create a temporary user ID or handle differently
    // For now, we'll use a special guest user ID
    const guestUserId = new require('mongoose').Types.ObjectId();
    
    // Create order
    const order = new Order({
      userId: guestUserId,
      items: req.session.cart.items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      })),
      totalAmount: req.session.cart.total,
      status: 'Pending',
      shippingAddress: {
        street,
        city,
        state,
        zipCode,
        country
      },
      paymentMethod: 'Cash on Delivery',
      guestInfo: {
        name,
        email,
        phone
      }
    });
    
    // Save order to database
    await order.save();
    
    // Clear cart
    req.session.cart = {
      items: [],
      total: 0
    };
    
    req.flash('success_msg', `Order placed successfully! Order number: ${order.orderNumber}. We'll contact you at ${email} for delivery details.`);
    res.redirect('/');
    
  } catch (error) {
    console.error('Place guest order error:', error);
    req.flash('error_msg', 'Error placing order. Please try again.');
    res.redirect('/checkout/guest');
  }
});

module.exports = router; 