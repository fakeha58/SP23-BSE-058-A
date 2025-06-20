const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { redirectIfAuth } = require('../middleware/auth');

// Login page
router.get('/login', redirectIfAuth, (req, res) => {
  res.render('auth/login', {
    title: 'Login - Fashion Store',
    layout: 'layouts/auth'
  });
});

// Register page
router.get('/register', redirectIfAuth, (req, res) => {
  res.render('auth/register', {
    title: 'Register - Fashion Store',
    layout: 'layouts/auth'
  });
});

// Handle login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Validation
    if (!email || !password) {
      req.flash('error_msg', 'Please fill in all fields');
      return res.redirect('/auth/login');
    }
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      req.flash('error_msg', 'Invalid email or password');
      return res.redirect('/auth/login');
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      req.flash('error_msg', 'Invalid email or password');
      return res.redirect('/auth/login');
    }
    
    // Create session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };
    
    req.flash('success_msg', `Welcome back, ${user.name}!`);
    res.redirect('/user/dashboard');
    
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error_msg', 'An error occurred during login');
    res.redirect('/auth/login');
  }
});

// Handle registration
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  
  try {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      req.flash('error_msg', 'Please fill in all fields');
      return res.redirect('/auth/register');
    }
    
    if (password !== confirmPassword) {
      req.flash('error_msg', 'Passwords do not match');
      return res.redirect('/auth/register');
    }
    
    if (password.length < 6) {
      req.flash('error_msg', 'Password must be at least 6 characters');
      return res.redirect('/auth/register');
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      req.flash('error_msg', 'Email already registered');
      return res.redirect('/auth/register');
    }
    
    // Create user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password
    });
    
    await newUser.save();
    
    req.flash('success_msg', 'Registration successful! Please log in.');
    res.redirect('/auth/login');
    
  } catch (error) {
    console.error('Registration error:', error);
    req.flash('error_msg', 'An error occurred during registration');
    res.redirect('/auth/register');
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    req.flash('success_msg', 'You have been successfully logged out.');
    res.redirect('/auth/login');
  });
});

// GET logout route for convenience
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    req.flash('success_msg', 'You have been successfully logged out.');
    res.redirect('/auth/login');
  });
});

module.exports = router;